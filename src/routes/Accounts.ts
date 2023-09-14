import express from "express";

import fetchAccounts from "../controllers/Accounts.ts";

const accountRouter = express.Router();

accountRouter.get("/fetch", fetchAccounts);

export default accountRouter;
