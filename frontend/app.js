const API_BASE_URL = "https://xi1ygrbqra.execute-api.us-east-1.amazonaws.com";

// El frontend conoce los identificadores, pero las preguntas y respuestas
// permanecen en DynamoDB y llegan a través de la API.
const questionIds = [
  "s3-001",
  "ec2-001",
  "iam-001",
  "dynamodb-001",
  "lambda-001",
  "rds-001",
  "cloudfront-001",
  "autoscaling-001",
  "vpc-001",
  "cloudformation-001"
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
let currentQuestion = null;
let correctAnswers = 0;
let answered = false;

function showFeedback(title, message) {
  elements.feedbackTitle.textContent = title;
  elements.explanation.textContent = message;
  elements.feedback.hidden = false;
}

function setLoadingState() {
  elements.quizCard.setAttribute("aria-busy", "true");
  elements.category.textContent = "CARGANDO";
  elements.question.textContent = "Consultando la siguiente pregunta...";
  elements.options.replaceChildren();
  elements.feedback.hidden = true;
  elements.nextButton.hidden = true;
}

async function loadQuestion() {
  setLoadingState();
  answered = false;

  const questionId = questionIds[currentQuestionIndex];

  try {
    const response = await fetch(`${API_BASE_URL}/questions/${questionId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? "No fue posible cargar la pregunta.");
    }

    currentQuestion = data;
    renderQuestion();
  } catch (error) {
    elements.category.textContent = "ERROR";
    elements.question.textContent = "No se pudo cargar la pregunta.";
    showFeedback("Revisa la conexión", error.message);
  } finally {
    elements.quizCard.removeAttribute("aria-busy");
  }
}

function renderQuestion() {
  elements.progress.textContent = `Pregunta ${currentQuestionIndex + 1} de ${questionIds.length}`;
  elements.progressBar.style.width = `${((currentQuestionIndex + 1) / questionIds.length) * 100}%`;
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

async function selectAnswer(selectedIndex) {
  if (answered) return;

  const optionButtons = [...elements.options.querySelectorAll(".option")];
  optionButtons.forEach((button) => { button.disabled = true; });

  try {
    const response = await fetch(`${API_BASE_URL}/answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: currentQuestion.id,
        selectedIndex
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message ?? "No fue posible comprobar la respuesta.");
    }

    answered = true;
    if (result.isCorrect) correctAnswers += 1;

    optionButtons.forEach((button, optionIndex) => {
      if (optionIndex === result.correctIndex) button.classList.add("correct");
      if (optionIndex === selectedIndex && !result.isCorrect) button.classList.add("incorrect");
    });

    elements.score.textContent = `Puntuación: ${correctAnswers}`;
    showFeedback(
      result.isCorrect ? "¡Respuesta correcta!" : "Respuesta incorrecta",
      result.explanation
    );
    elements.nextButton.textContent = currentQuestionIndex === questionIds.length - 1
      ? "Ver resultado"
      : "Siguiente pregunta";
    elements.nextButton.hidden = false;
  } catch (error) {
    optionButtons.forEach((button) => { button.disabled = false; });
    showFeedback("No se pudo comprobar la respuesta", error.message);
  }
}

function showResult() {
  const percentage = Math.round((correctAnswers / questionIds.length) * 100);
  elements.quizCard.hidden = true;
  elements.result.hidden = false;
  elements.resultTitle.textContent = `${correctAnswers} de ${questionIds.length} respuestas correctas`;
  elements.resultMessage.textContent = `Obtuviste ${percentage}%. Puedes repetir el cuestionario para reforzar los conceptos.`;
  elements.restartButton.focus();
}

function nextQuestion() {
  if (!answered) return;
  if (currentQuestionIndex === questionIds.length - 1) {
    showResult();
    return;
  }

  currentQuestionIndex += 1;
  loadQuestion();
}

function restartQuiz() {
  currentQuestionIndex = 0;
  correctAnswers = 0;
  currentQuestion = null;
  elements.result.hidden = true;
  elements.quizCard.hidden = false;
  loadQuestion();
}

elements.nextButton.addEventListener("click", nextQuestion);
elements.restartButton.addEventListener("click", restartQuiz);
loadQuestion();
