const problemElement = document.getElementById("problem");
const resultElement = document.getElementById("result");
const startContainer = document.getElementById("start-container");
const practiceContainer = document.getElementById("practice-container");
const summaryContainer = document.getElementById("summary");
const timerElement = document.getElementById("time-remaining");
const correctCountElement = document.getElementById("correct-count");
const incorrectCountElement = document.getElementById("incorrect-count");
const percentageElement = document.getElementById("percentage");

const correctSound = document.getElementById("correct-sound");
const incorrectSound = document.getElementById("incorrect-sound");

let currentProblem = {};
let correctAnswers = 0;
let incorrectAnswers = 0;
let practiceTime = 0;
let timer;

function startPractice() {
    const timeInput = document.getElementById("time-select").value;
    practiceTime = parseInt(timeInput);

    // Reinicia contadores y oculta la página inicial
    correctAnswers = 0;
    incorrectAnswers = 0;
    startContainer.style.display = "none";
    practiceContainer.style.display = "block";
    summaryContainer.style.display = "none";

    // Actualiza el cronómetro y genera el primer problema
    timerElement.textContent = practiceTime;
    generateProblem();

    // Inicia el temporizador
    clearInterval(timer);
    timer = setInterval(() => {
        practiceTime--;
        timerElement.textContent = practiceTime;

        if (practiceTime <= 0) {
            endPractice();
        }
    }, 1000);
}

function endPractice() {
    clearInterval(timer);

    // Muestra el resumen
    practiceContainer.style.display = "none";
    summaryContainer.style.display = "block";

    const totalAnswers = correctAnswers + incorrectAnswers;
    const percentage = totalAnswers > 0 ? ((correctAnswers / totalAnswers) * 100).toFixed(2) : 0;

    correctCountElement.textContent = `Correctas: ${correctAnswers}`;
    incorrectCountElement.textContent = `Incorrectas: ${incorrectAnswers}`;
    percentageElement.textContent = `Porcentaje de correctas: ${percentage}%`;
}

function goToStart() {
    // Muestra la página inicial y oculta las demás
    startContainer.style.display = "block";
    practiceContainer.style.display = "none";
    summaryContainer.style.display = "none";

    // Resetea los valores visuales
    document.getElementById("time-select").value = 60; // Valor predeterminado
}

function generateProblem() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const sign1 = Math.random() > 0.5 ? 1 : -1;
    const sign2 = Math.random() > 0.5 ? 1 : -1;
    const operation = Math.random() > 0.5 ? "multiply" : "divide";

    const term1 = num1 * sign1;
    const term2 = num2 * sign2;

    currentProblem = {
        term1,
        term2,
        operation,
        correctAnswer: calculateSign(term1, term2, operation),
    };

    if (operation === "multiply") {
        problemElement.innerHTML = `${term1} × ${term2}`;
    } else {
        problemElement.innerHTML = `
            <span id="numerator">${term1}</span>
            <span id="divider"></span>
            <span id="denominator">${term2}</span>
        `;
    }

    resultElement.textContent = "";
    resultElement.className = "";
}

function calculateSign(term1, term2, operation) {
    if (operation === "multiply") {
        return term1 * term2 > 0 ? "positive" : "negative";
    } else {
        return term1 / term2 > 0 ? "positive" : "negative";
    }
}

function checkAnswer(answer) {
    if (answer === currentProblem.correctAnswer) {
        correctAnswers++;
        resultElement.textContent = "¡Correcto! 😊";
        resultElement.className = "correct";
        correctSound.play(); // Reproduce el sonido correcto
    } else {
        incorrectAnswers++;
        const actualResult =
            currentProblem.correctAnswer === "positive" ? "Positivo" : "Negativo";
        resultElement.textContent = `Incorrecto ❌. El resultado es ${actualResult}.`;
        resultElement.className = "incorrect";
        incorrectSound.play(); // Reproduce el sonido incorrecto
    }

    // Genera automáticamente un nuevo problema después de una breve pausa
    setTimeout(() => {
        generateProblem();
    }, 1000);
}