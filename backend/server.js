const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const {errorHandler} =  require('./middleware/errorMiddleware') 
const connctDB = require('./config/db')
const port = process.env.PORT || 5000;
const cors = require('cors');

connctDB()

const app = express();

app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.use(errorHandler);

app.listen(port, ()=> {
    console.log(`Server started on port ${port}`);
})