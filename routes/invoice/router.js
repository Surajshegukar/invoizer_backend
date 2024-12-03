const express = require('express');
const router = express.Router();
const InvoiceModel = require('../../models/InvoiceModel');
const fetchUser = require('../../middleware/fetchUser');

router.post('/add-invoice',fetchUser, async(req, res) => {

    try{
        const {
            invoiceNumber,
            invoiceDate,
            studentId,
            items,
            totalAmount,
            totalDiscountedAmount,
            recivedAmount,
            balanceAmount,
            
        } = req.body;
    
        if (!invoiceNumber || !invoiceDate || !studentId || !items) {
            return res.status(400).json({ data: 'All fields are required' });
        }
    
        if (items.length === 0) {
            return res.status(400).json({ data: 'Items are required' });
        }
    
        const invoice = new InvoiceModel({
            invoiceNumber,
            invoiceDate,
            studentId,
            items,
            totalAmount,
            totalDiscountedAmount,
            recivedAmount,
            balanceAmount,
            user: req.id
        });
    
        await invoice.save();
    
        return res.status(200).json({
            data: 'Invoice created successfully',
            data: {
                invoiceNumber,
                invoiceDate,
                studentId,
                items,
                totalAmount,
                totalDiscountedAmount,
                recivedAmount,
                balanceAmount
            }
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            data: error.message
        });
    }
});


// get all invoices
router.get('/get-all-invoices',fetchUser, async(req, res) => {
    try {
        const invoices = await InvoiceModel.find({
            user: req.id
        });
        return res.status(200).json({
            success: true,
            data: invoices
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: error.message
        });
    }
});


//get latest 20 invoices

router.get('/get-lastest-invoices',fetchUser, async(req, res) => {
    try {
        const invoices = await InvoiceModel.find({
            user: req.id
        }).sort({ createdAt: -1 }).limit(20);
        return res.status(200).json({
            success: true,
            data: invoices
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: error.message
        });
    }
});

//get single invoice

router.get('/get-invoice/:id',fetchUser, async(req, res) => {
    try {
        
        const invoice = await InvoiceModel.findById(req.params.id);
        
        if (invoice.user.toString() !== req.id) {
            return res.status(401).json({
                success: false,
                data: 'Not authorized to access this route'
            });
        }

        if (!invoice) {
            return res.status(404).json({
                success: false,
                data: 'Invoice not found'
            });
        }
        return res.status(200).json({
            success: true,
            data: invoice
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: error.message
        });
    }

});

//get invoices by student id

router.get('/get-invoices-by-student-id/:id',fetchUser, async(req, res) => {

    try {
        const invoices = await InvoiceModel.find({ studentID: req.params.id,
            user: req.id
         });
        
        if (invoices.length === 0) {
            return res.status(404).json({
                success: false,
                data: 'Invoices not found'
            });
        }
        return res.status(200).json({
            success: true,
            data: invoices
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            data: error.message
        });
    }

});

//get invoices by student name

router.get('/get-invoices-by-student-name/:name',fetchUser, async(req, res) => {
    
        try {
            const invoices = await InvoiceModel.find({studentId: req.params.name,
                user: req.id
            });
            if (invoices.length === 0) {
                return res.status(404).json({
                    success: false,
                    data: 'Invoices not found'
                });
            }
            return res.status(200).json({
                name: req.params.name,
                success: true,
                data: invoices
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                data: error.message
            });
        }
    
});

//get invoices by student class

router.get('/get-invoices-by-student-class/:class',fetchUser, async(req, res) => {


    try {
    
        
        // find the invoices where student class is equal to the classv where invoice is created using student object id refers to student model and studentClass field is not exsist in ivoice model
        const invoices = await InvoiceModel({studentId:req.params.class})
        
        if (invoices.length === 0) {
            return res.status(404).json({
                success: false,
                data: 'Invoices not found'
            });
        }
        return res.status(200).json({
            success: true,
            data: invoices
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            data: error.message
        });
    }

});

//get invoices by invoice date

router.get('/get-invoices-by-invoice-date/:date',fetchUser, async(req, res) => {
        
    try {
        const invoices = await InvoiceModel.find({ invoiceDate: req.params.date,
            user: req.id
         });
        if (invoices.length === 0) {
            return res.status(404).json({
                success: false,
                data: 'Invoices not found'
            });
        }
        return res.status(200).json({
            success: true,
            data: invoices
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            data: error.message
        });
    }

});

//get invoices by invoice number

router.get('/get-invoices-by-invoice-number/:number',fetchUser, async(req, res) => {

    try {
        const invoices = await InvoiceModel.find({ invoiceNumber: req.params.number,
            user: req.id
         });
        if (invoices.length === 0) {
            return res.status(404).json({
                success: false,
                data: 'Invoices not found'
            });
        }
        return res.status(200).json({
            success: true,
            data: invoices
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            data: error.message
        });
    }
    
});

// get invoices by month and year   

router.get('/get-invoices-by-month-year/:month/:year',fetchUser, async(req, res) => {
    try {
        const invoices = await InvoiceModel.find({ invoiceDate: { $regex: `${req.params.month}-${req.params.year}` },
            user: req.id});
        if (invoices.length === 0) {
            return res.status(404).json({
                success: false,
                data: 'Invoices not found'
            });
        }
        return res.status(200).json({
            success: true,
            data: invoices
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            data: error.message
        });
    }
}
);

//get invoices by date range

router.get('/get-invoices-by-date-range/:from/:to',fetchUser, async(req, res) => {

    try {
        const invoices = await InvoiceModel.find({ invoiceDate: { $gte: req.params.from, $lte: req.params.to }
        , user: req.id });
        if (invoices.length === 0) {
            return res.status(404).json({
                success: false,
                data: 'Invoices not found'
            });
        }
        return res.status(200).json({
            success: true,
            data: invoices
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            data: error.message
        });
    }

});


//update invoice

router.put('/update-invoice/:id',fetchUser, async(req, res) => {
    try {
        const invoiceExists = await InvoiceModel.findById(req.params.id);
        if (invoiceExists.user.toString() !== req.id) {
            return res.status(401).json({
                success: false,
                data: 'Not authorized to access this route'
            });
        }

        const {
            invoiceNumber,
            invoiceDate,
            studentName,
            studentContact,
            studentID,
            studentClass,
            items,
            totalAmount,
            recivedAmount,
            balanceAmount
        } = req.body;
        if (!invoiceNumber || !invoiceDate || !studentName || !studentContact || !studentID || !studentClass || !items ) {
            return res.status(400).json({ data: 'All fields are required' });
        }
        if (items.length === 0) {
            return res.status(400).json({ data: 'Items are required' });
        }
        let invoice = await InvoiceModel.findById(req.params.id);
        if (!invoice) {
            return res.status(404).json({
                success: false,
                data: 'Invoice not found'
            });
        }
        invoice = await InvoiceModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });
        return res.status(200).json({
            success: true,
            data: invoice
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: error.message
        });
    }
});

//delete invoice

router.delete('/delete-invoice/:id',fetchUser, async(req, res) => {
    try {
        const invoice = await InvoiceModel.findById(req.params.id);
        if (invoice.user.toString() !== req.id) {
            return res.status(401).json({
                success: false,
                data: 'Not authorized to access this route'
            });
        }
        if (!invoice) {
            return res.status(404).json({
                success: false,
                data: 'Invoice not found'
            });
        }
        await InvoiceModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            success: true,
            data: 'Invoice deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: error.message
        });
    }
});

module.exports = router;

