const mongoose = require('mongoose');
const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        imageUrl: { type: String, required: true },
        imagePublicId: { type: String },
        price: { type: Number, required: true },
        discountPrice: { type: Number },
        countInStock: { type: Number, required: true, default: 0 },
        category: { type: String, required: true },
        specifications: [
            {
                key: { type: String },
                value: { type: String }
            }
        ],
        isFeatured: { type: Boolean, default: false },
        rating: { type: Number, default: 0 },
        purchaseCount: { type: Number, default: 0 }
    },
    { timestamps: true }
);
module.exports = mongoose.model('Product', productSchema);