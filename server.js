
// loading modules
let express = require('express')

let bodyParser = require('body-parser')
let nodemailer = require('nodemailer');
const db = require('./db/db');
const UserDb = require('./db/models/user')
const DoctorDb = require('./db/models/doctor')
const mongoose = require('mongoose')

// getting app object from express
let app = express()
let cookieParser = require('cookie-parser');
let secret = "secret123@"
app.use(cookieParser(secret))


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'hbs');

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
  let newUser = new User({
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
  let newUser = new Doctor({
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




app.get('/startconsultant', (req, res)=>{
  //send mail to all the users including the dr whom we will be 
  // working into the check

  const __id = new mongoose.Types.ObjectId() //need to set this at room id for them to join

})


app.get('/chat/:roomid', (req, res)=>{

})














app.listen(3000, ()=>{
    console.log("SERVER STARTED AT : 3000")
})