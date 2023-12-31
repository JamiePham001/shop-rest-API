const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// reference to product model
const Product = require('../models/product');

// get a list of all products
router.get('/', (req, res, next) => {
    Product.find()
    // display specific values
    .select('name price _id')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length, 
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    // create url link
                    request: {
                        type: 'GET',
                        url: 'http://localhost:5000/products/' + doc._id
                    }
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

// add a product to list
router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name, 
        price: req.body.price
    });
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: "Created product successfully",
            createdProduct: {
                name: result.name,
                price: result.name,
                _id: result._id,
                request: {
                    type: 'GET',
                    url:'http://localhost:5000/products/' + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });

});


// get a product via ID
router.get('/:productId', (req,res, next) =>{
    const id = req.params.productId;
    Product.findById(id).select('name price _id').exec().then(doc => {
        console.log("From database",doc);
        if (doc) {
            res.status(200).json({
                product: doc,
                requset: {
                    type: 'GET',
                    url: 'http://localhost:5000/products'
                }
            });
        } else {
            res.status(404).json({message: 'No valid entry found for provided ID'});
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

// update item via ID
router.patch('/:productId', (req,res, next) =>{
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.findOneAndUpdate({_id: id}, {$set: updateOps})
    .select('name price _id')
    .exec()
    .then(result => {
        res.status(200).json({
            // BUG* text not appearing
            message: 'Product updated!',
            request: {
                type: 'GET',
                url: 'http://localhost:5000/products/' + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

// delete item via ID
router.delete('/:productId', (req,res, next) =>{
    const id = req.params.productId;
    Product.deleteOne({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'product deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:5000/products',
                body: { name: 'String', price: 'Number'}
            }
        })
    })
    .catch(err => {
        console.log(err);
        // if (docs.length >= 0) {
        res.status(200).json*(docs);
        // } else {
        //    res.status(404).json({
        //        message: "no entries found"
        //    })
        // };
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;