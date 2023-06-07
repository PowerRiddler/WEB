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

function readProducts(id, categoryAttributes){
    let categoryInfo = {
        name: "",
        image: "",
        id: "",
        prodList: "",
    };
    try{
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
    try{
        var categoryAttributes = readJSONfile(path.join(__dirname, '../data/data.json'));
        res.render('home', {categories: categoryAttributes, currentCategory: categoryBanner });
    }catch(error) {
        return res.status(500).send('Internal server error');
    }
});


router.get('/home/getProducts/:id([0-9]{1,2})', (req,res) => {
    let id = parseInt(req.params.id);
    try{
        var categoryAttributes = readJSONfile(path.join(__dirname, '../data/data.json'));
        var selectedCategory = readProducts(id, categoryAttributes);
        res.render('home', {categories: categoryAttributes, currentCategory: selectedCategory });
    }catch(error) {
        return res.status(500).send('Internal server error');
    }
})

router.get('/home/getProducts/addToCart/:id(\\d+&\\d+-\\d+)', (req, res) => {
    var categoryId = req.params.id.split('&')[0];
    var prodId = req.params.id.split('&')[1];
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
            console.log('Item with ID:',prodId + " added to cart");
            res.redirect(`/home/getProducts/${(categoryId == 0) ?  0 : parseProdId}`);
        });
    });
});

module.exports = router;