import { useEffect, useRef, useState } from 'react'
import { target, generateAttempt, scoreAttempt } from '../lib/monkeys.js'

const ATTEMPTS_KEY = 'shakespeares-monkeys:attempts-v1'
// The best record is the whole point of the joke, so it has to be shared
// across everyone's browser, not just the one that happened to find it —
// hence the API instead of localStorage.
const BEST_API_URL = 'api/best'

// How many random attempts to draw per animation frame. Each attempt is an
// independent full-length re-roll (not a hill climb) — the joke only works
// if the odds stay genuinely astronomical.
const BATCH_SIZE = 40
// Only persist the attempt counter this often (ms) — the best-ever record
// is still submitted immediately whenever it's beaten.
const PERSIST_INTERVAL = 1000

function loadAttempts() {
    const n = Number(localStorage.getItem(ATTEMPTS_KEY))
    return Number.isFinite(n) ? n : 0
}

export function useMonkeyEngine({ running = true } = {}) {
    const [current, setCurrent] = useState({ text: '', score: 0 })
    const [best, setBest] = useState(null)
    const [attempts, setAttempts] = useState(loadAttempts)

    const bestRef = useRef(best)
    const attemptsRef = useRef(attempts)
    const lastPersistRef = useRef(0)

    useEffect(() => {
        let cancelled = false
        fetch(BEST_API_URL)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (cancelled || !data?.best) return
                // Guard against the (rare) case where the engine already
                // found and posted something better while this was in flight.
                if (!bestRef.current || data.best.score >= bestRef.current.score) {
                    bestRef.current = data.best
                    setBest(data.best)
                }
            })
            .catch(() => {
                // API unreachable (e.g. local dev without the backend running) —
                // fall back to showing only what this session finds.
            })
        return () => {
            cancelled = true
        }
    }, [])

    useEffect(() => {
        if (!running) return undefined

        let frameId

        function tick(now) {
            let bestOfBatch = null
            let lastAttempt = null

            for (let i = 0; i < BATCH_SIZE; i++) {
                const text = generateAttempt(target.length)
                const score = scoreAttempt(text)
                lastAttempt = { text, score }
                if (!bestOfBatch || score > bestOfBatch.score) {
                    bestOfBatch = { text, score }
                }
            }

            attemptsRef.current += BATCH_SIZE
            setCurrent(lastAttempt)

            if (!bestRef.current || bestOfBatch.score > bestRef.current.score) {
                const record = {
                    ...bestOfBatch,
                    attempts: attemptsRef.current,
                    at: Date.now(),
                }
                bestRef.current = record
                setBest(record)

                // Server recomputes the score itself and is the source of
                // truth — it may already hold a better record from another
                // browser, in which case this submission just loses.
                fetch(BEST_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: record.text, attempts: record.attempts }),
                })
                    .then((res) => (res.ok ? res.json() : null))
                    .then((data) => {
                        if (!data?.best) return
                        if (!bestRef.current || data.best.score >= bestRef.current.score) {
                            bestRef.current = data.best
                            setBest(data.best)
                        }
                    })
                    .catch(() => {})
            }

            if (now - lastPersistRef.current > PERSIST_INTERVAL) {
                lastPersistRef.current = now
                localStorage.setItem(ATTEMPTS_KEY, String(attemptsRef.current))
                setAttempts(attemptsRef.current)
            }

            frameId = requestAnimationFrame(tick)
        }

        frameId = requestAnimationFrame(tick)
        return () => {
            cancelAnimationFrame(frameId)
            localStorage.setItem(ATTEMPTS_KEY, String(attemptsRef.current))
        }
    }, [running])

    return { current, best, attempts, target }
}
