const { generateQrCode } = require('../../util/qr');
require('dotenv').config();

const DOMAIN = process.env.DOMAIN;

const homeView = async (req, res) => {
    const { userId } = req.session;
    const qrCode = await generateQrCode(`${DOMAIN}/register/${userId}`);

    res.render('home', { qrCode });
}

module.exports = { homeView };