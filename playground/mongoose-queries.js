const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose')
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');


var id = '5ab9f9e20b5cc7fe4ab87708';

// if(!ObjectID.isValid(id)) {
//   console.log('ID not valid')
// }

// // Finding more than one todo which returns an array of todos
// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos)
// })

// // Find only one item using any parameter
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todos', todo)
// })

// // Find an item by Id
// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('Id not found')
//   }
//   console.log('Todo By Id', todo)
// }).catch((e) => console.log(e))


// User.findById
User.findById('5ab9d01c25af42d93313bc8e').then((user) => {
  if(!user) {
    return console.log('Unable to find user')
  }
  console.log(JSON.stringify(user, undefined, 2))
}, (e) => {
  console.log(e)
})

