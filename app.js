var express = require('express');
var app = express();
var mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const blog = require('./schema.js');

mongoose.connect('mongodb://Localhost:27017/databyte',{ useNewUrlParser: true, useUnifiedTopology: true});

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
//app.use('/uploads', express.static('uploads'));

app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');
 
var storage = multer.diskStorage({
    destination:  (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + Date.now())
    }
});
 
var upload = multer({ storage: storage });

app.get('/',(req,res)=>{
    res.render('about');
});
/*
app.get('/about',(req,res)=>{
    res.render('pages/aboutus');
});
*/
app.get('/members',(req,res)=>{
    res.render('members');
});
app.get('/input',(req,res)=>{
    res.render('text');
});
/*
app.get('/blogs',(req,res)=>{
    res.render('pages/bloglist');
});
*/
app.get('/blogs',async (req,res)=>{
    var k = await blog.find({});
    console.log(k.length);
    res.render('bloglist',{blogs: k});
});
app.get('/blogs/:blogtitle',async (req,res)=>{
    console.log(req.params.blogtitle);
    var t= await blog.findOne({title: req.params.blogtitle});
    res.render('post',{post: t});
});
app.post('/disp',upload.array('image',10), (req,res)=>{
    let author = req.body.author;
    let title = req.body.title;
    let date = req.body.date;
    let data = req.body.data;
    console.log(req.files);
    let img = [];
    for(var i=0;i<req.files.length;i++)
    {
        img.push({
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.files[i].filename)),
            contentType: req.files[i].mimetype
        });
    }
    /*
    let img = {
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
        contentType: 'image/png'
    };
    */
    /*
    req.files.forEach()
    for(var i=0;i<req.files.length;i++){
       // response += `<img src="${req.files[i].path}" /><br>`
       img.push({
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
        contentType: 'image/png'
        })
    }
    */
    let bpost = new blog({
        author: author,
        title: title,
        date: date,
        data: data,
        image: img
    });
    bpost.markModified('author');
    bpost.markModified('title');
    bpost.markModified('date');
    bpost.markModified('data');
    bpost.markModified('image');
    bpost.save();
    //res.render('pages/display',{author,title,date,data,img});
    res.render('about');
})
app.listen(3000);