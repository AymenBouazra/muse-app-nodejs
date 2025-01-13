const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@mydatabase.8vzuo.mongodb.net/muse`)
.then(()=> console.log('Connected to database'))
.catch((err)=> console.log(err));