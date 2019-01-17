// import your node modules
const express = require('express');
const cors = require('cors');
const port = 5002;

const db = require('./data/db.js');

// add your server code starting here
const app = express();
app.use(express.json());
app.use(cors());

const INVALID_ID = 'INVALID_ID';

/****************************************************************************************************************************************** */
// POST
app.post('/api/posts', (req, res) => {
  const body = req.body;

  if (!body.title || !body.contents) {
    res.status(400).json({ errorMessage: 'Please provide title and contents for the post.' });
  }

  db.insert(body)
    .then((returnedId) => {
      res.status(201).json(body);
    })
    .catch((err) => {
      res.status(500).json({ error: 'There was an error while saving the post to the database' });
    });
});

// GET
app.get('/api/posts', (req, res) => {
  db.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({ error: 'The posts information could not be retrieved.' });
    });
});

// GET BY ID
app.get('/api/posts/:id', (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then((post) => {
      if (post.length === 0) {
        throw INVALID_ID;
      }
      res.status(200).json(post);
    })
    .catch((err) => {
      if (err === INVALID_ID) {
        res.status(404).json({ message: 'The post with the specified ID does not exist.' });
      }

      res.status(500).json({ error: 'The post information could not be retrieved.' });
    });
});

// DELETE
app.delete('/api/posts/:id', (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then((post) => {
      if (post.length === 0) {
        throw INVALID_ID;
      }

      db.remove(id)
        .then((deletedRecordQuantity) => {
          res.status(200).json(deletedRecordQuantity);
        })
        .catch((err) => {
          res.status(500).json({ error: 'The post could not be removed' });
        });
    })
    .catch((err) => {
      if (err === INVALID_ID) {
        res.status(404).json({ message: 'The post with the specified ID does not exist.' });
      }
    });
});

// PUT
app.put('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  const body = req.body;

  if (!body.title || !body.contents) {
    res.status(400).json({ errorMessage: 'Please provide title and contents for the post.' });
  }

  db.findById(id)
    .then((post) => {
      if (post.length === 0) {
        throw INVALID_ID;
      }

      db.update(id, body)
        .then((updatedId) => {
          res.status(200).json(post);
        })
        .catch((err) => {
          res.status(500).json({ error: 'The post information could not be modified.' });
        });
    })
    .catch((err) => {
      if (err === INVALID_ID) {
        res.status(404).json({ message: 'The post with the specified ID does not exist.' });
      }
    });
});

/****************************************************************************************************************************************** */

app.listen(port, () => {
  console.log(`App running on port:${port}`);
});
