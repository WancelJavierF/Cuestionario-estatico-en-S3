# Etapa 4: publicar Lambda mediante API Gateway

## Objetivo

Crear una HTTP API pública con la ruta `GET /questions/{id}`. API Gateway recibirá la solicitud HTTPS, extraerá el identificador y ejecutará `quiz-get-question`.

## Arquitectura de esta etapa

```text
Navegador
   │
   │ GET /questions/s3-001
   ▼
API Gateway HTTP API
   │
   ▼
Lambda quiz-get-question
   │
   │ dynamodb:GetItem
   ▼
DynamoDB QuizQuestions
```

## Crear la HTTP API

1. Abre Amazon API Gateway en `us-east-1`, la región de la tabla y la función.
2. Selecciona **Create API**.
3. En **HTTP API**, selecciona **Build**.
4. En **Integrations**, elige **Add integration** y después **Lambda**.
5. Selecciona `quiz-get-question`.
6. En **API name**, escribe `quiz-saa-api`.
7. Para el tipo de dirección IP, utiliza IPv4.
8. Continúa con **Next**.

## Configurar la ruta

Agrega esta ruta:

- Method: `GET`
- Resource path: `/questions/{id}`
- Integration target: `quiz-get-question`

Los caracteres `{id}` indican un parámetro de ruta. Cuando se solicita `/questions/s3-001`, Lambda recibe:

```json
{
  "pathParameters": {
    "id": "s3-001"
  }
}
```

## Configurar la etapa

Utiliza la etapa `$default` y conserva activado el despliegue automático. De esta manera los cambios de rutas e integraciones se publican sin crear un deployment manual.

Revisa el resumen y crea la API. Al crear la integración desde la consola, API Gateway agrega a Lambda el permiso necesario para invocarla.

## Probar la ruta

En los detalles de la API, copia **Invoke URL**. Tendrá una forma similar a:

```text
https://abc123.execute-api.us-east-1.amazonaws.com
```

Agrega la ruta y el identificador:

```text
https://abc123.execute-api.us-east-1.amazonaws.com/questions/s3-001
```

Abre la dirección completa en el navegador. Debes recibir un objeto JSON con `id`, `category`, `text` y `options`.

La respuesta no debe contener `correctIndex` ni `explanation`.

También puedes probar desde PowerShell:

```powershell
Invoke-RestMethod -Uri "TU_INVOKE_URL/questions/s3-001" -Method Get
```

## Pruebas adicionales

Prueba un identificador inexistente:

```text
TU_INVOKE_URL/questions/no-existe
```

La API debe responder con estado HTTP 404 y el mensaje `Pregunta no encontrada.`

## Errores frecuentes

- `Not Found`: la ruta escrita no coincide con `/questions/{id}`.
- `Internal Server Error`: revisa la prueba directa de Lambda y sus registros de CloudWatch.
- `ResourceNotFoundException`: Lambda y DynamoDB no están en la misma región o el nombre de tabla es incorrecto.
- Error de integración: comprueba que la ruta tenga asociada la integración `quiz-get-question`.

## Seguridad en esta etapa

La ruta será pública porque todavía no agregaremos autenticación. Solo expone una operación de lectura y Lambda elimina la respuesta correcta antes de devolver la pregunta. Más adelante añadiremos límites de solicitudes y evaluaremos autenticación.

CORS se configurará cuando publiquemos el frontend y conozcamos su dirección exacta en S3.
