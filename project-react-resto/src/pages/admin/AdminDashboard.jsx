import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="p-4">
      <div className="content-card">
        <h2 className="mb-4">⚔️ Mobile Legends Admin Dashboard ⚔️</h2>
        <p className="mb-4">
          Manage heroes, skills, players and battle statistics from this legendary control center.
        </p>
        <button className="btn-custom btn-primary-custom">
          🎮 Add New Admin
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
