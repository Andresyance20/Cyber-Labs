const express = require('express');
const router = express.Router();
const Student = require('../services/Student');

/* GET programming languages. */
router.get('/', async function(req, res, next) {
    try {
        res.json(await Student.getMultiple(req.query.page));
    } catch (err) {
        console.error('Error while getting Student', err.message);
        next(err);
    }

})

router.get('/test', async function(req, res, next) {
    try {
        
    } catch (err) {
        console.error('Error while ', err.message);
        next(err);
    }
})

router.get('/:id', async function(req, res, next){
    try {
      res.json(await Student.getOne(req.params.id));
    } catch (err) {
      console.error('Error while getting Student', err.message);
      next(err);
    }
  })
  
  router.post('/', async function(req, res, next){
      try{
          res.json(await Student.create(req.body)); 
      } catch(err) {
          console.error('Error adding Student', err.message);
          next(err);
      }
  })
  
  
  module.exports = router;