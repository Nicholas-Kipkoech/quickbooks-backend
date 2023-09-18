import { Request, Response } from "express";
import { config } from "dotenv";
import axios from "axios";
import authToken from "../config/authToken.ts";

config();

const fetchAccounts = async (req: Request, res: Response) => {
  try {
    const { realmId, accessToken } = await authToken.getAccessTokenAndRealmId();
    const query = "SELECT * FROM Account";
    const apiUrl = `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/query`;

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      params: {
        query: query,
      },
    });
    return res.send({ accounts: response.data.QueryResponse.Account });
  } catch (error: any) {
    console.log(error);
  }
};

const fetchAccount = async (req: Request, res: Response) => {
  try {
    const { realmId, accessToken } = await authToken.getAccessTokenAndRealmId();
    const accountID = req.params.accountID;
    const apiUrl = `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/account/${accountID}`;
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const accountData = response.data.Account;
    return res.status(200).json({ account: accountData });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export default { fetchAccounts, fetchAccount };
