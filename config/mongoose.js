const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/Adminpanel');

const db = mongoose.connection;
db.once('open', (err)=>{
    if(err) console.log(err);

    console.log("Db Connect Successfully");
})

module.exports = db;