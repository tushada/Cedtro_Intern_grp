const admin = require("../firebaseAdmin");

async function getUserHomeId(uid) {
  const userDoc = await admin.firestore().collection("users").doc(uid).get();
  if (!userDoc.exists) throw new Error("User not found");
  return userDoc.data().updateHomeId;
}

module.exports = { getUserHomeId }; 