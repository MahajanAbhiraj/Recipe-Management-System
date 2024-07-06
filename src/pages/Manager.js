import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import RecipeForm from './RecipeForm';
import UserForm from './UserForm';
import EditUserForm from './EditUserForm';
import Modal from './Modal';
import './Manager.css';
import { BACKEND_URL } from '../constants';

const UploadButton = ({ handleFileUpload }) => {
  return (
    <div className="upload-container">
      <input
        type="file"
        id="fileUpload"
        className="file-upload"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
      />
      <label htmlFor="fileUpload" className="upload-button">
        Upload Excel File
      </label>
    </div>
  );
};

const Manager = ({ user }) => {
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showPackagingForm, setShowPackagingForm] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const[IsEditing,setIsEditing]=useState(false);
  const navigate = useNavigate();

  const columnMapping = {
    0: 's.no',
    1: 'name',
    2: 'category',
    3: 'moisture_loss',
    4: 'Energy_KCal',
    5: 'sodium',
    6: 'carbohydrate',
    7: 'dietary_fibre',
    8: 'protein',
    9: 'fat',
    10: 'sat_fat',
    11: 'trans_fat',
    12: 'cholesterol',
    13: 'potassium',
    14: 'total_sugar',
    15: 'added_sugar',
    16: 'vitamin_D',
    17: 'calcium',
    18: 'iron'
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: 0 });
        const data = rawData.slice(2); // Skip the first two rows
        const jsonData = [];
        for (let row of data) {
          // Stop processing if the first column is empty
          if (!row[0]) break;
          const transformedRow = {};
          row.forEach((cell, index) => {
            if (columnMapping[index]) {
              transformedRow[columnMapping[index]] = cell;
            }
          });
          jsonData.push(transformedRow);
        }
        console.log(jsonData);
        for (const row of jsonData) {
          try {
            const response = await fetch(`${BACKEND_URL}/ingredients`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(row)
            });

            if (!response.ok) {
              console.error(`Failed to upload row: ${JSON.stringify(row)}`);
            }
          } catch (error) {
            console.error('Error uploading data:', error);
          }
        }

        setIngredients(jsonData);
        alert('File uploaded and processed successfully.');
      };
      reader.readAsBinaryString(file);
    }
  };

  const fetchIngredients = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/ingredients`);
      if (response.ok) {
        const data = await response.json();
        setIngredients(data);
      } else {
        console.error('Failed to fetch ingredients');
      }
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
  };

  useEffect(() => {
    if (showRecipeForm) {
      fetchIngredients();
    }
  }, [showRecipeForm]);

  const handleCreateRecipe = (recipeData) => {
    setShowRecipeForm(false);
    alert('Recipe Created');
    // Add logic to handle creating the recipe
  };


  const handleCreateUser = (userData) => {
    setShowUserForm(false);
    alert('User Created');
    // Add logic to handle the new user if needed
  };

  const handleedit= ()=>
  {
    setIsEditing(true);
  }

  const onSave=(user)=>{
    setIsEditing(false);
  }
  if (user.role !== 'Manager' && user.role !== 'Admin') {
    return <div className="not-accessible">Not Accessible</div>;
  }

  return (
    <div className="manager-page">
      <div className="compartment">
        <h3>Upload Ingredients</h3>
        <p>For adding ingredients, use the button below to upload an Excel file.</p>
        <UploadButton handleFileUpload={handleFileUpload} />
      </div>

      <div className="compartment">
        <h3>Create Recipe</h3>
        <p>To create a new recipe, use the button below.</p>
        <button className="btn green" onClick={() => setShowRecipeForm(true)}>
          Create Recipe
        </button>
      </div>

      
    <div className="compartment">
      <h3>Create Packaging Item</h3>
      <p>To create a new packaging item, use the link below.</p>
      <Link to="/createpackaging" className="btn green no-underline">
        Create Packaging Item
      </Link>
    </div>
  

      

      <div className="compartment">
        <h3>Pending Approvals</h3>
        <p>To approve pending final products, use the link below.</p>
        <Link to="/approvals" className="link pending-approvals-button">Pending Approvals</Link>
      </div>

      <div className="compartment">
        <h3>My Profile</h3>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Mobile Number:</strong> {user.phone}</p>
        <p><strong>Email:</strong> {user.emailid}</p>
        <button className="btn yellow" onClick={() => handleedit()}>Edit My Details</button>
      </div>

      <div className="compartment">
        <h3>User Management</h3>
        <p>To manage other users, use the buttons below.</p>
        <button className="btn purple" onClick={() => navigate('/users')}>See Others' Details</button>
        <button className="btn red" onClick={() => setShowUserForm(true)}>Create User</button>
      </div>

      <Modal isOpen={showRecipeForm} onClose={() => setShowRecipeForm(false)}>
        <RecipeForm ingredients={ingredients} handleCreateRecipe={handleCreateRecipe} />
      </Modal>

      



      <Modal isOpen={showUserForm} onClose={() => setShowUserForm(false)}>
        <UserForm handleCreateUser={handleCreateUser} onClose={() => setShowUserForm(false)} />
      </Modal>

      {IsEditing && (
        <EditUserForm 
          user={user} 
          onSave={onSave} 
        />
      )}
    </div>
  );
};

export default Manager;
