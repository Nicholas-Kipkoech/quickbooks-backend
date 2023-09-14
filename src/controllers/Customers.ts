import { Request, Response } from "express";
import { config } from "dotenv";
import axios from "axios";
config();

const accessToken = process.env.ACCESS_TOKEN;
const realmId = "4620816365340768660";

const fetchCustomers = async (req: Request, res: Response) => {
  try {
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

export default fetchCustomers;
