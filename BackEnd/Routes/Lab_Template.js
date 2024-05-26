const express = require('express');
const router = express.Router();
const Lab_Template = require('../services/Lab_Template');

// Fetches multiple lab template records
router.get('/', async (req, res, next) => {
  try {
    res.json(await Lab_Template.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting Lab Template`, err.message);
    next(err);
  }
});

// Fetches a single lab template record by ID
router.get('/:id', async (req, res, next) => {
  try {
    res.json(await Lab_Template.getOne(req.params.id));
  } catch (err) {
    console.error(`Error while getting Lab Template`, err.message);
    next(err);
  }
});

// Creates a new lab template record
router.post('/', async (req, res, next) => {
  try {
    res.json(await Lab_Template.create(req.body));
  } catch (err) {
    console.error('Error adding Lab Template', err.message);
    next(err);
  }
});


module.exports = router;
