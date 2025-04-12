require ('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');   
const morgan = require('morgan');

require('./models/Post');
require('./models/User');

const app = express();
//middleware
app.use(express.json());
app.use(morgan('dev'));

//connect to mongodb
mongoose.connect(process.env.MONGODB_URI)
.then(()=>console.log('MongoDB connected'))
.catch(err=>console.log(err));

//routes
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
app.use('/api/posts',postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth',authRoutes);

app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});

//start server
const PORT =process.env.PORT || 3000;
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
