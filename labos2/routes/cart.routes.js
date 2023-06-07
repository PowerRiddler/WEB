var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();

function readCartData(pathToFile) {
    try {
        var cartData = fs.readFileSync(pathToFile, 'utf8');
        var data = fs.readFileSync(path.join(pathToFile, '../data.json'), 'utf8');
        var shoppingCartItems = JSON.parse(cartData);
        var dataJson = JSON.parse(data);
        var items = shoppingCartItems.products.map((prod) => { 
            return{
                id: prod.id,
                quantity: prod.quantity,
            };     
        });
        items.forEach((item) => {
            item['name'] = dataJson.categories.find(catId => catId.id == item.id.split('-')[0]).products.find(productId => productId.id == item.id).name;
        });
        /*console.log("ITEMS: ",items);*/
        return items;
    } catch (error) {
        throw new Error('Internal server error');
    }
}

/*GET cart main page*/
router.get('/cart/getAll', (req, res) => {
    let shoppingCart = {
        name: "Checkout",
    };
    var productsAddedToCart = readCartData(path.join(__dirname, '../data/cartData.json'));
    res.render('cart', {currentCategory: shoppingCart, cartItems: productsAddedToCart });
});

router.get('/cart/remove/:id(\\d+-\\d+)', (req, res) => {
    let itemId = req.params.id;
    let data = fs.readFileSync(path.join(__dirname, '../data/cartData.json'), 'utf8');
    let cartDataJSON = JSON.parse(data);
    const removeOne = cartDataJSON.products.find(item => item.id == itemId);
    removeOne.quantity -=1;
    fs.writeFile(path.join(__dirname, '../data/cartData.json'), JSON.stringify(cartDataJSON), 'utf8', err =>{
        if(err) {res.status(500).send('Internal server error'); return;}
        console.log("Removed 1 from item with ID:",itemId);
        res.redirect('/cart/getAll');
    });
});

router.get('/cart/add/:id(\\d+-\\d+)', (req, res) => {
    let itemId = req.params.id;
    let data = fs.readFileSync(path.join(__dirname, '../data/cartData.json'), 'utf8');
    let cartDataJSON = JSON.parse(data);
    const addOne = cartDataJSON.products.find(item => item.id == itemId);
    addOne.quantity +=1;
    fs.writeFile(path.join(__dirname, '../data/cartData.json'), JSON.stringify(cartDataJSON), 'utf8', err =>{
        if(err) {res.status(500).send('Internal server error'); return;}
        console.log("Added 1 to item with ID:",itemId);
        res.redirect('/cart/getAll');
    });
});

module.exports = router;