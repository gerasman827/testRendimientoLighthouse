const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const credentialsPath = path.resolve(__dirname, "./support/jactpackcrm-connector.json");

async function testAuth() {
  const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  try {
    const authClient = await auth.getClient();
    console.log("Autenticación exitosa.");
  } catch (error) {
    console.error("Error de autenticación:", error);
  }
}

testAuth();
