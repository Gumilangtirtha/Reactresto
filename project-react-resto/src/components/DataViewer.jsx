import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const DataViewer = () => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [itemId, setItemId] = useState('');
  const [inputValue, setInputValue] = useState('');

  // Function to fetch a specific item by ID
  const fetchItem = async (id) => {
    if (!id) {
      setError('Please enter a valid ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getItemById(id);
      setItem(data);
    } catch (err) {
      setItem(null);
      if (err.response && err.response.status === 404) {
        setError(`No item found with ID: ${id}`);
      } else {
        setError(`Error fetching data: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setItemId(inputValue);
    fetchItem(inputValue);
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">Data Viewer</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="mb-4">
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter item ID (1-100)"
                    value={inputValue}
                    onChange={handleInputChange}
                    min="1"
                    max="100"
                    required
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Loading...
                      </>
                    ) : (
                      'Fetch Data'
                    )}
                  </button>
                </div>
                <small className="text-muted">
                  Try IDs between 1 and 100 for JSONPlaceholder API
                </small>
              </form>

              {/* Error message */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {/* Data display */}
              {item && (
                <div className="card">
                  <div className="card-header bg-light">
                    <h3 className="card-title">Item #{item.id}</h3>
                  </div>
                  <div className="card-body">
                    <h4 className="card-title">{item.title}</h4>
                    <p className="card-text">{item.body}</p>
                    <div className="text-muted">
                      <small>User ID: {item.userId}</small>
                    </div>
                  </div>
                </div>
              )}

              {/* No data message */}
              {!loading && !error && !item && (
                <div className="alert alert-info" role="alert">
                  Enter an ID and click "Fetch Data" to view item details
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataViewer;
