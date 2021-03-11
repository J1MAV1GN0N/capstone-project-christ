import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtPayload } from '../../auth/JwtPayload'


const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJFMqUzP7R3N1eMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1kOHJqMnNyZC51cy5hdXRoMC5jb20wHhcNMjEwMzA3MTMwMTQ3WhcN
MzQxMTE0MTMwMTQ3WjAkMSIwIAYDVQQDExlkZXYtZDhyajJzcmQudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA47gdrXE7FGPCldgr
WwF3v8fuSuq4/WW3rOytd31cXyptf40+8a4txORSIUCFqu7gLS/OciLjmgl6kvpI
DjYNDrsC9dSzDrQJxhtdODX0JH1PiKiTWiAF/NLS+e1LTgOonBfsUMTcYgZS64g9
gT2QnyCp5eK8et4MHUA3LqwX7TgRQksAFWzfuHocbUAPFlr839doC+bQfQZCm6oB
yAdImZVsTwTRkL0vNq8EBYTZNYhXwG6842EbeCcTDv+9Jk3Zjcw6sB0AKG7pilKj
4JYyb3K/cG5kglbAHbBynAKIHJKwyLQALne1HHvXnr+AsovtHXBxmkw6Ivxqh01k
VKxslQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBS6QjzFx9iq
idqLdDCwtYunFP+XGzAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AIjhVWr4X5QeO0ilk8SM6FfS170cQE2f63Q8DE7Ecoq0zMOoSLPPty10hAovtPNS
mugZHOn3zcd8E4t2h9NYN243GsTBVggr2N2shj7spxHoc8BqGyiFcBX+wEoyY8Wz
TRWfvMGtm8gBvZNQ6TawDv8fFztEVskUXWxce/x1MleANk7gQEwRBRtDrGCAvU/F
sMTEIhM7Fh0eqsOEy5KWg6MdRJIv8ahEIZmX/xevdPSDIKV7sg6PM049MoSZSY9C
vQTQr5jSuzE0ZzpAVzSwuKsb93blCMprh5JCTVYm3IzlVFH41R7nb/D6Nj5xgrfL
btWoEOV4S9PIgnR82NhfhWA=
-----END CERTIFICATE-----`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
    try {
      const jwtToken = verifyToken(event.authorizationToken)
      console.log('User was authorized', jwtToken)
  
      return {
        principalId: jwtToken.sub,
        policyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: 'Allow',
              Resource: '*'
            }
          ]
        }
      }
    } catch (e) {
      console.log('User authorized', e.message)
  
      return {
        principalId: 'user',
        policyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: 'Deny',
              Resource: '*'
            }
          ]
        }
      }
    }
  }
  
  function verifyToken(authHeader: string): JwtPayload {
    if (!authHeader)
      throw new Error('No authentication header')
  
    if (!authHeader.toLowerCase().startsWith('bearer '))
      throw new Error('Invalid authentication header')
  
    const split = authHeader.split(' ')
    const token = split[1]
  
    return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
  }
  