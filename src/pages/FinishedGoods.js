import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Table } from 'react-bootstrap';
import { BACKEND_URL } from '../constants';
import './FinishedGoods.css'; // Import external CSS file

const FgsDetails = () => {
  const [fgsList, setFgsList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFgs, setSelectedFgs] = useState(null);
  const [scaledIngredients, setScaledIngredients] = useState([]);

  useEffect(() => {
    const fetchFgsDetails = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/fgs`);
        setFgsList(response.data);
      } catch (error) {
        console.error('Error fetching FGS details:', error);
      }
    };

    fetchFgsDetails();
  }, []);

  const handleShowDetails = async (fgs) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/recipes/name/${fgs.recipeName}`);
      const recipe = response.data;

      // Calculate the scaling factor
      const scalingFactor = fgs.TotalWeight / recipe.totalWeight;

      // Scale the ingredients
      const scaledIngredients = recipe.ingredients.map(ingredient => ({
        ingredientName: ingredient.ingredient,
        quantity: ingredient.quantity * scalingFactor,
      }));

      setSelectedFgs(fgs);
      setScaledIngredients(scaledIngredients);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
  };

  const handleClose = () => setShowModal(false);

  return (
    <div className="container">
      <h2 className="mb-4">Finished Goods Details</h2>
      <div className="fgs-table-container">
        <Table striped bordered hover>
          <thead className="thead-dark">
            <tr>
              <th>S.No</th>
              <th>Recipe Name</th>
              <th>Total Weight (kg)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fgsList.map((fgs, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{fgs.recipeName}</td>
                <td>{fgs.TotalWeight}</td>
                <td>
                  <Button variant="primary" onClick={() => handleShowDetails(fgs)}>
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {selectedFgs && (
        <Modal show={showModal} onHide={handleClose} centered>
          <Modal.Header closeButton className="fgs-modal-header">
            <Modal.Title className="fgs-modal-title">{selectedFgs.recipeName} - Ingredients Details</Modal.Title>
          </Modal.Header>
          <Modal.Body className="fgs-modal-body">
            <Table striped bordered hover>
              <thead className="thead-dark">
                <tr>
                  <th>Ingredient Name</th>
                  <th>Quantity (g)</th>
                </tr>
              </thead>
              <tbody>
                {scaledIngredients.map((ingredient, index) => (
                  <tr key={index}>
                    <td>{ingredient.ingredientName}</td>
                    <td>{ingredient.quantity.toFixed(2)}</td> {/* Round to 2 decimal places */}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer className="fgs-modal-footer">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default FgsDetails;
