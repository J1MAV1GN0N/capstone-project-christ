import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { createTodo } from '../../businessLayer/todos';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body);

  // TODO: Implement creating a new TODO item
  if (!newTodo.name) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'name is empty'
      })
    };
  }

  const todoItem = await createTodo(event, newTodo);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: todoItem
    })
  };
}
