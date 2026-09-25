# Etapa 2: almacenar preguntas en DynamoDB

## Objetivo

Crear una tabla que almacene las preguntas del cuestionario. En esta etapa el frontend todavía utilizará sus datos locales; primero comprobaremos que la tabla y su modelo funcionan.

## Modelo de un elemento

```json
{
  "id": "s3-001",
  "category": "Amazon S3",
  "text": "¿Qué característica permite conservar varias versiones de un mismo objeto?",
  "options": ["Lifecycle", "Versioning", "Replication", "Transfer Acceleration"],
  "correctIndex": 1,
  "explanation": "S3 Versioning permite recuperar versiones anteriores."
}
```

## Decisión de diseño

La tabla se llamará `QuizQuestions` y utilizará `id` de tipo String como clave de partición.

Cada pregunta tiene un identificador único como `s3-001` o `ec2-001`. Para esta primera versión no necesitamos una clave de ordenación porque cada elemento se consulta mediante un solo identificador.

Usaremos el modo de capacidad bajo demanda para no estimar unidades de lectura y escritura durante una práctica con poco tráfico.

## Crear la tabla desde la consola

1. Abre Amazon DynamoDB en la consola de AWS.
2. Confirma la región seleccionada y anótala; Lambda y API Gateway se crearán después en la misma región.
3. Entra en **Tables** y selecciona **Create table**.
4. En **Table name**, escribe `QuizQuestions`.
5. En **Partition key**, escribe `id` y selecciona el tipo **String**.
6. No agregues una sort key.
7. Conserva **Default settings**. Estas opciones utilizan capacidad bajo demanda en la configuración inicial actual.
8. Crea la tabla y espera hasta que su estado sea **Active**.

## Agregar el primer elemento

1. Abre la tabla `QuizQuestions`.
2. Selecciona **Explore table items** y después **Create item**.
3. Cambia a la vista **JSON**.
4. Pega el primer objeto de `data/questions.json`.
5. Guarda el elemento.
6. Comprueba que aparezca con el identificador `s3-001`.

## Qué debes comprender

- La clave de partición identifica dónde y cómo DynamoDB distribuye un elemento.
- `id` debe ser único en esta tabla porque no existe una clave de ordenación.
- DynamoDB no exige que todos los elementos tengan los mismos atributos.
- El índice de la respuesta correcta se guarda en la tabla, pero la API no lo enviará al navegador cuando solicite una pregunta.

Esta última decisión evita entregar la respuesta correcta antes de que el usuario responda. Más adelante una función Lambda consultará el elemento, comprobará la respuesta y devolverá únicamente el resultado y la explicación.
