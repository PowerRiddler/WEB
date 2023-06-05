var express = require('express');
var router = express.Router();

/*GET cart main page*/
router.get('/', (req, res) =>{
    res.render('cart');
});

module.exports = router;