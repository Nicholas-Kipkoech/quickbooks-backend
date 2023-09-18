import { Request, Response } from "express";
import { config } from "dotenv";
import axios from "axios";
import authToken from "../config/authToken.ts";

config();

const fetchEmployees = async (req: Request, res: Response) => {
  try {
    const { realmId, accessToken } = await authToken.getAccessTokenAndRealmId();
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

const fetchEmployee = async (req: Request, res: Response) => {
  try {
    const { realmId, accessToken } = await authToken.getAccessTokenAndRealmId();
    const employeeID = req.params.employeeID;
    const apiUrl = `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/employee/${employeeID}`;
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const employeeData = response.data.Employee;
    return res.status(200).json({ employee: employeeData });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export default { fetchEmployees, fetchEmployee };
