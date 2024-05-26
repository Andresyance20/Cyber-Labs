const express = require('express');
const router = express.Router();
const Instructor = require('../services/Instructor');

/* GET programming languages. */
router.get('/', async function(req, res, next) {
  try {
    res.json(await Instructor.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting Instructor `, err.message);
    next(err);
  }
});

router.get('/:id', async function(req, res, next){
  try {
    res.json(await Instructor.getOne(req.params.id));
  } catch (err) {
    console.error(`Error while getting Instructor `, err.message);
    next(err);
  }
})

router.post('/', async function(req, res, next){
    try{
        res.json(await Instructor.create(req.body)); 
    } catch(err) {
        console.error('Error adding Instructor', err.message);
        next(err);
    }
})


module.exports = router;