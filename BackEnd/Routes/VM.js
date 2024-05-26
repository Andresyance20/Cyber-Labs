const express = require('express');
const router = express.Router();
const VM = require('../services/VM');


router.get('/:id', async function(req, res, next){
    try {
      res.json(await VM.getOne(req.params.id));
    } catch (err) {
      console.error(`Error while getting VM `, err.message);
      next(err);
    }
});

router.delete('/:id', async function(req, res, next){
  try {
    res.json(await VM.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting VM `, err.message);
    next(err);
  }
});

router.post('/', async function(req, res, next){
    try {
        res.json(await VM.create(req.body));
    } catch (err) {
        console.error(`Error while creating VM`, err.message);
        next(err);
    }
});

router.post('/:id',async function(req, res, next){
  try {
    res.json(await VM.start(req.body));
  } catch (err) {
    console.error(`Error while creating VM`, err.message);
    next(err);
  }
});



module.exports = router