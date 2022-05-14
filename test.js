const bcrypt = require("bcrypt");

bcrypt.hash("1710", 10, async (err, hash) => {
    console.log(hash)
})
async function test (){
    console.log(await bcrypt.hash("1710", 10))
}
test