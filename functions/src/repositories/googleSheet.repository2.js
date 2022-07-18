const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');
const { config } = require('../config/config');

class GoogleApi {
  async connectGoogle(id) {
    console.log(config);
    const auth = new GoogleAuth({
      keyFile: {
        type: 'service_account',
        project_id: config.project_id,
        private_key_id: config.private_key_id,
        private_key: config.private_key,
        client_email: config.client_email,
        client_id: config.client_id,
        auth_uri: config.auth_uri,
        token_uri: config.token_uri,
        auth_provider_x509_cert_url: config.auth_provider_x509_cert_url,
        client_x509_cert_url: config.client_x509_cert_url,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const client = await auth.getClient();
    const googlesheet = google.sheets({ version: 'v4', auth: client });

    const metadata = await googlesheet.spreadsheets.get({
      auth,
      spreadsheetId: id.toString(),
    });
    return metadata;
  }
}

module.exports = GoogleApi;
