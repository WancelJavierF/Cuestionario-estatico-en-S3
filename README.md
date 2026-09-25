# Proyecto 02: Quiz interactivo para AWS SAA

Aplicación serverless para practicar conceptos de AWS Solutions Architect Associate mediante preguntas almacenadas en DynamoDB.

## Arquitectura

- Amazon S3 publica el frontend estático.
- Amazon API Gateway expone la API HTTP.
- AWS Lambda obtiene preguntas y comprueba respuestas.
- Amazon DynamoDB almacena las preguntas, opciones, respuestas y explicaciones.
- Amazon CloudWatch conserva los registros de ejecución de Lambda.

## Rutas de la API

| Método | Ruta | Función |
| --- | --- | --- |
| `GET` | `/questions` | Devuelve todas las preguntas sin revelar las respuestas. |
| `GET` | `/questions/{id}` | Devuelve una pregunta específica. |
| `POST` | `/answers` | Comprueba la respuesta seleccionada y devuelve la explicación. |

El frontend obtiene dinámicamente las preguntas mediante `GET /questions`. Agregar un elemento a DynamoDB no requiere modificar `app.js`.

## Documentación

1. [Crear la tabla en DynamoDB](docs/02-dynamodb.md)
2. [Crear la Lambda para obtener una pregunta](docs/03-lambda-get-question.md)
3. [Publicar la primera ruta en API Gateway](docs/04-api-gateway.md)
4. [Cargar las preguntas iniciales](docs/05-seed-questions.md)
5. [Crear la Lambda que comprueba respuestas](docs/06-check-answer-lambda.md)
6. [Publicar la ruta de respuestas](docs/07-api-check-answer.md)
7. [Conectar el frontend con la API](docs/08-connect-frontend.md)
8. [Publicar el frontend en S3](docs/09-deploy-frontend-s3.md)
9. [Administrar preguntas dinámicamente](docs/10-dynamic-questions.md)

## Ejecutar localmente

Sirve la carpeta `frontend` con un servidor HTTP local y abre la dirección que este indique. La aplicación necesita conexión con la API desplegada en AWS.
