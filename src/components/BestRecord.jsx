function formatDate(ms) {
    if (!ms) return null
    return new Date(ms).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

function BestRecord({ best }) {
    const score = best ? (best.score * 100).toFixed(4) : '0.0000'

    return (
        <div className="mx-auto mt-10 max-w-3xl px-6">
            <div className="-rotate-1 border border-ink/70 bg-paper p-6 shadow-[4px_4px_0_0_rgba(26,26,26,0.15)] sm:p-8">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink-faint">
                    Best match ever recorded
                </p>
                <p className="mt-2 font-mono text-4xl font-bold text-ink sm:text-5xl">
                    {score}%
                </p>

                {best ? (
                    <>
                        <p className="mt-1 font-mono text-xs text-ink-faint">
                            Found on attempt #{best.attempts.toLocaleString()}
                            {formatDate(best.at) ? ` · ${formatDate(best.at)}` : ''}
                        </p>
                        <pre className="mt-4 max-h-64 overflow-y-auto whitespace-pre-wrap break-words border-t border-ink-rule pt-4 font-mono text-xs leading-relaxed text-ink">
                            {best.text}
                        </pre>
                    </>
                ) : (
                    <p className="mt-4 font-mono text-sm text-ink-faint">
                        No attempts recorded yet — give it a second.
                    </p>
                )}
            </div>
        </div>
    )
}

export default BestRecord
