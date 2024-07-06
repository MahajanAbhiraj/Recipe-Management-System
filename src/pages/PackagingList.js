import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../constants';
import './PackagingList.css'; // Import external CSS file

const PackagingList = () => {
  const [packagedList, setPackagedList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackagedItems = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/Packages`);
        setPackagedList(response.data);
      } catch (error) {
        console.error('Error fetching packaged items:', error);
      }
    };

    fetchPackagedItems();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleRowClick = (id) => {
    navigate(`/packaged/${id}`);
  };

  const filteredPackagedList = packagedList.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="packaging-container">
      <h2 className="packaging-title">Packaged Items</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search packaged items..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div className="packaged-list">
        {filteredPackagedList.map((item, index) => (
          <div
            key={index}
            className="packaged-item"
            onClick={() => handleRowClick(item._id)}
          >
            <p className="packaged-item-name">{item.name}</p>
            <p className="packaged-item-weight">{item.weight} kg</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackagingList;
