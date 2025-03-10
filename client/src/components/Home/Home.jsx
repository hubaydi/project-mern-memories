import React, { useState } from 'react';
import { Container, Grow, Grid, AppBar, TextField, Button, Paper, Chip, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { getPostsBySearch } from '../../actions/posts';
import Posts from '../Posts/Posts';
import Form from '../Form/Form';
import Pagination from '../Pagination';
import useStyles from './styles';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
  const styles = useStyles();
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
    <Grow in>
      <Container maxWidth="xl">
        <Grid 
          container 
          justifyContent="space-between" 
          alignItems="stretch" 
          spacing={3} 
          sx={styles.gridContainer}
        >
          <Grid item xs={12} sm={6} md={9}>
            <Posts setCurrentId={setCurrentId} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppBar 
              sx={styles.appBarSearch} 
              position="static" 
              color="inherit"
            >
              <TextField 
                onKeyPress={handleKeyPress} 
                name="search" 
                variant="outlined" 
                label="Search Memories" 
                fullWidth 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
              <Box sx={{ margin: '10px 0', display: 'flex', flexWrap: 'wrap' }}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleDeleteChip(tag)}
                    color="primary"
                    variant="outlined"
                    sx={{ margin: '0 5px 5px 0' }}
                  />
                ))}
                <TextField
                  variant="outlined"
                  label="Search Tags"
                  fullWidth
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddChip(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
              </Box>
              <Button 
                onClick={searchPost} 
                sx={styles.searchButton} 
                variant="contained" 
                color="primary"
              >
                Search
              </Button>
            </AppBar>
            <Form currentId={currentId} setCurrentId={setCurrentId} />
            {(!searchQuery && !tags.length) && (
              <Paper sx={styles.pagination} elevation={6}>
                <Pagination page={page} />
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default Home;
