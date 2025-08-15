import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    subtitle: {
        type: String,
        trim: true
    },
    buttonText: {
        type: String,
        trim: true
    },
    link: {
        type: String,
        required: true,
        trim: true
    },
    desktopImage: {
        type: String,
        required: true
    },
    mobileImage: {
        type: String,
    },
    isPublished: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const BannerModel = mongoose.model('Banner', bannerSchema);

export default BannerModel;