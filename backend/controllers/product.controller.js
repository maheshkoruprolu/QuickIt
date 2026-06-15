import productModel from "../models/product.model.js";

export const addProductController = async (req, res) => {
    try {
        const { name, image, categoryId, subCategory, unit, stock, price, discount, description, more_details, publish } = req.body;

        if (!name || !price) {
            return res.status(400).json({ message: "Name and price are required", error: true, success: false });
        }

        const product = new productModel({
            name, image, categoryId, subCategory, unit, stock, price, discount, description, more_details, publish
        });

        const saveProduct = await product.save();

        return res.status(200).json({ message: "Product added successfully", data: saveProduct, error: false, success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message || error, error: true, success: false });
    }
};

export const getProductController = async (req, res) => {
    try {
        const products = await productModel.find()
            .populate('categoryId')
            .populate('subCategory')
            .sort({ createdAt: -1 });

        return res.status(200).json({ message: "Products fetched successfully", data: products, error: false, success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message || error, error: true, success: false });
    }
};

export const updateProductController = async (req, res) => {
    try {
        const { _id, ...updateData } = req.body;

        if (!_id) {
            return res.status(400).json({ message: "Product id is required", error: true, success: false });
        }

        const updateProduct = await productModel.findByIdAndUpdate(_id, updateData, { new: true });

        return res.status(200).json({ message: "Product updated successfully", data: updateProduct, error: false, success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message || error, error: true, success: false });
    }
};

export const deleteProductController = async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({ message: "Product id is required", error: true, success: false });
        }

        await productModel.findByIdAndDelete(_id);

        return res.status(200).json({ message: "Product deleted successfully", error: false, success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message || error, error: true, success: false });
    }
};

export const searchProductController = async (req, res) => {
    try {
        let { search, categoryId } = req.body;
        let query = { publish: true };

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        if (categoryId) {
            query.categoryId = { $in: [categoryId] };
        }

        const products = await productModel.find(query)
            .populate('categoryId')
            .populate('subCategory')
            .sort({ createdAt: -1 });

        return res.status(200).json({ message: "Products fetched successfully", data: products, error: false, success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message || error, error: true, success: false });
    }
};

export const getProductDetailsController = async (req, res) => {
    try {
        const { id } = req.body;
        const product = await productModel.findById(id)
            .populate('categoryId')
            .populate('subCategory');
            
        if (!product) {
            return res.status(404).json({ message: "Product not found", error: true, success: false });
        }

        return res.status(200).json({ message: "Product details", data: product, error: false, success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message || error, error: true, success: false });
    }
};


import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";

export const uploadImageController = async (req, res) => {
    try {
        const file = req.file;
        const uploadImage = await uploadImageCloudinary(file);
        
        return res.status(200).json({
            message: "Upload successful",
            data: {
                url: uploadImage.url
            },
            error: false,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};
