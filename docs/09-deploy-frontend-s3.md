# Etapa 9: publicar el frontend en Amazon S3

## Objetivo

Publicar `index.html`, `styles.css` y `app.js` mediante el endpoint de alojamiento web estático de un bucket dedicado.

## Crear el bucket

1. Abre Amazon S3 y crea un bucket de propósito general.
2. Utiliza `us-east-1`, la misma región utilizada por la API.
3. Elige un nombre globalmente único, por ejemplo `quiz-aws-saa-wanceljavier-2026`.
4. Conserva **Object Ownership** con ACL deshabilitadas.
5. Crea el bucket.

## Subir los archivos

Abre el bucket y sube directamente el contenido de `frontend`:

```text
index.html
styles.css
app.js
```

Los tres archivos deben aparecer en la raíz. No subas la carpeta `frontend` como un nivel adicional.

## Activar el alojamiento web

1. Abre **Properties**.
2. En **Static website hosting**, selecciona **Edit**.
3. Habilita el alojamiento de sitio estático.
4. En **Index document**, escribe `index.html`.
5. Guarda los cambios.

## Permitir la lectura de los archivos públicos

En **Permissions > Block public access**, conserva activados los bloqueos relacionados con ACL y desactiva los dos bloqueos relacionados con políticas públicas del bucket.

Después abre **Bucket policy**:

1. Copia `s3/website-policy.json`.
2. Sustituye `BUCKET_NAME` en las tres apariciones por el nombre real del bucket.
3. Guarda la política.

La política permite únicamente `s3:GetObject` sobre los tres archivos del frontend. No permite listar, subir, modificar o eliminar objetos.

## Probar el endpoint

Regresa a **Properties > Static website hosting** y copia el endpoint del sitio. Tendrá una forma parecida a:

```text
http://quiz-aws-saa-wanceljavier-2026.s3-website-us-east-1.amazonaws.com
```

El endpoint web de S3 utiliza HTTP. Esto es una limitación temporal mientras CloudFront continúa restringido en la cuenta.

## Restringir CORS de la API

Después de confirmar la dirección, abre **API Gateway > quiz-saa-api > CORS**.

Elimina `*` de **Access-Control-Allow-Origin** y agrega dos orígenes, sin barra final:

```text
http://localhost:8766
http://NOMBRE_DEL_BUCKET.s3-website-us-east-1.amazonaws.com
```

Conserva:

```text
Access-Control-Allow-Headers: content-type
Access-Control-Allow-Methods: GET, POST, OPTIONS
```

El origen de S3 permite usar la versión publicada. El origen localhost conserva las pruebas locales.

## Actualizaciones posteriores

Cuando cambie el frontend, reemplaza en S3 únicamente los archivos modificados. Como esta versión no usa CloudFront, no necesita invalidaciones de caché de una distribución.
