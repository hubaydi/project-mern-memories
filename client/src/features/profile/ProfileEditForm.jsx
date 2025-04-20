import React, { useState, useEffect } from 'react';

const ProfileEditForm = ({ profile, onSave }) => {
  const [formData, setFormData] = useState(profile);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const validateForm = () => {
    let newErrors = {};

    // Validate website URL
    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Invalid URL';
    }

    // Validate Twitter handle (alphanumeric and underscore only)
    if (formData.twitter && !/^[a-zA-Z0-9_]+$/.test(formData.twitter)) {
      newErrors.twitter = 'Invalid Twitter handle';
    }

    // Validate Instagram handle (alphanumeric, underscore, period only)
    if (formData.instagram && !/^[a-zA-Z0-9_.]+$/.test(formData.instagram)) {
      newErrors.instagram = 'Invalid Instagram handle';
    }

    // Validate Facebook handle (alphanumeric and period only)
    if (formData.facebook && !/^[a-zA-Z0-9.]+$/.test(formData.facebook)) {
      newErrors.facebook = 'Invalid Facebook handle';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="bio" className="block text-gray-700 font-semibold mb-1">Bio</label>
        <textarea
          id="bio"
          name="bio"
          value={formData?.bio || ''}
          onChange={handleChange}
          rows={4}
          className="w-full border rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div>
        <label htmlFor="website" className="block text-gray-700 font-semibold mb-1">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          value={formData?.website || ''}
          onChange={handleChange}
          className={`w-full border rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.website ? 'border-red-500' : ''}`}
        />
        {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website}</p>}
      </div>
      <div>
        <label htmlFor="twitter" className="block text-gray-700 font-semibold mb-1">Twitter</label>
        <input
          id="twitter"
          name="twitter"
          type="text"
          value={formData?.twitter || ''}
          onChange={handleChange}
          className={`w-full border rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.twitter ? 'border-red-500' : ''}`}
        />
        {errors.twitter && <p className="text-red-500 text-xs mt-1">{errors.twitter}</p>}
      </div>
      <div>
        <label htmlFor="instagram" className="block text-gray-700 font-semibold mb-1">Instagram</label>
        <input
          id="instagram"
          name="instagram"
          type="text"
          value={formData?.instagram || ''}
          onChange={handleChange}
          className={`w-full border rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.instagram ? 'border-red-500' : ''}`}
        />
        {errors.instagram && <p className="text-red-500 text-xs mt-1">{errors.instagram}</p>}
      </div>
      <div>
        <label htmlFor="facebook" className="block text-gray-700 font-semibold mb-1">Facebook</label>
        <input
          id="facebook"
          name="facebook"
          type="text"
          value={formData?.facebook || ''}
          onChange={handleChange}
          className={`w-full border rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.facebook ? 'border-red-500' : ''}`}
        />
        {errors.facebook && <p className="text-red-500 text-xs mt-1">{errors.facebook}</p>}
      </div>
      <div className="pt-2">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold transition">
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
