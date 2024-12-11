import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'
const app=express();
import 'dotenv/config'

import homeRoutes from './routes/homeRoutes.js';
import productRoutes from './routes/productRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import db from './config/db.js'
import cloudinary from './config/cloudinary.js';

app.use(cors({
    origin: [process.env.FIRST_URI,process.env.SECOND_URI],
    methods:['GET','POST','DELETE','PUT'],
    allowedHeaders:[
        'Content-Type',
        'Authorization',     
        'Cache-Control',
        'Expires',
        'Pragma'
    ],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/',homeRoutes);
app.use('/products',productRoutes);
app.use('/order',orderRoutes);
app.use('/payment',paymentRoutes);

app.listen(3000,()=>{
    console.log("server is running");
})