var express = require('express');
var router = express.Router();

/*GET cart main page*/
router.get('/', (req, res) =>{
    let shoppingCart = {
        name: "Checkout",
    };
    res.render('cart', {currentCategory: shoppingCart} );
});

module.exports = router;