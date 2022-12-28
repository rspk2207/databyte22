const mongoose = require('mongoose');
const schema = mongoose.Schema;
const blogs = new schema({
    author:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true,
        unique: true        
    },
    date:{
        type: Date,
        required: true
    },
    data:{
        type: String, 
        required: true
    },
    image:[{
        data: Buffer,
        contentType: String,  
    }]
});

const blog = mongoose.model('blog',blogs);
module.exports = blog;