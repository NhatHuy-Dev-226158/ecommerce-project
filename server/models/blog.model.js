// File: models/blog.model.js
import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    featuredImage: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    tags: [{ type: String, trim: true }],
    isPublished: { type: Boolean, default: false },
    views: { type: Number, default: 0 }
}, { timestamps: true });

// Middleware để tự động tạo slug
blogSchema.pre('validate', function (next) {
    if (this.title && this.isModified('title')) {
        this.slug = this.title.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            + '-' + Date.now();
    }
    next();
});

const BlogModel = mongoose.model('Blog', blogSchema);
export default BlogModel;