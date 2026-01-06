import { OrderModel } from "../entities/order/order.model";
import { createBaseCRUD } from "../shared/base";

const orderRouter = createBaseCRUD(OrderModel);

export default orderRouter;
