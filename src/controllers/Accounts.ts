import { Request, Response } from "express";
import { config } from "dotenv";
import axios from "axios";
import getAccessTokenAndRealmId from "../config/authToken.ts";
config();

const fetchAccounts = async (req: Request, res: Response) => {
  try {
    const { realmId, accessToken } = await getAccessTokenAndRealmId();
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

export default fetchAccounts;
