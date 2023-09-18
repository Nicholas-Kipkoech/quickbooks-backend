import express from "express";

import employeeController from "../controllers/Employees.ts";

const employeeRouter = express.Router();

employeeRouter.get("/fetch", employeeController.fetchEmployees);
employeeRouter.get(
  "/fetch/employee/:employeeID",
  employeeController.fetchEmployee
);

export default employeeRouter;
