const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userModel = require("../models/users-model");
const hisaabModel = require("../models/hisaab-model");
const { isLoggedIn, redirectIfLoggedIn } = require("../middlewares/auth-middlewares");

router.get('/create', isLoggedIn, function (req, res) {
    res.render('create');
})

router.post('/create', isLoggedIn, async function (req, res) {
    let { title, description, encrypted, shareable, passcode, editpermissions } = req.body;

    encrypted = encrypted === 'on' ? true : false;
    shareable = shareable === 'on' ? true : false;
    editpermissions = editpermissions === 'on' ? true : false;

    try {
        let hisaabCreated = await hisaabModel.create({
            title,
            description,
            user: req.user._id,
            passcode,
            encrypted,
            shareable,
            editpermissions,
        });
        let user = await userModel.findOne({ email: req.user.email })
        user.hisaab.push(hisaabCreated._id);
        await user.save();
        res.redirect("/profile");
    } catch (err) {
        res.send(err.message);
    }

})

router.get('/view/:id',isLoggedIn, async function(req,res){
    const id = req.params.id;
    const hisaab = await hisaabModel.findOne({
        _id:id
    })
    if(!hisaab) return res.redirect('/profile');

    if(hisaab.encrypted) return res.render('passcode',{isLoggedIn:true,hisaab});

    res.render('hisaab',{isLoggedIn:true,hisaab});
})

router.post('/verify/:id',isLoggedIn,async function(req,res){
    const id = req.params.id;
    const hisaab = await hisaabModel.findOne({_id:id});
    if(!hisaab) return res.redirect('/profile');
    if(hisaab.passcode !== req.body.passcode) return res.redirect('/profile');
    return res.render('hisaab',{isLoggedIn:true,hisaab});
})

router.get('/delete/:id',isLoggedIn,async function(req,res){
    const id = req.params.id;
    const hisaab = await hisaabModel.findOne({
        _id:id,
        user:req.user.id
    });
    if(!hisaab) return res.redirect('/profile');

    await hisaabModel.deleteOne({
        _id:id
    });
    res.redirect('/profile');
})

router.get('/edit/:id',isLoggedIn, async function(req,res){
    const id = req.params.id;
    const hisaab = await hisaabModel.findById(id);
    if(!hisaab) return res.redirect('/profile');

    return res.render('edit',{isLoggedIn:true,hisaab});
})

router.post('/edit/:id',isLoggedIn, async function(req,res){
    const id = req.params.id;
    const hisaab = await hisaabModel.findById(id);
    if(!hisaab) return res.redirect('/profile');

    hisaab.title = req.body.title;
    hisaab.description = req.body.description;
    hisaab.encrypted = req.body.encrypted === 'on'? true : false;
    hisaab.passcode = req.body.passcode;
    hisaab.shareable = req.body.shareable === 'on'? true : false;
    hisaab.editPermissions = req.body.editPermissions === 'on'? true : false;

    await hisaab.save();
    res.redirect('/profile');
})

module.exports = router;