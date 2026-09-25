import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

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

function readPayload(event) {
  if (typeof event.body === "string") {
    return JSON.parse(event.body);
  }

  if (event.body && typeof event.body === "object") {
    return event.body;
  }

  return event;
}

export const handler = async (event = {}) => {
  const tableName = process.env.TABLE_NAME;

  if (!tableName) {
    console.error("Missing TABLE_NAME environment variable");
    return createResponse(500, { message: "La función no está configurada correctamente." });
  }

  let payload;

  try {
    payload = readPayload(event);
  } catch {
    return createResponse(400, { message: "El cuerpo de la solicitud no contiene JSON válido." });
  }

  const { id, selectedIndex } = payload;

  if (typeof id !== "string" || id.trim() === "") {
    return createResponse(400, { message: "Debes enviar el identificador de la pregunta." });
  }

  if (!Number.isInteger(selectedIndex)) {
    return createResponse(400, { message: "selectedIndex debe ser un número entero." });
  }

  try {
    const result = await documentClient.send(
      new GetCommand({
        TableName: tableName,
        Key: { id }
      })
    );

    if (!result.Item) {
      return createResponse(404, { message: "Pregunta no encontrada." });
    }

    const question = result.Item;

    if (selectedIndex < 0 || selectedIndex >= question.options.length) {
      return createResponse(400, { message: "La opción seleccionada no existe." });
    }

    return createResponse(200, {
      id: question.id,
      isCorrect: selectedIndex === question.correctIndex,
      correctIndex: question.correctIndex,
      explanation: question.explanation
    });
  } catch (error) {
    console.error("Failed to check answer", {
      name: error?.name,
      message: error?.message,
      requestId: error?.$metadata?.requestId
    });

    return createResponse(500, { message: "No fue posible comprobar la respuesta." });
  }
};
