import ProductModel from '../models/product.model.js';

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

export async function createProduct(request, response) {
    try {
        let product = new ProductModel({
            name: request.body.name,
            description: request.body.description,
            images: imagesArr,
            brand: request.body.brand,
            price: request.body.price,
            oldPrice: request.body.oldPrice,
            categoryName: request.body.categoryName,
            categoryID: request.body.categoryID,
            subCategory: request.body.subCategory,
            subCategoryID: request.body.subCategoryID,
            thirdSubCategory: request.body.thirdSubCategory,
            thirdSubCategoryID: request.body.thirdSubCategoryID,
            countInStock: request.body.countInStock,
            rating: request.body.rating,
            isFeatured: request.body.isFeatured,
            discount: request.body.discount,
            productRam: request.body.productRam,
            size: request.body.size,
            productWeight: request.body.productWeight,
        })

        product = await product.save();

        if (!product) {
            return response.status(500).json({
                message: "Product not created",
                error: true,
                success: false
            });
        }

        imagesArr = [];

        return response.status(200).json({
            message: "Product created successfully",
            error: false,
            success: true,
            product: product
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function getAllProduct(request, response) {
    try {
        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage);
        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                success: false,
                error: true
            });
        }

        const products = await ProductModel.find().populate("category")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();

        if (!products) {
            return response.status(500).json({
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            error: false,
            success: true,
            products: products,
            totalPages: totalPages,
            page: page
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//Lấy tất cả sản phẩm theo id của category
export async function getAllProductByCatId(request, response) {
    try {
        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 1000;
        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                success: false,
                error: true
            });
        }

        const products = await ProductModel.find({
            categoryID: request.params.id
        })
            .populate("category")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();

        if (!products) {
            return response.status(500).json({
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            error: false,
            success: true,
            products: products,
            totalPages: totalPages,
            page: page
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//Lấy tất cả sản phẩm theo tên của category
export async function getAllProductByCatName(request, response) {
    try {
        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 1000;
        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                success: false,
                error: true
            });
        }

        const products = await ProductModel.find({
            categoryName: request.query.categoryName
        })
            .populate("category")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();

        if (!products) {
            return response.status(500).json({
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            error: false,
            success: true,
            products: products,
            totalPages: totalPages,
            page: page
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//Lấy tất cả sản phẩm theo id của subCategory
export async function getAllProductBySubCatId(request, response) {
    try {
        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 1000;
        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                success: false,
                error: true
            });
        }

        const products = await ProductModel.find({
            subCategoryID: request.params.id
        })
            .populate("category")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();

        if (!products) {
            return response.status(500).json({
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            error: false,
            success: true,
            products: products,
            totalPages: totalPages,
            page: page
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//Lấy tất cả sản phẩm theo tên của SubCategory
export async function getAllProductBySubCatName(request, response) {
    try {
        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 1000;
        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                success: false,
                error: true
            });
        }

        const products = await ProductModel.find({
            subCategory: request.query.subCategory
        })
            .populate("category")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();

        if (!products) {
            return response.status(500).json({
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            error: false,
            success: true,
            products: products,
            totalPages: totalPages,
            page: page
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//Lấy tất cả sản phẩm theo id của ThirdLavelCatId
export async function getAllProductByThirdLavelCatId(request, response) {
    try {
        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 1000;
        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                success: false,
                error: true
            });
        }

        const products = await ProductModel.find({
            thirdSubCategoryID: request.params.id
        })
            .populate("category")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();

        if (!products) {
            return response.status(500).json({
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            error: false,
            success: true,
            products: products,
            totalPages: totalPages,
            page: page
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//Lấy tất cả sản phẩm theo tên của ThirdLavelCatName
export async function getAllProductByThirdLavelCatName(request, response) {
    try {
        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 1000;
        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                success: false,
                error: true
            });
        }

        const products = await ProductModel.find({
            thirdSubCategory: request.query.thirdSubCategory
        })
            .populate("category")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();

        if (!products) {
            return response.status(500).json({
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            error: false,
            success: true,
            products: products,
            totalPages: totalPages,
            page: page
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//Lấy tất cả sản phẩm theo giá
export async function getAllProductByPrice(request, response) {
    try {
        let productlist = [];

        if (request.query.categoryID !== "" && request.query.categoryID !== undefined) {
            const productlistArr = await ProductModel.find({
                categoryID: request.query.categoryID,
            }).populate("category");

            productlist = productlistArr;
        }

        if (request.query.subCategoryID !== "" && request.query.subCategoryID !== undefined) {
            const productlistArr = await ProductModel.find({
                subCategoryID: request.query.subCategoryID,
            }).populate("category");

            productlist = productlistArr;
        }

        if (request.query.thirdSubCategoryID !== "" && request.query.thirdSubCategoryID !== undefined) {
            const productlistArr = await ProductModel.find({
                thirdSubCategoryID: request.query.thirdSubCategoryID,
            }).populate("category");

            productlist = productlistArr;
        }

        const filteredProducts = productlist.filter((product) => {
            if (request.query.minPrice && product.price < parseInt(request.query.minPrice)) {
                return false;
            }
            if (request.query.maxPrice && product.price > parseInt(request.query.maxPrice)) {
                return false;
            }
            return true;
        });

        return response.status(200).json({
            error: false,
            success: true,
            products: filteredProducts,
            totalPages: 0,
            page: 0,
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//Lấy tất cả sản phẩm theo số sao đánh giá
export async function getAllProductByRating(request, response) {
    try {
        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 1000;
        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                success: false,
                error: true
            });
        }

        let products = [];

        if (request.query.categoryID !== undefined) {
            products = await ProductModel.find({
                rating: request.query.rating,
                categoryID: request.query.categoryID,
            })
                .populate("category")
                .skip((page - 1) * perPage)
                .limit(perPage)
                .exec();
        }

        if (request.query.subCategoryID !== undefined) {
            products = await ProductModel.find({
                rating: request.query.rating,
                subCategoryID: request.query.subCategoryID,
            })
                .populate("category")
                .skip((page - 1) * perPage)
                .limit(perPage)
                .exec();
        }

        if (request.query.thirdSubCategoryID !== undefined) {
            products = await ProductModel.find({
                rating: request.query.rating,
                thirdSubCategoryID: request.query.thirdSubCategoryID,
            })
                .populate("category")
                .skip((page - 1) * perPage)
                .limit(perPage)
                .exec();
        }

        if (!products) {
            return response.status(500).json({
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            error: false,
            success: true,
            products: products,
            totalPages: totalPages,
            page: page
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//Số lượng sản phẩm
export async function getProductCount(request, response) {
    try {
        const productCount = await ProductModel.countDocuments();

        if (!productCount) {
            return response.status(400).json({
                error: true,
                success: false,
            });
        }
        return response.status(200).json({
            error: false,
            success: true,
            productCount: productCount
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }

}

export async function getAllFeaturedProducts(request, response) {
    try {
        const products = await ProductModel.find({
            isFeatured: true
        }).populate("category");

        if (!products) {
            return response.status(500).json({
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            error: false,
            success: true,
            products: products,
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function deleteProduct(request, response) {
    try {
        const product = await ProductModel.findById(request.params.id).populate("category");

        if (!product) {
            return response.status(404).json({
                message: "Product Not found",
                error: true,
                success: false
            })
        }

        const images = product.images;
        let img = "";
        for (img of images) {
            const imgUrl = img;
            const urlArr = imgUrl.split("/");
            const image = urlArr[urlArr.length - 1];
            const imageName = image.split(".")[0];

            if (imageName) {
                cloudinary.uploader.destroy(imageName, (error, result) => {
                    // console.log(error, result);
                });
            }
        }

        const deletedProduct = await ProductModel.findByIdAndDelete(request.params.id);

        if (!deletedProduct) {
            return response.status(404).json({
                message: "Product not deleted!",
                success: false,
                error: true
            });
        }

        return response.status(200).json({
            success: true,
            error: false,
            message: "Product Deleted!",
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

//Lấy 1 sản phẩm
export async function getProduct(request, response) {
    try {
        const product = await ProductModel.findById(request.params.id).populate("category");

        if (!product) {
            return response.status(404).json({
                message: "Product Not found",
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            success: true,
            error: false,
            product: product,
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
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

export async function updateProduct(request, response) {
    try {
        const product = await ProductModel.findByIdAndUpdate(
            request.params.id, {
            name: request.body.name,
            description: request.body.description,
            images: request.body.images,
            brand: request.body.brand,
            price: request.body.price,
            oldPrice: request.body.oldPrice,
            categoryName: request.body.categoryName,
            categoryID: request.body.categoryID,
            subCategory: request.body.subCategory,
            subCategoryID: request.body.subCategoryID,
            category: request.body.category,
            thirdSubCategory: request.body.thirdSubCategory,
            thirdSubCategoryID: request.body.thirdSubCategoryID,
            countInStock: request.body.countInStock,
            rating: request.body.rating,
            isFeatured: request.body.isFeatured,
            discount: request.body.discount,
            productRam: request.body.productRam,
            size: request.body.size,
            productWeight: request.body.productWeight,
        }, { new: true });

        if (!product) {
            return response.status(404).json({
                message: "the product can not be updated!",
                status: false,
            });
        }

        imagesArr = [];

        return response.status(200).json({
            message: "The product is updated",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}