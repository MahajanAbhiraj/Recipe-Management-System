import React from 'react';
import './Home.css';
import recipeIcon from './recipe-icon.jpg';
import ingredientsIcon from './ingredients-icon.jpg';
import reportIcon from './report-icon.jpg';

const Home = () => {
    return (
        <div className="home-container">
            <div className="home-content">
                <h1>Welcome to Recipe Inventory Management System</h1>
                <p>This inventory system is designed to streamline the management of recipes and ingredients, making it easier for chefs and kitchen staff to organize and track their culinary creations.</p>
                <div className="feature-list">
                    <div className="feature-item">
                        <img src={recipeIcon} alt="Recipe Icon" />
                        <h2>Manage Recipes</h2>
                        <p>Easily create, edit, and organize your recipes in one centralized location.</p>
                    </div>
                    <div className="feature-item">
                        <img src={ingredientsIcon} alt="Ingredient Icon" />
                        <h2>Track Ingredients</h2>
                        <p>Keep track of your ingredient inventory, including stock levels and expiration dates.</p>
                    </div>
                    <div className="feature-item">
                        <img src={reportIcon} alt="Report Icon" />
                        <h2>Generate Reports</h2>
                        <p>Generate detailed reports on recipe usage, ingredient consumption, and more to optimize kitchen operations.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
