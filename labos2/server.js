const express = require('express')
const path = require('path');
const http = require('http');
const fs = require('fs');
const session = require('express-session');
const port = 3000;

const indexRouter = require('./routes/home.routes');
const cartRouter = require('./routes/cart.routes');
const server = express();
const mainServer = http.createServer(server);


function onServerStart(){
  const directoryPath = path.join(__dirname, '/data');
  const fileToKeep = 'data.json';
  fs.readdir(directoryPath, (err, files) => {
    if (err) {console.error('Error reading directory:', err); return;}
    files.forEach((file) => {
      if (file !== fileToKeep) {
        const filePath = path.join(directoryPath, file);

        fs.unlink(filePath, (err) => {
          if(err){console.log(err); return;}
        });
      }
    });
  });
}


server.use(session({
  secret: 'DrugaLaboratorijskaVjezbaIzWEB-a',
  resave: false,
  cookie: {maxAge: 900000 }, //session last for 15 min, according to research, this is the average time spent on online grocery sotres
  saveUninitialized: true
}));

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
  console.log(`Store has oppend on port: ${port}`);
  onServerStart();
})


module.exports = server