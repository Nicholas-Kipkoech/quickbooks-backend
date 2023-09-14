import express from "express";
import fetchBills from "../controllers/Bills.ts";

const billRouter = express.Router();

billRouter.get("/fetch", fetchBills);

export default billRouter;
