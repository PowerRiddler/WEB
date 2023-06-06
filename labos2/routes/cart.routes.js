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

router.get('/add/:id(\\d+-\\d+)', (req, res) => {
    var prodId = req.params.id;
    var parseProdId = prodId.split('-')[0];
    /*console.log(prodId);*/
    fs.readFile(path.join(__dirname, '../data/cartData.json'), 'utf8', (err, data) => {
        if (err) {res.status(500).send('Internal server error'); return;}

        let cartData = JSON.parse(data);
        const itemExistsById = cartData.products.find(item => item.id == prodId);
        /*const itemExistsByName = cartData.products.find(item => item.name == prodId);*/
        if(itemExistsById){
            itemExistsById.quantity +=1;
        }else{
            cartData.products.push({id: prodId, /*name: ,*/quantity: 1});
        }
        fs.writeFile(path.join(__dirname, '../data/cartData.json'), JSON.stringify(cartData), 'utf8', err => {
            if(err) {res.status(500).send('Internal server error'); return;}
            console.log('Item with ID:',prodId + "added to cart");
            res.redirect(`/home/getProducts/${parseProdId}`);
        });
    });
});

module.exports = router;