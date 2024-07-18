const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
require("dotenv").config();

const indexRouter = require('./routes/index');
const hisaabRouter = require('./routes/hisaab');
const db = require("./config/mongoose-connection");

const flash = require("connect-flash");
const expressSession = require("express-session");

app.use(
  expressSession({
    resave: false,
    saveUninitialized: true,
    secret: "ajhsbcnjabsghjgcbjahkscbhjabkschja",
  })
);
app.use(flash());

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use('/',indexRouter);
app.use('/hisaab',hisaabRouter);

app.listen(process.env.PORT || 3000);
