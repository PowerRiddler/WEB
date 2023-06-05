const express = require('express')
const path = require('path');
/*const data = require('./data');*/
const port = 3000;

const indexRouter = require('./routes/home.routes');
const cartRouter = require('./routes/cart.routes');
const server = express();

server.set('views', path.join(__dirname, 'views'));
server.set('partials', path.join(__dirname, 'views/partials'));
server.set('view engine', 'ejs');


server.use(express.json());
server.use(express.static(path.join(__dirname, 'public')));
server.use('/data', express.static('data'));

server.use('/', indexRouter);
server.use('/getCategories', indexRouter);
server.use('/cart', cartRouter);

server.listen(port, ()=> {
  console.log(`Store has oppend on port: ${port}`);
})

module.exports = server