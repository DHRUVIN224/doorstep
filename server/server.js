const express = require('express')
const app = express();
const bodyparser = require('body-parser')
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./src/config/db');
const userRouter = require('./src/routes/userRouter');
const buissnessRouter = require('./src/routes/buissnessRouter');
const adminRouter = require('./src/routes/adminRouter');
const messageRouter = require('./src/routes/messageRouter');

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Connect to MongoDB
connectDB();

app.use(bodyparser.json())
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}))
app.use(express.urlencoded({extended:true}))

app.use('/user',userRouter)
app.use('/buissness',buissnessRouter)
app.use('/admin',adminRouter)
app.use('/message',messageRouter)

app.listen(PORT,() => {
    console.log(`Server started on port ${PORT}`)
})