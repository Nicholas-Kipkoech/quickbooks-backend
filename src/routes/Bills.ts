import express from "express";
import billController from "../controllers/Bills.ts";

const billRouter = express.Router();

billRouter.get("/fetch", billController.fetchBills);
billRouter.get("/fetch/bill/:billID", billController.fetchBill);

export default billRouter;
