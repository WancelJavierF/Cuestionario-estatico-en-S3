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
  },
  {
    id: "rds-001",
    category: "Amazon RDS",
    text: "¿Qué tipo de base de datos NO es compatible con Amazon RDS?",
    options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"],
    correctIndex: 2,
    explanation: "Amazon RDS admite motores relacionales como MySQL, PostgreSQL, MariaDB, Oracle, SQL Server y Db2, pero no MongoDB."
  },
  {
    id: "cloudfront-001",
    category: "Amazon CloudFront",
    text: "¿Cuál es la función principal de Amazon CloudFront?",
    options: ["Almacenar datos en la nube", "Distribuir contenido a nivel global", "Monitorear instancias EC2", "Gestionar usuarios y permisos"],
    correctIndex: 1,
    explanation: "CloudFront es una red de entrega de contenido (CDN) que distribuye contenido a nivel global con baja latencia."
  },
  {
    id: "autoscaling-001",
    category: "AWS Auto Scaling",
    text: "¿Qué hace AWS Auto Scaling?",
    options: ["Crea copias de seguridad de datos", "Ajusta automáticamente la capacidad de recursos", "Monitorea el tráfico web", "Gestiona usuarios y permisos"],
    correctIndex: 1,
    explanation: "AWS Auto Scaling ajusta automáticamente la capacidad de recursos para mantener un rendimiento estable y predecible."
  },
  {
    id: "vpc-001",
    category: "Amazon VPC",
    text: "¿Qué es una Amazon VPC?",
    options: ["Un servicio de almacenamiento", "Una red virtual privada en la nube", "Un tipo de base de datos", "Un servicio de monitoreo"],
    correctIndex: 1,
    explanation: "Amazon VPC permite crear una red virtual aislada en la nube donde se pueden lanzar recursos de AWS."
  },
  {
    id: "cloudformation-001",
    category: "AWS CloudFormation",
    text: "¿Cuál es el propósito principal de AWS CloudFormation?",
    options: ["Gestionar usuarios y permisos", "Automatizar la creación de recursos en AWS", "Monitorear el tráfico web", "Almacenar datos en la nube"],
    correctIndex: 1,
    explanation: "AWS CloudFormation permite definir y provisionar recursos de AWS mediante plantillas, facilitando la automatización."
  },
  {
    id: "route53-001",
    category: "Amazon Route 53",
    text: "¿Cuál es la función principal de Amazon Route 53?",
    options: ["Ejecutar funciones sin servidor", "Proporcionar resolución DNS y enrutamiento de tráfico", "Almacenar objetos", "Crear imágenes de máquinas virtuales"],
    correctIndex: 1,
    explanation: "Amazon Route 53 es un servicio DNS escalable que traduce nombres de dominio y permite dirigir el tráfico mediante diferentes políticas de enrutamiento."
  },
  {
    id: "sqs-001",
    category: "Amazon SQS",
    text: "¿Qué beneficio principal aporta Amazon SQS a una arquitectura distribuida?",
    options: ["Ejecutar consultas SQL", "Desacoplar componentes mediante colas de mensajes", "Distribuir contenido desde ubicaciones de borde", "Administrar registros DNS"],
    correctIndex: 1,
    explanation: "Amazon SQS permite desacoplar componentes porque los productores colocan mensajes en una cola y los consumidores los procesan de manera independiente."
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
