import React, { useState } from 'react';
import './RecipeForm.css';
import { BACKEND_URL } from '../constants';

const RecipeForm = ({ ingredients, handleCreateRecipe }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [maxServings, setMaxServings] = useState('');
  const [preparationNotes, setPreparationNotes] = useState('');
  const [totalWeight, setTotalWeight] = useState('');
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [quantity, setQuantity] = useState('');
  const [filteredIngredients, setFilteredIngredients] = useState([]);

  const handleSearchIngredient = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSelectedIngredient(searchTerm);
    if (searchTerm === '') {
      setFilteredIngredients([]);
    } else {
      const filtered = ingredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(searchTerm)
      );
      setFilteredIngredients(filtered);
    }
  };

  const handleAddIngredient = () => {
    if (selectedIngredient && quantity) {
      const ingredient = ingredients.find(ingredient => ingredient.name.toLowerCase() === selectedIngredient.toLowerCase());
      if (ingredient) {
        const newRecipeIngredient = {
          name: ingredient.name,
          quantity: quantity
        };
        setRecipeIngredients([...recipeIngredients, newRecipeIngredient]);
        setSelectedIngredient('');
        setQuantity('');
        setFilteredIngredients([]);
      }
    }
  };

  const handleIngredientSelect = (ingredientName) => {
    setSelectedIngredient(ingredientName);
    setFilteredIngredients([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedIngredients = recipeIngredients.map(ingredient => ({
        ingredient: ingredient.name,
        quantity: ingredient.quantity
      }));
    const recipeData = {
      name,
      description,
      category,
      maxServings,
      preparationNotes,
      totalWeight,
      ingredients: formattedIngredients
    };
    console.log(JSON.stringify(recipeData));
    try {
      const response = await fetch(`${BACKEND_URL}/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(recipeData)

      });
      if (!response.ok) {
        throw new Error('Failed to create recipe');
      }
  
      // Assuming the response contains the created recipe data
      const createdRecipe = await response.json();
  
      // Optionally, you can handle the created recipe data here
  
      // Call the callback function passed as props to handle the created recipe
      handleCreateRecipe(createdRecipe);
    } catch (error) {
      console.error('Error creating recipe:', error.message);
      // Optionally, you can display an error message to the user
    }
  };
  

  return (
    <div className="recipe-form-container">
      <h2>Create New Recipe</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />

        <label htmlFor="description">Description:</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />

        <label htmlFor="category">Category:</label>
        <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} />

        <label htmlFor="maxServings">Maximum Servings:</label>
        <input type="text" id="maxServings" value={maxServings} onChange={(e) => setMaxServings(e.target.value)} />

        <label htmlFor="preparationNotes">Preparation Notes:</label>
        <textarea id="preparationNotes" value={preparationNotes} onChange={(e) => setPreparationNotes(e.target.value)} />

        <label htmlFor="totalWeight">Total Weight:</label>
        <input type="text" id="totalWeight" value={totalWeight} onChange={(e) => setTotalWeight(e.target.value)} />

        <div className="ingredient-selection">
          <label htmlFor="ingredients">Select Ingredient:</label>
          <input
            type="text"
            id="ingredients"
            placeholder="Search ingredient"
            value={selectedIngredient}
            onChange={handleSearchIngredient}
          />
          {filteredIngredients.length > 0 && (
            <ul className="ingredient-dropdown">
              {filteredIngredients.map(ingredient => (
                <li key={ingredient.name} onClick={() => handleIngredientSelect(ingredient.name)}>
                  {ingredient.name}
                </li>
              ))}
            </ul>
          )}
          <input type="text" placeholder="Quantity(in gms)" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          <button type="button" onClick={handleAddIngredient}>Add Ingredient</button>
        </div>

        <div className="recipe-ingredients">
          <h3>Recipe Ingredients:</h3>
          <ul>
            {recipeIngredients.map((ingredient, index) => (
              <li key={index}>{ingredient.name} - {ingredient.quantity}</li>
            ))}
          </ul>
        </div>

        <button type="submit">Create Recipe</button>
      </form>
    </div>
  );
};

export default RecipeForm;
