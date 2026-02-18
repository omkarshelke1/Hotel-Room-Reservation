import React from 'react';

const Footer = () => {
    return (
        <footer className="footer footer-center p-4 bg-base-300 text-base-content mt-auto">
            <aside>
                <p>Copyright © {new Date().getFullYear()} - All right reserved by Hotel Booking System</p>
            </aside>
        </footer>
    );
};

export default Footer;
