import { OrderModel } from "../entities/order/order.model";
import { createBaseCRUD } from "../shared/base";
import { Router } from "express";
import mongoose from "mongoose";

const orderRouter = createBaseCRUD(OrderModel);

const utilRouter = Router();

utilRouter.get("/pending/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const pendingOrder = await OrderModel.findOne({
      order_user_id: userId,
      order_status: "pending",
    });

    if (!pendingOrder) {
      return res.status(404).json({ error: "No pending order found" });
    }

    res.json(pendingOrder);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

utilRouter.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const orders = await OrderModel.find({
      order_user_id: userId,
    }).sort({ createdAt: -1 }); 

    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

orderRouter.use("/utils", utilRouter);

export default orderRouter;
