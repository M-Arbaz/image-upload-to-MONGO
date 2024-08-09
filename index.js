
require('dotenv').config();
const uri =process.env.DB_URL;
var port = process.env.PORT || 3000;
var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
var fs = require('fs');
var path = require('path');
const img = new mongoose.Schema({
    name:String,
    desc: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
})
const image = mongoose.model("images", img);
// HY THERE FROM TESTING
// console.log(uri)
mongoose.connect(uri)
.then(console.log("DB Connected", process.env.DB_URL))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var multer = require('multer');

var storage = multer.memoryStorage(); // Store files in memory instead of on disk

var upload = multer({ storage: storage });

app.get('/',(req,res)=>{
res.send('<h1>Express By $#@dow..! running perfectly</h1>')
})
app.get('/leak/data', async (req, res) => {
    try {
        const items = await image.find(); // Retrieve all images from the database

        let html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Image Gallery</title>
            </head>
            <body>
                <h1>Uploaded Images</h1>
        `;

        items.forEach(item => {
            html += `
                <div>
                    <h2>${item.name}</h2>
                    <p>${item.desc}</p>
                    <img src="data:${item.img.contentType};base64,${item.img.data.toString('base64')}" />
                </div>
            `;
        });

        html += `
            </body>
            </html>
        `;

        res.send(html);
    } catch (err) {
        console.log(err);
        res.status(500).send('An error occurred', err);
    }
});

app.get('/find:id',(req,res)=>{
    const _id =req.params.id;
    image.find({_id:_id}).then(result => res.send(
         
        `   <div>
                    <h2>${result[0].name}</h2>
                    <p>${result[0].desc}</p>
                    <img src="data:${result[0].img.contentType};base64,${result[0].img.data.toString('base64')}" />
                </div>`
    )).catch((err)=>{console.log(80,err)})

})
app.post('/', upload.single('image'), (req, res, next) => {
    var obj = {
        name: req.body.name,
        desc: req.body.desc,
        img: {
            data: req.file.buffer, 
            contentType: req.file.mimetype 
        }
    }
    image.create(obj)
    .then(item => {
        res.send('/uploaded');
    })
    .catch(err => {
        console.log(err);
        res.status(500).send('An error occurred', err);
    });
});


app.listen(port, err => {
    if (err)
        throw err
    console.log('Server listening on port', port)
})
