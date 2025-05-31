import React, { useState, useRef } from 'react';
// ...existing imports...

const User = () => {
  // ...existing state declarations...
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  const handleStatusUpdate = async (userId) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const newStatus = user.status === 1 ? 0 : 1;
      
      const response = await axios.put(`/api/users/${userId}/status`, {
        status: newStatus
      });

      if (response.data.success) {
        setUsers(users.map(u => 
          u.id === userId ? { ...u, status: newStatus } : u
        ));
        setMessage('User status updated successfully');
      }
    } catch (error) {
      setMessage('Failed to update user status');
      console.error(error);
    }
  };

  // ...existing modal and form code...

  return (
    <div className="container mt-4">
      {/* ...existing modal and form JSX... */}

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Level</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.level}</td>
                <td>
                  <button
                    className={`btn btn-sm ${user.status === 1 ? 'btn-success' : 'btn-danger'}`}
                    onClick={() => handleStatusUpdate(user.id)}
                  >
                    {user.status === 1 ? 'Active' : 'Banned'}
                  </button>
                </td>
                <td>
                  {/* ...existing action buttons... */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;
