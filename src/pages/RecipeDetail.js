import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './RecipeDetail.css';
import axios from 'axios';
import { BACKEND_URL } from '../constants';

const RecipeDetail = ({ recipe }) => {
  const { id } = useParams();
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [requiredWeight, setRequiredWeight] = useState('');
  const [insufficientIngredients, setInsufficientIngredients] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [batchCode, setBatchCode] = useState(''); // State for batch code
  const [updatedIngredients, setUpdatedIngredients] = useState([]);
  const [shouldGeneratePDF, setShouldGeneratePDF] = useState(false);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/recipes/${id}`);
        const data = await response.json();
        setRecipeDetails(data);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
      }
    };

    if (!recipe) {
      fetchRecipeDetails();
    } else {
      setRecipeDetails(recipe);
    }
  }, [id, recipe]);

  const handleWeightChange = (e) => {
    setRequiredWeight(e.target.value);
  };

  const checkIngredientAvailability = async (ingredient) => {
    try {
      console.log('Checking availability for ingredient:', ingredient);
      const response = await fetch(`${BACKEND_URL}/ingredients/${ingredient.ingredient}`);
      const data = await response.json();
      return data.quantity >= ingredient.requiredQuantity;
    } catch (error) {
      console.error(`Error checking ingredient ${ingredient.ingredient}:`, error);
      return false;
    }
  };

  const handleProceed = async () => {
    if (!requiredWeight) {
      alert('Please enter the required weight');
      return;
    }

    const requiredFactor = requiredWeight / recipeDetails.totalWeight;
    const updatedIngredients = recipeDetails.ingredients.map((ingredient) => ({
      ...ingredient,
      requiredQuantity: ingredient.quantity * requiredFactor,
    }));

    const unavailableIngredients = [];

    for (const ingredient of updatedIngredients) {
      if (!ingredient.ingredient) {
        console.error('Ingredient object does not have an ingredient property:', ingredient);
        continue;
      }
      const isAvailable = await checkIngredientAvailability(ingredient);
      if (!isAvailable) {
        unavailableIngredients.push(ingredient.ingredient);
      }
    }

    if (unavailableIngredients.length > 0) {
      setInsufficientIngredients(unavailableIngredients);
    } else {
      setShowConfirmation(true);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
  
    doc.setFont('helvetica', 'bold');
    doc.text('Preparation Notes', 20, 20);
    doc.setFont('helvetica', 'normal');
  
    const pageHeight = doc.internal.pageSize.height; // Get the height of the page
    const margin = 20;
    const maxHeight = pageHeight - margin * 2;
  
    // Split the text into lines that fit within the page width
    const notes = doc.splitTextToSize(recipeDetails.preparationNotes, 170);
    let cursorY = 30;
    notes.forEach(line => {
      if (cursorY + 10 > maxHeight) {
        doc.addPage();
        cursorY = margin;
      }
      doc.text(line, 20, cursorY);
      cursorY += 10;
    });
  
    // Add some space before the table
    cursorY += 10;
  
    // Check if there's enough space for the table, otherwise add a new page
    if (cursorY + 20 > maxHeight) {
      doc.addPage();
      cursorY = margin;
    }
    console.log("HI");
    console.log(updatedIngredients);
    // Use autoTable to create the table, which handles page breaks automatically
    doc.autoTable({
      startY: cursorY,
      head: [['Food Item', 'Required Quantity', 'Available Quantity']],
      body: updatedIngredients.map((ingredient) => [
        ingredient.ingredient,
        ingredient.requiredQuantity,
        ingredient.availableQuantity,
      ]),
      margin: { top: cursorY },
    });
    const fileName = `${recipeDetails.name}_${batchCode}_Recipe.pdf`;
     doc.save(fileName);
  };
  

  const saveOnFinal = async () => {
    const ingredientsUsed = recipeDetails.ingredients.map((ingredient) => ({
      ingredientName: ingredient.ingredient,
      weight: (ingredient.quantity * (requiredWeight / recipeDetails.totalWeight)).toFixed(2),
    }));

    const finalProduct = {
      recipeName: recipeDetails.name,
      finalWeight: requiredWeight,
      ingredientsUsed: ingredientsUsed,
      batchCode: batchCode, 
      approved: false, 
    };

    try {
      const response = await fetch(`${BACKEND_URL}/finals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalProduct),
      });

      if (response.ok) {
        console.log('Final product saved successfully');
      } else {
        console.error('Error saving final product:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving final product:', error);
    }
  };

  const deductQuantity = async () => {
    try {
      const updatedIngredientsList = [];
      for (const ingredient of recipeDetails.ingredients) {
        const { ingredient: ingredientName, quantity } = ingredient;
        const requiredQuantity = quantity * (requiredWeight / recipeDetails.totalWeight);
  
        // Fetch the current quantity of the ingredient
        const response = await axios.get(`${BACKEND_URL}/ingredients/${ingredientName}`);
        const currentQuantity = response.data.quantity;
        console.log(currentQuantity);
  
        // Deduct the required quantity
        const editedQuantity = currentQuantity - requiredQuantity;
        console.log(editedQuantity);
  
        // Update the ingredient quantity
        await axios.patch(`${BACKEND_URL}/ingredients/${ingredientName}`, { quantity: editedQuantity });
  
        // Store the updated ingredient quantity
        updatedIngredientsList.push({
          ingredient: ingredientName,
          requiredQuantity: requiredQuantity.toFixed(2),
          availableQuantity: editedQuantity.toFixed(2)
        });
        console.log(`Deducted ${requiredQuantity} units of ${ingredientName} from total quantity.`);
      }
      setUpdatedIngredients(updatedIngredientsList);
    } catch (error) {
      console.error('Error deducting quantity:', error);
    }
  };

   
  useEffect(() => {
    if (shouldGeneratePDF && updatedIngredients.length > 0) {
      generatePDF();
      setShouldGeneratePDF(false); // Reset the flag
    }
  }, [shouldGeneratePDF, updatedIngredients]);
  
  const handleConfirm = async () => {
    console.log('Confirmed preparation of', requiredWeight, 'kg of recipe');
    
    // Ensure updated ingredients are set before generating PDF
    await deductQuantity();
    
    // Set the flag to generate the PDF
    setShouldGeneratePDF(true);
    
    // Save the final product
    saveOnFinal();
  
    setShowConfirmation(false);
  };
  

  const handleCloseInsufficientPopup = () => {
    setInsufficientIngredients([]);
  };

  const handleBatchCodeChange = (e) => {
    setBatchCode(e.target.value);
  };

  if (!recipeDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="recipe-detail-container">
      <h2>Recipe Details</h2>
      <div className="recipe-detail-header">
        <div className="recipe-detail-info">
          <div className="detail-row">
            <span className="detail-label">NAME</span>
            <span className="detail-value">{recipeDetails.name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">DESCRIPTION</span>
            <span className="detail-value">{recipeDetails.description}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">CATEGORY</span>
            <span className="detail-value">{recipeDetails.category}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">MAXIMUM SERVINGS</span>
            <span className="detail-value">{recipeDetails.maxServings}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">PREPARATION NOTES</span>
            <span className="detail-value">{recipeDetails.preparationNotes}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">TOTAL WEIGHT</span>
            <span className="detail-value">{recipeDetails.totalWeight} kg</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">RECIPE INGREDIENTS</span>
            <span className="detail-value">
              <ul>
                {recipeDetails.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient.ingredient}</li>
                ))}
              </ul>
            </span>
          </div>
        </div>
        <div className="recipe-detail-image">
          <img src="/path-to-your-image.jpg" alt={recipeDetails.name} /> {/* Update the image path */}
        </div>
      </div>

      <div className="recipe-weight-input">
        <label htmlFor="weight">Enter required weight of recipe:</label>
        <input
          type="number"
          id="weight"
          value={requiredWeight}
          onChange={handleWeightChange}
        />
        <button className="proceed-btn" onClick={handleProceed}>Proceed</button>
      </div>

      {insufficientIngredients.length > 0 && (
        <div className="insufficient-popup">
          <h3>Insufficient Ingredients</h3>
          <ul>
            {insufficientIngredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
          <button onClick={handleCloseInsufficientPopup}>Close</button>
        </div>
      )}

      {showConfirmation && (
        <div className="confirmation-popup">
          <h3>Confirmation</h3>
          <p>Are you sure you want to prepare {requiredWeight} kg of this recipe?</p>
          <label htmlFor="batchCode">Enter Batch Code:</label>
          <input
            type="text"
            id="batchCode"
            value={batchCode}
            onChange={handleBatchCodeChange}
          />
          <button onClick={handleConfirm}>Yes</button>
          <button onClick={() => setShowConfirmation(false)}>No</button>
        </div>
      )}

      <div className="ingredient-table">
        <h3>Recipe Ingredients</h3>
        <table>
          <thead>
            <tr>
              <th>Food Item</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {recipeDetails.ingredients.map((ingredient, index) => (
              <tr key={index}>
                <td>{ingredient.ingredient}</td>
                <td>{ingredient.quantity} gms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecipeDetail;
