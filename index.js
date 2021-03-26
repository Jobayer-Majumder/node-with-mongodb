const password = '-wXDp27JkH8nGsc';

const express = require('express');
const bodyParser = require('body-parser')
const ObjectId = require('mongodb').ObjectId;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://testdb:-wXDp27JkH8nGsc@jobayer.eggfq.mongodb.net/testdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// app.get('/data', (req, res) => {
//   // console.log('hello im working');
//   res.send('assalamualaikum');
// })

client.connect(err => {
  const productCollection = client.db("testdb").collection("products");
  
  app.get('/products', (req, res) => {
    productCollection.find({})
    .toArray((error, documents) => {
      res.send(documents)
    })
  });

  app.post('/addProducts', (req, res) => {
    const product = req.body;
    productCollection.insertOne(product)
    .then(result => {
      console.log('product added successfully');
      res.redirect('/');
    })
    // console.log(product);
  });

  app.get('/product/:id', (req , res) => {
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err , document) => {
      res.send(document[0]);
    })
  })
  
  app.patch('/updatePd/:id', (req, res) => {
    console.log(req.body)
    productCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {price: req.body.price, quantity: req.body.quantity}
    })
    .then(result => {
      res.send(result.modifiedCount > 0);
    });
    
  });

  app.delete('/deletePd/:id', (req, res) => {
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0);
    })
    console.log(req.params.id);
  });

});


app.get('/',  (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(3000, () => console.log('listening port'));
