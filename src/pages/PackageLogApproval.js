import React, { useState, useEffect } from 'react';
import './Approvals.css';
import { BACKEND_URL } from '../constants';

const PackageLogApproval= () => {
  const [pendingApprovals, setPendingApprovals] = useState([]);

  useEffect(() => {
    // Fetch pending approvals from the backend
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/packagelogs?approved=false`);
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
      const response = await fetch(`${BACKEND_URL}/packagelogs/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approved: true }),
      });

      if (response.ok) {
        console.log(`Approval for ID ${id} successful`);

        // Remove the approved item from pending approvals list
        setPendingApprovals(pendingApprovals.filter(item => item._id !== id));
      } else {
        console.error(`Failed to approve item with ID ${id}`);
      }
    } catch (error) {
      console.error(`Error approving item with ID ${id}:`, error);
    }
  };


  return (
    <div className="approvals-container">
      <h2 className="approvals-title">Pending Approvals</h2>
      {pendingApprovals.length > 0 ? (
        <ul className="approvals-list">
          {pendingApprovals.map(item => (
            <li className="approvals-item" key={item._id}>
              <div className="approvals-batchCode">Batch Code: {item.batchcode}</div>
              <div className="approvals-recipe-name">Package Name: {item.Name}</div>
              <div className="approvals-final-weight">Weight: {item.Weight} kg</div>
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

export default PackageLogApproval;
