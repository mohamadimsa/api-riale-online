const bcrypt = require("bcrypt");

bcrypt.hash("1710", 10, async (err, hash) => {
    console.log(hash)
})