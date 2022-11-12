const database = require('./database');

const movies = [
  {
    id: 1,
    title: 'Citizen Kane',
    director: 'Orson Wells',
    year: '1941',
    colors: false,
    duration: 120,
  },
  {
    id: 2,
    title: 'The Godfather',
    director: 'Francis Ford Coppola',
    year: '1972',
    colors: true,
    duration: 180,
  },
  {
    id: 3,
    title: 'Pulp Fiction',
    director: 'Quentin Tarantino',
    year: '1994',
    color: true,
    duration: 180,
  },
];

const deleteMovies = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query('delete from movies where id = ?', [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send('Not found');
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Problems deleting entry');
    });
};

const putMovies = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, director, year, color, duration } = req.body;

  database
    .query(
      'update movies set title = ?, director = ?, year = ?, color = ?, duration = ? where id = ?',
      [title, director, year, color, duration, id]
    )

    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send('Not found');
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Could not update');
    });
};
const postMovies = (req, res) => {
  const { title, director, year, color, duration } = req.body;

  database
    .query(
      'INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)',
      [title, director, year, color, duration]
    )
    .then(([result]) => {
      res.status(201).json(result.insertId);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error savin the movie');
    });
};

const getMoviesFromJson = (req, res) => {
  res.json(movies);
};

const getMovieFromJsonById = (req, res) => {
  const id = parseInt(req.params.id);

  const movie = movies.find((movie) => movie.id === id);

  if (movie != null) {
    res.json(movie);
  } else {
    res.status(404).send('Not Found');
  }
};

const getMoviesFromDB = (req, res) => {
  let sql = 'select * from movies';
  const sqlValues = [];

  if (req.query.color != null) {
    sql += ' where color = ?';
    sqlValues.push(req.query.color);

    if (req.query.max_duration != null) {
      sql += 'and duration <= ?';
      sqlValues.push(req.query.max_duration);
    }
  } else if (req.query.max_duration != null) {
    sql += ' where duration <= ?';
    sqlValues.push(req.query.max_duration);
  }

  database
    .query(sql, sqlValues)
    .then(([movies]) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving data from database');
    });
};

const getMovieFromDbById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query('select * from movies where id = ?', [id])
    .then((movies) => {
      if (movies[0] != 0) {
        res.json(movies[0]);
      } else {
        res.status(404).send('Not Found');
      }
    })
    .catch((err) => {
      res.status(500).send('Error retrieving data from database');
    });
};

module.exports = {
  getMoviesFromJson,
  getMovieFromJsonById,
  getMoviesFromDB,
  getMovieFromDbById,
  postMovies,
  putMovies,
  deleteMovies,
};