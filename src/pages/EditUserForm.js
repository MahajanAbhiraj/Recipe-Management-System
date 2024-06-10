import React, { useState } from 'react';
import './EditUserForm.css';
import { BACKEND_URL } from '../constants';

const EditUserForm = ({ user, onSave }) => {
  const [editableUser, setEditableUser] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableUser({ ...editableUser, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/users/${editableUser._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editableUser)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        onSave(updatedUser);
      } else {
        console.error('Failed to save user details');
      }
    } catch (error) {
      console.error('Error saving user details:', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-button" onClick={() => onSave(null)}>X</button>
        <h3>Edit User Details</h3>
        <div className="edit-form">
          <div className="form-group">
            <label>Name:</label>
            <input name="name" value={editableUser.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Username:</label>
            <input name="username" value={editableUser.username} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Mobile:</label>
            <input name="phone" value={editableUser.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input name="email" value={editableUser.emailid} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input name="password" type="password" value={editableUser.password} onChange={handleChange} />
          </div>
          <button className="edit-btn" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditUserForm;
