var express = require('express');
var router = express.Router();

/*GET store front page*/
router.get('/',function(req, res, next){
    res.redirect('/home/getCategories');
});

router.get('/home/getCategories', (req, res) => {
    res.render('home');
});

module.exports = router;