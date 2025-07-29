import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    temperature: '',
    symptoms: false,
    covidContact: false
  });
  const [declarations, setDeclarations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchDeclarations();
  }, []);

  const fetchDeclarations = async () => {
    try {
      const response = await axios.get(`${API_URL}/health-declarations`);
      setDeclarations(response.data);
    } catch (error) {
      console.error('Error fetching declarations:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await axios.post(`${API_URL}/health-declarations`, formData);
      setMessage('Health declaration submitted successfully!');
      setFormData({
        name: '',
        temperature: '',
        symptoms: false,
        covidContact: false
      });
      fetchDeclarations();
    } catch (error) {
      setMessage('Error submitting declaration. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/health-declarations/${id}`);
      fetchDeclarations();
    } catch (error) {
      console.error('Error deleting declaration:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Health Declaration Form</h1>
        
        <form onSubmit={handleSubmit} className="health-form">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="temperature">Temperature (°C) *</label>
            <input
              type="number"
              id="temperature"
              name="temperature"
              step="0.1"
              min="35"
              max="45"
              value={formData.temperature}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="symptoms"
                checked={formData.symptoms}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              Do you have any of the following symptoms now or within the last 14 days: 
              Cough, smell/test impairment, fever, breathing difficulties, body aches, 
              headaches, fatigue, sore throat, diarrhea, runny nose (even if your symptoms are mild)?
            </label>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="covidContact"
                checked={formData.covidContact}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              Have you been in contact with anyone suspected or diagnosed with Covid-19 
              within the last 14 days?
            </label>
          </div>

          <button type="submit" disabled={isSubmitting} className="submit-btn">
            {isSubmitting ? 'Submitting...' : 'Submit Declaration'}
          </button>

          {message && (
            <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}
        </form>

        <div className="declarations-section">
          <h2>Submitted Health Declarations</h2>
          {declarations.length === 0 ? (
            <p>No declarations submitted yet.</p>
          ) : (
            <div className="table-container">
              <table className="declarations-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Temperature (°C)</th>
                    <th>Has Symptoms</th>
                    <th>Covid Contact</th>
                    <th>Submitted At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {declarations.map((declaration) => (
                    <tr key={declaration.id}>
                      <td>{declaration.name}</td>
                      <td>{declaration.temperature}</td>
                      <td>
                        <span className={`status ${declaration.symptoms ? 'yes' : 'no'}`}>
                          {declaration.symptoms ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>
                        <span className={`status ${declaration.covidContact ? 'yes' : 'no'}`}>
                          {declaration.covidContact ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>{formatDate(declaration.submittedAt)}</td>
                      <td>
                        <button 
                          onClick={() => handleDelete(declaration.id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;