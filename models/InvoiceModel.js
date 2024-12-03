const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true
    },
    invoiceNumber: {
        type: String,
        required: [true, 'Invoice number is required'],
        unique: true
    },

    invoiceDate: {
        type: Date,
        required: [true, 'Invoice date is required']
    },

    studentId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentModel',
        required: true
    },


    items: [
        {
            itemId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ItemModel',
                required: true
            },
            dividend: {
                type: Number,
                required: true
            },
            discount: {
                type: Number,
                required: true
            },
            amount:{
                type:Number,
                required:true
            }
        }
    ],

    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required']
    },

    totalDiscountedAmount: {
        type: Number,
        required: [true, 'Total discount is required']
    },

    recivedAmount: {
        type: Number,
        required: [false, 'Recived amount is required']
    },

    balanceAmount: {
        type: Number,
        required: [false, 'Balance amount is required']
    }

});

module.exports = mongoose.model('Invoice', InvoiceSchema);


