import express from "express";

import fetchEmployees from "../controllers/Employees.ts";

const employeeRouter = express.Router();

employeeRouter.get("/fetch", fetchEmployees);

export default employeeRouter;
