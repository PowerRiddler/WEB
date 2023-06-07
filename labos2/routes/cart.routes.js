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
        console.log("ITEMS: ",items);
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
    var articlesAddedToCart = readCartData(path.join(__dirname, '../data/cartData.json'));
    res.render('cart', {currentCategory: shoppingCart, cartItems: articlesAddedToCart });
})

module.exports = router;