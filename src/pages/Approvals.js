import React, { useState, useEffect } from 'react';
import './Approvals.css';
import { BACKEND_URL } from '../constants';

const Approvals = () => {
  const [pendingApprovals, setPendingApprovals] = useState([]);

  useEffect(() => {
    // Fetch pending approvals from the backend
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/finals?approved=false`);
      if (response.ok) {
        const data = await response.json();
        setPendingApprovals(data);
      } else {
        console.error('Failed to fetch pending approvals');
      }
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`${BACKEND_URL}/finals/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approved: true }),
      });

      if (response.ok) {
        console.log(`Approval for ID ${id} successful`);

        // Find the approved item
        const approvedItem = pendingApprovals.find(item => item._id === id);

        // Call the function to update final goods
        if (approvedItem) {
          await handleUpdateFinalGoods(approvedItem.recipeName, approvedItem.finalWeight);
        }

        // Remove the approved item from pending approvals list
        setPendingApprovals(pendingApprovals.filter(item => item._id !== id));
      } else {
        console.error(`Failed to approve item with ID ${id}`);
      }
    } catch (error) {
      console.error(`Error approving item with ID ${id}:`, error);
    }
  };

  const handleUpdateFinalGoods = async (recipeName, TotalWeight) => {
    try {
      const response = await fetch(`${BACKEND_URL}/fgs`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipeName, TotalWeight }),
      });

      if (response.ok) {
        console.log(`Final goods updated successfully for recipe ${recipeName}`);
      } else {
        console.error(`Failed to update final goods for recipe ${recipeName}`);
      }
    } catch (error) {
      console.error(`Error updating final goods for recipe ${recipeName}:`, error);
    }
  };

  return (
    <div className="approvals-container">
      <h2 className="approvals-title">Pending Approvals</h2>
      {pendingApprovals.length > 0 ? (
        <ul className="approvals-list">
          {pendingApprovals.map(item => (
            <li className="approvals-item" key={item._id}>
              <div className="approvals-batchCode">Batch Code: {item.batchCode}</div>
              <div className="approvals-recipe-name">Recipe Name: {item.recipeName}</div>
              <div className="approvals-final-weight">Final Weight: {item.finalWeight} kg</div>
              <div className="approvals-ingredients">
                <div className="ingredient-heading"> Ingredients Used: </div>
                <ul>
                  {item.ingredientsUsed.map(ingredient => (
                    <li key={ingredient._id} className="approvals-ingredient">
                      {ingredient.ingredientName}: {ingredient.weight} gms
                    </li>
                  ))}
                </ul>
              </div>
              <button className="approvals-approve-button" onClick={() => handleApprove(item._id)}>Approve</button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="no-approvals">No pending approvals</div>
      )}
    </div>
  );
};

export default Approvals;
