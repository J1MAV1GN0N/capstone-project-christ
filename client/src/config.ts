const apiId = '' // Used RS256 to authenticate user
export const apiEndpoint = `https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'dev-d8rj2srd.us.auth0.com',            // Auth0 domain
  clientId: 'ycteTb6xDatfLzUn1WQFMQ1MO6QQK8DI',   // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'   //localhost:3000
}
