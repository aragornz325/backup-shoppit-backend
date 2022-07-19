const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');
const { config } = require('../config/config');

class GoogleApi {
  async connectGoogle(id) {
    try {
      let auth = new GoogleAuth({
        keyFile: 'keys.json',
        scopes: `https://www.googleapis.com/auth/spreadsheets`,
      });

      console.log(auth);
      const client = await auth.getClient();
      const googlesheet = google.sheets({
        version: 'v4',
        auth: client,
      });
      const metadata = googlesheet.spreadsheets.get({
        auth,
        spreadsheetId: id,
      });
      return metadata;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = GoogleApi;
