import axios from "axios";
import authToken from "../config/authToken.ts";

async function fetchCompanyInfo() {
  try {
    const { realmId, accessToken } = await authToken.getAccessTokenAndRealmId();
    const query = "SELECT * FROM CompanyInfo";
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

    return response.data.QueryResponse.CompanyInfo;
  } catch (error) {
    throw error;
  }
}

export default fetchCompanyInfo;
