const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailSender {
	static async sendEmailWithAttachment(message) {
		const transporter = nodemailer.createTransport({
			service: process.env.MAIL_SERVICE,
			auth: {
				user: process.env.MAIL_SENDER_USER,
				pass: process.env.MAIL_SENDER_PASSWORD,
			},
		});

		message.from = process.env.MAIL_SENDER_USER;

		await transporter.sendMail(message);
	}
}

module.exports = EmailSender;