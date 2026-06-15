import categoryModel from "../models/category.model.js";

export const addCategoryController = async (req, res) => {
    try {
        const { name, image } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Category name is required",
                error: true,
                success: false,
            });
        }

        const category = new categoryModel({
            name,
            image,
        });

        const saveCategory = await category.save();

        return res.status(200).json({
            message: "Category added successfully",
            data: saveCategory,
            error: false,
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

export const getCategoryController = async (req, res) => {
    try {
        const categories = await categoryModel.find().sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Categories fetched successfully",
            data: categories,
            error: false,
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

export const updateCategoryController = async (req, res) => {
    try {
        const { id, _id, name, image } = req.body;
        const categoryId = id || _id;

        if (!categoryId) {
            return res.status(400).json({
                message: "Category id is required",
                error: true,
                success: false,
            });
        }

        const updateCategory = await categoryModel.findByIdAndUpdate(
            categoryId,
            { name, image },
            { new: true }
        );

        return res.status(200).json({
            message: "Category updated successfully",
            data: updateCategory,
            error: false,
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

export const deleteCategoryController = async (req, res) => {
    try {
        const { id, _id } = req.body;
        const categoryId = id || _id;

        if (!categoryId) {
            return res.status(400).json({
                message: "Category id is required",
                error: true,
                success: false,
            });
        }

        await categoryModel.findByIdAndDelete(categoryId);

        return res.status(200).json({
            message: "Category deleted successfully",
            error: false,
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};
