import React, { useState } from 'react';
import './UserForm.css';
import { BACKEND_URL } from '../constants';
const UserForm = ({ handleCreateUser, onClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    password: '',
    phone: '',
    emailid: '',
    role: 'User' // default value
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('User created successfully');
        handleCreateUser(formData); // Pass the created user data back to parent component
        onClose(); // Close the modal
      } else {
        alert('Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('An error occurred while creating the user');
    }
  };

  return (
    <div className="user-form-container">
      <h3>Create User</h3>
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="emailid">Email:</label>
          <input
            type="email"
            id="emailid"
            name="emailid"
            value={formData.emailid}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="User">User</option>
            <option value="Manager">Manager</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn green">Create User</button>
          <button type="button" className="btn red" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
