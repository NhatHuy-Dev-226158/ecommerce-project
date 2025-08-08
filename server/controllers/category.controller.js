import CategoryModel from '../models/category.model.js';

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

var imagesArr = [];
export async function updatedImages(request, response) {
    try {
        imagesArr = [];

        const image = request.files;
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false,
        };

        for (let i = 0; i < image?.length; i++) {
            const img = await cloudinary.uploader.upload(
                image[i].path,
                options,
                function (error, result) {
                    imagesArr.push(result.secure_url);
                    fs.unlinkSync(`uploads/${request.files[i].filename}`);
                }
            );
        }

        return response.status(200).json({
            message: "Successfully.",
            success: true,
            data: {
                images: imagesArr
            }
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function createCategory(request, response) {
    try {
        let category = new CategoryModel({
            name: request.body.name,
            images: imagesArr,
            parentId: request.body.parentId,
            parentCatName: request.body.parentCatName,
        })

        if (!category) {
            return response.status(500).json({
                message: "Category not created",
                error: true,
                success: false
            })
        }

        category = await category.save();
        imagesArr = []

        return response.status(200).json({
            message: "Successfully",
            error: false,
            success: true,
            category: category
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function getCategories(request, response) {
    try {
        const categories = await CategoryModel.find();
        const categoryMap = {};
        const rootCategories = [];

        categories.forEach(cat => {
            categoryMap[cat._id] = { ...cat._doc, children: [] }
        });

        categories.forEach(cat => {
            if (cat.parentId) {
                categoryMap[cat.parentId].children.push(categoryMap[cat._id]);
            } else {
                rootCategories.push(categoryMap[cat._id])
            }
        })

        return response.status(200).json({
            error: false,
            success: true,
            data: rootCategories
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function getCategoriesCount(request, response) {
    try {
        const categoryCount = await CategoryModel.countDocuments({ parentId: undefined });
        if (!categoryCount) {
            response.status(500).json({
                error: true,
                success: false
            });
        } else {
            response.send({
                categoryCount: categoryCount
            });
        }

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function getSubCatehoriesCount(request, response) {
    try {
        const categories = await CategoryModel.find();
        if (!categories) {
            response.status(500).json({
                error: true,
                success: false
            });
        } else {
            const subCatList = [];
            for (let cat of categories) {
                if (cat.parentId !== null) {
                    subCatList.push(cat);
                }
            }
            return response.status(200).json({
                message: `Found ${subCatList.length} sub-categories.`,
                error: false,
                success: true,
                data: {
                    count: subCatList.length,
                    subCategories: subCatList
                }
            });
        }

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function getCategory(request, response) {
    try {
        const category = await CategoryModel.findById(request.params.id);
        if (!category) {
            return response.status(500).json({
                message: "The category with the given Id was not found ",
                error: true,
                success: false
            });
        }
        return response.status(200).json({
            error: false,
            success: true,
            category: category
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function removeImageFromCloudinary(request, response) {

    // try {
    //     const userId = request.userId;
    //     const user = await UserModel.findById(userId);

    //     if (!user) {
    //         return response.status(404).json({
    //             message: "User not found." 
    //         });
    //     }

    //     const imgUrl = user.avatar;

    //     if (!imgUrl) {
    //         return response.status(400).json({ 
    //             message: "No avatar to delete." 
    //         });
    //     }

    //     const urlArr = imgUrl.split("/");
    //     const imageFile = urlArr[urlArr.length - 1];
    //     const publicId = imageFile.split(".")[0];

    //     await cloudinary.uploader.destroy(publicId);

    //     user.avatar = ""; 
    //     await user.save(); 


    //     return response.status(200).json({
    //         message: "Avatar removed successfully.",
    //         success: true,
    //         error: false
    //     });

    // } catch (error) {
    //     return response.status(500).json({
    //         message: "An internal server error occurred.",
    //         error: true,
    //         success: false
    //     });
    // }


    const imgUrl = request.query.img;
    const urlArr = imgUrl.split("/");
    const image = urlArr[urlArr.length - 1];
    const imageName = image.split(".")[0];

    if (imageName) {
        const res = await cloudinary.uploader.destroy(
            imageName,
            (error, result) => {

            }
        );

        if (res) {
            response.status(200).send(res);
        }
    }
}

export async function deleteCategory(request, response) {
    const category = await CategoryModel.findById(request.params.id);
    const images = category.images;

    let img = "";

    for (img of images) {
        const imgUrl = img;
        const urlArr = imgUrl.split("/");
        const image = urlArr[urlArr.length - 1];
        const imageName = image.split(".")[0];

        if (imageName) {
            cloudinary.uploader.destroy(imageName, (error, result) => {

            });
        }
    }
    const subCategory = await CategoryModel.find({ parentId: request.params.id });

    for (let i = 0; i < subCategory.length; i++) {

        const thirdsubCategory = await CategoryModel.find({
            parentId: subCategory[i]._id
        });

        for (let i = 0; i < thirdsubCategory.length; i++) {
            const deletedThirdSubCat = await CategoryModel.findByIdAndDelete(thirdsubCategory[i]._id);
        }

        const deletedSubCat = await CategoryModel.findByIdAndDelete(subCategory[i]._id);
    }

    const deletedCat = await CategoryModel.findByIdAndDelete(request.params.id);

    if (!deletedCat) {
        return response.status(404).json({
            message: "Category not found",
            error: true,
            success: false,
        });
    }
    return response.status(200).json({
        message: "Category deleted",
        error: false,
        success: true,
    });
}

export async function updateCategory(request, response) {

    const category = await CategoryModel.findByIdAndUpdate(
        request.params.id,
        {
            name: request.body.name,
            images: imagesArr.length > 0 ? imagesArr[0] : request.body.images,
            parentId: request.body.parentId,
            parentCatName: request.body.parentCatName,
        },
        { new: true }
    );
    if (!category) {
        return response.status(500).json({
            message: "Category not found",
            error: true,
            success: false,
        });
    }

    imagesArr = [];

    return response.status(200).json({
        error: true,
        success: false,
        category: category
    });

}