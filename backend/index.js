const express = require('express');
// const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// app.use(bodyParser.json());

// const uri = process.env.ATLAS_URI;
// const uri = "mongodb+srv://riligalak:quiz2@cluster0.uzxptk7.mongodb.net/?retryWrites=true&w=majority";
const uri = "mongodb+srv://riligalak:quiz2@cluster0.uzxptk7.mongodb.net/Booklist";
// mongoose.connect(uri, { useNewUrlParser: true});
mongoose.connect(uri, { useNewUrlParser: true}
);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Mongoose connected successfully!");
})

//---CRUD pu this after connecting mongo db---------
let Book = require('./model/bookmodel');

//get all
app.get('/', (req, res) => {
    Book.find()
      .then((record) => res.json(record))
      .catch((err) => res.status(500).json("Error: " + err));
});


//get by id
app.get('/:id', (req, res) => {
    Book.findById(req.params.id)
      .then((record) => res.json(record))
      .catch((err) => res.status(500).json("Error: " + err));
  });
  

app.get('/search/:title', (req, res) => {
    const filter = { "title": req.params.title };
    Book.find(filter)
      .then((record) => res.json(record))
      .catch((err) => res.status(500).json("Error: " + err));
  });
  
  
app.post('/api', (req, res) => {
  
    title = req.body.title;
    author = req.body.author;
    description = req.body.description;
  
    const record = new Book({
      title,
      author,
      description
    });
  
    record
      .save()
      .then(() => res.send(record))
      .catch((err) => res.status(500).json("Error: " + err));
  });
  
  
app.put("/:id", (req, res) => {
  
    Book.findById(req.params.id)
      .then((books) => {
        books.title = req.body.title;
        books.author = req.body.author;
        books.description = req.body.description;
  
        books
          .save()
          .then(() => res.json("Book updated!"))
          .catch((err) => res.status(500).json("Error: " + err));
      })
      .catch((err) => res.status(500).json("Error: " + err));
  });
  
  
app.put("/title/:title",(req, res) => {
    const filter = { "title": req.params.title };
    const update = { "description": req.body.description };
  
    console.log(filter);
    console.log(update);
  
    Book.findOneAndUpdate(filter, update, {upsert: true}, function(err, doc) {
        if (err) return res.status(500).send({error: err});
        return res.send('Succesfully saved.');
    });
   });
  
   
app.delete("/deleteall/all",(req, res) => {
    console.log("Delete all");
  Book.deleteMany({})
    .then(() => res.json("All Books deleted."))
    .catch((err) => res.status(500).json("Error: " + err));
  });
  
  
app.delete("/:id",(req, res) => {
      Book.findByIdAndDelete(req.params.id)
        .then(() => res.json("Book deleted."))
        .catch((err) => res.status(500).json("Error: " + err));
    });
  
    app.delete("/author/:author",(req, res) => {
    const filter = { "author": req.params.author };
  
    console.log(filter);
  
    Book.deleteMany(filter, (err) => {
        if (err) return res.status(500).send({error: err});
        return res.send('Succesfully Deleted.');
    });
  });

  
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  });
  

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    })
  });


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});