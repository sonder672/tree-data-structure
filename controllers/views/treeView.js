const { getUserById } = require('../../database/user/query');

const treeView = async (req, res) => {
    const { userId } = req.session;

    const user = await getUserById(userId);
    
    res.render('tree', { paramUrl: `nodeId=${user.nodeId}` });
};

module.exports = { treeView };