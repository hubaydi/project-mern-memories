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
        className={`flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition ${isUploading ? 'opacity-70 cursor-not-allowed' : ''} cursor-pointer`}
        tabIndex={0}
        aria-disabled={isUploading}
      >
        {isUploading ? (
          <ImSpinner2 className="animate-spin" size={20} />
        ) : (
          <FaCloudUploadAlt size={20} />
        )}
        {isUploading ? 'Uploading...' : 'Upload Profile Picture'}
      </label>
    </div>
  );
};

export default ProfilePictureUpload;
