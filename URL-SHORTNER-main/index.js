// Load environment variables
require('dotenv').config();

const express = require('express');
const connectDB = require('./connection');
const urlroutes=require('./routes/url');
const path = require('path');
const userRoutes = require('./routes/user');
const cookieParser = require('cookie-parser');
const {authenticateUser,restrictToRoles} = require('./middleware/auth');




const app = express();
const port = process.env.PORT || 8001;


//middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(authenticateUser);
app.set('view engine', 'ejs');
app.set('views',path.resolve("./view"));


// Connect to MongoDB
connectDB(process.env.MONGODB_URI );
app.use('/user', userRoutes);
app.use('/',authenticateUser,urlroutes);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});