import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: [{
        type: String,
        required: true
    }],
    brand: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0
    },
    oldPrice: {
        type: Number,
        default: 0,
    },
    categoryName: {
        type: String,
        default: ""
    },
    categoryID: {
        type: String,
        default: ""
    },
    subCategory: {
        type: String,
        default: ""
    },
    subCategoryID: {
        type: String,
        default: ""
    },
    thirdSubCategory: {
        type: String,
        default: ""
    },
    thirdSubCategoryID: {
        type: String,
        default: ""
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    countInStock: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    discount: {
        type: Number,
        required: true,
    },
    productRam: [{
        type: String,
        default: null
    }],
    size: [{
        type: String,
        default: null,
    }],
    productWeight: [{
        type: String,
        default: null
    }],
    dateCreated: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const ProductModel = mongoose.model('product', productSchema);

export default ProductModel;