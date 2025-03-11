import React, { useState } from 'react';
// import { Container, Grow, Grid, AppBar, TextField, Button, Paper, Chip, Box } from '@mui/material'; // Remove MUI imports
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { getPostsBySearch } from '../actions/posts';
import Posts from './Posts/Posts';
import Form from './Form';
import Pagination from './Pagination';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
  const query = useQuery();
  const page = query.get('page') || 1;
  const searchQuery = query.get('searchQuery');

  const [currentId, setCurrentId] = useState(0);
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  const searchPost = () => {
    if (search.trim() || tags.length) {
      dispatch(getPostsBySearch({ search, tags: tags.join(',') }));
      navigate(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`);
    } else {
      navigate('/');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchPost();
    }
  };

  const handleAddChip = (tag) => {
    setTags([...tags, tag]);
  };

  const handleDeleteChip = (chipToDelete) => {
    setTags(tags.filter((tag) => tag !== chipToDelete));
  };

  return (
    <div className="grow mt-10"> {/* Replace Grow with div and add Tailwind class */}
      <div className="max-w-7xl mx-auto"> {/* Replace Container with div and add Tailwind class */}
        <div className="flex flex-col md:flex-row justify-between items-start space-x-2"> {/* Replace Grid with div and add Tailwind classes */}
          <div className="w-full sm:w-full md:w-3/4 pt-10 md:pt-0"> {/* Replace Grid with div and add Tailwind classes */}
            <Posts setCurrentId={setCurrentId} />
          </div>
          <div className="w-full sm:w-2/3 md:w-1/4 -order-1 mr-4"> {/* Replace Grid with div and add Tailwind classes */}
            <div className="bg-white p-4 rounded shadow-md"> {/* Replace AppBar with div and add Tailwind classes */}
              <input /* Replace TextField with input and add Tailwind classes */
                type="text"
                placeholder="Search Memories"
                className="w-full border rounded py-2 px-3 mb-2"
                onKeyDown={handleKeyPress}
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="my-2 flex flex-wrap"> {/* Replace Box with div and add Tailwind classes */}
                {tags.map((tag) => (
                  <div /* Replace Chip with div and add Tailwind classes */
                    key={tag}
                    className="bg-blue-500 text-white rounded-full px-2 py-1 m-1 text-sm"
                  >
                    {tag}
                    <button onClick={() => handleDeleteChip(tag)} className="ml-1">
                      &times;
                    </button>
                  </div>
                ))}
                <input /* Replace TextField with input and add Tailwind classes */
                  type="text"
                  placeholder="Search Tags"
                  className="w-full border rounded py-2 px-3"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddChip(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
              </div>
              <button /* Replace Button with button and add Tailwind classes */
                onClick={searchPost}
                className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full"
              >
                Search
              </button>
            </div>
            <Form currentId={currentId} setCurrentId={setCurrentId} />
            {(!searchQuery && !tags.length) && (
              <div className="bg-white p-4 rounded shadow mt-4"> {/* Replace Paper with div and add Tailwind classes */}
                <Pagination page={page} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
