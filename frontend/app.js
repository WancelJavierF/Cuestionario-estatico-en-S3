// En esta primera etapa los datos viven en el navegador.
// Más adelante sustituiremos este arreglo por una llamada a API Gateway.
const questions = [
  {
    id: "s3-001",
    category: "Amazon S3",
    text: "¿Qué característica permite conservar varias versiones de un mismo objeto?",
    options: ["Lifecycle", "Versioning", "Replication", "Transfer Acceleration"],
    correctIndex: 1,
    explanation: "S3 Versioning asigna un identificador diferente a cada versión y permite recuperar versiones anteriores."
  },
  {
    id: "ec2-001",
    category: "Amazon EC2",
    text: "¿Qué servicio distribuye tráfico entre varias instancias EC2?",
    options: ["Elastic Load Balancing", "Amazon Route 53", "AWS Auto Scaling", "Amazon CloudWatch"],
    correctIndex: 0,
    explanation: "Elastic Load Balancing recibe el tráfico y lo distribuye entre destinos saludables, como instancias EC2."
  },
  {
    id: "iam-001",
    category: "AWS IAM",
    text: "¿Qué práctica sigue el principio de mínimo privilegio?",
    options: ["Asignar AdministratorAccess", "Compartir el usuario raíz", "Conceder solo las acciones necesarias", "Crear claves sin fecha de rotación"],
    correctIndex: 2,
    explanation: "El mínimo privilegio concede únicamente las acciones y recursos necesarios para realizar una tarea."
  },
  {
    id: "dynamodb-001",
    category: "Amazon DynamoDB",
    text: "¿Qué dato es obligatorio al crear una tabla de DynamoDB?",
    options: ["Una dirección IP", "Una clave de partición", "Un bucket de S3", "Una instancia EC2"],
    correctIndex: 1,
    explanation: "Toda tabla de DynamoDB requiere una clave de partición; opcionalmente puede incluir una clave de ordenación."
  },
  {
    id: "lambda-001",
    category: "AWS Lambda",
    text: "¿Cuál es una característica principal de AWS Lambda?",
    options: ["Requiere administrar el sistema operativo", "Solo funciona dentro de EC2", "Ejecuta código en respuesta a eventos", "Necesita una VPC para funcionar"],
    correctIndex: 2,
    explanation: "Lambda ejecuta funciones bajo demanda en respuesta a eventos y AWS administra la infraestructura de ejecución."
  },
  {
    id: "rds-001",
    category: "Amazon RDS",
    text: "¿Qué tipo de base de datos NO es compatible con Amazon RDS?",
    options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"],
    correctIndex: 2,
    explanation: "Amazon RDS admite motores relacionales como MySQL, PostgreSQL, MariaDB, Oracle, SQL Server y Db2, pero no MongoDB."
  },
  {
    id: "cloudfront-001",
    category: "Amazon CloudFront",
    text: "¿Cuál es la función principal de Amazon CloudFront?",
    options: ["Almacenar datos en la nube", "Distribuir contenido a nivel global", "Monitorear instancias EC2", "Gestionar usuarios y permisos"],
    correctIndex: 1,
    explanation: "CloudFront es una red de entrega de contenido (CDN) que distribuye contenido a nivel global con baja latencia."
  },
  {
    id: "autoscaling-001",
    category: "AWS Auto Scaling",
    text: "¿Qué hace AWS Auto Scaling?",
    options: ["Crea copias de seguridad de datos", "Ajusta automáticamente la capacidad de recursos", "Monitorea el tráfico web", "Gestiona usuarios y permisos"],
    correctIndex: 1,
    explanation: "AWS Auto Scaling ajusta automáticamente la capacidad de recursos para mantener un rendimiento estable y predecible."
  },
  {
    id: "vpc-001",
    category: "Amazon VPC",
    text: "¿Qué es una Amazon VPC?",
    options: ["Un servicio de almacenamiento", "Una red virtual privada en la nube", "Un tipo de base de datos", "Un servicio de monitoreo"],
    correctIndex: 1,
    explanation: "Amazon VPC permite crear una red virtual aislada en la nube donde se pueden lanzar recursos de AWS."
  },
  {
    id: "cloudformation-001",
    category: "AWS CloudFormation",
    text: "¿Cuál es el propósito principal de AWS CloudFormation?",
    options: ["Gestionar usuarios y permisos", "Automatizar la creación de recursos en AWS", "Monitorear el tráfico web", "Almacenar datos en la nube"],
    correctIndex: 1,
    explanation: "AWS CloudFormation permite definir y provisionar recursos de AWS mediante plantillas, facilitando la automatización."
  }
];

