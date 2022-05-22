const bcrypt = require("bcrypt");
const { cryptage, decryptage } = require("./services/function/chifrement");
const jwt = require("jsonwebtoken");

const token = jwt.sign(
  {
    idCard: "9e3ddf0f-17d8-4144-9529-013caa90ce6c",
  },
  "v6sb89x6s33b9dkh"
);
//console.log(token)
console.log(
  cryptage(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZENhcmQiOiI5ZTNkZGYwZi0xN2Q4LTQxNDQtOTUyOS0wMTNjYWE5MGNlNmMiLCJpYXQiOjE2NTMwMzM5NTh9.vAzVGk9ivFpsD2nl7lKzhjnujXRo41w5KggX5ke2svE"
  )
);

// console.log(
//   jwt.verify(
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZENhcmQiOiIyNmNjYjgyNS0zYTNlLTQ2MjMtYmIyYi1kODJhOGVkZjZiZDkiLCJpYXQiOjE2NTI3ODY1NTZ9.OwLD5xcMx8f3YazxAwrmSX6-gpoRfMxXgrGiXMxzOwc",
//     "v6sb89x6s33b9dkh"
//   )
// );
