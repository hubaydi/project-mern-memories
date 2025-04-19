import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import Posts from '../features/posts/Posts';
import Form from './Form';
import Pagination from './Pagination';
import { getPostsBySearch } from '../features/posts/PostsSlice';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState([]);

  const query = useQuery();
  const page = query.get('page') || 1;
  const searchQuery = query.get('searchQuery');

  const [currentId, setCurrentId] = useState(0);
  const dispatch = useDispatch();
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
    <div className="grow mt-10">
        <div className="flex flex-col items-center md:flex-row justify-between md:items-start space-x-2">
          <div className="w-full md:w-3/4 pt-10 md:pt-0">
            <Posts setCurrentId={setCurrentId}/>
          </div>
          <div className="w-full min-w-[250px] sm:w-2/3 md:w-1/4 -order-1 mr-4">
            <div className="bg-white p-4 rounded shadow-md">
              <input
                type="text"
                placeholder="Search Memories"
                className="w-full border rounded py-2 px-3 mb-2"
                onKeyDown={handleKeyPress}
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="my-2 flex flex-wrap">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="bg-blue-500 text-white rounded-full px-2 py-1 m-1 text-sm"
                  >
                    {tag}
                    <button onClick={() => handleDeleteChip(tag)} className="ml-1 cursor-pointer">
                      &times;
                    </button>
                  </div>
                ))}
                <input
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
              <button
                onClick={searchPost}
                className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full cursor-pointer"
              >
                Search
              </button>
            </div>
            <Form currentId={currentId} setCurrentId={setCurrentId} />
            {(!searchQuery && !tags.length) && (
              <div className="bg-white p-4 rounded shadow my-4">
                <Pagination page={page} />
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default Home;
