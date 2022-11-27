const express = require('express')
const { getDb, connectToDb } = require('./db')
const { ObjectId } = require('mongodb')

// init app & middleware
const app = express()
app.use(express.json())

const port = process.env.PORT || 3000


// db connection
let db

connectToDb((err) => {
  if(!err){
    app.listen(port, () => {
      console.log('You are listening on port 3000')
    })
    db = getDb()
  }
})

// routes
app.get('/abouts', (req, res) => {
  
  let abouts = []

  db.collection('abouts')
    .find()
    .sort({author: 1})
    .forEach(about => abouts.push(about))
    .then(() => {
      res.status(200).json(abouts)
    })
    .catch(() => {
      res.status(500).json({error: 'Could not fetch the documents'})
    })
})

app.get('/abouts/:id', (req, res) => {

  if (ObjectId.isValid(req.params.id)) {

    db.collection('abouts')
      .findOne({_id: new ObjectId(req.params.id)})
      .then(doc => {
        res.status(200).json(doc)
      })
      .catch(err => {
        res.status(500).json({error: 'Could not fetch the document'})
      })
      
  } else {
    res.status(500).json({error: 'Could not fetch the document'})
  }

})

app.post('/abouts', (req, res) => {
  const about = req.body

  db.collection('abouts')
    .insertOne(about)
    .then(result => {
      res.status(201).json(result)
    })
    .catch(err => {
      res.status(500).json({err: 'Could not create new document'})
    })
})

app.delete('/abouts/:id', (req, res) => {

  if (ObjectId.isValid(req.params.id)) {

  db.collection('abouts')
    .deleteOne({ _id: new ObjectId(req.params.id) })
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json({error: 'Could not delete document'})
    })

  } else {
    res.status(500).json({error: 'Could not delete document'})
  }
})

app.patch('/abouts/:id', (req, res) => {
  const updates = req.body

  if (ObjectId.isValid(req.params.id)) {

    db.collection('abouts')
      .updateOne({ _id: new ObjectId(req.params.id) }, {$set: updates})
      .then(result => {
        res.status(200).json(result)
      })
      .catch(err => {
        res.status(500).json({error: 'Could not update document'})
      })

  } else {
    res.status(500).json({error: 'Could not update document'})
  }
})
