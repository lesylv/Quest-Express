require('dotenv').config();

const express = require('express');

const app = express();

app.use(express.json());

const port = 5052;

const welcome = (req, res) => {
  res.send('Welcome to my favourite movie list');
};

app.get('/', welcome);

const movieHandlers = require('./movieHandlers');

const userHandler = require('./userHandler');
const { validateMovie, validateUsers } = require('./validators');

app.put('/api/movies/:id', validateMovie, movieHandlers.putMovies);

app.post('/api/movies', validateMovie, movieHandlers.postMovies);
app.get('/api/movies-json', movieHandlers.getMoviesFromJson);
app.get('/api/movies-json/:id', movieHandlers.getMovieFromJsonById);
app.delete('/api/movies/:id', movieHandlers.deleteMovies);
app.get('/api/movies', movieHandlers.getMoviesFromDB);
app.get('/api/movies/:id', movieHandlers.getMovieFromDbById);

app.delete('/api/users/:id', userHandler.deleteUsers);
app.put('/api/users/:id', validateUsers, userHandler.putUsers);
app.post('/api/users', validateUsers, userHandler.postUsers);
app.get('/api/users', userHandler.getUsers);
app.get('/api/users/:id', userHandler.getUserById);

app.listen(port, (err) => {
  if (err) {
    console.error('Something bad happened');
  } else {
    console.log(`Server is listening on ${port}`);
  }
});