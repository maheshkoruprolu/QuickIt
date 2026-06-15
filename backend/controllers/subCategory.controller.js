import subCategoryModel from "../models/subCategory.model.js";

export const addSubCategoryController = async (req, res) => {
    try {
        const { name, image, categoryId } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Name is required",
                error: true,
                success: false,
            });
        }

        const subCategory = new subCategoryModel({ name, image, categoryId });
        const saveSubCategory = await subCategory.save();

        return res.status(200).json({
            message: "SubCategory added successfully",
            data: saveSubCategory,
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

export const getSubCategoryController = async (req, res) => {
    try {
        const subCategories = await subCategoryModel
            .find()
            .populate("categoryId")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "SubCategories fetched successfully",
            data: subCategories,
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

export const updateSubCategoryController = async (req, res) => {
    try {
        const { id, _id, name, image, categoryId } = req.body;
        const subCategoryId = id || _id;

        if (!subCategoryId) {
            return res.status(400).json({
                message: "Id is required",
                error: true,
                success: false,
            });
        }

        const updateSubCategory = await subCategoryModel.findByIdAndUpdate(
            subCategoryId,
            { name, image, categoryId },
            { new: true }
        );

        return res.status(200).json({
            message: "SubCategory updated successfully",
            data: updateSubCategory,
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

export const deleteSubCategoryController = async (req, res) => {
    try {
        const { id, _id } = req.body;
        const subCategoryId = id || _id;

        if (!subCategoryId) {
            return res.status(400).json({
                message: "Id is required",
                error: true,
                success: false,
            });
        }

        await subCategoryModel.findByIdAndDelete(subCategoryId);

        return res.status(200).json({
            message: "SubCategory deleted successfully",
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
