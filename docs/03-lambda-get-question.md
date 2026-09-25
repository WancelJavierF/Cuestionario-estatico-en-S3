# Etapa 3: leer una pregunta con Lambda

## Objetivo

Crear una función Lambda que reciba un `id`, consulte `QuizQuestions` mediante `GetItem` y devuelva la pregunta sin incluir la respuesta correcta.

## Flujo de esta etapa

```text
Evento de prueba { "id": "s3-001" }
                  │
                  ▼
        Lambda quiz-get-question
                  │
                  │ dynamodb:GetItem
                  ▼
        DynamoDB QuizQuestions
```

## Crear la función

1. Abre AWS Lambda en la misma región donde creaste `QuizQuestions`.
2. Selecciona **Create function** y después **Author from scratch**.
3. Usa `quiz-get-question` como nombre.
4. Selecciona la versión más reciente de Node.js disponible.
5. Conserva la arquitectura predeterminada `x86_64`.
6. En permisos, selecciona **Create a new role with basic Lambda permissions**.
7. Crea la función.

El rol básico permite enviar registros a CloudWatch Logs. Todavía no concede acceso a DynamoDB.

## Configurar la variable de entorno

1. Dentro de la función, abre **Configuration**.
2. Entra en **Environment variables** y selecciona **Edit**.
3. Agrega:

   - Key: `TABLE_NAME`
   - Value: `QuizQuestions`

4. Guarda los cambios.

## Conceder permiso de lectura

1. Abre DynamoDB y entra en `QuizQuestions`.
2. En **Additional info**, copia el ARN de la tabla.
3. Regresa a Lambda y abre **Configuration > Permissions**.
4. Selecciona el nombre del rol de ejecución para abrirlo en IAM.
5. Elige **Add permissions > Create inline policy**.
6. Selecciona la vista JSON.
7. Copia `iam/get-question-policy.json` y sustituye `TABLE_ARN` por el ARN real.
8. Continúa y utiliza `QuizQuestionsReadItem` como nombre de la política.
9. Crea la política.

La acción `dynamodb:GetItem` permite leer un elemento si se conoce su clave. No permite listar, insertar, modificar ni eliminar elementos.

## Agregar el código

1. Regresa a la función Lambda y abre la pestaña **Code**.
2. Abre `index.mjs` en el editor de AWS.
3. Sustituye todo su contenido por `lambda/get-question/index.mjs`.
4. Selecciona **Deploy** para publicar el código guardado.

## Crear el evento de prueba

1. Selecciona **Test** y crea un evento nuevo.
2. Usa `GetS3Question` como nombre.
3. Reemplaza el JSON del evento por:

```json
{
  "id": "s3-001"
}
```

4. Guarda el evento y vuelve a seleccionar **Test**.

## Resultado esperado

```json
{
  "statusCode": 200,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": "{\"id\":\"s3-001\",\"category\":\"Amazon S3\",\"text\":\"...\",\"options\":[...]}"
}
```

`body` aparece como texto porque este es el formato que API Gateway espera de una integración Lambda proxy. Es normal ver comillas escapadas en la prueba directa.

Comprueba que `body` no contenga `correctIndex` ni `explanation`.

## Errores frecuentes

- `ResourceNotFoundException`: la tabla no existe en la región de la función o `TABLE_NAME` es incorrecto.
- `AccessDeniedException`: el rol no tiene `dynamodb:GetItem` sobre el ARN correcto.
- Respuesta 404: no existe un elemento con `id` igual a `s3-001`.
- Respuesta 500 sobre configuración: falta la variable `TABLE_NAME`.
