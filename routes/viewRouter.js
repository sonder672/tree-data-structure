const express = require('express');
const router = express.Router();
const { loginView, registerView } = require('../controllers/views/userView');
const { homeView } = require('../controllers/views/generalView');
const { treeView } = require('../controllers/views/treeView')


const preventLogin = (req, res, next) => {
	const { userId } = req.session;

	if (userId)
	{
		return res.redirect('/');
	}

	next();
};
router.get('/login', preventLogin, loginView);
router.get('/register/:userId', registerView);

const loggedUser = (req, res, next) => {
	const { userId } = req.session;

	if (!userId)
	{
		return res.redirect('/login');
	}

	next();
}
router.get('/', loggedUser, homeView);
router.get('/tree', loggedUser, treeView);
router.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			console.error('Error al destruir la sesión:', err);
		}
		
		res.redirect('/login');
	});
});
 
router.use(loggedUser, (req, res, next) => {
	res.status(404).render('404');
});

module.exports = router;
