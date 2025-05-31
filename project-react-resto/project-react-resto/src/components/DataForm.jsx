import React, { useState, useEffect } from 'react';

const DataForm = ({ item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
  });

  // If an item is provided (for editing), populate the form
  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        body: item.body || '',
      });
    } else {
      // Reset form when creating a new item
      setFormData({
        title: '',
        body: '',
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        {item ? 'Edit Item' : 'Add New Item'}
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="body" className="form-label">
              Body
            </label>
            <textarea
              className="form-control"
              id="body"
              name="body"
              rows="3"
              value={formData.body}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {item ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DataForm;
