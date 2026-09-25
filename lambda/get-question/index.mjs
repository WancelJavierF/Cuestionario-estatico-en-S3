import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

// Lambda proporciona AWS_REGION automáticamente. El cliente se crea fuera
// del handler para poder reutilizarlo entre invocaciones.
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const documentClient = DynamoDBDocumentClient.from(dynamoClient);

function createResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };
}

export const handler = async (event = {}) => {
  const tableName = process.env.TABLE_NAME;
  const questionId =
    event.id ??
    event.pathParameters?.id ??
    event.queryStringParameters?.id;

  if (!tableName) {
    console.error("Missing TABLE_NAME environment variable");
    return createResponse(500, { message: "La función no está configurada correctamente." });
  }

  if (!questionId) {
    return createResponse(400, { message: "Debes enviar el identificador de la pregunta." });
  }

  try {
    const result = await documentClient.send(
      new GetCommand({
        TableName: tableName,
        Key: { id: questionId }
      })
    );

    if (!result.Item) {
      return createResponse(404, { message: "Pregunta no encontrada." });
    }

    // Estos datos permanecen en el backend hasta que el usuario responda.
    const { correctIndex, explanation, ...publicQuestion } = result.Item;

    return createResponse(200, publicQuestion);
  } catch (error) {
    console.error("Failed to read question", {
      name: error?.name,
      message: error?.message,
      requestId: error?.$metadata?.requestId
    });

    return createResponse(500, { message: "No fue posible consultar la pregunta." });
  }
};
