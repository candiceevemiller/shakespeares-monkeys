import { useEffect, useRef, useState } from 'react'
import { target, generateAttempt, scoreAttempt } from '../lib/monkeys.js'

const BEST_KEY = 'shakespeares-monkeys:best-v1'
const ATTEMPTS_KEY = 'shakespeares-monkeys:attempts-v1'

// How many random attempts to draw per animation frame. Each attempt is an
// independent full-length re-roll (not a hill climb) — the joke only works
// if the odds stay genuinely astronomical.
const BATCH_SIZE = 40
// Only persist the attempt counter this often (ms) — the best-ever record
// is still written immediately whenever it's beaten.
const PERSIST_INTERVAL = 1000

function loadBest() {
    try {
        const raw = localStorage.getItem(BEST_KEY)
        return raw ? JSON.parse(raw) : null
    } catch {
        return null
    }
}

function loadAttempts() {
    const n = Number(localStorage.getItem(ATTEMPTS_KEY))
    return Number.isFinite(n) ? n : 0
}

export function useMonkeyEngine({ running = true } = {}) {
    const [current, setCurrent] = useState({ text: '', score: 0 })
    const [best, setBest] = useState(loadBest)
    const [attempts, setAttempts] = useState(loadAttempts)

    const bestRef = useRef(best)
    const attemptsRef = useRef(attempts)
    const lastPersistRef = useRef(0)

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
                localStorage.setItem(BEST_KEY, JSON.stringify(record))
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
