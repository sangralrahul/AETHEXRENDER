import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import cartRouter from "./cart";
import aiRouter from "./ai";
import ordersRouter from "./orders";
import notificationsRouter from "./notifications";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(cartRouter);
router.use(aiRouter);
router.use(ordersRouter);
router.use(notificationsRouter);

export default router;
