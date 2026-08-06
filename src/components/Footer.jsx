function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mx-auto mt-16 max-w-3xl px-6 pb-14 text-center">
            <p className="font-mono text-xs text-ink-faint">
                © Candice Miller {currentYear}
            </p>
        </footer>
    );
}

export default Footer;
