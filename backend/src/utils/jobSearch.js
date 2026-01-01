import axios from "axios";
import "dotenv/config";

const url = "https://jsearch.p.rapidapi.com/search";

const headers = {
  "X-RapidAPI-Key": process.env.RAPID_API_KEY,
  "X-RapidAPI-Host": process.env.RAPID_API_HOST
};

const fetchJobs = async (querystring) => {
  try {
    const response = await axios.get(url, { headers, params: querystring });
    return {
      data: response.data.data ,
      status: response.data.status
    };
  } catch (error) {
    console.error('Job search API error:', error.message);
    return {
      data: [],
      error: error.message
    };
  }
}

export { fetchJobs };