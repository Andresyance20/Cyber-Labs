const express = require('express');
const router = express.Router();
const Course = require('../services/Courses');

/* GET programming languages. */
router.get('/', async function(req, res, next) {
    try {
        res.json(await Course.getMultiple(req.query.page));
    } catch (err) {
        console.error(`Error while getting course `, err.message);
        next(err);
    }

})

router.get('/:id', async function(req, res, next){
    try {
      res.json(await Course.getOne(req.params.id));
    } catch (err) {
      console.error(`Error while getting Courses `, err.message);
      next(err);
    }
  })
 
  // Endpoint to create a new Course 
  router.post('/', async (req, res, next) => {
    try {
      res.json(await Course.create(req.body));
    } catch (err) {
      console.error('Error adding Course', err.message);
      next(err);
    }
  });

router.get('/student/:id', async function(req, res, next){
  try {
    res.json(await Course.getCoursesStudent(req.params.id));
  } catch (err) {
    console.error(`Error while getting Courses `, err.message);
    next(err);
  }
})

router.get('/:id/labs', async function(req, res, next){
  try {
    res.json(await Course.getCourseLabs(req.params.id));
  } catch (err) {
    console.error(`Error while getting Course Labs `, err.message);
    next(err);
  }
})

module.exports = router