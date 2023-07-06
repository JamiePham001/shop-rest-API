const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');

// Handle incoming GET requests to /orders
router.get('/', (req, res, next) => {
    Order
    .find()
    .select('product quantity _id')
    .exec()
    .then(docs => {
        res.status(200).json(
            {
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quanitity,
                        request: {
                            type: 'GET',
                            url: 'http//localhost:5000/orders/' +doc._id
                        }
                    }
                    
                }),
            }
        );
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
});

router.post('/', (req, res, next) => {
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    });
    order
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json(
            {
                message: 'orders stored',
                createdOrder: {
                    _id: result._id,
                    product: result.product.ObjectId,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http//localhost:5000/orders/' +result._id
                }
            }
        );
    })
    .catch(err => {
        console.log(err);
        res.staus(500).json({
            error: err
        });
    });
});

router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        message:'order details',
        orderId: req.params.orderId
    });
});

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message:'order deleted',
        orderId: req.params.orderId
    });
});


module.exports = router;