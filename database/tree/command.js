const mongoose = require('mongoose');
const { TreeModel } = require('../../models/tree');

const addChildToParentNode = async(value, parentNodeId, children) => {
    try {
        if (!value || !parentNodeId || !children) {
            throw new Error('parameters are missing to save the node');
        }

        const nodeValue = new TreeModel({ value, parentReference: parentNodeId });
        await nodeValue.save();

        if (!Array.isArray(children)) {
            throw new Error('the children parameter must be an Array');
        }

        children.push(nodeValue._id);
        await TreeModel.findByIdAndUpdate(parentNodeId, { children });

        return nodeValue._id;
    } catch (error) {
        console.error('Error added node:', error);
        throw error;
    }
};

const deleteAllReferenceFromNode = async(idNodeToDelete, parentIdReference) => {
    if (!idNodeToDelete || !parentIdReference) {
        throw new Error('parameters are missing to save the node');
    }

    const [nodeToDelete, parentNode] = await Promise.all([
        TreeModel
            .findById(idNodeToDelete)
            .select('_id value')
            .lean(),
        TreeModel
            .findById(parentIdReference)
            .select('_id children')
            .lean()
    ]);

    const nodesToUpdateTheirValue = await TreeModel
    .find({ value: { $gt: nodeToDelete.value } });

    console.log({nodesToUpdateTheirValue});
    
    const updatedChildren = parentNode.children.filter(children => children.toString() != idNodeToDelete.toString());
    console.log({oldChildren: parentNode.children});
    console.log({updatedChildren});

    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        await TreeModel.findByIdAndUpdate(parentIdReference, { children: updatedChildren });
        await TreeModel.findByIdAndRemove(idNodeToDelete, {});

        const updatePromises = nodesToUpdateTheirValue.map(async (node, index) => {
            const newValue = nodeToDelete.value + index;
            await TreeModel.findByIdAndUpdate(node._id, { value: newValue });
        });
        await Promise.all(updatePromises);

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();

        throw error;
    } finally {
        session.endSession();
    }
};

const updateNodeParent = async({childrenNewParentNode, newParentNodeId}, oldParentNodeId, nodeId) => {
    if (!childrenNewParentNode, !newParentNodeId || !oldParentNodeId || !nodeId) {
        throw new Error('parameters are missing to move the node');
    }

    if (!Array.isArray(childrenNewParentNode)) {
        throw new Error('the children parameter must be an Array');
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const oldParentNode = await TreeModel.findById(oldParentNodeId)
            .select('_id children')
            .lean();
        const updatedChildren = oldParentNode.children.filter(children => children.toString() != nodeId.toString());
        await TreeModel.findByIdAndUpdate(oldParentNodeId, { children: updatedChildren });

        childrenNewParentNode.push(nodeId);
        await TreeModel.findByIdAndUpdate(newParentNodeId, { children: childrenNewParentNode });
        
        await TreeModel.findByIdAndUpdate(nodeId, { parentReference: newParentNodeId });

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();

        throw error;
    } finally {
        session.endSession();
    }
};

module.exports = { addChildToParentNode, deleteAllReferenceFromNode, updateNodeParent };