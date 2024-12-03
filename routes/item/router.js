const express = require('express');
const ItemModel = require('../../models/ItemModel');
const router = express.Router();
const fetchUser = require('../../middleware/fetchUser');

router.get('/get-items',fetchUser, async(req, res) => {
    try{
        const items = await ItemModel.find({user: req.id});
        return res.status(200).json({
            sucess: true,
            message: 'Items fetched successfully',
            data: items
        });
    }
    catch(error){
        return res.status(500).json({
            sucess: false,
            message: 'Server error'
        });
    }
});

router.post('/add-item',fetchUser, async(req, res) => {
    try{
        const {itemName, fees} = req.body;

        if(!itemName || !fees ){
            return res.status(400).json({
                sucess: false,
                message: 'All fields are required'
            });
        }

        const item = new ItemModel({
            itemName,
            fees,
            user: req.id
        });


        await item.save();
        return res.status(200).json({
            sucess: true,
            message: 'Item added successfully',
            data: item
        });
    }
    catch(error){
        return res.status(500).json({
            sucess: false,
            message: 'Server error'
        });
    }
}
);

router.put('/update-item/:id',fetchUser, async(req, res) => {
    try{
        
        const isItemExist =await ItemModel.findOne({_id: req.params.id});

        if(isItemExist.user.toString() !== req.id){
            return res.status(401).json({
                sucess: false,
                message: 'You are not authorized to update this item',
                

            });
        }

        const {itemName, fees} = req.body;

        if(!itemName || !fees ){
            return res.status(400).json({
                sucess: false,
                message: 'All fields are required'
            });
        }

        const item = await ItemModel.findByIdAndUpdate(req.params.id, {
            itemName,
            fees,
        }, {new: true});

        return res.status(200).json({
            sucess: true,
            message: 'Item updated successfully',
            data: item
            
        });
    }
    catch(error){
        res.status(500).json({
            sucess: false,
            message: 'Server error'
        });
    }
}

);

router.delete('/delete-item/:id',fetchUser, async(req, res) => {
    try{

        const item = await ItemModel.findById(req.params.id);
        if(item.user.toString() !== req.id){
            return res.status(401).json({
                sucess: false,
                message: 'You are not authorized to delete this item',                
            });

        }
        
        await ItemModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            sucess: true,
            message: 'Item deleted successfully'
        });
    }
    catch(error){
        return res.status(500).json({
            sucess: false,
            message: `Server error : ${error.message}`
        });
    }
}
);

module.exports = router;

