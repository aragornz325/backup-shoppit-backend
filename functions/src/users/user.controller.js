const admin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth")

const tryUser = async (req, res) => {
  await getAuth().setCustomUserClaims("p3Tn1lnvaTN8RaxYa940XXzVNso2", { user: true });
  const userRecord = await admin.auth().getUser("p3Tn1lnvaTN8RaxYa940XXzVNso2");
  res.json({data: userRecord.customClaims});

}

module.exports = {
  tryUser
}