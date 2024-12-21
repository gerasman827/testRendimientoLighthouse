const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// Setting routes and credentials
const credentialsPath = path.join(__dirname, 'jactpackcrm-connector.json');
const jsonFilePath = path.join(__dirname, 'cypress', 'fixtures', 'lighthouse-report.json');
const spreadsheetId = '1N4B608PrFlGZqIf5Fsdwm81iaWQN7qLV4j4G_GlYSKc';

// Function to authenticate with Google API
async function authorizeGoogleAPI() {
  const credentials = require(credentialsPath);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return auth.getClient();
}

// Function to read and parse the JSON file
function readAndParseJSON(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`JSON file not found: ${filePath}`);
  }

  const rawData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(rawData);
}

// Function to upload data to Google Sheets
async function uploadToGoogleSheets(sheets, spreadsheetId, range, values) {
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    resource: { values },
  });
  console.log(`Data written in the range ${range}`);
}

// Main function to process and upload data
async function processAndUploadData() {
  console.log('Starting data processing...');

  let jsonData;
  try {
    // Read and parse the JSON file
    jsonData = readAndParseJSON(jsonFilePath);
    console.log('JSON read and parsed:', jsonData);
  } catch (error) {
    console.error('Error reading or parsing JSON:', error);
    return null;
  }

  try {
  // Authenticate and upload data to Google Sheets
    console.log('Authenticating with Google API...');
    const auth = await authorizeGoogleAPI();
    const sheets = google.sheets({ version: 'v4', auth });

    const headers = Object.keys(jsonData[0]); // Headers
    const data = jsonData.map((entry) => Object.values(entry)); // Rows

    console.log('Uploading data to Google Sheets...');
    await uploadToGoogleSheets(sheets, spreadsheetId, 'Homepage1!A1', [headers]);
    await uploadToGoogleSheets(sheets, spreadsheetId, 'Homepage1!A2', data);
    console.log('Data uploaded successfully!');
  } catch (error) {
    console.error('Error uploading data to Google Sheets:', error);
    return null;
  }

  return jsonData; // Returns the processed data for possible verifications
}

module.exports = processAndUploadData;
