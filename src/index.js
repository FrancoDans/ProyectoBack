const express = require("express");
var admin = require("firebase-admin");
const app = express()

const PORT = 8080

//FIREBASE
var serviceAccount = require("../../db/productos-56155-firebase-adminsdk-wt2w7-6dfa095c28.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://console.firebase.google.com/u/0/project/productos-56155/firestore/data/~2Fproducts?hl=es-419"

});
 app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto` + PORT)
})