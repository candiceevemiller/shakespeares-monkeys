import React from "react";

function Footer() {
    let currentYear = new Date().getFullYear();

    return (
        <footer className="text-light text-center mt-5">
            <p>© Candice Miller {currentYear}</p>
        </footer>
    );
}

export default Footer;