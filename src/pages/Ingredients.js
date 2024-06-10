import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Ingredients.css';
import { BACKEND_URL } from '../constants';

const IngredientItem = ({ name, category, quantityInGrams, handleViewDetails, handleEdit, handleDelete }) => {
  const quantityInKgs = (quantityInGrams / 1000).toFixed(2);
  return (
    <tr>
      <td>{name}</td>
      <td>{category}</td>
      <td>{quantityInGrams} g</td>
      <td>{quantityInKgs} kg</td>
      <td>
        <button className="view-button" onClick={handleViewDetails}>View Ingredient Full Details</button>
      </td>
      <td>
        <button className="edit-button" onClick={handleEdit}>Edit</button>
      </td>
      <td>
        <button className="delete-button" onClick={handleDelete}>Delete</button>
      </td>
    </tr>
  );
};

const IngredientDetailsPopup = ({ isOpen, handleClose, ingredient }) => {
  if (!isOpen) return null;
  return (
    <div className="ingredient-details-popup">
      <h3>Ingredient Details</h3>
      <ul>
        <li>Name: {ingredient.name}</li>
        <li>Category: {ingredient.category}</li>
        <li>Quantity (g): {ingredient.quantity}</li>
        <li>Moisture_Loss: {ingredient.moisture_loss}</li>
        <li>Energy_KCal: {ingredient.Energy_KCal}</li>
        <li>Sodium: {ingredient.sodium}</li>
        <li>Carbohydrate: {ingredient.carbohydrate}</li>
        <li>Dietary_Fibre: {ingredient.dietary_fibre}</li>
        <li>Protein: {ingredient.protein}</li>
        <li>Fat: {ingredient.fat}</li>
        <li>Sat_Fat: {ingredient.sat_fat}</li>
        <li>Trans_Fat: {ingredient.trans_fat}</li>
        <li>Cholesterol: {ingredient.cholesterol}</li>
        <li>Potassium: {ingredient.potassium}</li>
        <li>Total_Sugar: {ingredient.total_sugar}</li>
        <li>Added_Sugar: {ingredient.added_sugar}</li>
        <li>Vitamin_D: {ingredient.vitamin_D}</li>
        <li>Calcium: {ingredient.calcium}</li>
        <li>Iron: {ingredient.iron}</li>
      </ul>
      <button onClick={handleClose}>Close</button>
    </div>
  );
};

const Ingredients = ({userRole}) => {
  const [ingredients, setIngredients] = useState([]);
  const [ingredientCount, setIngredientCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [isDetailsPopupOpen, setIsDetailsPopupOpen] = useState(false);
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [editedQuantity, setEditedQuantity] = useState('');
  const [editingIngredient, setEditingIngredient] = useState(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/ingredients`);
        setIngredients(response.data);
        setFilteredIngredients(response.data);
        setIngredientCount(response.data.length);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      }
    };

    fetchIngredients();
  }, []);

  useEffect(() => {
    const filtered = ingredients.filter(ingredient =>
      ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredIngredients(filtered);
  }, [searchQuery, ingredients]);

  const handleViewDetails = (index) => {
    setSelectedIngredient(filteredIngredients[index]);
    setIsDetailsPopupOpen(true);
  };

  const handleEdit = (index) => {
    if (userRole === 'Manager' || userRole === 'Admin')
      {
        setEditPopupOpen(true);
    const ingredient = filteredIngredients[index];
    setEditingIngredient(ingredient);
    setEditedQuantity(ingredient.quantity);
      }
      else{
        alert('Not authorized to edit ingredients.');
      }
  };

  const handleDelete = async (index) => {
    if (userRole === 'Manager' || userRole === 'Admin')
      {
        try {
          const ingredientName = filteredIngredients[index].name;
          await axios.delete(`${BACKEND_URL}/ingredients/${ingredientName}`);
          const updatedIngredients = ingredients.filter((ingredient) => ingredient.name !== ingredientName);
          setIngredients(updatedIngredients);
          setIngredientCount(updatedIngredients.length);
        } catch (error) {
          console.error('Error deleting ingredient:', error);
        }
      }
      else{
        alert('Not authorized to delete ingredients.');
      }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleEditQuantity = async () => {
    try {
      const ingredientName = editingIngredient.name;
      await axios.patch(`${BACKEND_URL}/ingredients/${ingredientName}`, { "quantity": editedQuantity });
      const updatedIngredients = ingredients.map((ingredient) =>
        ingredient.name === ingredientName ? { ...ingredient, quantity: editedQuantity } : ingredient
      );
      setIngredients(updatedIngredients);
      setEditPopupOpen(false);
    } catch (error) {
      console.error('Error updating ingredient quantity:', error);
    }
  };

  const handleCloseDetailsPopup = () => {
    setIsDetailsPopupOpen(false);
    setSelectedIngredient(null);
  };

  return (
    <div className="container">
      <h2>Ingredients</h2>
      <input
        type="text"
        placeholder="Search ingredients..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-box"
      />
      <p>Total Ingredients: {ingredientCount}</p>
      <table className="ingredient-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity (g)</th>
            <th>Quantity (kg)</th>
            <th>View Details</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredIngredients.map((ingredient, index) => (
            <IngredientItem
              key={index}
              name={ingredient.name}
              category={ingredient.category}
              quantityInGrams={ingredient.quantity}
              handleViewDetails={() => handleViewDetails(index)}
              handleEdit={() => handleEdit(index)}
              handleDelete={() => handleDelete(index)}
            />
          ))}
        </tbody>
      </table>
      <IngredientDetailsPopup
        isOpen={isDetailsPopupOpen}
        handleClose={handleCloseDetailsPopup}
        ingredient={selectedIngredient}
      />
      {editPopupOpen && (
        <div className="edit-popup">
          <h3>Edit Quantity</h3>
          <input
            type="text"
            placeholder="Enter new quantity in gms"
            value={editedQuantity}
            onChange={(e) => setEditedQuantity(e.target.value)}
          />
          <button onClick={handleEditQuantity}>Save</button>
          <button onClick={() => setEditPopupOpen(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Ingredients;
