const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Player = require('../models/player');
const {validateToken} = require('../config/auth');
const jwt = require('jsonwebtoken');


// Add data
router.post('/add', async (req, res) => {
    try {
        const { name, place, roles, contact } = req.body

        const user = await User.create({
            name: name,
            roles: roles,
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
router.get('/add', validateToken , (req, res) => {
    res.render("add", {title: "Add Users", users: new User});
});

// edit
router.get('/edit/:id', async (req, res) => {
    const users = await User.findById(req.params.id);
    res.render("edit", {title: "Edit Users", users: users});
});

router.post('/table/:id', async (req, res) => {
    try {
        const {name, place, roles, contact} = req.body
        await User.findByIdAndUpdate(req.params.id,{
            name,
            place,
            roles,
            contact,
        });
        res.redirect('/table')
    } catch (error) {
        
    }
    
});

// deleted
router.get('/table/:id', async (req, res) =>{
    const user = await User.findByIdAndDelete(req.params.id);
    res.redirect('/table');
});


// search data
router.post('/table', async (req, res) => {
    try {
        const { name } = req.body;
        const userAll = await User.find();
        const user = await User.find({ name: name });
        
        !name ? res.render('table', { title: "Table data",users: userAll }) : res.render('table', { title: "Table data", users: user });
    } catch (error) {
        
    }
});

// Show table that has been traded
router.get('/table', async (req, res) => {
    const search = req.query.name || "";
    const usersearch = await User.find({name: {$regex: search, $options: "i"}});
    const userAll = await User.find({ });
    const users = search == ""?userAll: usersearch;
    res.render("table", {title: "Table data", users: users});
    
});

// go to login
router.get('/log_in', (req, res) => {
    res.render("log_in", {title: "Login", users: new User});
});

// go to register
router.get('/regis', (req, res) => {
    res.render("regis", {title: "Register", users: new User});
});

router.post('/log_in', async (req, res) => {
    const { email, password } = req.body;

    try {
        const player = await Player.findOne({ email });

        if (player) {
            const passwordMatch = password == player.password? true : false;
            if (passwordMatch) {
                const token = jwt.sign({ id: player._id, email: player.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
                res.cookie("token", token);

                console.log("Login is successfully!");
                res.redirect('/table');
            } else {
                req.flash("error", "Incorrect password.");
                res.redirect('/log_in');
            }
        } else {
            req.flash("error", "User not found.");
            res.redirect('/log_in');
        }
    } catch (error) {
        console.log("Login is failed.");
        console.log(error);

        req.flash("error", "Login is failed.");
        res.redirect('/log_in');
    }
});

router.post('/regis',async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log(req.body.username);
        if (!username || !email || !password) {
            res.status(400).json({ message: "All fields are required." });
        }

        const existUserCheck = await Player.findOne({ email: req.body.email });
        if (existUserCheck) {
            res.status(400).json({ message: "Email already exists." });
        }

        const player = await Player.create({
            username,
            email,
            password
        });

        const token = jwt.sign({ id: player._id, email: player.email, }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token);

        console.log("Register is successfully!");
        res.redirect('/log_in');
    } catch (error) {
        console.log("Error");
    }
});

router.get('/logout', (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 1 });
        console.log("Log Out.");
        res.redirect("/home");
    } catch (error) {
        console.log("Error"); 
    }
});

module.exports = router;