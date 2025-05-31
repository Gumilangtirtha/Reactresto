import React from 'react';

const DataTable = ({ data, onEdit, onDelete }) => {
  if (!data || data.length === 0) {
    return (
      <div className="alert alert-info" role="alert">
        No data available. Add some data to see it here.
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Title</th>
            <th scope="col">Body</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.body.substring(0, 50)}...</td>
              <td>
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm me-1"
                    onClick={() => onEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
