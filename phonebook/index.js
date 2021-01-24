const express = require("express")
const morgan = require("morgan")

const app = express()

app.use(express.json())
app.use(morgan("tiny"))

const MAX_ID = 1000

let persons = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
  { id: 3, name: "Dan Abramov", number: "12-43-234345" },
  { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" },
]

app.get("/info", (request, response) => {
  response.send(
    `Phonebook has info for ${
      persons.length
    } people\n\n${new Date().toString()}`
  )
})

app.get("/api/persons", (request, response) => {
  response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((person) => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

const generateId = () => Math.floor(Math.random() * Math.floor(MAX_ID))

app.post("/api/persons", (request, response) => {
  const body = request.body
  if (!body || !body.name.length || !body.number.length) {
    return response.status(400).json({
      error: "name or number missing",
    })
  }

  if (persons.some(({ name }) => name === body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
