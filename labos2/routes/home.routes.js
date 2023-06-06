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
        prodList: "",
    };
    try{
        categoryAttributes.forEach(attribute => {
            if(attribute.id == id){
                categoryInfo.name = attribute.name;
                categoryInfo.image = attribute.image;
                categoryInfo.prodList = attribute.products.map((prod) => {
                    return{
                        name: prod.name,
                        image: prod.image,
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

module.exports = router;