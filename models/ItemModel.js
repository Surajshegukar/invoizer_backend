const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    itemName: {
        type: String,
        required: [true, 'Item name is required']
    },
    
    fees: {
        type: Number,
        required: [true, 'fees is required']
    },
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true
    }
});

module.exports = mongoose.model('Item', ItemSchema);