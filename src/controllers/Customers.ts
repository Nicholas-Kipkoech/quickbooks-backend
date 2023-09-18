import { Request, Response } from "express";
import { config } from "dotenv";
import axios from "axios";
import authToken from "../config/authToken.ts";

config();

const fetchCustomers = async (req: Request, res: Response) => {
  try {
    const { realmId, accessToken } = await authToken.getAccessTokenAndRealmId();
    const query = "SELECT * FROM Customer";
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
    return res.send({ customers: response.data.QueryResponse.Customer });
  } catch (error: any) {
    console.log(error);
  }
};

const fetchCustomer = async (req: Request, res: Response) => {
  try {
    const { realmId, accessToken } = await authToken.getAccessTokenAndRealmId();
    const customerID = req.params.customerID;
    const apiUrl = `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/customer/${customerID}`;
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const customerData = response.data.Customer;
    return res.status(200).json({ customer: customerData });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
export default { fetchCustomers, fetchCustomer };
