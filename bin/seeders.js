const database = require('../database');
const { TreeModel } = require('../models/tree');
const { UserModel } = require('../models/user');
const bcrypt = require('bcrypt');

const deleteAllData = async () => {
    await UserModel.deleteMany({});
    await TreeModel.deleteMany({});
};

const createRootNode = async () => {
    const newRootNode = new TreeModel({ value: 1 });
    await newRootNode.save();

    return newRootNode._id;
};

const createOwnerUser = async(rootNodeId) => {
    const salt = bcrypt.genSaltSync(10);
    const passwordEncrypt = bcrypt.hashSync('santi', salt);

    const user = new UserModel({ 
        email: 'santi@a.com',
        password: passwordEncrypt,
        nodeId: rootNodeId
    });

    await user.save();
};

const runSeeders = async() => {
    try {
        await database.mongoose.connect(database.DATABASE_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});

        await deleteAllData();
        const rootNodeId = await createRootNode();
        await createOwnerUser(rootNodeId);
    
        console.log('Seeders running');
        process.exit();
    } catch(error)
    {
        console.error(error);
    }
};

runSeeders();