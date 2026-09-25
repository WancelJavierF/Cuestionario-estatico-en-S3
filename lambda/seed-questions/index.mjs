import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { BatchWriteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const documentClient = DynamoDBDocumentClient.from(dynamoClient);

const questions = [
  {
    id: "s3-001",
    category: "Amazon S3",
    text: "¿Qué característica permite conservar varias versiones de un mismo objeto?",
    options: ["Lifecycle", "Versioning", "Replication", "Transfer Acceleration"],
    correctIndex: 1,
    explanation: "S3 Versioning asigna un identificador diferente a cada versión y permite recuperar versiones anteriores."
  },
  {
    id: "ec2-001",
    category: "Amazon EC2",
    text: "¿Qué servicio distribuye tráfico entre varias instancias EC2?",
    options: ["Elastic Load Balancing", "Amazon Route 53", "AWS Auto Scaling", "Amazon CloudWatch"],
    correctIndex: 0,
    explanation: "Elastic Load Balancing recibe el tráfico y lo distribuye entre destinos saludables, como instancias EC2."
  },
  {
    id: "iam-001",
    category: "AWS IAM",
    text: "¿Qué práctica sigue el principio de mínimo privilegio?",
    options: ["Asignar AdministratorAccess", "Compartir el usuario raíz", "Conceder solo las acciones necesarias", "Crear claves sin fecha de rotación"],
    correctIndex: 2,
    explanation: "El mínimo privilegio concede únicamente las acciones y recursos necesarios para realizar una tarea."
  },
  {
    id: "dynamodb-001",
    category: "Amazon DynamoDB",
    text: "¿Qué dato es obligatorio al crear una tabla de DynamoDB?",
    options: ["Una dirección IP", "Una clave de partición", "Un bucket de S3", "Una instancia EC2"],
    correctIndex: 1,
    explanation: "Toda tabla de DynamoDB requiere una clave de partición; opcionalmente puede incluir una clave de ordenación."
  },
  {
    id: "lambda-001",
    category: "AWS Lambda",
    text: "¿Cuál es una característica principal de AWS Lambda?",
    options: ["Requiere administrar el sistema operativo", "Solo funciona dentro de EC2", "Ejecuta código en respuesta a eventos", "Necesita una VPC para funcionar"],
    correctIndex: 2,
    explanation: "Lambda ejecuta funciones bajo demanda en respuesta a eventos y AWS administra la infraestructura de ejecución."
  }
];

export const handler = async () => {
  const tableName = process.env.TABLE_NAME;

  if (!tableName) {
    throw new Error("Missing TABLE_NAME environment variable");
  }

  const putRequests = questions.map((question) => ({
    PutRequest: { Item: question }
  }));

  const result = await documentClient.send(
    new BatchWriteCommand({
      RequestItems: {
        [tableName]: putRequests
      }
    })
  );

  const unprocessed = result.UnprocessedItems?.[tableName] ?? [];

  if (unprocessed.length > 0) {
    console.error("Some questions were not processed", {
      count: unprocessed.length
    });

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Algunas preguntas no pudieron guardarse.",
        unprocessedCount: unprocessed.length
      })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Preguntas guardadas correctamente.",
      insertedCount: questions.length
    })
  };
};
