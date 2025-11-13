const crypto = require('crypto');
module.exports = (req, res) => {
const hash = crypto.createHash('sha3-256').update(JSON.stringify(req.body)).digest('hex');
res.json({ sha3: hash });
};
