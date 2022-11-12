const database = require('./database');

const deleteUsers = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query('delete from users where id = ?', [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send('Page Not Found');
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Problem deleting entry');
    });
};

const putUsers = (req, res) => {
  const id = parseInt(req.params.id);
  const { firstname, lastname, email, city, language } = req.body;

  database
    .query(
      'Update users set firstname = ?, lastname = ?, email = ?, city = ?, language = ? where id = ?',
      [firstname, lastname, email, city, language, id]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send('Not found');
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      res.status(500).send('Could not update');
    });
};

const postUsers = (req, res) => {
  const { firstname, lastname, email, city, language } = req.body;

  database
    .query(
      'INSERT INTO users (firstname, lastname, email, city, language) VALUES ( ?, ?, ?, ?, ?)',
      [firstname, lastname, email, city, language]
    )
    .then(([result]) => {
      res.status(201).json(result.insertId);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error creating user');
    });
};

const getUsers = (req, res) => {
  let sql = 'select * from users ';
  const sqlValues = [];

  if (req.query.language != null) {
    sql += 'where language = ?';
    sqlValues.push(req.query.language);

    if (req.query.city != null) {
      sql += 'and city = ?';
      sqlValues.push(req.query.city);
    }
  } else if (req.query.city != null) {
    sql += 'where city = ?';
    sqlValues.push(req.query.city);
  } else {
    res.status(200);
  }

  database
    .query(sql, sqlValues)
    .then(([result]) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving users from database');
    });
};

const getUserById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query('select * from users where id = ?', [id])
    .then((result) => {
      console.log(result);
      if (result[0] != 0) {
        res.json(result[0]);
      } else {
        res.status(404).send('Not Found');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving data from database');
    });
};

module.exports = {
  getUsers,
  getUserById,
  postUsers,
  putUsers,
  deleteUsers,
};