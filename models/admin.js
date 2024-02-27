const mongoose = require('mongoose');
const adminPath = '/uploads/adminImage';
const path = require('path')
const multer = require('multer');

const adminSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    gender : {
        type : String,
        required : true
    },
    hobby : {
        type : Array,
        required : true
    },
    city : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    adminImage : {
        type : String,
        required : true
    },
    isActive : {
        type : Boolean,
        required : true
    },
    created_date : {
        type : String,
        required : true
    },
    updated_date : {
        type : String,
        required : true
    }
})

const adminStorage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,path.join(__dirname,"..",adminPath))
    },
    filename : function(req,file,cb){
        cb(null,file.fieldname+"-"+Date.now())
    }
})
adminSchema.statics.adminUploadImage = multer({storage : adminStorage}).single("adminImage");
adminSchema.statics.adminImgPath = adminPath;

const adminData = mongoose.model('Admin',adminSchema);
module.exports = adminData;