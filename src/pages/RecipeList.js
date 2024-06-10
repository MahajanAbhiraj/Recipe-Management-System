import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './RecipeList.css';
import { BACKEND_URL } from '../constants';

const RecipeList = ({ onSelectRecipe }) => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    // Fetch recipes from the backend
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/recipes`);
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="recipe-list-container">
      <h2>Recipes</h2>
      {recipes.map((recipe) => (
        <div key={recipe._id} className="recipe-item">
          <h3>
            <Link to={`/recipes/${recipe._id}`} onClick={() => onSelectRecipe(recipe)}>
              {recipe.name}
            </Link>
          </h3>
          <p>{recipe.description}</p>
        </div>
      ))}
    </div>
  );
};

export default RecipeList;
