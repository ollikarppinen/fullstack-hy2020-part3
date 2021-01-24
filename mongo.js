const mongoose = require("mongoose")

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password> <name> <number>"
  )
  process.exit(1)
}
const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.qmxgf.mongodb.net/test?retryWrites=true&w=majority`

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .catch((err) => {
    console.log(Error, err.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model("Person", personSchema)

if (name && number) {
  const person = new Person({
    name,
    number,
  })

  person
    .save()
    .then((result) => {
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
    .catch((err) => {
      console.log(Error, err.message)
    })
}

if (name === undefined && number === undefined) {
  Person.find({})
    .then((persons) => {
      console.log("phonebook:")
      persons.forEach(({ name, number }) => console.log(`${name} ${number}`))
      mongoose.connection.close()
    })
    .catch((err) => {
      console.log(Error, err.message)
    })
}
