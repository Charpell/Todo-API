require('dotenv').config()
var env = process.env.NODE_ENV || 'development';
console.log('env ******', env)

if (env === 'development') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = process.env.MONGODB_URI_DEVELOPMEMT;
} else if (env === 'test') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = process.env.MONGODB_URI_TEST;

}



const _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser')
const { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose')
var { Todo } = require('./models/todo');
var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate')


var app = express();
const port = process.env.PORT;

app.use(bodyParser.json())

// Post a todo
app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc)
  }, (e) => {
    res.status(400).send(e)
  })
})

// Get all todos
app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({ todos })
  }, (e) => {
    res.status(400).send(e);
  })
})

// GET /todos/1234
app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }
    res.send({ todo })
  }).catch((e) => {
    res,status(400).send()
  })

})


app.delete('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }

    res.send({ todo });
  }).catch((e) => {
    res.status(400).send()
  })
})


app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send()
    }

    res.send({ todo });
  }).catch((e) => {
    res.status(400).send()
  })
})


// POST /users
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});




app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user)
})


// POST /users/login 
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  
  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);      
    })
  }).catch((e) => {
    res.status(400).send();
  });
})


app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`)
})

module.exports = {
  app
}