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

        // Sports-specific fields
        brand: { type: String }, // e.g., Nike, Adidas, Puma, Under Armour
        sport: { type: String }, // e.g., Basketball, Football, Running, Tennis
        sizes: [{ type: String }], // e.g., ['S', 'M', 'L', 'XL'] or ['8', '9', '10'] for shoes
        colors: [{ type: String }], // e.g., ['Black', 'White', 'Red']
        gender: {
            type: String,
            enum: ['Men', 'Women', 'Unisex', 'Kids'],
            default: 'Unisex'
        },
        material: { type: String }, // e.g., Cotton, Polyester, Synthetic Leather
        ageGroup: {
            type: String,
            enum: ['Adult', 'Youth', 'Kids'],
            default: 'Adult'
        },

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