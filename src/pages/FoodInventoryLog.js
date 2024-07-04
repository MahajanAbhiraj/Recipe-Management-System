import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './FoodInventoryLog.css';
import { BACKEND_URL } from '../constants';

const FoodInventoryLog = () => {
  const [finals, setFinals] = useState([]);
  
  useEffect(() => {
    fetchFinals();
  }, []);

  const fetchFinals = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/finals?approved=true`);
      if (response.ok) {
        const data = await response.json();
        setFinals(data);
      } else {
        console.error('Failed to fetch finals');
      }
    } catch (error) {
      console.error('Error fetching finals:', error);
    }
  };

  const handleViewDetails = (final) => {
    // Create a modal or popup to display the details
    const modal = document.createElement('div');
    modal.classList.add('modal');
    
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    
    const closeBtn = document.createElement('span');
    closeBtn.classList.add('close');
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => modal.remove());
  
    const recipeName = document.createElement('h3');
    recipeName.textContent = `Recipe Name: ${final.recipeName}`;
  
    const finalWeight = document.createElement('p');
    finalWeight.textContent = `Final Weight: ${final.finalWeight} kg`;
  
    const ingredientsHeading = document.createElement('h4');
    ingredientsHeading.textContent = 'Ingredients';
  
    const ingredientsList = document.createElement('ul');
    final.ingredientsUsed.forEach(ingredient => {
      const listItem = document.createElement('li');
      listItem.textContent = `${ingredient.ingredientName}: ${ingredient.weight} gms`;
      ingredientsList.appendChild(listItem);
    });
  
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(recipeName);
    modalContent.appendChild(finalWeight);
    modalContent.appendChild(ingredientsHeading);
    modalContent.appendChild(ingredientsList);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  };
  

  const generateExcel = async (final) => {
    // Fetch ingredient details and calculate nutritional values based on the actual weight in the recipe
    const ingredientsData = await Promise.all(final.ingredientsUsed.map(async (ingredient) => {
      const response = await fetch(`${BACKEND_URL}/ingredients/${ingredient.ingredientName}`);
      if (!response.ok) {
        console.error(`Failed to fetch details for ingredient: ${ingredient.ingredientName}`);
        return null;
      }
      const ingredientDetails = await response.json();
  
      // Calculate the dry weight
      const dryWeight = ingredient.weight * (1 - ingredientDetails.moisture_loss / 100);
  
      // Calculate nutritional values based on the actual weight in the recipe
      const factor = ingredient.weight / 100;
      const calculatedValues = {
        Energy_KCal: ingredientDetails.Energy_KCal * factor,
        sodium: ingredientDetails.sodium * factor,
        carbohydrate: ingredientDetails.carbohydrate * factor,
        dietary_fibre: ingredientDetails.dietary_fibre * factor,
        protein: ingredientDetails.protein * factor,
        fat: ingredientDetails.fat * factor,
        sat_fat: ingredientDetails.sat_fat * factor,
        trans_fat: ingredientDetails.trans_fat * factor,
        cholesterol: ingredientDetails.cholesterol * factor,
        potassium: ingredientDetails.potassium * factor,
        total_sugar: ingredientDetails.total_sugar * factor,
        added_sugar: ingredientDetails.added_sugar * factor,
        vitamin_D: ingredientDetails.vitamin_D * factor,
        calcium: ingredientDetails.calcium * factor,
        iron: ingredientDetails.iron * factor
      };
  
      return {
        ...ingredientDetails,
        originalWeight: ingredient.weight,
        dryWeight: dryWeight,
        calculatedValues: calculatedValues
      };
    }));
  
    // Filter out any null values in case of fetch failures
    const validIngredientsData = ingredientsData.filter(data => data !== null);
  
    // Create worksheet data with larger headings
    const worksheetData = validIngredientsData.map(ingredient => ({
      'INGREDIENT NAME': ingredient.name,
      'CATEGORY': ingredient.category,
      'ORIGINAL WEIGHT (GMS)': ingredient.originalWeight,
      'DRY WEIGHT (GMS)': ingredient.dryWeight,
      'ENERGY (KCAL PER 100G)': ingredient.Energy_KCal,
      'ENERGY (KCAL)': ingredient.calculatedValues.Energy_KCal,
      'SODIUM (MG PER 100G)': ingredient.sodium,
      'SODIUM (MG)': ingredient.calculatedValues.sodium,
      'CARBOHYDRATE (G PER 100G)': ingredient.carbohydrate,
      'CARBOHYDRATE (G)': ingredient.calculatedValues.carbohydrate,
      'DIETARY FIBRE (G PER 100G)': ingredient.dietary_fibre,
      'DIETARY FIBRE (G)': ingredient.calculatedValues.dietary_fibre,
      'PROTEIN (G PER 100G)': ingredient.protein,
      'PROTEIN (G)': ingredient.calculatedValues.protein,
      'FAT (G PER 100G)': ingredient.fat,
      'FAT (G)': ingredient.calculatedValues.fat,
      'SATURATED FAT (G PER 100G)': ingredient.sat_fat,
      'SATURATED FAT (G)': ingredient.calculatedValues.sat_fat,
      'TRANS FAT (G PER 100G)': ingredient.trans_fat,
      'TRANS FAT (G)': ingredient.calculatedValues.trans_fat,
      'CHOLESTEROL (MG PER 100G)': ingredient.cholesterol,
      'CHOLESTEROL (MG)': ingredient.calculatedValues.cholesterol,
      'POTASSIUM (MG PER 100G)': ingredient.potassium,
      'POTASSIUM (MG)': ingredient.calculatedValues.potassium,
      'TOTAL SUGAR (G PER 100G)': ingredient.total_sugar,
      'TOTAL SUGAR (G)': ingredient.calculatedValues.total_sugar,
      'ADDED SUGAR (G PER 100G)': ingredient.added_sugar,
      'ADDED SUGAR (G)': ingredient.calculatedValues.added_sugar,
      'VITAMIN D (MCG PER 100G)': ingredient.vitamin_D,
      'VITAMIN D (MCG)': ingredient.calculatedValues.vitamin_D,
      'CALCIUM (MG PER 100G)': ingredient.calcium,
      'CALCIUM (MG)': ingredient.calculatedValues.calcium,
      'IRON (MG PER 100G)': ingredient.iron,
      'IRON (MG)': ingredient.calculatedValues.iron
    }));
  
    // Generate Excel file with larger headings
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  
    // Modify header styles and merge cells
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + "1";
      if (!worksheet[address]) continue;
      worksheet[address].s = {
        font: { sz: 20, bold: true, color: { rgb: "000000" } },
        alignment: { vertical: 'center', horizontal: 'center', wrapText: true }
      };
  
      // Merge cells for the header to make them span 2-3 rows
      const mergeRange = {
        s: { r: 0, c: C }, // Start cell
        e: { r: 0, c: C }  // End cell (2 rows down)
      };
      if (!worksheet['!merges']) worksheet['!merges'] = [];
      worksheet['!merges'].push(mergeRange);
    }
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Final');
  
    XLSX.writeFile(workbook, `${final.recipeName}_FoodInventoryLog.xlsx`);
  };
  
  
  

  return (
    <div className="food-inventory-container">
      <h2 className="food-inventory-heading">Food Inventory Log</h2>
      <table className="food-inventory-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Batch Code</th>
            <th>Recipe Name</th>
            <th>Final Weight</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {finals.map((final,index) => (
            <tr key={final._id}>
                <td>{index+1}</td>
              <td>{final.batchCode}</td>
              <td>{final.recipeName}</td>
              <td>{final.finalWeight} Kg</td>
              <td>
                <button className="food-inventory-button" onClick={() => handleViewDetails(final)}>View Details</button>
                <button className="food-inventory-button" onClick={() => generateExcel(final)}>Generate Excel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FoodInventoryLog;
