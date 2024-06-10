import React from 'react';
import './Users.css';

const UserDetailsModal = ({ user, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h3>User Details</h3>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Mobile:</strong> {user.phone}</p>
        <p><strong>Email:</strong> {user.emailid}</p>
        <p><strong>Password:</strong> <span className="blurred">{user.password}</span></p>
      </div>
    </div>
  );
};

export default UserDetailsModal;
