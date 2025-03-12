import React, { useState, useEffect } from 'react';
// import { TextField, Button, Typography, Paper, Box, Autocomplete } from '@mui/material'; // Remove MUI imports
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';
import { useNavigate } from 'react-router-dom';

import { createPost, updatePost } from '../actions/posts';
// import useStyles from './styles'; // Remove useStyles

const Form = ({ currentId, setCurrentId }) => {
  const [postData, setPostData] = useState({ title: '', message: '', tags: [], selectedFile: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [tagInput, setTagInput] = useState('');
  
  const post = useSelector((state) => (currentId ? state.posts.posts.find((message) => message._id === currentId) : null));
  const dispatch = useDispatch();
  // const styles = useStyles(); // Remove useStyles
  const user = JSON.parse(localStorage.getItem('profile'));
  const navigate = useNavigate();

  const clear = () => {
    setCurrentId(0);
    setPostData({ title: '', message: '', tags: [], selectedFile: '' });
    setErrors({});
    setFormError('');
    setTagInput('');
  };

  useEffect(() => {
    if (!post?.title) clear();
    if (post) setPostData(post);
  }, [post]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!postData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!postData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    if (!postData.selectedFile) {
      newErrors.selectedFile = 'Please select an image';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setFormError('');
    
    try {
      if (currentId === 0) {
        await dispatch(createPost({ ...postData, name: user?.result?.name }, navigate));
      } else {
        await dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }));
      }
      clear();
    } catch (error) {
      setFormError(
        error?.response?.data?.message || 
        'An error occurred. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user?.result?.name) {
    return (
      <div className="bg-white rounded-lg shadow-lg mt-4 p-6"> {/* Replace Paper with div and add Tailwind classes */}
        <h6 className='text-center ' >
          Please Sign In to create your own memories and like other's memories.
        </h6>
      </div>
    );
  }

  const handleAddChip = (tag) => {
    if (!tag.trim()) return;
    
    // Don't add duplicate tags
    if (postData.tags.includes(tag.trim())) {
      setTagInput('');
      return;
    }
    
    setPostData({ ...postData, tags: [...postData.tags, tag.trim()] });
    setTagInput('');
  };

  const handleDeleteChip = (chipToDelete) => {
    setPostData({ ...postData, tags: postData.tags.filter((tag) => tag !== chipToDelete) });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData({ ...postData, [name]: value });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6"> {/* Replace Paper with div and add Tailwind classes */}
      <form
        autoComplete="off"
        noValidate
        onSubmit={handleSubmit}
      >
        <h6 className="text-lg font-bold mb-4">{currentId ? `Editing "${post?.title}"` : 'Creating a Memory'}</h6> {/* Replace Typography with h6 and add Tailwind classes */}
        
        {formError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {formError}
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            id="title"
            name="title"
            className={`w-full border rounded py-2 px-3 ${errors.title ? 'border-red-500' : ''}`}
            value={postData.title}
            onChange={handleChange}
            placeholder="Title of your memory"
          />
          {errors.title && <p className="text-red-500 text-xs italic mt-1">{errors.title}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className={`w-full border rounded py-2 px-3 ${errors.message ? 'border-red-500' : ''}`}
            value={postData.message}
            onChange={handleChange}
            placeholder="Share your story..."
          />
          {errors.message && <p className="text-red-500 text-xs italic mt-1">{errors.message}</p>}
        </div>
        
        <div className="mb-4"> {/* Replace Box with div and add Tailwind classes */}
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <div className="flex flex-wrap gap-1 mb-2">
            {postData.tags.map((tag) => (
              <div key={tag} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center">
                {tag}
                <button 
                  type="button"
                  onClick={() => handleDeleteChip(tag)} 
                  className="ml-1 text-blue-500 hover:text-blue-800"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              id="tags"
              type="text"
              placeholder="Add tags (press Enter)"
              className="w-full border rounded py-2 px-3"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddChip(tagInput);
                }
              }}
            />
            <button
              type="button"
              className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
              onClick={() => handleAddChip(tagInput)}
            >
              Add
            </button>
          </div>
        </div>
        
        <div className="mb-4"> {/* Replace Box with div and add Tailwind classes */}
          <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
          <FileBase
            type="file"
            multiple={false}
            onDone={({ base64 }) => {
              setPostData({ ...postData, selectedFile: base64 });
              if (errors.selectedFile) {
                setErrors({
                  ...errors,
                  selectedFile: ''
                });
              }
            }}
          />
          {errors.selectedFile && <p className="text-red-500 text-xs italic mt-1">{errors.selectedFile}</p>}
          {postData.selectedFile && (
            <div className="mt-2">
              <img 
                src={postData.selectedFile} 
                alt="Preview" 
                className="max-h-40 rounded shadow-sm" 
              />
            </div>
          )}
        </div>
        
        <button /* Replace Button with button and add Tailwind classes */
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
        <button /* Replace Button with button and add Tailwind classes */
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full"
          type="button"
          onClick={clear}
          disabled={isSubmitting}
        >
          Clear
        </button>
      </form>
    </div>
  );
};

export default Form;
