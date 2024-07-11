import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../constants';
import './PackagedLogs.css'; // Import external CSS file

const PackagedLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/packagelogs?approved=true`);
        setLogs(response.data);
      } catch (error) {
        console.error('Error fetching package logs:', error);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="package-logs-container">
      <h2>Package Logs</h2>
      <table className="package-logs-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Batch Code</th>
            <th>Name</th>
            <th>Weight</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={log._id}>
              <td>{index + 1}</td>
              <td>{log.batchcode}</td>
              <td>{log.Name}</td>
              <td>{log.Weight} kg</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PackagedLogs;
