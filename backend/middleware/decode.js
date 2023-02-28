const admin = require("firebase-admin");
const serviceAccount = require("./authenticate.json");
const firebase = require("firebase-admin");
firebase.initializeApp({ credential: admin.credential.cert(serviceAccount) });

async function decodeIDToken(req, res, next) {
  const header = req.headers?.authorization;
  if (
    header !== "Bearer null" &&
    req.headers?.authorization?.startsWith("Bearer ")
  ) {
    const idToken = req.headers.authorization.split("Bearer ")[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req["currentUser"] = decodedToken;
      next();
    } catch (err) {
      res.status(401).json(err);
    }
  }
}
module.exports = decodeIDToken;
