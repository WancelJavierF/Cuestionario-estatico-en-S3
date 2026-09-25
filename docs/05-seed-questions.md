# Etapa 5: cargar las preguntas con código

## Objetivo

Crear una función Lambda temporal que inserte las cinco preguntas mediante una operación `BatchWriteItem`.

Esta función no tendrá un trigger ni una ruta pública. La invocaremos una vez desde la consola y la eliminaremos después de comprobar los datos.

## Crear la función

1. Abre Lambda en `us-east-1`.
2. Crea una función desde cero llamada `quiz-seed-questions`.
3. Selecciona la versión más reciente de Node.js y la arquitectura `x86_64`.
4. Permite que Lambda cree un rol nuevo con permisos básicos.
5. Crea la función.

## Configurar la tabla

Agrega esta variable de entorno:

- Key: `TABLE_NAME`
- Value: `QuizQuestions`

## Agregar el permiso

1. Copia el ARN de `QuizQuestions` desde DynamoDB.
2. Abre el rol de ejecución de `quiz-seed-questions`.
3. Crea una política insertada mediante la vista JSON.
4. Copia `iam/seed-questions-policy.json`.
5. Sustituye `TABLE_ARN` por el ARN de la tabla.
6. Nombra la política `QuizQuestionsBatchWrite`.

Este rol solo podrá ejecutar `dynamodb:BatchWriteItem` sobre esa tabla.

## Agregar y ejecutar el código

1. Sustituye el contenido de `index.mjs` por `lambda/seed-questions/index.mjs`.
2. Pulsa **Deploy**.
3. Crea un evento de prueba llamado `SeedQuestions` con este contenido:

```json
{}
```

4. Ejecuta la prueba.

El resultado esperado es:

```json
{
  "statusCode": 200,
  "body": "{\"message\":\"Preguntas guardadas correctamente.\",\"insertedCount\":5}"
}
```

## Verificar los datos

Abre `QuizQuestions` en DynamoDB y selecciona **Explore table items**. Deben aparecer estos identificadores:

```text
s3-001
ec2-001
iam-001
dynamodb-001
lambda-001
```

`BatchWriteItem` vuelve a escribir un elemento si ya existe la misma clave. Por eso `s3-001` no se duplica.

## Limpieza posterior

Después de comprobar los cinco elementos, elimina `quiz-seed-questions` y su rol de ejecución. El código permanecerá en GitHub como evidencia reproducible del proceso.
