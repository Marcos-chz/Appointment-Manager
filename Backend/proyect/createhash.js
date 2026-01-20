const bcrypt = require('bcrypt');

bcrypt.hash('123456', 10).then(hash => {
  console.log('Nuevo hash para "111":', hash);
});
