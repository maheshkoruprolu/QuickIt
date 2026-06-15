import { Router } from "express";
import auth from "../middlewares/auth.js";
import { admin } from "../middlewares/Admin.js";
import {
    addSubCategoryController,
    deleteSubCategoryController,
    getSubCategoryController,
    updateSubCategoryController,
} from "../controllers/subCategory.controller.js";

const subCategoryRouter = Router();

subCategoryRouter.post("/add-sub-category", auth, admin, addSubCategoryController);
subCategoryRouter.get("/get-sub-category", getSubCategoryController);
subCategoryRouter.put("/update-sub-category", auth, admin, updateSubCategoryController);
subCategoryRouter.delete("/delete-sub-category", auth, admin, deleteSubCategoryController);

export default subCategoryRouter;
