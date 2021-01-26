const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const url = process.env.MONGODB_URI

console.log("connecting to", url)

mongoose.plugin((schema) => {
  schema.pre("findOneAndUpdate", setRunValidators)
  schema.pre("updateMany", setRunValidators)
  schema.pre("updateOne", setRunValidators)
  schema.pre("update", setRunValidators)
})

function setRunValidators() {
  this.setOptions({ runValidators: true, context: "query", new: true })
}

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected to MongoDB")
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name required"],
    minlength: 3,
    unique: true,
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /([^\d]*\d){8}/.test(v)
      },
      message: "{VALUE} is not a valid phone number!",
    },
    required: [true, "Phone number required"],
  },
})
personSchema.plugin(uniqueValidator)

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model("Person", personSchema)
