const { addChildToParentNode, deleteAllReferenceFromNode, updateNodeParent } = require('../database/tree/command');
const { deleteUser } = require('../database/user/command');
const { 
    searchNode, 
    getNodeValueHigherThanCurrent, 
    validateDownwardsNodeExists, 
    getAncestryRecursivelyByNodeId, 
    getDescendantsRecursivelyByNodeId 
} = require('../database/tree/query');

const addNodeToTree = async (parentNodeId, parentNodeValue) => {
    if (!parentNodeId && !parentNodeValue)
    {
        return { statusCode: 400, message: 'missing parent node value', wasSuccessful: false };
    }

    const parentNode = await searchNode(parentNodeId, parentNodeValue);

    if (!parentNode) {
        return { statusCode: 404, message: 'Parent node not found', wasSuccessful: false };
    }

    if (parentNode.numberChildren === 3) {
        return { statusCode: 400, message: 'parent node value you chose already has three children', wasSuccessful: false };
    }

    const newNodeValue = await getNodeValueHigherThanCurrent();
    const idCreatedNode = await addChildToParentNode(newNodeValue, parentNode.id, parentNode.children);

    return { 
        statusCode: 201, 
        message: 'node created and associated with its parent', 
        wasSuccessful: true, 
        idCreatedNode 
    };
};

const deleteNodeToTree = async (nodeToDeleteId, valueToDelete, ownNodeId) => {
    if (!nodeToDeleteId && !valueToDelete && !ownNodeId) {
        return { statusCode: 400, message: 'missing node parameter to delete' };
    }

    const node = await searchNode(nodeToDeleteId, valueToDelete);

    if (!node) {
        return { statusCode: 404, message: 'node not found' };
    }

    if (node._id == ownNodeId) {
        return { statusCode: 400, message: 'You cant delete your own node' };
    }

    if (!node.parentReference) {
        return { statusCode: 400, message: 'You cant delete the root node' };
    }

    if (node.numberChildren > 0) {
        return { statusCode: 400, message: 'the node you are trying to delete has children' };
    }

    await deleteAllReferenceFromNode(node.id, node.parentReference);
    await deleteUser(node.id);

    return { statusCode: 200, message: 'node and all its references removed' };
};

const updateNodeToAnotherParent = async ({ newParentNodeValue, nodeToUpdateId, valueToUpdate }, ownNodeId) => {
    if (!newParentNodeValue || (!nodeToUpdateId && !valueToUpdate) || !ownNodeId)
    {
        return { statusCode: 400, message: 'missing node parameter to move' };
    }

    const [node, newParentNode] = await Promise.all([
        searchNode(nodeToUpdateId, valueToUpdate),
        searchNode(null, newParentNodeValue)
    ]);

    if (!node || !newParentNode) {
        return { statusCode: 404, message: 'node not found' };
    }

    if (node._id == ownNodeId) {
        return { statusCode: 400, message: 'You cant move your own node' };
    }

    if (!node.parentReference) {
        return { statusCode: 400, message: 'You cant move the root node' };
    }

    if (node.id.toString() == newParentNode.id.toString()) {
        return { statusCode: 400, message: 'You cannot move the node to that same node' };
    }

    const childrenAsString = newParentNode.children.map(childId => childId.toString());
    if (childrenAsString.includes(node.id.toString())) {
        return { statusCode: 400, message: 'the node youre trying to add as a parent IS ALREADY the parent' };
    }

    if (newParentNode.numberChildren === 3) {
        return { statusCode: 400, message: 'parent node value you chose already has three children' };
    }

    const nodeExistsDescending = await validateDownwardsNodeExists(node.id, null, newParentNode.id);

    if (nodeExistsDescending) {
        return { statusCode: 400, message: `you cannot move this node (${node.value}) to a child or lower (${newParentNode.value})` };
    }

    await updateNodeParent({ 
        childrenNewParentNode: newParentNode.children, 
        newParentNodeId: newParentNode.id 
    }, node.parentReference, node.id);

    return { statusCode: 200, message: `the node with value ${node.value} is now a child of ${newParentNode.value}` };
};

const getAncestryRecursively = async (nodeId, value) => {
    if (!nodeId && !value) {
        throw new Error('must enter one of two values to search');
    }

    const ancestry = await getAncestryRecursivelyByNodeId(nodeId, value);

    console.log({ancestry});

    if (!ancestry) {
        return { statusCode: 400, message: 'you probably sent a node id or value that was not found' };
    }

    return { statusCode: 200, message: 'successfully brought ancestry', ancestry };
};

const getDescendantsRecursively = async (nodeId, value) => {
    if (!nodeId && !value) {
        throw new Error('must enter one of two values to search');
    }

    const descendants = await getDescendantsRecursivelyByNodeId(nodeId, value);

    if (!descendants) {
        return { statusCode: 400, message: 'you probably sent a node id or value that was not found' };
    }

    return { statusCode: 200, message: 'successfully brought descendant', descendants };
};

module.exports = { 
    addNodeToTree, 
    deleteNodeToTree, 
    updateNodeToAnotherParent, 
    getAncestryRecursively, 
    getDescendantsRecursively 
};