const { UserModel, UserRegistrationLogModel } = require('../../models/user');

const saveUser = async (email, password, nodeId) => {
    if (!email || !password || !nodeId)
    {
        throw new Error('Missing parameters to save the user');
    }

    const user = new UserModel({
        email,
        password,
        nodeId
    });

    await user.save();

    const userLog = new UserRegistrationLogModel({
        userId: user._id,
        is_deleted: false
    });

    await userLog.save();
};

const deleteUser = async(nodeId) => {
    if (!nodeId)
    {
        throw new Error('Missing parameters to delete the user');
    }

    const deletedUser = await UserModel.findOneAndRemove({ nodeId }, {});
    await UserRegistrationLogModel.findOneAndUpdate({ userId: deletedUser._id }, { is_deleted: true });
};

module.exports = { saveUser, deleteUser };