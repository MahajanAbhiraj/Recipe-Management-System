import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import UserDetailsModal from './UserDetailsModal';
import EditUserForm from './EditUserForm';
import './Users.css';
import { BACKEND_URL } from '../constants';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
//   const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
  };

  const handleEditUser = (user) => {
    setIsEditing(true);
    setSelectedUser(user);
  };

  const handleSaveUser = (updatedUser) => {
    if (updatedUser) {
      // Here you can add the logic to save the updated user to the backend
      console.log('Saving user:', updatedUser);
    }
    setIsEditing(false);
    setSelectedUser(null);
  };

  return (
    <div className="users-page">
      <h2>Users</h2>
      <ul className="users-list">
        {users.map(user => (
          <li key={user._id} className="user-item">
            <div><strong>Name:</strong> {user.name}</div>
            <div><strong>Username:</strong> {user.username}</div>
            <div className="user-actions">
              <button 
                className="btn view-btn" 
                onClick={() => handleViewDetails(user)}
              >
                View Full Details
              </button>
              <button 
                className="btn edit-btn" 
                onClick={() => handleEditUser(user)}
              >
                Edit Details
              </button>
            </div>
          </li>
        ))}
      </ul>
      {selectedUser && !isEditing && (
        <UserDetailsModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
      {selectedUser && isEditing && (
        <EditUserForm 
          user={selectedUser} 
          onSave={handleSaveUser} 
        />
      )}
    </div>
  );
};

export default Users;
