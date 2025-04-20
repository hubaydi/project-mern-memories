import React, { useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';

const ProfilePictureUpload = ({ onUpload }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      try {
        await onUpload(file);
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="profile-picture-upload"
        type="file"
        onChange={handleFileChange}
      />
      <label
        htmlFor="profile-picture-upload"
        className={`flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-full font-semibold shadow cursor-pointer transition-all border-2 border-white focus:ring-2 focus:ring-blue-400 ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
        tabIndex={0}
        aria-disabled={isUploading}
        title="Change profile picture"
      >
        {isUploading ? (
          <ImSpinner2 className="animate-spin" size={18} />
        ) : (
          <FaCloudUploadAlt size={18} />
        )}
        <span className="hidden md:inline">{isUploading ? 'Uploading...' : 'Change'}</span>
      </label>
    </div>
  );
};

export default ProfilePictureUpload;
