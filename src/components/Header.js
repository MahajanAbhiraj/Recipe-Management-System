import React from 'react';
import './Header.css';
import Icon from '../pages/instabites.avif'; // Ensure this path is correct

const Header = () => {
    return (
        <header className="header">
            <img src={Icon} alt="UserIcon" className="iconbites" />
            <div className="header-text">
                RECIPE MANAGEMENT SYSTEM
            </div>
        </header>
    );
};

export default Header;
