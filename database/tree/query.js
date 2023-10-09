const { TreeModel } = require('../../models/tree');

const searchNode = async(nodeId, value) => {
    if (!nodeId && !value) {
        throw new Error('must enter one of two values to search');
    }

    const query = {};

    if (nodeId) {
       query._id = nodeId; 
    } else {
        query.value = value;
    }

    const node = await TreeModel
        .findOne(query)
        .lean();

    if (!node) {
        return null;
    }

    return {
        id: node._id,
        value: node.value,
        children: node.children,
        numberChildren: node.children.length,
        parentReference: node.parentReference
    };
};

const nodeExists = async(id) => {
    const node = await TreeModel
        .findById(id);

    if (node) return true;

    return false;
};

const getNodeValueHigherThanCurrent = async() => {
    const valueHigher = await TreeModel
        .findOne({}, { value: 1 })
        .sort({ value: -1 });

    const newValue = valueHigher ? parseInt(valueHigher.value) + 1 : 1;

    return newValue;
};

const validateDownwardsNodeExists = async (nodeId, value, nodeToSearch) => {
    if ((!nodeId && !value) || !nodeToSearch)
    {
        throw new Error('must enter one of two values to search');
    }

    const query = {};

    if (nodeId) {
       query._id = nodeId; 
    } else {
        query.value = value;
    }

    const node = await TreeModel.findOne(query).lean();

    if (!node) {
        throw new Error(`Node with ID ${nodeId} and/or value ${value} not found.`);
    }

    if (node._id.toString() === nodeToSearch.toString())
    {
        return true;
    }

    if (!node.children || node.children.length === 0) {
        return false;
    }

    for (const childNodeId of node.children) {
        const childDescendant = await validateDownwardsNodeExists(childNodeId, null, nodeToSearch);
        if (childDescendant) {
            return true;
        }
    }

    return false;
};

const getAncestryRecursivelyByNodeId = async (nodeId, value, ancestry = []) => {
    if (!nodeId && !value)
    {
        throw new Error('must enter one of two values to search');
    }

    const query = {};

    if (nodeId) {
       query._id = nodeId; 
    } else {
        query.value = value;
    }

    const node = await TreeModel.findOne(query).lean();

    if (!node) {
        return null;
    }

    ancestry.push({ 
        nodeId: node._id, 
        value: node.value, 
        position: ancestry.length 
    });

    if (!node.parentReference) {
        return ancestry;
    }

    //*recursive
    return getAncestryRecursivelyByNodeId(node.parentReference, null, ancestry);
};

const getDescendantsRecursivelyByNodeId = async (nodeId, value) => {
    if (!nodeId && !value) {
        throw new Error('must enter one of two values to search');
    }

    const query = {};

    if (nodeId) {
        query._id = nodeId;
    } else {
        query.value = value;
    }

    const node = await TreeModel.findOne(query).lean();

    if (!node) {
        return null;
    }

    const descendants = {
        nodeId: node._id,
        value: node.value,
        children: []
    };

    if (!node.children || node.children.length === 0) {
        return descendants;
    }

    for (const childNodeId of node.children) {
        const childDescendant = await getDescendantsRecursivelyByNodeId(childNodeId, null);
        if (childDescendant) {
            descendants.children.push(childDescendant);
        }
    }

    return descendants;
};

module.exports = { 
    searchNode, 
    getNodeValueHigherThanCurrent, 
    nodeExists, 
    validateDownwardsNodeExists,
    getAncestryRecursivelyByNodeId, 
    getDescendantsRecursivelyByNodeId 
};