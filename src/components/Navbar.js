import React from 'react';
import './NavBar.css';

const Navbar = ({ onPageChange, loggedInUser, onLogout }) => {
    return (
        <nav className="navbar">
            {/* <div className="navbar-brand">RECIPE MANAGEMENT SYSTEM</div> */}
            <div className="navbar-links">
                <button onClick={() => onPageChange('home')}>Home</button>
                <button onClick={() => onPageChange('recipes')}>Recipes</button>
                <button onClick={() => onPageChange('ingredients')}>Ingredients</button>
                <button onClick={() => onPageChange('foodinventorylog')}>Final Product</button>
                <button onClick={() => onPageChange('finishedgoods')}>Finished Goods</button>
                <button onClick={() => onPageChange('packaged')}>Packed Item</button>
                <button onClick={() => onPageChange('manager')}>Manager</button>
                {loggedInUser ? (
                    <>
                        <span className="navbar-user">Logged in as: {loggedInUser}</span>
                        <button onClick={onLogout}>Logout</button>
                    </>
                ) : (
                    <button onClick={() => onPageChange('login')}>Login</button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
