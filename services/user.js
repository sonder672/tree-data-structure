const bcrypt = require('bcrypt');
const { emailExists, getUserByEmail, getUserById } = require('../database/user/query');
const { addNodeToTree } = require('./tree');
const { saveUser } = require('../database/user/command');

const login = async (email, password) => {
    if (!email || !password)
    {
        throw new Error('parameters are missing to login');
    }

    const user = await getUserByEmail(email);

    if (!user)
    {
        return { statusCode: 400, message: 'incorrect username or password' };
    }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (!isPasswordCorrect)
    {
        return { statusCode: 400, message: 'incorrect username or password' };
    }

    return { statusCode: 200, message: `Welcome back ${user.email}`, userId: user._id, nodeId: user.nodeId };
};

const register = async (email, password, userId) => {
    if (!email || !password || !userId)
    {
        throw new Error('Missing parameters to save the user');
    }

    const [mailExists, user] = await Promise.all([
        emailExists(email),
        getUserById(userId)
    ]);

    if (mailExists)
    {
        return { message: `existing email: ${email}`, statusCode: 400 };
    }

    if (!user)
    {
        throw new Error(`user not found: ID - ${userId}`)
    }

    console.log({user});

    const result = await addNodeToTree(user.nodeId, null);
    if (!result.wasSuccessful)
    {
        return { message: result.message, statusCode: result.statusCode };
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordEncrypt = bcrypt.hashSync(password, salt);
    await saveUser(email, passwordEncrypt, result.idCreatedNode);

    return { message: `user created together with his node. Node id: ${result.idCreatedNode}`, statusCode: 201 }
};

module.exports = { login, register };