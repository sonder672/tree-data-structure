const mongoose = require('mongoose');

const nodeSchema  = new mongoose.Schema({
    value: { 
        type: Number, 
        required: true, 
        unique: true 
    },
    parentReference: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Node'
    },
    children: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Node', 
        required: false, 
        default: [] 
    }]
});

const TreeModel = mongoose.model('Node', nodeSchema );

module.exports = { TreeModel };