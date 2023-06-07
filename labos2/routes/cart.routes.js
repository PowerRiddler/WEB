var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();

/*GET cart main page*/
router.get('/', (req, res) =>{
    let shoppingCart = {
        name: "Checkout",
    };
    res.render('cart', {currentCategory: shoppingCart} );
});

module.exports = router;