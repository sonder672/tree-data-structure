const qrCode = require('qrcode');

const generateQrCode = async (qrCodeContent, size = 500) => {
    const base64Image = await qrCode.toDataURL(qrCodeContent, {
        width: size,
        height: size
    });

    return base64Image;
};

module.exports = { generateQrCode };