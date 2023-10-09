const cron = require('node-cron');
const { getNumberRegisteredUsersToday } = require('../database/user/query');
const { html } = require('../util/mail/user/html');
const EmailSender = require('../util/mail/nodeMailer');
require('dotenv').config();

exports.initScheduledJobs = () => {
    const job = cron.schedule('57 23 * * *', async () => {
        try {
            console.log({cronMessage: 'Cron running'});
            const numberRegisteredUsersToday = await getNumberRegisteredUsersToday();
            const emailHtml = html(numberRegisteredUsersToday);

            const message = {
                to: process.env.MAIL_CORPORATE_EMAIL,
                subject: 'Cantidad de usuarios registrado hoy',
                html: emailHtml
            };
            EmailSender.sendEmailWithAttachment(message);
        } catch(error) {
            console.error(error);
        }
    });

    job.start();
};