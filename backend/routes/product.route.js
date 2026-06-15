import { Router } from "express";
import auth from "../middlewares/auth.js";
import { admin } from "../middlewares/Admin.js";
import upload from "../middlewares/multer.js";
import {
    addProductController,
    deleteProductController,
    getProductController,
    updateProductController,
    uploadImageController,
    searchProductController,
    getProductDetailsController
} from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.post("/upload-image", auth, admin, upload.single("image"), uploadImageController);
productRouter.post("/add-product", auth, admin, addProductController);
productRouter.get("/get-product", getProductController);
productRouter.put("/update-product", auth, admin, updateProductController);
productRouter.delete("/delete-product", auth, admin, deleteProductController);
productRouter.post("/search-product", searchProductController);
productRouter.post("/product-details", getProductDetailsController);

export default productRouter;
