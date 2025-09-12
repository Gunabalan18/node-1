const express=require('express');
const dotenv=require('dotenv');
const connectDB=require('./config/db')
const routes=require('./routes/authrouters')

dotenv.config();

connectDB()


const app=express();

app.use(express.json());

app.use('/api/auth',routes)

app.get('/', (req,res)=>{
    res.send('API is running');
})

const port = process.env.PORT
app.listen(port,()=>{
    console.log('Server is running on port 3000');
});