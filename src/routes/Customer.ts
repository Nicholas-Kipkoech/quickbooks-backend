import express from "express";
import fetchCustomers from "../controllers/Customers.ts";

const customerRouter = express.Router();

customerRouter.get("/fetch", fetchCustomers);

export default customerRouter;
