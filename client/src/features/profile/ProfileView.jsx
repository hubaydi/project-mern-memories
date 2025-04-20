import React from 'react';
import { FaTwitter, FaInstagram, FaFacebook, FaGlobe } from 'react-icons/fa';

const ProfileView = ({ profile, onEditClick }) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in">
      {/* Cover image placeholder */}
      <div className="h-40 md:h-56 w-full bg-gradient-to-r from-blue-300 to-purple-200" />
      {/* Profile picture and details */}
      <div className="relative flex flex-col items-center -mt-20 pb-8 px-6 md:px-12">
        <div className="relative">
          <img
            src={profile.profilePicture}
            alt="Profile"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg object-cover bg-gray-100"
          />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-1 flex items-center gap-2">
          {profile.name}
        </h1>
        <p className="text-gray-500 mb-2">{profile.email}</p>
        <div className="flex gap-3 mb-4">
          {profile.website && (
            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 transition" title="Website">
              <FaGlobe size={22} />
            </a>
          )}
          {profile.twitter && (
            <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 transition" title="Twitter">
              <FaTwitter size={22} />
            </a>
          )}
          {profile.instagram && (
            <a href={`https://instagram.com/${profile.instagram}`} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-700 transition" title="Instagram">
              <FaInstagram size={22} />
            </a>
          )}
          {profile.facebook && (
            <a href={`https://facebook.com/${profile.facebook}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 transition" title="Facebook">
              <FaFacebook size={22} />
            </a>
          )}
        </div>
        {profile.bio && (
          <p className="text-gray-700 mb-6 whitespace-pre-line max-w-xl text-center">{profile.bio}</p>
        )}
        <button
          onClick={onEditClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-full font-semibold shadow transition mb-2"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileView;
