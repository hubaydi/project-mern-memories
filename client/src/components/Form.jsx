import React, { useState, useEffect } from 'react';
// import { TextField, Button, Typography, Paper, Box, Autocomplete } from '@mui/material'; // Remove MUI imports
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';
import { useNavigate } from 'react-router-dom';

import { createPost, updatePost } from '../actions/posts';
// import useStyles from './styles'; // Remove useStyles

const Form = ({ currentId, setCurrentId }) => {
  const [postData, setPostData] = useState({ title: '', message: '', tags: [], selectedFile: '' });
  const post = useSelector((state) => (currentId ? state.posts.posts.find((message) => message._id === currentId) : null));
  const dispatch = useDispatch();
  // const styles = useStyles(); // Remove useStyles
  const user = JSON.parse(localStorage.getItem('profile'));
  const navigate = useNavigate();

  const clear = () => {
    setCurrentId(0);
    setPostData({ title: '', message: '', tags: [], selectedFile: '' });
  };

  useEffect(() => {
    if (!post?.title) clear();
    if (post) setPostData(post);
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentId === 0) {
      dispatch(createPost({ ...postData, name: user?.result?.name }, navigate));
      clear();
    } else {
      dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }));
      clear();
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
    setPostData({ ...postData, tags: [...postData.tags, tag] });
  };

  const handleDeleteChip = (chipToDelete) => {
    setPostData({ ...postData, tags: postData.tags.filter((tag) => tag !== chipToDelete) });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6"> {/* Replace Paper with div and add Tailwind classes */}
      <form
        autoComplete="off"
        noValidate
        onSubmit={handleSubmit}
      >
        <h6 className="text-lg font-bold mb-4">{currentId ? `Editing "${post?.title}"` : 'Creating a Memory'}</h6> {/* Replace Typography with h6 and add Tailwind classes */}
        <input /* Replace TextField with input and add Tailwind classes */
          name="title"
          label="Title"
          className="w-full border rounded py-2 px-3 mb-4"
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        />
        <textarea /* Replace TextField with textarea and add Tailwind classes */
          name="message"
          label="Message"
          rows={4}
          className="w-full border rounded py-2 px-3 mb-4"
          value={postData.message}
          onChange={(e) => setPostData({ ...postData, message: e.target.value })}
        />
        <div className="mb-4"> {/* Replace Box with div and add Tailwind classes */}
          {/*  The Autocomplete component is complex and would require a custom implementation with Tailwind CSS.
              Consider using a library like react-select for a more customizable select component. */}
          <input
            type="text"
            placeholder="Tags"
            className="w-full border rounded py-2 px-3"
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                handleAddChip(e.target.value);
                e.target.value = '';
              }
            }}
          />
        </div>
        <div className="mb-4"> {/* Replace Box with div and add Tailwind classes */}
          <FileBase
            type="file"
            multiple={false}
            onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })}
          />
        </div>
        <button /* Replace Button with button and add Tailwind classes */
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-2"
          type="submit"
        >
          Submit
        </button>
        <button /* Replace Button with button and add Tailwind classes */
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full"
          onClick={clear}
        >
          Clear
        </button>
      </form>
    </div>
  );
};

export default Form;
