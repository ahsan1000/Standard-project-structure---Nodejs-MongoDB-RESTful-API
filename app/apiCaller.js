// apiCaller.js

const axios = require("axios");
const fs = require("fs");
const path = require("path");
// Set custom headers including User-Agent
const customHeaders = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36",
  // Add other headers if needed
};
// Create Axios instance with custom headers
const axiosInstance = axios.create({
  headers: customHeaders,
});
// Function to call the API with a given date range
async function callAPI(startDate, endDate) {
  const apiUrl = `https://api.canlii.org/v1/caseBrowse/en/onltb/?offset=0&resultCount=10000&publishedBefore=${endDate}&publishedAfter=${startDate}&api_key=9hZZpYitkc3sVP2WCA4JD2szTvQzIcCi1xPmmegX`;

  try {
    const response = await axios.get(apiUrl);
    // Handle the response data here
    console.log(`API called with date range: ${startDate} to ${endDate}`);
    //console.log(response.data); // Example: Logging response data
    return response.data; // Return response data if needed
  } catch (error) {
    console.error("Error occurred while calling API:", error);
    throw error; // Throw the error for handling in server.js if needed
  }
}

// Function to generate date strings in YYYY-MM-DD format
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Main function to iterate over dates and call the API
async function fetchAPIResults() {
  const startDate = new Date("2020-01-01");
  const endDate = new Date("2021-01-01"); // Assuming you want to include January 1, 2024

  const results = [];

  const currentDate = new Date(startDate);
  while (currentDate < endDate) {
    const nextDate = new Date(currentDate);
    nextDate.setFullYear(currentDate.getFullYear() + 1); // Incrementing the year
    const data = await callAPI(formatDate(currentDate), formatDate(nextDate));
    results.push(data); // Store API response data
    currentDate.setFullYear(currentDate.getFullYear() + 1); // Move to the next year
  }

  return results;
}

async function fetchCaseWiseData() {
  const resultArray = [];
  let jsonData = await fetchAPIResults();
  let counter = 0;

  // Create directory if it doesn't exist
  const directory = "../CourtCasesDB";
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }

  for (const cases of jsonData) {
    for (const caseObj of cases.cases) {
      if (counter >= 15) break; // Break the loop if counter reaches 15
      const caseId = caseObj.caseId.en;
      const apiUrl = `https://api.canlii.org/v1/caseBrowse/en/onltb/${caseId}/?api_key=9hZZpYitkc3sVP2WCA4JD2szTvQzIcCi1xPmmegX`;

      try {
        const response = await axios.get(apiUrl);
        resultArray.push(response.data);
        setTimeout(() => {
          console.log("5 seconds passed");
        }, 5000);
        // Fetch HTML content from the provided URL
        // Now you can use axiosInstance for making requests with the specified User-Agent
        await axiosInstance
          .get(response.data.url)
          .then((res) => {
            // console.log(res.data);

            const htmlContent = res.data;

            // Write HTML content to a file in the CourtCasesDB folder
            const filePath = path.join(directory, `${caseId}.html`);
            fs.writeFileSync(filePath, htmlContent);
            console.log(`HTML file saved for case ID ${caseId}`);
          })
          .catch((error) => {
            console.log("error");
            console.error(error.message);
          });
      } catch (error) {
        console.error(
          `Error fetching data for case ID ${caseId}: ${error.message}`
        );
      }

      counter++;
    }

    if (counter >= 15) break; // Break the outer loop if counter reaches 15
  }

  return resultArray;
}

async function retryWithBackoff(
  requestFn,
  maxRetries = 5,
  delay = 1000,
  backoffFactor = 2
) {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      return await requestFn();
    } catch (error) {
      if (error.response && error.response.status === 429) {
        // If rate-limited, wait and retry
        const waitTime = delay * Math.pow(backoffFactor, retries);
        console.log(`Rate limited. Retrying in ${waitTime / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        retries++;
      } else {
        throw error;
      }
    }
  }

  throw new Error(`Failed after ${maxRetries} retries`);
}
module.exports = { fetchAPIResults, fetchCaseWiseData };
