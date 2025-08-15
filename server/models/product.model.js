import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
    },
    richDescription: {
        type: String,
        default: ''
    },
    images: [{
        type: String,
    }],
    brand: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0,
        required: true
    },
    oldPrice: {
        type: Number,
        default: 0,
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0
    },
    rating: {
        type: Number,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    sale: {
        discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
        discountValue: { type: Number, default: 0 }
    },
    attributes: [{
        name: String,
        values: [String]
    }],
    variants: [{
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }],

}, { timestamps: true });

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
productSchema.set('toJSON', {
    virtuals: true,
});


const ProductModel = mongoose.model('Product', productSchema); // Đổi tên thành 'Product' (viết hoa)

export default ProductModel;