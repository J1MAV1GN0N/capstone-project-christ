import { APIGatewayProxyEvent } from "aws-lambda";
import { parseUserId } from "../auth/utils";

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
 export function getUserId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
// There is no Authorization 
// property but a authorization property
  console.log("Value of Authorization:- " + authorization)
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}

export function getHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  }
}