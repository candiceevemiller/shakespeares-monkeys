function LiveAttempt({ current, attempts }) {
    const score = current ? (current.score * 100).toFixed(2) : '0.00'

    return (
        <div className="mx-auto mt-12 max-w-3xl px-6">
            <div className="flex items-baseline justify-between font-mono text-xs uppercase tracking-[0.25em] text-ink-faint">
                <span>Currently typing</span>
                <span>{attempts.toLocaleString()} attempts so far</span>
            </div>
            <p className="mt-2 font-mono text-sm text-ink-faint">
                This attempt: {score}% match
            </p>
            <pre className="mt-3 h-40 overflow-hidden whitespace-pre-wrap break-words border border-ink-rule bg-white/40 p-4 font-mono text-xs leading-relaxed text-ink/70">
                {current?.text}
            </pre>
        </div>
    )
}

export default LiveAttempt
