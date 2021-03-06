const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

const app = express();
const db = require('./config/keys').mongoURI;
const port = process.env.PORT || 5000;

const users = require('./routes/api/users')

mongoose.connect(db, { useNewUrlParser: true }).then(() => {
  console.log('Connected to MongoDB successfully')
}).catch(err => {console.log(err)})

app.listen(port, () => {});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
require('./config/passport')(passport);

app.get('/', (req, res) => {
  res.json( {msg: 'This is a test'})
});

app.use('/users', users);