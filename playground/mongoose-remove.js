const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose')
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// Todo.remove
// Todo.remove({}).then((result) => {
//   console.log(result)
// })


// Todo.findOneAndRemove
Todo.findByIdAndRemove('5aba27b5c3834d58a19de9d4').then((todo) => {
  console.log(todo)
})

// Todo.findByIdAndRemove
Todo.findOneAndRemove({_id: '5aba27b5c3834d58a19de9d4'}).then((todo) => {

});

