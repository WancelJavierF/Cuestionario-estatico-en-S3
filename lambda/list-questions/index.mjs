import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const documentClient = DynamoDBDocumentClient.from(dynamoClient);

function createResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    },
    body: JSON.stringify(body)
  };
}

export const handler = async () => {
  const tableName = process.env.TABLE_NAME;

  if (!tableName) {
    console.error("Missing TABLE_NAME environment variable");
    return createResponse(500, {
      message: "La función no está configurada correctamente."
    });
  }

  try {
    const questions = [];
    let lastEvaluatedKey;

    // DynamoDB Scan devuelve como máximo 1 MB por solicitud. El ciclo permite
    // que la función siga funcionando cuando el cuestionario crezca.
    do {
      const result = await documentClient.send(
        new ScanCommand({
          TableName: tableName,
          ProjectionExpression: "id, category, #questionText, #questionOptions",
          ExpressionAttributeNames: {
            "#questionText": "text",
            "#questionOptions": "options"
          },
          ExclusiveStartKey: lastEvaluatedKey
        })
      );

      questions.push(...(result.Items ?? []));
      lastEvaluatedKey = result.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    questions.sort((first, second) => first.id.localeCompare(second.id));

    return createResponse(200, { questions });
  } catch (error) {
    console.error("Failed to list questions", {
      name: error?.name,
      message: error?.message,
      requestId: error?.$metadata?.requestId
    });

    return createResponse(500, {
      message: "No fue posible consultar la lista de preguntas."
    });
  }
};
