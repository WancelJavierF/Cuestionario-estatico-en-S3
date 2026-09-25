# Etapa 8: conectar el frontend con la API

## Objetivo

Sustituir las preguntas locales del navegador por solicitudes reales a API Gateway.

El frontend utiliza:

- `GET /questions/{id}` para obtener el texto y las opciones.
- `POST /answers` para comprobar la opción elegida.

## Configurar CORS

El navegador aplica la política del mismo origen. Como el frontend y API Gateway usan direcciones diferentes, la API debe responder con permisos CORS.

1. Abre `quiz-saa-api` en API Gateway.
2. Entra en **CORS**.
3. Configura **Access-Control-Allow-Origin** temporalmente con `*`.
4. En **Access-Control-Allow-Headers**, agrega `content-type`.
5. En **Access-Control-Allow-Methods**, agrega `GET`, `POST` y `OPTIONS`.
6. Guarda los cambios.

La etapa `$default` los publica automáticamente. Cuando el frontend tenga una dirección definitiva en S3, reemplazaremos `*` por ese origen concreto.

## Código del frontend

`frontend/app.js` contiene `API_BASE_URL` con la dirección de API Gateway y una lista de diez identificadores.

La función `loadQuestion()` solicita la pregunta actual. La función `selectAnswer()` envía el identificador y el índice seleccionado mediante JSON.

Las respuestas correctas dejaron de estar en el frontend. Solamente Lambda y DynamoDB conocen `correctIndex` antes de cada respuesta.

## Probar localmente

Sirve la carpeta del proyecto con un servidor local. Desde la raíz del repositorio puedes utilizar:

```powershell
python -m http.server 8766
```

Abre:

```text
http://localhost:8766/frontend/
```

Si el navegador muestra un error relacionado con CORS, revisa los tres valores configurados en API Gateway y confirma que los cambios estén guardados.

## Siguiente etapa

Después de probar las diez preguntas, publicaremos `frontend` en un bucket S3 separado y limitaremos CORS a la dirección pública de ese sitio.
