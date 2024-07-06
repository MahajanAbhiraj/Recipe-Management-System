import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './RecipeList.css';
import { BACKEND_URL } from '../constants';

const RecipeList = ({ onSelectRecipe }) => {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="recipe-list-container">
      <h2 className="recipe-list-title">Recipes</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div className="recipe-list">
        {filteredRecipes.map((recipe) => (
          <div key={recipe._id} className="recipe-card">
            <h3 className="recipe-card-title">
              <Link to={`/recipes/${recipe._id}`} onClick={() => onSelectRecipe(recipe)}>
                {recipe.name}
              </Link>
            </h3>
            <p className="recipe-card-description">{recipe.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeList;
