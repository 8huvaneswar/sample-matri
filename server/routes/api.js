const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../modals/user')
const mongoose = require('mongoose')
const db = "mongodb://userbhuvan:userbhuvan1@ds123796.mlab.com:23796/bhuvandb"

mongoose.connect(db, err => {
    if (err) {
        console.error('Error!' + err)
    } else {
        console.log('Connected to mongodb')
    }
})

router.get('/', (req, res) => {
    res.send('From API route')
})

router.post('/register', (req, res) => {
    let userData = req.body
    let user = new User(userData)
    user.save((error, registeredUser) => {
        if (error) {
            console.log(error)
        }else{
            let payload = { subject: registeredUser._id }
            let token = jwt.sign(payload, 'secretKey')
            res.status(200).send({token})
        }
    })
})

router.post('/login', (req, res) => {
    let userData = req.body

    User.findOne({email : userData.email}, (error, user) => {
        if(error){
            console.log(error)
        }else{
            if (!user){
                res.status(401).send('Invalid Email')
            }else
            if (user.password !== userData.password) {
                res.status(401).send('Invalid Password')
            } else {
                let payload = { subject: user._id }
                let token = jwt.sign(payload, 'secretKey')
                res.status(200).send({token})
            }
        }
    })
})


function verifyToken(req, res, next){
    if(!req.headers.authorization){
        return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if (token === 'null'){
        return res.status(401).send('Unauthorized request')
    }
    let payload = jwt.verify(token, 'secretKey')
    if(!payload){
        return res.status(401).send('Unauthorized request')
    }
    req.userId = payload.subject
    next()
}


router.get('/events', (req, res) => {
    let events = [
        {
        "_id": "1",
        "name": "Auto Expo",
        "description": "lorem ipsum",
        "date" : "2018-11-13T18:25:43.511Z"
        },
        {
            "_id": "2",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date" : "2018-11-13T18:25:43.511Z"
        },
        {
            "_id": "3",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date" : "2018-11-13T18:25:43.511Z"
        },
        {
            "_id": "4",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date" : "2018-11-13T18:25:43.511Z"
        },
    ]
    res.json(events)
})


router.get('/special', verifyToken, (req, res) => {
    let events = [
        {
        "_id": "1",
        "name": "Auto Expo",
        "description": "lorem ipsum",
        "date" : "2018-11-13T18:25:43.511Z"
        },
        {
            "_id": "2",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date" : "2018-11-13T18:25:43.511Z"
        },
        {
            "_id": "3",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date" : "2018-11-13T18:25:43.511Z"
        },
        {
            "_id": "4",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date" : "2018-11-13T18:25:43.511Z"
        },
    ]
    res.json(events)
})

module.exports = router