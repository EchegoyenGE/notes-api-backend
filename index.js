require('dotenv').config()

require('./mongo.js')

const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/Note')
const notFound = require('./middleware/notFound.js')
const handleErrors = require('./middleware/handleErrors.js')

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})

app.get('/api/notes/:id', (request, response, next) => {
  const { id } = request.params

  Note.findById(id).then(note => {
    if (note) {
      return response.json(note)
    } else {
      response.status(404).end()
    }
  }).catch(err => {
    next(err)
  })
})

app.put('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  const note = request.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})

app.delete('/api/notes/:id', async (request, response, next) => {
  const { id } = request.params
  try {
    await Note.findByIdAndDelete(id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.post('/api/notes', async (request, response, next) => {
  const note = request.body

  if (!note.content) {
    return response.status(400).json({
      error: 'required "content" field is missing'
    })
  }

  const newNote = new Note({
    content: note.content,
    date: new Date(),
    important: note.important || false
  })

  try {
    const savedNote = await newNote.save()
    response.json(savedNote)
  } catch (error) {
    next(error)
  }
})

app.use(notFound)

app.use(handleErrors)

const PORT = process.env.PORT || 3001
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
