import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    images: [{
        type: String,
    }],
    parentCatName: {
        type: String,
        default: ''
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    seoTitle: {
        type: String,
        trim: true,
        default: ''
    },
    seoDescription: {
        type: String,
        trim: true,
        default: ''
    },
    slug: {
        type: String,
        trim: true,
        default: ''
    }
}, { timestamps: true });

const CategoryModel = mongoose.model('Category', categorySchema);

export default CategoryModel;