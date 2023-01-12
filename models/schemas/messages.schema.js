const { Schema } = require('mongoose')

const messagesSchema = new Schema({
      date: { type: Date, required: true, default: new Date().toLocaleString() },
      author: {
        email: { type: String, required: true },
        name: { type: String, required: true },
        lastname: { type: String, required: true },
        age: { type: String, required: true },
        alias: { type: String, required: true },
        avatar: { type: String, required: true },
      },
      text: { type: String, required: true },
})

module.exports = messagesSchema
