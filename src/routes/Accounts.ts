import express from "express";

import accountsController from "../controllers/Accounts.ts";

const accountRouter = express.Router();

accountRouter.get("/fetch", accountsController.fetchAccounts);
accountRouter.get("/fetch/account/:accountID", accountsController.fetchAccount);

export default accountRouter;
