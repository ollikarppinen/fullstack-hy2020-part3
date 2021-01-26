require("dotenv").config()

const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const Person = require("./models/person")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("build"))

morgan.token("body", (req, _res) => JSON.stringify(req.body))

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
)

app.get("/info", (request, response) => {
  Person.countDocuments().then((count) =>
    response.send(
      `Phonebook has info for ${count} people\n\n${new Date().toString()}`
    )
  )
})

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(next)
})

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name: body.name, number: body.number },
    {}
  )
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch(next)
})

app.post("/api/persons", (request, response, next) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: "name missing" })
  }

  if (body.number === undefined) {
    return response.status(400).json({ error: "name missing" })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch(next)
})

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end()
    })
    .catch(next)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
