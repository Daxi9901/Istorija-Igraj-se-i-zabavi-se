// ----------------------------
//  GLOBALNE PROMENLJIVE
// ----------------------------
let eras = [];
let currentEra = null;
let currentQuestionIndex = 0;
let score = 0;
let answered = false;

// ----------------------------
//  ELEMENTI IZ DOM-a
// ----------------------------
const eraSelect = document.getElementById("eraSelect");
const eraTitle = document.getElementById("eraTitle");
const eraTagline = document.getElementById("eraTagline");
const eraIntro = document.getElementById("eraIntro");

const educationSection = document.getElementById("educationSection");
const quizSection = document.getElementById("quizSection");
const startQuizBtn = document.getElementById("startQuizBtn");

const questionText = document.getElementById("questionText");
const answersContainer = document.getElementById("answersContainer");
const progress = document.getElementById("progress");
const scoreBox = document.getElementById("score");
const nextBtn = document.getElementById("nextBtn");
const feedback = document.getElementById("feedback");
const resultBox = document.getElementById("finalResult");

// Lista fajlova koje učitavamo
const eraFiles = [
    "egypt.json",
    "rome.json",
    "greece.json",
    "vizantija.json",
    "mesopotamija.json",
    "persijsko_carstvo.json",
    "vikinzi.json",
    "germani.json",
    "kelti.json",
    "srbija.json",
    "indija.json",
    "mongoli.json",
    "napoleon.json",
    "asirci.json",
    "hetiti.json",
    "fenicani.json",
    "sumeri.json",
    "prvisvetskirat.json",
    "drugisvetskirat.json",
    "bitkeww2.json",
    "komandantiww2.json",
    "holokaust.json",
    "americkarevolucija.json",
    "gradjanskiratsad.json",
    "francuskarevolucija.json",
    "industrijskarevolucija.json",
    "prvisrpskiustanak.json",
    "drugisrpskiustanak.json",
    "balkanskiratovi.json",
    "balkanskiratovibitke.json",
    "cerska_kolubarska.json",
];

// ----------------------------
//  UCITAVANJE LISTE EPOCH-a
// ----------------------------
async function loadEraList() {
    for (const file of eraFiles) {
        try {
            const response = await fetch(`data/${file}`);
            const eraData = await response.json();
            eras.push(eraData);

            const option = document.createElement("option");
            option.value = eraData.id;
            option.textContent = eraData.name;
            eraSelect.appendChild(option);
        } catch (err) {
            console.warn("Greška pri učitavanju:", file);
        }
    }

    if (eras.length > 0) {
        loadEra(eras[0].id);
    }
}

// ----------------------------
//  UCITAVANJE KONKRETNE ERE
// ----------------------------
function loadEra(eraId) {
    currentEra = eras.find(e => e.id === eraId);
    currentQuestionIndex = 0;
    score = 0;

    eraTitle.textContent = currentEra.name;
    eraTagline.textContent = currentEra.tagline;
    eraIntro.innerHTML = currentEra.intro.map(p => `<p>${p}</p>`).join("");

    educationSection.style.display = "block";
    quizSection.style.display = "none";

    resultBox.textContent = "";
    feedback.textContent = "";
    scoreBox.textContent = "Rezultat: 0";
    progress.textContent = `Pitanje 0/${currentEra.questions.length}`;
}

// ----------------------------
//  START KVIZA
// ----------------------------
startQuizBtn.addEventListener("click", () => {
    educationSection.style.display = "none";
    quizSection.style.display = "block";

    currentQuestionIndex = 0;
    score = 0;

    loadQuestion();
});

// ----------------------------
//  PRIKAZ PITANJA
// ----------------------------
function loadQuestion() {
    const q = currentEra.questions[currentQuestionIndex];

    questionText.textContent = q.question;
    answersContainer.innerHTML = "";
    feedback.textContent = "";
    resultBox.textContent = "";

    answered = false;
    nextBtn.disabled = true;

    q.answers.forEach((text, i) => {
        const btn = document.createElement("button");
        btn.className = "answer-btn";
        btn.textContent = text;
        btn.onclick = () => checkAnswer(i);
        answersContainer.appendChild(btn);
    });

    progress.textContent = `Pitanje ${currentQuestionIndex + 1}/${currentEra.questions.length}`;
    scoreBox.textContent = `Rezultat: ${score}`;
}

// ----------------------------
//  PROVERA ODGOVORA
// ----------------------------
function checkAnswer(index) {
    if (answered) return;
    answered = true;

    const q = currentEra.questions[currentQuestionIndex];
    const buttons = document.querySelectorAll(".answer-btn");

    buttons.forEach((btn, i) => {
        btn.disabled = true;
        if (i === q.correct) btn.classList.add("correct");
        if (i === index && i !== q.correct) btn.classList.add("wrong");
    });

    if (index === q.correct) {
        score++;
        feedback.textContent = "✔ Tačno!";
    } else {
        feedback.textContent = `✘ Netačno. Tačan odgovor: ${q.answers[q.correct]}`;
    }

    scoreBox.textContent = `Rezultat: ${score}`;

    // AUTOMATSKI ZAVRŠETAK NA POSLEDNJEM PITANJU
    const last = currentEra.questions.length - 1;
    if (currentQuestionIndex === last) {
        setTimeout(showFinalResult, 600);
        return;
    }

    nextBtn.disabled = false;
}

// ----------------------------
//  SLEDEĆE PITANJE
// ----------------------------
nextBtn.onclick = () => {
    if (!answered) return;

    currentQuestionIndex++;
    loadQuestion();
};

// ----------------------------
//  KRAJ KVIZA
// ----------------------------
function showFinalResult() {
    questionText.textContent = "Kraj kviza!";
    answersContainer.innerHTML = "";

    const total = currentEra.questions.length;
    const pct = Math.round((score / total) * 100);

    resultBox.innerHTML = `
        <strong>Osvojio si ${score}/${total} (${pct}%).</strong>
        <br><br>

        <button id="restartQuizBtn"
            style="padding:10px 18px;background:#4b86ff;border:none;border-radius:8px;
            color:#fff;font-size:15px;cursor:pointer;margin-right:10px;">
            Ponovi kviz
        </button>

        <button id="backToStartBtn"
            style="padding:10px 18px;background:#666;border:none;border-radius:8px;
            color:#fff;font-size:15px;cursor:pointer;">
            Vrati se na početak
        </button>
    `;

    feedback.textContent = "";
    nextBtn.disabled = true;

    document.getElementById("restartQuizBtn").onclick = restartQuiz;
    document.getElementById("backToStartBtn").onclick = returnToStart;
}

// ----------------------------
//  PONOVNO POKRETANJE
// ----------------------------
function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    answered = false;

    resultBox.textContent = "";
    feedback.textContent = "";
    nextBtn.disabled = true;

    loadQuestion();
}

// ----------------------------
//  POVRATAK NA EDUKACIJU
// ----------------------------
function returnToStart() {
    quizSection.style.display = "none";
    educationSection.style.display = "block";

    resultBox.textContent = "";
    feedback.textContent = "";
}

// ----------------------------
//  PROMENA ERE
// ----------------------------
eraSelect.addEventListener("change", () => loadEra(eraSelect.value));

// ----------------------------
//  START
// ----------------------------
loadEraList();
