import { Router } from "express";
import auth from "../middlewares/auth.js";
import { admin } from "../middlewares/Admin.js";
import {
    addCategoryController,
    deleteCategoryController,
    getCategoryController,
    updateCategoryController,
} from "../controllers/category.controller.js";

const categoryRouter = Router();

categoryRouter.post("/add-category", auth, admin, addCategoryController);
categoryRouter.get("/get-category", getCategoryController); // Public route
categoryRouter.put("/update-category", auth, admin, updateCategoryController);
categoryRouter.delete("/delete-category", auth, admin, deleteCategoryController);

export default categoryRouter;
