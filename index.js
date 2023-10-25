const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const { userRoute } = require('./routes/userRoute');
const { groupRoute } = require('./routes/groupRoute');
const { walletRoute } = require('./routes/walletRoute');


const app = express();
dotenv.config();
connectDB();

const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: "*",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  };
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', userRoute);
app.use('/api/group', groupRoute);
app.use('/api/wallet', walletRoute);

app.listen(PORT, ()=>{
    console.log(`CoShare running in ${process.env.NODE_ENV} mode on port ${PORT}`);
})