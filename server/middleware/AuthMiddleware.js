const admin = require('../config/firebaseAdmin');
async function verifyFirebaseToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization || '';
        const match = authHeader.match(/^Bearer (.*)$/);
        if (!match) return res.status(401).json({ message: 'No token provided' });

        const idToken = match[1];
        const decoded = await admin.auth().verifyIdToken(idToken);
        // console.log(decoded)
        // console.log(idToken)
        req.user = {
            uid: decoded.uid,
            email: decoded.email,
            picture: decoded.picture,
        };
        next();
    } catch (error) {
        console.error('Token verification error', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports = verifyFirebaseToken;