# Etapa 7: publicar la comprobación de respuestas

## Objetivo

Agregar `POST /answers` a `quiz-saa-api` y conectarla con `quiz-check-answer`.

## Flujo

```text
POST /answers
{ "id": "s3-001", "selectedIndex": 1 }
                       │
                       ▼
               API Gateway
                       │
                       ▼
          Lambda quiz-check-answer
                       │
                       ▼
            DynamoDB QuizQuestions
```

## Crear la integración

1. Abre `quiz-saa-api` en API Gateway.
2. Entra en **Integrations > Manage integrations**.
3. Crea una integración de tipo Lambda.
4. Selecciona `quiz-check-answer`.
5. Utiliza payload format version `2.0`.
6. Crea la integración.

No agregues el trigger desde la pantalla de Lambda porque esa opción crea automáticamente una ruta `ANY` con el nombre de la función.

## Crear la ruta

1. Entra en **Routes**.
2. Crea la ruta:

   - Method: `POST`
   - Path: `/answers`

3. Selecciona la ruta nueva.
4. Adjunta la integración `quiz-check-answer`.

La API debe mostrar:

```text
GET  /questions/{id} → quiz-get-question
POST /answers        → quiz-check-answer
```

La etapa `$default` publica automáticamente los cambios cuando Auto-deploy está activado.

## Autorizar la invocación

Comprueba en Lambda que la política basada en recursos de `quiz-check-answer` permita a API Gateway ejecutar `lambda:InvokeFunction`.

El ARN de origen sigue este formato:

```text
arn:aws:execute-api:REGION:ACCOUNT_ID:API_ID/*/POST/answers
```

Usar `POST/answers` limita el permiso a la ruta creada en esta etapa.

## Probar desde PowerShell

```powershell
$requestBody = @{
  id = "s3-001"
  selectedIndex = 1
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "INVOKE_URL/answers" `
  -Method Post `
  -ContentType "application/json" `
  -Body $requestBody
```

La respuesta debe indicar `isCorrect: true`.

Cambia `selectedIndex` a `0` y repite la solicitud. La respuesta debe indicar `isCorrect: false`.

## Errores frecuentes

- `Internal Server Error`: revisa el permiso basado en recursos de Lambda y los registros de CloudWatch.
- `Not Found`: comprueba que la ruta sea exactamente `/answers`.
- Mensaje sobre JSON inválido: envía `Content-Type: application/json` y utiliza `ConvertTo-Json`.
- Mensaje sobre `selectedIndex`: debe enviarse como número, sin comillas.

## Limpieza de rutas

Si todavía existe `ANY /quiz-get-question`, elimínala. Las únicas rutas necesarias hasta esta etapa son `GET /questions/{id}` y `POST /answers`.
