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
                id: category.id,
            };
        });
        return categoryAttributes;
    } catch (error) {
        throw new Error('Internal server error');
    }
}

/*GET root and redirect to home/getCategories*/
router.get('/',function(req, res, next){
    res.redirect('/home/getCategories');
});

router.get('/home/getCategories', (req, res) => {
    try{
        var categoryAttributes = readJSONfile(path.join(__dirname, '../data/data.json'));
        res.render('home', {categories: categoryAttributes });
    }catch(error) {
        return res.status(500).send('Internal server error');
    }
});


router.get('/home/getProducts/:id([0-9]{1,2})', (req,res) => {
    try{
        var categoryAttributes = readJSONfile(path.join(__dirname, '../data/data.json'));
        res.render('home', {categories: categoryAttributes });
    }catch(error) {
        return res.status(500).send('Internal server error');
    }
})

module.exports = router;