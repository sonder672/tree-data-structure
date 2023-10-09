const express = require('express');
const router = express.Router();
const { login, register } = require('../../services/user');

router.post('/login', async (req, res) => {
    try { 
        const { email, password } = req.body;

        const result = await login(email, password);

        if (result.userId)
        {
            req.session.userId = result.userId;
            req.session.nodeId = result.nodeId;
        }

        res.status(result.statusCode).json({ message: result.message });
    } catch (error) {
        console.error('Error login:', error);
        res.status(500).json({ message: 'Ha ocurrido un error interno. Agradecemos tu paciencia' });
    }
});

router.post('/register', async (req, res) => {
    try { 
        const { email, password, userId } = req.body;

        const result = await register(email, password, userId);

        res.status(result.statusCode).json({ message: result.message });
    } catch (error) {
        console.error('Error user register:', error);
        res.status(500).json({ message: 'Ha ocurrido un error interno. Agradecemos tu paciencia' });
    }
});

module.exports = { userController: router };