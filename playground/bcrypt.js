const bcrypt = require('bcryptjs')

var password = '123abc';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash)
  })
})

// var hashedPassword = '$2a$10$nAD9dlA6J50x2tKTgIEN6OsZZR.xV1D6OxbCnYSTCQ4DkxmoJQAzK';

// bcrypt.compare(password, hashedPassword, (err, res) => {
//   console.log(res)
// })