const elements = {
  quizCard: document.querySelector(".quiz-card"),
  progress: document.querySelector("#progress"),
  progressBar: document.querySelector("#progress-bar"),
  score: document.querySelector("#score"),
  category: document.querySelector("#category"),
  question: document.querySelector("#question"),
  options: document.querySelector("#options"),
  feedback: document.querySelector("#feedback"),
  feedbackTitle: document.querySelector("#feedback-title"),
  explanation: document.querySelector("#explanation"),
  nextButton: document.querySelector("#next-button"),
  result: document.querySelector("#result"),
  resultTitle: document.querySelector("#result-title"),
  resultMessage: document.querySelector("#result-message"),
  restartButton: document.querySelector("#restart-button")
};

let currentQuestionIndex = 0;
let correctAnswers = 0;
let answered = false;

function renderQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  answered = false;

  elements.progress.textContent = `Pregunta ${currentQuestionIndex + 1} de ${questions.length}`;
  elements.progressBar.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;
  elements.score.textContent = `Puntuación: ${correctAnswers}`;
  elements.category.textContent = currentQuestion.category;
  elements.question.textContent = currentQuestion.text;
  elements.options.replaceChildren();
  elements.feedback.hidden = true;
  elements.nextButton.hidden = true;

  currentQuestion.options.forEach((option, optionIndex) => {
    const button = document.createElement("button");
    button.className = "option";
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", () => selectAnswer(optionIndex));
    elements.options.append(button);
  });
}

function selectAnswer(selectedIndex) {
  if (answered) return;
  answered = true;

  const currentQuestion = questions[currentQuestionIndex];
  const optionButtons = [...elements.options.querySelectorAll(".option")];
  const isCorrect = selectedIndex === currentQuestion.correctIndex;

  if (isCorrect) correctAnswers += 1;

  optionButtons.forEach((button, optionIndex) => {
    button.disabled = true;
    if (optionIndex === currentQuestion.correctIndex) button.classList.add("correct");
    if (optionIndex === selectedIndex && !isCorrect) button.classList.add("incorrect");
  });

  elements.score.textContent = `Puntuación: ${correctAnswers}`;
  elements.feedbackTitle.textContent = isCorrect ? "¡Respuesta correcta!" : "Respuesta incorrecta";
  elements.explanation.textContent = currentQuestion.explanation;
  elements.feedback.hidden = false;
  elements.nextButton.textContent = currentQuestionIndex === questions.length - 1
    ? "Ver resultado"
    : "Siguiente pregunta";
  elements.nextButton.hidden = false;
}

function showResult() {
  const percentage = Math.round((correctAnswers / questions.length) * 100);
  elements.quizCard.hidden = true;
  elements.result.hidden = false;
  elements.resultTitle.textContent = `${correctAnswers} de ${questions.length} respuestas correctas`;
  elements.resultMessage.textContent = `Obtuviste ${percentage}%. Puedes repetir el cuestionario para reforzar los conceptos.`;
  elements.restartButton.focus();
}

function nextQuestion() {
  if (!answered) return;
  if (currentQuestionIndex === questions.length - 1) {
    showResult();
    return;
  }

  currentQuestionIndex += 1;
  renderQuestion();
}

function restartQuiz() {
  currentQuestionIndex = 0;
  correctAnswers = 0;
  elements.result.hidden = true;
  elements.quizCard.hidden = false;
  renderQuestion();
}

elements.nextButton.addEventListener("click", nextQuestion);
elements.restartButton.addEventListener("click", restartQuiz);
renderQuestion();
