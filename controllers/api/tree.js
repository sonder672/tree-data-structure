const express = require('express');
const router = express.Router();
const { deleteNodeToTree, updateNodeToAnotherParent, getAncestryRecursively, getDescendantsRecursively } = require('../../services/tree');

router.get('/search/ascendancy', async (req, res) => {
	try {
        const { nodeId, value } = req.query;

        const result = await getAncestryRecursively(nodeId, value);

        res.status(result.statusCode).json({ message: result.message, ancestry: result.ancestry });
	} catch (error) {
		console.log({error});
		res.status(500).json({ message: 'Ha ocurrido un error interno. Agradecemos tu paciencia' });
	}
});

router.get('/search/descendant', async (req, res) => {
	try {
        const { nodeId, value } = req.query;

        const result = await getDescendantsRecursively(nodeId, value);

        res.status(result.statusCode).json({ message: result.message, descendants: result.descendants });
	} catch (error) {
		console.log({error});
		res.status(500).json({ message: 'Ha ocurrido un error interno. Agradecemos tu paciencia' });
	}
});

router.delete('/delete', async (req, res) => {
	try {
        const { nodeId, value } = req.query;

        const result = await deleteNodeToTree(nodeId, value, req.session.nodeId);

        res.status(result.statusCode).json({ message: result.message });
	} catch (error) {
		console.log({error});
		res.status(500).json({ message: 'Ha ocurrido un error interno. Agradecemos tu paciencia' });
	}
});

router.post('/update', async (req, res) => {
	try {
        const nodeData = req.body;

        const result = await updateNodeToAnotherParent(nodeData, req.session.nodeId);

        res.status(result.statusCode).json({ message: result.message });
	} catch (error) {
		console.log({error});
		res.status(500).json({ message: 'Ha ocurrido un error interno. Agradecemos tu paciencia' });
	}
});

module.exports = { treeController: router };