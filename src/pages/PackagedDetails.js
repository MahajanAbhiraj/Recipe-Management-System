import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../constants';
import './PackagedDetails.css'; // Import external CSS file

const PackagedDetails = () => {
  const { id } = useParams();
  const [packagedItem, setPackagedItem] = useState(null);
  const [amountInKgs, setAmountInKgs] = useState('');
  const [insufficientMaterials, setInsufficientMaterials] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchPackagedItem = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/Packages/${id}`);
        setPackagedItem(response.data);
      } catch (error) {
        console.error('Error fetching packaged item:', error);
      }
    };

    fetchPackagedItem();
  }, [id]);

  const handleAmountChange = (event) => {
    setAmountInKgs(event.target.value);
  };

  const handleCreateClick = async () => {
    const requiredAmounts = packagedItem.products.map((product) => ({
      recipe: product.recipe,
      requiredQuantity: (product.quantity * amountInKgs) / packagedItem.weight,
    }));

    const insufficientMaterials = [];

    for (let { recipe, requiredQuantity } of requiredAmounts) {
      try {
        const response = await axios.get(`${BACKEND_URL}/fgs/${recipe}`);
        if (response.data.TotalWeight < requiredQuantity) {
          insufficientMaterials.push({
            recipe,
            available: response.data.TotalWeight,
            required: requiredQuantity,
          });
        }
      } catch (error) {
        console.error(`Error fetching recipe ${recipe}:`, error);
      }
    }

    if (insufficientMaterials.length > 0) {
      setInsufficientMaterials(insufficientMaterials);
      setShowPopup(true);
    } else {
      setShowConfirmation(true);
    }
  };

  const handleConfirmClick = async (confirmed) => {
    setShowConfirmation(false);
    if (confirmed) {
      for (let { recipe, requiredQuantity } of packagedItem.products.map((product) => ({
        recipe: product.recipe,
        requiredQuantity: (product.quantity * amountInKgs) / packagedItem.weight,
      }))) {
        try {
          await axios.put(`${BACKEND_URL}/fgs`, {
            recipeName:recipe,
            TotalWeight: -requiredQuantity, // Deduct the required quantity
          });
          
        } catch (error) {
          console.error(`Error updating recipe ${recipe}:`, error);
        }
      }
      alert('Quantities successfully updated!');
    }
  };

  return (
    <div className="container">
      {packagedItem ? (
        <div className="packaged-details">
          <h2>{packagedItem.name}</h2>
          <p><strong>Weight:</strong> {packagedItem.weight} kg</p>
          <h3>Products</h3>
          <ul>
            {packagedItem.products.map((product, index) => (
              <li key={index}>
                {product.recipe}: {product.quantity} units
              </li>
            ))}
          </ul>
          <div className="amount-input">
            <label htmlFor="amountInKgs">Enter the amount in kgs:</label>
            <input
              type="number"
              id="amountInKgs"
              value={amountInKgs}
              onChange={handleAmountChange}
              placeholder="Enter amount in kgs"
            />
          </div>
          <button onClick={handleCreateClick}>Create</button>
          {showPopup && (
            <div className="packaged-popup">
              <div className="packaged-popup-content">
                <h3>Insufficient Recipe Material</h3>
                <ul>
                  {insufficientMaterials.map((material, index) => (
                    <li key={index}>
                      {material.recipe}: Available {material.available} kg, Required {material.required} kg
                    </li>
                  ))}
                </ul>
                <button onClick={() => setShowPopup(false)}>Close</button>
              </div>
            </div>
          )}
          {showConfirmation && (
            <div className="packaged-confirmation">
              <div className="packaged-confirmation-content">
                <p>Are you sure you want to create this package?</p>
                <button onClick={() => handleConfirmClick(true)}>Yes</button>
                <button onClick={() => handleConfirmClick(false)}>No</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PackagedDetails;
