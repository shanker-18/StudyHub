import React from 'react';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { id } = useParams();
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
          <p className="text-gray-600">Profile ID: {id}</p>
        </div>
        
        <div className="card">
          <p className="text-center text-gray-600">Profile content coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
