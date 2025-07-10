const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // Place your Firebase service account key here

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin; 