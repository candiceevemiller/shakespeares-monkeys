import { useState } from "react"

const images = [
    '176.jpg',
    'dilbert.gif',
    'monkeys.jpg',
    'simpsons.gif',
    'sonnets.jpeg',
    'tarantino.jpg',
    'typewriter.jpg',
]

function randomIndex(exclude) {
    if (images.length <= 1) return 0
    let next = Math.floor(Math.random() * images.length)
    while (next === exclude) next = Math.floor(Math.random() * images.length)
    return next
}

function ImageWheel() {
    const [index, setIndex] = useState(() => randomIndex())

    return (
        <div className="mx-auto mt-12 max-w-3xl px-6 text-center">
            <button
                type="button"
                onClick={() => setIndex((prev) => randomIndex(prev))}
                className="inline-block rotate-1 border border-ink/70 bg-white p-3 shadow-[3px_3px_0_0_rgba(26,26,26,0.15)] transition-transform hover:-rotate-1"
            >
                <img
                    src={`${import.meta.env.BASE_URL}img/${images[index]}`}
                    alt="A wry reference to monkeys, typewriters, or infinite improbability"
                    className="max-h-[34rem] w-auto max-w-full"
                />
            </button>
            <p className="mt-3 font-mono text-xs text-ink-faint">
                (psst — click the photo)
            </p>
        </div>
    )
}

export default ImageWheel
