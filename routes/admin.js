const express = require('express');
const routs = express.Router();
const admin = require('../models/admin');
const adminController = require('../controller/adminController');

routs.get('/', async(req,res)=>{
    return res.render('login');
});
routs.get('/dashboard', adminController.dashboard);
routs.get('/add_admin',adminController.add_admin);
routs.get('/viewAdminData',adminController.viewAdminData);
routs.post('/insertAdminData',admin.adminUploadImage,adminController.insertAdminData);
// routs.get('/view_admin',adminController.view_admin);

routs.get("/isActive/:id", adminController.isActive);

routs.get("/updateAdminData/:id",adminController.updateAdminData)
routs.post("/EditAdminData",admin.adminUploadImage,adminController.EditAdminData);

routs.get('/deleteRecords/:id',adminController.deleteRecords);
routs.post('/checkLogin',adminController.checkLogin);
routs.get('/logout', async(req,res)=>{
    res.clearCookie("admin");
    res.render('login');
});
routs.get('/changePassword',adminController.changePassword);
routs.post('/modifyPass', adminController.modifyPass);
routs.get('/editProfile',adminController.editProfile);
routs.get('/update',adminController.update);
routs.post('/editAdminRecord',admin.adminUploadImage,adminController.editAdminRecord);

module.exports = routs;