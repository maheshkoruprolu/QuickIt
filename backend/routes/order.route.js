import { Router } from "express";
import auth from "../middlewares/auth.js";
import { createOrderController, getOrderController } from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.post("/create", auth, createOrderController);
orderRouter.get("/history", auth, getOrderController);

export default orderRouter;
