const bcrypt = require("bcrypt");
const { cryptage, decryptage } = require("./services/function/chifrement");
const jwt = require("jsonwebtoken");

const token = jwt.sign(
  {
    idCard: "26ccb825-3a3e-4623-bb2b-d82a8edf6bd9",
  },
  "v6sb89x6s33b9dkh"
);
//console.log(token)
console.log(
  cryptage(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZENhcmQiOiIyNmNjYjgyNS0zYTNlLTQ2MjMtYmIyYi1kODJhOGVkZjZiZDkiLCJpYXQiOjE2NTI3OTkwMzh9.kkCaoyobs1vU0Urmed58YkiydfudK96ipyryc0TaK3Q"
  )
);

// console.log(
//   jwt.verify(
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZENhcmQiOiIyNmNjYjgyNS0zYTNlLTQ2MjMtYmIyYi1kODJhOGVkZjZiZDkiLCJpYXQiOjE2NTI3ODY1NTZ9.OwLD5xcMx8f3YazxAwrmSX6-gpoRfMxXgrGiXMxzOwc",
//     "v6sb89x6s33b9dkh"
//   )
// );
