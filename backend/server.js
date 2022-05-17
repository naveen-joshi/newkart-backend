const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const {errorHandler} =  require('./middleware/errorMiddleware'); 
const connctDB = require('./config/db');
const port = process.env.PORT || 5000;
const cors = require('cors');
const morgan = require('morgan');

connctDB()

const app = express();

app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('tiny'));

app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

app.use("/assets/public", express.static(__dirname + "/assets/public"));

app.use(errorHandler);

app.listen(port, ()=> {
    console.log(`Server started on port ${port}`);
})