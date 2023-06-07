const express = require('express')
const path = require('path');
const http = require('http');
const fs = require('fs');
/*const data = require('./data');*/
const port = 3000;

const indexRouter = require('./routes/home.routes');
const cartRouter = require('./routes/cart.routes');
const server = express();
const mainServer = http.createServer(server);

function onServerStart(){
  const initialState = {
    products: [],
    totalItemCount: 0,
  };
  fs.writeFile(path.join(__dirname, '/data/cartData.json'), JSON.stringify(initialState), 'utf8', err => {
    if (err) {console.log(err); return;}
  });
}

server.set('views', path.join(__dirname, 'views'));
server.set('partials', path.join(__dirname, 'views/partials'));
server.set('view engine', 'ejs');


server.use(express.json());
server.use(express.static(path.join(__dirname, 'public')));
server.use('/data', express.static('data'));

server.use('/', indexRouter);
server.use('/getCategories', indexRouter);
server.use('/', cartRouter);
server.use('/getAll', cartRouter);

mainServer.listen(port, ()=> {
  console.log(`Store has oppend on port: ${port} and doesn't care.`);
  onServerStart();
})


module.exports = server