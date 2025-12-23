import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <h3>Recifree</h3>
                    <p>Your cooking companion. Cook with love!</p>
                </div>
                
                <div className="footer-links">
                    <Link to="/privacy-policy">Privacy Policy</Link>
                    <Link to="/terms-and-conditions">Terms and Conditions</Link>
                    <Link to="/contact-us">Contact Us</Link>
                </div>
            </div>
            
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Recifree. All rights reserved.</p>
            </div>
        </footer>
    );
}