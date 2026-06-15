import { Router } from "express";
import auth from "../middlewares/auth.js";
import {
    addToCartItemController,
    deleteCartItemQtyController,
    getCartItemController,
    updateCartItemQtyController
} from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.post("/add", auth, addToCartItemController);
cartRouter.get("/get", auth, getCartItemController);
cartRouter.put("/update", auth, updateCartItemQtyController);
cartRouter.delete("/delete", auth, deleteCartItemQtyController);

export default cartRouter;
