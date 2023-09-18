import { Request, Response } from "express";
import { config } from "dotenv";
import axios from "axios";
import authToken from "../config/authToken.ts";
config();

const fetchBills = async (req: Request, res: Response) => {
  try {
    const { realmId, accessToken } = await authToken.getAccessTokenAndRealmId();
    const query = "SELECT * FROM bill";
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
    return res.send({ bills: response.data.QueryResponse.Bill });
  } catch (error: any) {
    console.log(error);
  }
};
const fetchBill = async (req: Request, res: Response) => {
  try {
    const { realmId, accessToken } = await authToken.getAccessTokenAndRealmId();
    const billID = req.params.billID;
    const apiUrl = `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/bill/${billID}`;
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const billData = response.data.Bill;
    return res.status(200).json({ bill: billData });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export default { fetchBills, fetchBill };
