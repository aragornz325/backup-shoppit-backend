const { getAuth } = require("firebase-admin/auth")

const tryUser = async (req, res) => {
  const auth = getAuth()

  await auth.setCustomUserClaims("p3Tn1lnvaTN8RaxYa940XXzVNso2", { user: true });
  const userRecord = await auth.getUser("p3Tn1lnvaTN8RaxYa940XXzVNso2");
  res.json({ data: userRecord.customClaims });

}

module.exports = {
  tryUser
}