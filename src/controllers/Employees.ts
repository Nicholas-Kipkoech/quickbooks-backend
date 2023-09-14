import { Request, Response } from "express";
import { config } from "dotenv";
import axios from "axios";
config();

const accessToken = process.env.ACCESS_TOKEN;
const realmId = "4620816365340768660";

const fetchEmployees = async (req: Request, res: Response) => {
  try {
    const query = "SELECT * FROM Employee";
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
    return res.send({ employees: response.data.QueryResponse.Employee });
  } catch (error: any) {
    console.log(error);
  }
};

export default fetchEmployees;
