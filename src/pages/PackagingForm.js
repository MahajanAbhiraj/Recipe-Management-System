import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../constants';
import './PackagingForm.css';

const PackagingForm = ({ handleCreatePackaging }) => {
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [availableRecipes, setAvailableRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/recipes`);
        setAvailableRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAddRecipe = (recipe) => {
    const quantity = parseFloat(prompt('Enter quantity:'));
    if (quantity > 0) {
      setSelectedRecipes([...selectedRecipes, { recipe: recipe.name, quantity }]);
    }
  };

  const handleRemoveRecipe = (index) => {
    setSelectedRecipes(selectedRecipes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newPackage = { name, weight, products: selectedRecipes };
    
    try {
      axios.post(`${BACKEND_URL}/Packages`, newPackage);
      alert('Package created successfully!'); // Alert should appear
      navigate('/manager'); // Redirect after successful creation
    } catch (error) {
      console.error('Error creating package:', error);
    }
  };
  

  const filteredRecipes = searchQuery
  ? availableRecipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : [];


  return (
    <form className="packaging-form" onSubmit={handleSubmit}>
      <h2>Create Packaging</h2>
      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Weight (kg):</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Search Recipes:</label>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search recipes..."
        />
      </div>
      <div className="recipe-search-results">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe._id}
            className="recipe-item"
            onClick={() => handleAddRecipe(recipe)}
          >
            {recipe.name}
          </div>
        ))}
      </div>
      <div className="selected-recipes">
        <h3>Selected Recipes:</h3>
        {selectedRecipes.map((recipe, index) => (
          <div key={index} className="selected-recipe">
            <span>{recipe.recipe} - {recipe.quantity} units</span>
            <button type="button" onClick={() => handleRemoveRecipe(index)}>Remove</button>
          </div>
        ))}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default PackagingForm;
