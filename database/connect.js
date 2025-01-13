const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@mydatabase.8vzuo.mongodb.net/muse`)
.then(success => {
 console.log('Successfuly connected to database');
}).catch(error => {
 console.log('error connecting to database');
})