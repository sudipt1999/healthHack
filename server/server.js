var http = require('http');
var socketIO = require('socket.io');
var express = require('express');
let bodyParser = require('body-parser')
let nodemailer = require('nodemailer');
var path = require('path');
var moment = require('moment');
const Users = require('./utils/users');
const User = new Users();
const db = require('../db/db');
const UserDb = require('../db/models/user')
const DoctorDb = require('../db/models/doctor')
const mongoose = require('mongoose')

const publicPath = path.join(__dirname, '../views');

var app = express();
let cookieParser = require('cookie-parser');
let secret = "secret123@"
app.use(cookieParser(secret))


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(express.static(publicPath));
app.set('view engine', 'hbs');
var server = http.createServer(app);
var io = socketIO(server);

//app.use(express.static(publicPath));

app.get('/c/', (req, res) => {
    console.log('/someone entered');
    console.log("req", req.originalUrl);
    if (req.originalUrl === '/c') {
        console.log("basic file");
        res.render('join.hbs');
    }
    else {
        console.log("chat file");
        res.render('chat.hbs');
    }
})

// set a cookie
app.use(function (req, res, next) {
    // check if client sent cookie
    var cookie = req.cookies.user;
    if (!cookie || cookie == 'null')
    {
      console.log("USER NOT SIGNED IN")
    } 
    else
    {
      // yes, cookie was already present 
      console.log('cookie exists', cookie);
      // will need to find user by id
  
    } 
    next(); // <-- important!
  });
  
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sudiptdabral2991999@gmail.com',
      pass: 'iamawinner'
    }
  });
  
  let mailOptions = {
    from: 'sudiptdabral2991999@gmail.com',
    to: 'rangekutta123@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };
  
app.get('/signout', (req, res)=>{
  res.cookie('user','null');
  res.redirect('/');
})

app.get('/', (req, res)=>{
  console.log("RECEIVED REQ BABE")
  res.render('index.hbs')
})

app.get('/signin', (req, res)=>{
  res.render('signin.hbs')
})

app.post('/signin', (req,res)=>{
  console.log("SIGNIN CALLED",req.body)
  if(req.body.name == "sudo-admin"){
    res.cookie('user', "sudo")
  }
  res.send("Jai ho !")
})




app.post('/usersignup', (req, res)=>{
  const user = req.body.user
  console.log("user received", user, req.body)
  let newUser = new UserDb({
    name: user.name,
    email: user.email
  })

  newUser.save()
        .then(user=>{
          console.log("USER ADDED SUCCESS",user)
          res.cookie('user', user._id)
          res.send("successfully added")
        })
        .catch(err=>{
          res.send("SORRY COULDN't ADd", err)
        })

})


app.post('/doctorsignup', (req, res)=>{
  const user = req.body.user
  console.log("user received", user, req.body)
  let newUser = new DoctorDb({
    name: user.name,
    email: user.email,
    interest: user.interest
  })

  newUser.save()
    .then(user=>{
      console.log("USER ADDED SUCCESS",user)
      res.cookie('user', user._id)
      res.send({status: true})
    })
    .catch(err=>{
      res.send("SORRY COULDN't ADd", err)
    })

})



app.post('/sendmail', (req, res)=>{
    console.log("Req at /")
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          res.send({status: false}).status(400)
        } else {
          console.log('Email sent: ' + info.response);
          res.send({status: true}).status(200)
        }
      });
})




app.post('/startconsultant', (req, res)=>{
  //send mail to all the users including the dr whom we will be 
  // working into the check

  const __id = new mongoose.Types.ObjectId() //need to set this at room id for them to join
  let emails = []
  let searchEmails = req.body.user.findArray;
  console.log(searchEmails)
  DoctorDb.find({}, (err, doctors)=>{

      if(err){
        console.log(error);
        res.send({status: false}).status(400)
      }


        console.log("doctors", doctors)
          doctors.map(doc =>{
            console.log("doc => ",doc);
            searchEmails.map(val => {
              console.log("VAL :",val)
              if(doc.interest.includes(val)){
                console.log("adding to emails")
                emails.push(doc.email)
              }
              return " "
            });
          })
            emails = [...new Set(emails)]
            console.log("EMAIL FORMED ",emails);
            let mailOptions = {
              from: 'sudiptdabral2991999@gmail.com',
              to: emails.join(';'),
              subject: 'A God Child requires your help',
              text: `Room id : ${__id} ! Join as soon as possible ! May god be with you ! Amen. <br> Link to the channel`
            };

            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
                res.send({status: false}).status(400)
              } else {
                console.log('Email sent: ' + info.response);
                res.send({status: true}).status(200)
              }
            });



  })
          
             
            





})



io.on('connection', (socket) => {
    // console.log("someone connected");
    var id = socket.id;
    // console.log("socket.id", id);
    socket.on('addUser', (data) => {
        // console.log("inside addUSer socket");
        // console.log(data);
        if (User.findUser(socket.id)) {
            User.deleteUser(socket.id);
        }
        const newUser = {
            id: socket.id,
            name: data.name,
            room: data.room
        };
        /* MAKING ROOM SO THAT MESSAGE CAN BE SENT TO IT */
        socket.join(data.room);
        // console.log(newUser);
        /*adding user to the dynamic storage */
        User.addUser(newUser);
        const userInRoom = User.findRoomUser(data.room);
        const welcomeText = {
            from: 'Admin',
            text: `${newUser.name} joined the room`,
            time: new Date()
        }
        socket.broadcast.to(data.room).emit('receivedMessage', welcomeText);
        io.to(data.room).emit('updatedUserList', userInRoom);
    })

    /*  METHOD FOR REGISTERING MESSAGE AND EMITING TO ROOM */
    socket.on('newMessage', (data) => {
        console.log("NEW MESSAGE RECEIVED ", data);
        const user = User.findUser(id);
        const message = {
            from: user.name,
            text: data.text,
            time: new Date().getTime()
        }
        console.log("MESSAGE READY To SEND TO OTHERS ", message);
        console.log("found user ", user);
        User.findRoomUser(user.room);
        io.to(user.room).emit('receivedMessage', message);
    })


    socket.on('disconnect', () => {
        var user = User.deleteUser(socket.id);
        const userInRoom = User.findRoomUser(user.room);
        var departureText = {
            from: 'Admin',
            text: `${user.name} left the room`,
            time: new Date().getTime()
        }
        socket.broadcast.to(user.room).emit('receivedMessage', departureText);
        io.to(user.room).emit('updatedUserList', userInRoom);
    })

})


server.listen(3000, () => {
    console.log("app started at port 3000");
})