var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();

function readJSONfile(pathToFile) {
    try {
        var data = fs.readFileSync(pathToFile, 'utf8');
        var extractCategories = JSON.parse(data);
        var categories = extractCategories.categories;
        var categoryAttributes = categories.map((category) => {
            return {
                name: category.name,
                image: category.image,
                id: category.id,
                products: category.products,
            };
        });
        return categoryAttributes;
    } catch (error) {
        throw new Error('Internal server error');
    }
}

function readProducts(id, categoryAttributes, pathToFile){
    let categoryInfo = {
        name: "",
        image: "",
        id: "",
        prodList: "",
    };
    try{
        var cartData = fs.readFileSync(path.join(__dirname, `../data/${pathToFile}.json`), 'utf8');
        var cartDataJson = JSON.parse(cartData);
        categoryAttributes.forEach(attribute => {
            if(attribute.id == id){
                categoryInfo.name = attribute.name;
                categoryInfo.image = attribute.image;
                categoryInfo.id = attribute.id;
                categoryInfo.prodList = attribute.products.map((prod) => {
                    return{
                        name: prod.name,
                        image: prod.image,
                        id: prod.id,
                    };
                });
            }
        });
        categoryInfo.prodList.forEach((product) => {
            if (cartDataJson.products.find(id => id.id == product.id)){
                product['quantity'] = cartDataJson.products.find(id => id.id == product.id).quantity;
            }
        });
        return categoryInfo;
    }catch(error){
        throw new Error('Internal server error');
    }
}

/*GET root and redirect to home/getCategories*/
router.get('/',function(req, res, next){
    res.redirect('/home/getCategories');
});

router.get('/home/getCategories', (req, res) => {
    let categoryBanner = {
        name: "Odaberite kategoriju",
        image: "webshop2.jpg",
    };
    const initialState = {
        products: [],
        totalItemCount: 0,
    };

    console.log("A user has visited the page! Session ID: ", req.sessionID);
    if(fs.existsSync(path.join(__dirname, `../data/${req.sessionID}.json`))) {
        console.log("File exists, won't rewrite it");
    }else{
        console.log("File doesn't exists, creating it");
        fs.writeFile(path.join(__dirname, `../data/${req.sessionID}.json`), JSON.stringify(initialState), 'utf8', (err) => {
            if(err) {console.log(err); return;}
        });
    }

    try{
        var categoryAttributes = readJSONfile(path.join(__dirname, '../data/data.json'));
        res.render('home', {categories: categoryAttributes, currentCategory: categoryBanner, itemQuantity: null });
    }catch(error) {
        return res.status(500).send('Internal server error');
    }
});


router.get('/home/getProducts/:id([0-9]{1,2})', (req,res) => {
    let id = parseInt(req.params.id);
    try{
        var categoryAttributes = readJSONfile(path.join(__dirname, '../data/data.json'));
        var cartData = fs.readFileSync(path.join(__dirname, `../data/${req.sessionID}.json`), 'utf8');
        var noOfItemsInCart = JSON.parse(cartData);
        var selectedCategory = readProducts(id, categoryAttributes, req.sessionID);
        res.render('home', {categories: categoryAttributes, currentCategory: selectedCategory, itemQuantity: noOfItemsInCart.totalItemCount });
    }catch(error) {
        return res.status(500).send('Internal server error');
    }
})

router.get('/home/getProducts/addToCart/:id(\\d+&\\d+-\\d+)', (req, res) => {
    var categoryId = req.params.id.split('&')[0];
    var prodId = req.params.id.split('&')[1];
    var parseProdId = prodId.split('-')[0];

    fs.readFile(path.join(__dirname, `../data/${req.sessionID}.json`), 'utf8', (err, data) => {
        if (err) {res.status(500).send('Internal server error'); return;}

        let cartData = JSON.parse(data);
        const itemExistsById = cartData.products.find(item => item.id == prodId);
        if(itemExistsById){
            itemExistsById.quantity ++;
        }else{
            cartData.products.push({id: prodId, quantity: 1});
        }
        cartData.totalItemCount ++;
        fs.writeFile(path.join(__dirname, `../data/${req.sessionID}.json`), JSON.stringify(cartData), 'utf8', err => {
            if(err) {res.status(500).send('Internal server error'); return;}
            console.log('Item with ID:',prodId + " added to cart");
            res.redirect(`/home/getProducts/${(categoryId == 0) ?  0 : parseProdId}`);
        });
    });
});

module.exports = router;