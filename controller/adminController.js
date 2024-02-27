const admin = require('../models/admin');
const path = require('path');
const fs = require("fs");

module.exports.dashboard = async(req,res)=>{
    if(req.cookies.admin == undefined){
        return res.redirect('/admin');
    }
    var adminControl = req.cookies.admin;
    return res.render('dashboard',{
        admin : adminControl
    })
}

module.exports.add_admin = async(req,res)=>{
    if(req.cookies.admin == undefined){
        return res.redirect('/admin');
    }
    var adminControl = req.cookies.admin;
    return res.render('add_admin',{
        admin : adminControl
    })
}

module.exports.viewAdminData = async(req,res)=>{
    let data = await admin.find({})
    if(req.cookies.admin == undefined){
        return res.redirect('/admin/');
    }
    else{
        var adminControl = req.cookies.admin;
        return res.render('view_admin',{
            adminData : data,
            admin : adminControl
        });
    }
}

module.exports.insertAdminData = async(req,res)=>{
    // console.log(req.file);
    // console.log(req.body);
    try{
        let imagePath = '';
        req.body.name = req.body.fname+" "+req.body.lname;
        if(req.file){
            imagePath = admin.adminImgPath+"/"+req.file.filename;
        }
        req.body.adminImage = imagePath;
        req.body.isActive = true;
        req.body.created_date = new Date().toLocaleString();
        req.body.updated_date = new Date().toLocaleString();
        let adminData = await admin.create(req.body);
        if(adminData){
            console.log("Record Insert Successfully");
            return res.redirect('/admin/view_admin');
        }
        else{
            console.log("Record not found");
            return res.redirect('/admin');
        }
    }
    catch(err){
        console.log("Something Wrong",err);
        return res.redirect('/admin/view_admin');
    }
}

module.exports.isActive = async (req, res) => {
    try {
        if (req.params.id) {
            let data = await admin.findById(req.params.id);
            if (data.isActive) {
                let active = await admin.findByIdAndUpdate(req.params.id, {
                    isActive: false,
                });
                if (active) {
                    console.log("Data Deactivate Successfully");
                    return res.redirect("back");
                } else {
                    console.log("Record Not Deactivate");
                    return res.redirect("back");
                }
            } else {
                let Deactive = await admin.findByIdAndUpdate(req.params.id, {
                    isActive: true,
                });
                if (Deactive) {
                    console.log("Data activate Successfully");
                    return res.redirect("back");
                } else {
                    console.log("Record Not activate");
                    return res.redirect("back");
                }
            }
        } else {
            console.log("Params Id not Found");
            returnres.redirect("back");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
}

module.exports.checkLogin = async(req,res)=>{
    try{
        var adminData = await admin.findOne({email:req.body.email});
        if(adminData){
            if(adminData.password == req.body.password){
                res.cookie('admin',adminData)
                return res.redirect('/admin/dashboard');
            }
            else{
                console.log("Invalid password");
                res.redirect('back');
            }
        }
        else{
            console.log("Invalid Email");
            res.redirect('back');
        }
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}

// Change Password Start
module.exports.changePassword = async(req,res)=>{
    if(req.cookies.admin == undefined){
        return res.redirect('/admin');
    }
    var adminControl = req.cookies.admin;
    return res.render('changePass',{
        admin : adminControl
    })
}

module.exports.modifyPass = async(req,res)=>{
    var adminControl = req.cookies.admin;
    console.log(req.body);
    try{
        if(adminControl.password == req.body.cpass){
            if(req.body.cpass != req.body.npass){
                if(req.body.npass == req.body.copass){
                    let allAdmin = await admin.findById(adminControl._id);
                    if(allAdmin){
                        let editPass = await admin.findByIdAndUpdate(allAdmin._id,{'password' : req.body.npass})
                        if(editPass){
                            return res.redirect('/admin/logout');
                        }
                        else{
                            console.log("Password Not Found");
                            return res.redirect('back');
                        }
                    }
                    else{
                        console.log("Record not Found");
                        return res.redirect('back');
                    }
                }
                else{
                    console.log("Current and new password are not same");
                    return res.redirect('back');
                }
            }
            else{
                console.log("Current and new password are not same");
                return res.redirect('back');
            }
        }
        else{
            console.log("Old and Current Password are not Same");
            return res.redirect('back');
        }
    }
    catch(err){
        console.log(err);
        return res.redirect('back')
    }
}
// Change Password End


// Profile Update start

module.exports.editProfile = async(req,res)=>{
    let data = await admin.find({isActive : true})
    if(req.cookies.admin == undefined){
        return res.redirect('/admin');
    }
    var adminControl = req.cookies.admin;
    return res.render('profile',{
        adminData : data,
        admin : adminControl
    })
}

module.exports.deleteRecords = async(req,res)=>{
    try {
        let oldData = await admin.findById(req.params.id);
        if (oldData) {
            var oldImage = oldData.adminImage;
            if (oldImage) {
                let FullPath = path.join(__dirname, "..", oldData.adminImage);
                await fs.unlinkSync(FullPath);
            }
        }
        else {
            console.log("Image Path is Worng");
            return res.redirect("back");
        }
        await admin.findByIdAndDelete(req.params.id);
        return res.redirect("back");
    }
    catch (err) {
        console.log(err);
        return res.redirect("back");
    }
}

module.exports.updateAdminData = async (req, res) => {
    let record = await admin.findById(req.params.id);
    var adminControl = req.cookies.admin;
    return res.render("update_admin", {
        admin: record,
        admin: adminControl
    });
}

module.exports.EditAdminData = async (req, res) => {
    let oldData = await admin.findById(req.body.EditId);
    req.body.name = req.body.fname + " " + req.body.lname;
    req.body.isActive = true;
    req.body.update_date = new Date().toLocaleString();
    if (req.file) {
        if (oldData.adminImage) {
            let FullPath = path.join(__dirname, "..", oldData.adminImage);
            await fs.unlinkSync(FullPath);
        }
        var imagePath = '';
        imagePath = admin.adminImgPath + "/" + req.file.filename;
        req.body.adminImage = imagePath;
    }
    else {
        req.body.adminImage = imagePath;
    }
    await admin.findByIdAndUpdate(req.body.EditId, req.body);
    return res.redirect("/admin/viewAdminData")
}

module.exports.update = async(req,res)=>{
    let data = await admin.find({isActive : true})
    if(req.cookies.admin == undefined){
        return res.redirect('/admin');
    }
    var adminControl = req.cookies.admin;
    return res.render('update',{
        adminData : data,
        admin : adminControl
    })
}

module.exports.editAdminRecord = async(req,res)=>{
    let oldImg = await admin.findById(req.body.editId);
    req.body.name = req.body.fname+" "+req.body.lname;
    req.body.isActive = true;
    req.body.updated_date = new Date().toLocaleString();
    if(req.file){
        if(oldImg.adminImage){
            let fullPath = path.join(__dirname,'..',oldImg.adminImage);
            await fs.unlinkSync(fullPath);
        }
        var ImagePath = '';
        ImagePath = admin.adminImgPath+"/"+req.file.filename;
        req.body.adminImage = ImagePath;
    }
    else{
        req.body.adminImage = oldImg.adminImage;
    }
    await admin.findByIdAndUpdate(req.body.editId,req.body);
    return res.redirect('/admin/editProfile');
}

// Profile Update end