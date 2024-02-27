const express = require('express');
const port = 9999;
const path = require('path');
var cookieParser = require('cookie-parser');
const app = express();
const db = require('./config/mongoose');

app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,"assets")));
app.use('/uploads',express.static(path.join(__dirname,'uploads')));

app.use('/admin', require('./routes/admin'));

app.listen(port, (err)=>{
    if(err)
        console.log('Something Wrong');

        console.log("Server is connected on port : ", port);
});
