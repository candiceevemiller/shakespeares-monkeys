function Header() {
    return (
        <header className="mx-auto max-w-3xl px-6 pt-14 text-center">
            <h1 className="cursor font-mono text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Shakespeare's Monkeys
            </h1>
            <p className="mt-3 font-mono text-sm text-ink-faint">
                An infinite room of monkeys at typewriters, each attempting
                Hamlet's most famous soliloquy by pure chance. This page has been
                running the experiment since it loaded — the record below is the
                closest anyone's browser has ever gotten.
            </p>
        </header>
    )
}

export default Header
