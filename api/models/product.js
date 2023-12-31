const mongoose = require('mongoose');


// defines what a product looks like
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true}, 
    price: { type: Number, required: true}
});

module.exports = mongoose.model('Product', productSchema);