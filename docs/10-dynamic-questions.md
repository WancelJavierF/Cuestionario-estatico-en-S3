# Etapa 10: administrar preguntas dinámicamente

## Objetivo

Agregar preguntas a `QuizQuestions` sin modificar ni volver a publicar el frontend. La ruta `GET /questions` consulta DynamoDB y devuelve automáticamente el contenido público disponible.

## Flujo

```text
DynamoDB QuizQuestions
        ↓ Scan
Lambda quiz-list-questions
        ↓
GET /questions
        ↓
Frontend en Amazon S3
```

`quiz-list-questions` solo devuelve `id`, `category`, `text` y `options`. Los campos `correctIndex` y `explanation` permanecen en el backend hasta que se envía una respuesta a `POST /answers`.

## Agregar un elemento manualmente

1. Abre **DynamoDB** en la región `us-east-1`.
2. Entra en **Tablas → QuizQuestions → Explorar elementos**.
3. Selecciona **Crear elemento** y abre **Vista JSON**.
4. Desactiva **Ver JSON de DynamoDB** para utilizar JSON normal.
5. Pega un único objeto. No lo encierres entre corchetes.
6. Selecciona **Crear elemento**.

Ejemplo:

```json
{
  "id": "sqs-001",
  "category": "Amazon SQS",
  "text": "¿Qué beneficio principal aporta Amazon SQS a una arquitectura distribuida?",
  "options": [
    "Ejecutar consultas SQL",
    "Desacoplar componentes mediante colas de mensajes",
    "Distribuir contenido desde ubicaciones de borde",
    "Administrar registros DNS"
  ],
  "correctIndex": 1,
  "explanation": "Amazon SQS permite desacoplar componentes porque los productores colocan mensajes en una cola y los consumidores los procesan de manera independiente."
}
```

`correctIndex` comienza en cero: `0` es la primera opción, `1` la segunda, `2` la tercera y `3` la cuarta.

## Verificación

1. Abre `https://xi1ygrbqra.execute-api.us-east-1.amazonaws.com/questions`.
2. Comprueba que aparece `sqs-001`.
3. Confirma que la respuesta no contiene `correctIndex` ni `explanation`.
4. Recarga el sitio publicado en S3.
5. Comprueba que el total aumentó y responde la pregunta nueva.

No es necesario modificar `frontend/app.js` ni volver a cargar archivos en S3.

## Mantener el repositorio como referencia

Registra también la pregunta en `data/questions.json` y `lambda/seed-questions/index.mjs`. Así podrás reconstruir la tabla en otra cuenta o entorno.
