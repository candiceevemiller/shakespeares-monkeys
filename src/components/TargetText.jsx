function TargetText({ text }) {
    return (
        <div className="mx-auto mt-12 max-w-3xl px-6">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink-faint">
                Target text — Hamlet, Act III, Scene I
            </p>
            <pre className="mt-3 whitespace-pre-wrap break-words border-t border-ink-rule pt-4 font-mono text-sm leading-relaxed text-ink/90">
                {text}
            </pre>
        </div>
    )
}

export default TargetText
