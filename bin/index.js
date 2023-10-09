const app = require('../app');
const database = require('../database');
const scheduledFunctions = require('../jobs/dailyNotification');
require('dotenv').config();

const startServer = async () => {
	try {
		await database.mongoose.connect(database.DATABASE_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});

		app.listen(process.env.PORT, () => {
			console.log('Running on port 3000');
			scheduledFunctions.initScheduledJobs();
		});
	} catch (error) {
		console.error('Error connecting to the database:', error);
	}
};
  
startServer(); 