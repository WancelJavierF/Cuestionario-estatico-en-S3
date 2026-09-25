# Etapa 6: comprobar respuestas con Lambda

## Objetivo

Crear una función permanente que reciba una pregunta y la opción seleccionada. La función consultará DynamoDB y devolverá el resultado y la explicación.

## Limpiar la función temporal

Después de verificar los diez elementos:

1. Elimina la función `quiz-seed-questions` desde Lambda.
2. Abre IAM y elimina el rol de ejecución creado exclusivamente para esa función.

El código de carga permanece en el repositorio, por lo que el proceso sigue siendo reproducible.

## Flujo

```text
{ "id": "s3-001", "selectedIndex": 1 }
                       │
                       ▼
             Lambda quiz-check-answer
                       │
                       │ dynamodb:GetItem
                       ▼
              DynamoDB QuizQuestions
                       │
                       ▼
{ "isCorrect": true, "correctIndex": 1, "explanation": "..." }
```

## Crear la función

1. Crea una función desde cero llamada `quiz-check-answer` en `us-east-1`.
2. Selecciona la versión más reciente de Node.js y `x86_64`.
3. Crea un rol nuevo con permisos básicos de Lambda.
4. Agrega la variable `TABLE_NAME` con valor `QuizQuestions`.

## Conceder acceso a la tabla

1. Abre el rol de ejecución de `quiz-check-answer`.
2. Crea una política insertada mediante la vista JSON.
3. Copia `iam/check-answer-policy.json`.
4. Sustituye `TABLE_ARN` por el ARN de `QuizQuestions`.
5. Nombra la política `QuizQuestionsCheckAnswer`.

La función solo necesita `dynamodb:GetItem` porque comprobar una respuesta no modifica la tabla.

## Agregar el código

1. Sustituye el contenido de `index.mjs` por `lambda/check-answer/index.mjs`.
2. Pulsa **Deploy**.

## Probar una respuesta correcta

Crea el evento `CorrectAnswer`:

```json
{
  "id": "s3-001",
  "selectedIndex": 1
}
```

La respuesta debe incluir:

```json
{
  "statusCode": 200,
  "body": "{\"id\":\"s3-001\",\"isCorrect\":true,\"correctIndex\":1,\"explanation\":\"...\"}"
}
```

## Probar una respuesta incorrecta

Cambia `selectedIndex` a `0`. La respuesta debe contener `isCorrect: false`, junto con el índice correcto y la explicación.

## Validaciones incluidas

- El cuerpo debe ser JSON válido.
- `id` debe ser texto no vacío.
- `selectedIndex` debe ser un número entero.
- El índice debe corresponder a una opción existente.
- La pregunta debe existir en DynamoDB.

En la siguiente etapa publicaremos esta función mediante `POST /answers` en la misma HTTP API.
