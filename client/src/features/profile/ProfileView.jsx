import React from 'react';

const ProfileView = ({ profile, onEditClick }) => {
  return (
    <div className="mt-6">
      <div className="flex items-center mb-8">
        <img
          src={profile.profilePicture}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover mr-8 border-4 border-blue-200"
        />
        <div>
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <p className="text-gray-600">{profile.email}</p>
        </div>
      </div>
      {profile.bio && (
        <p className="text-gray-800 mb-4 whitespace-pre-line">{profile.bio}</p>
      )}
      <div className="flex gap-2 flex-wrap mt-4 mb-4">
        {profile.website && (
          <a href={profile.website} target="_blank" rel="noopener noreferrer" className="border border-blue-400 text-blue-600 px-4 py-1 rounded hover:bg-blue-50 transition">
            Website
          </a>
        )}
        {profile.twitter && (
          <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer" className="border border-blue-400 text-blue-600 px-4 py-1 rounded hover:bg-blue-50 transition">
            Twitter
          </a>
        )}
        {profile.instagram && (
          <a href={`https://instagram.com/${profile.instagram}`} target="_blank" rel="noopener noreferrer" className="border border-blue-400 text-blue-600 px-4 py-1 rounded hover:bg-blue-50 transition">
            Instagram
          </a>
        )}
        {profile.facebook && (
          <a href={`https://facebook.com/${profile.facebook}`} target="_blank" rel="noopener noreferrer" className="border border-blue-400 text-blue-600 px-4 py-1 rounded hover:bg-blue-50 transition">
            Facebook
          </a>
        )}
      </div>
      <button
        onClick={onEditClick}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded mt-3 font-semibold transition"
      >
        Edit Profile
      </button>
    </div>
  );
};

export default ProfileView;
