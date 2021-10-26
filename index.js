const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const port = process.env.PORT || 3000
mongoose.connect("mongodb://localhost:27017/myUrlShortner")

const { UrlModel } = require('./models/urlshort')

//middleware
app.use(express.static('public'))
app.set('view engine', "ejs");
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', function(req, res) {
    let allUrl = UrlModel.find(function(err, result) {
        res.render('home', {
            urlResult: result
        })
    })
});
app.post('/create', function(req, res) {
    //create url shortner
    //store it in db
    let urlShort = new UrlModel({
        longUrl: req.body.longurl,
        shortUrl: generateurl()
    })
    urlShort.save(function(err, data) {
        if (err) throw err;
        res.redirect('/');
    })
});

app.get('/:urlId', function(req, res) {
    UrlModel.findOne({ shortUrl: req.params.urlId }, function(err, data) {
        if (err) throw err;
        UrlModel.findByIdAndUpdate({ _id: data.id }, { $inc: { clickCount: 1 } }, function(err, updatedData) {
            if (err) throw err
            res.redirect(data.longUrl)
        })

    })
})

app.get('/delete/:id', function(req, res) {
    UrlModel.findByIdAndDelete({ _id: req.params.id }, function(err, deleteData) {
        if (err) throw err
        res.redirect('/')
    })
})
app.listen(3000, function() {
    console.log("port is runnings 3000")
})

function generateurl() {
    var randomresult = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    var characterslength = characters.length;
    for (i = 0; i < 5; i++) {
        randomresult += characters.charAt(
            Math.floor(Math.random() * characterslength)
        )
    }
    console.log(randomresult)
    return randomresult
}