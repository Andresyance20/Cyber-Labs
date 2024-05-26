const express = require('express');
const router = express.Router();
const StudentLab = require('../services/student_lab');


router.get('/', async function(req, res, next) {
    try {
        res.json(await StudentLab.getMultiple(req.query.page));
    } catch (err) {
        console.error(`Error while getting student labs `, err.message);
        next(err);
    }
});

router.get('/:id', async function(req, res, next){
    try {
      res.json(await StudentLab.getOne(req.params.id));
    } catch (err) {
      console.error(`Error while getting student lab `, err.message);
      next(err);
    }
});

module.exports = router;
