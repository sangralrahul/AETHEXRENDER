import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import cartRouter from "./cart";
import aiRouter from "./ai";
import ordersRouter from "./orders";
import notificationsRouter from "./notifications";
import reviewsRouter from "./reviews";
import sellerRouter from "./seller";
import blogRouter from "./blog";
import authRouter from "./auth";
import contactRouter from "./contact";
import adminRouter from "./admin";
import medKnowledgeRouter from "./medknowledge";
import bookCoverRouter from "./book-cover";
import verifyRouter from "./verify";

const router: IRouter = Router();

router.use(healthRouter);
router.use(bookCoverRouter);
router.use(authRouter);
router.use(adminRouter);
router.use(contactRouter);
router.use(productsRouter);
router.use(cartRouter);
router.use(aiRouter);
router.use(ordersRouter);
router.use(notificationsRouter);
router.use(reviewsRouter);
router.use(sellerRouter);
router.use(blogRouter);
router.use(medKnowledgeRouter);
router.use(verifyRouter);

export default router;
