import express from "express";
import customerController from "../controllers/Customers.ts";

const customerRouter = express.Router();

customerRouter.get("/fetch", customerController.fetchCustomers);
customerRouter.get(
  "/fetch/customer/:customerID",
  customerController.fetchCustomer
);

export default customerRouter;
