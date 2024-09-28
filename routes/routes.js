const express = require('express');
const router = express.Router();
const User = require('../models/user');
const multer = require('multer')

// Add data
router.post('/add', async (req, res) => {
    try {
        const { name, place, contact } = req.body

        const user = await User.create({
            name: name,
            place: place,
            contact: contact,
        });

        req.session.message = {
            type: 'success',
            message: 'User added successfully!'
        };

        res.redirect('/table');

        console.log(user);

    } catch (error) {
        console.log(error)
    }
});

// Go to path Home
router.get("/home", (req, res) => {
    res.render('home', {title: "Home Page" });
});

// Go to path Add data
router.get('/add', (req, res) => {
    res.render("add", {title: "Add Users", users: new User});
});

router.get('/edit/:id', async (req, res) => {
    const users = await User.findById(req.params.id);
    res.render("edit", {title: "Edit Users", users: users});
});

router.post('/table/:id', async (req, res) => {
    try {
        const {name, place, contact} = req.body
        await User.findByIdAndUpdate(req.params.id,{
            name,
            place,
            contact,
        });
        res.redirect('/table')
    } catch (error) {
        
    }
    
});

router.get('/table/:id', async (req, res) =>{
    const user = await User.findByIdAndDelete(req.params.id);
    res.redirect('/table');
});


router.post('/table', async (req, res) => {
    try {
        const { name } = req.body;
        const userAll = await User.find();
        const user = await User.find({ name: name });
        
        !name ? res.render('table', { title: "Table data",users: userAll }) : res.render('table', { title: "Table data", users: user });
    } catch (error) {
        
    }
});

router.get('/table', async (req, res) => {
    const users = await User.find();
    res.render("table", {title: "Table data", users: users});
    
});

router.get('/log_in', (req, res) => {
    res.render("log_in", {title: "Login", users: new User});
});

router.get('/regis', (req, res) => {
    res.render("regis", {title: "Register", users: new User});
});

module.exports = router;