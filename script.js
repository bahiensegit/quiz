let questions = [
    {
        "title": "O que são as pessoas chamadas de Boat People?",
        "options": [
            "Vietnamitas que navegam em lanchas em busca de novas explorações e territórios.",
            "Refugiados que fogem do país a partir de barcos, e estes são muito pequenos comparado ao grande número de pessoas que navegam nele.",
            "São trabalhadores que migram temporariamente para países europeus para trabalhar em indústrias pesadas.",
            "Turistas que navegam em iates e barcos de luxo."
        ],
        "correctOptionIndex": 2,
        "points": 10
    },
    {
        "title": "Quem venceu a guerra do Vietnã",
        "options": [
            "Vietnã do Norte",
            "Hanoi",
            "Palestina",
            "Vietnã do Sul"
        ],
        "correctOptionIndex": 1,
        "points": 10
    },
    {
        "title": "Qual urso é um urso típico do Vietnã?",
        "options": [
            "Urso-Malaio",
            "Urso panda",
            "Urso marrom",
            "Urso polar"
        ],
        "correctOptionIndex": 1,
        "points": 10
    },
    {
        "title": "Quais aspectos ambientais e sociais são destacados pela guia sobre Hanói?",
        "options": [
            "A grande biodiversidade no país e as arquiteturas francesas do país.",
            "A predominância de áreas urbanas e industriais.",
            "A economia centrada no setor de tecnologia.",
            "A ausência de florestas tropicais na região."
        ],
        "correctOptionIndex": 1,
        "points": 10
    },
    {
        "title": "Qual desses é um prato típico do Vietnã",
        "options": [
            "Lagosta Frita",
            "Mapo tofu",
            "Rolinho primavera",
            "Tian Bu la"
        ],
        "correctOptionIndex": 3,
        "points": 10
    },
    {
        "title": "O que ajudou a vitória do lado Norte do vietnã",
        "options": [
            "Tecnologia militar avançada.",
            "Apoio financeiro dos EUA.",
            "Superiores táticas marítimas.",
            "Melhor adaptação ao terreno e clima."
        ],
        "correctOptionIndex": 4,
        "points": 10
    },
    {
        "title": "Qual ideologia política o lado Norte do Vietnã apoiava.",
        "options": [
            "Capitalismo.",
            "Liberalismo.",
            "Comunismo.",
            "Monarquia."
        ],
        "correctOptionIndex": 3,
        "points": 10
    }
];

let currentQuestionIndex = 0;
let score = 0;
let time;
let cooldown = false;
let timenow

// Load questions from JSON file
// Start the quiz
function startQuiz() {
    time = (new Date()).getTime() / 1000
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('question-screen').style.display = 'block';
    displayQuestion();
}

// Display a question
function displayQuestion() {

    const question = questions[currentQuestionIndex];
    document.getElementById('question-title').innerText = question.title;
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(button);
    });
}

// Check if the selected answer is correct
function checkAnswer(selectedIndex) {
    if (cooldown) {
        return;
    }

    const question = questions[currentQuestionIndex];
    const options = document.getElementById('options-container').children;
    const pointsEarned = document.getElementById('points-earned');


    if (selectedIndex + 1 == question.correctOptionIndex) {
        options[selectedIndex].classList.add('correct');
        score += question.points;
        pointsEarned.innerText = `+${question.points} points`;
        pointsEarned.classList.add('points-animate');
    } else {
        options[selectedIndex].classList.add('wrong');
        pointsEarned.innerText = "+0 points";
    }

    cooldown = true

    setTimeout(() => {
        pointsEarned.classList.remove('points-animate');
        nextQuestion();
    }, 1000);
}

// Move to the next question or show the result screen
function nextQuestion() {
    cooldown = false;

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        timenow = (new Date()).getTime() / 1000;

        showTextQuestion();
    }
}

function showTextQuestion() {
    document.getElementById('question-screen').style.display = 'none';
    document.getElementById('text-question').style.display = 'block';
}

// Submit text answer and send it to a webhook
function submitTextAnswer() {
    const answer = document.getElementById('text-answer').value;


    const webhookURL = 'https://discord.com/api/webhooks/1298862605841989698/Dj690zN9GpwWLUMnZJHFrL7sjvEIsJMZcztXVgKVeA3Aw2ahxvjE3aKCLRhQcPH9GXH1';  // Replace with your webhook URL
    fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: answer }),
    })
    .then(response => {
        showResults();
    })
    .catch(error => {
        console.error('Error:', error);
        showResults();
    });
}

// Show the final scores
function showResults() {
    let questionsoutta = " (" + Object.keys(questions).length + "/" + score / 10 + ")"
    let timetodisplay = Math.floor((timenow - time) * 100) / 100

    document.getElementById('question-screen').style.display = 'none';
    document.getElementById('text-question').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';
    document.getElementById('leaderboard').style.display = 'block';
    document.getElementById('final-score').innerText = score.toString().concat(questionsoutta);
    document.getElementById('final-time').innerText = timetodisplay.toString().concat("s");

    console.log(Object.keys(questions).length)

    if (score / 10 == Object.keys(questions).length) {
        document.getElementById('final-message').innerText = "Parabéns! Você gabaritou o quiz!";
    } else {
        document.getElementById('final-message').innerText = "Não foi dessa vez... Sinta-se livre para tentar novamente!";
    }
    
    updateLeaderboard(timetodisplay);
}

function updateLeaderboard(Time) {
    // Get leaderboard from localStorage or initialize an empty array
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

    // Push the new time before sorting and slicing
    leaderboard.push(Time);

    // Sort the leaderboard in ascending order and take the top 3
    leaderboard.sort((a, b) => a - b);
    leaderboard = leaderboard.slice(0, 3); // Keep only top 3

    // Update localStorage with the new leaderboard
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

    // Update the UI leaderboard
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';

    leaderboard.forEach((time, index) => {
        console.log(time);
        const li = document.createElement('li');
        li.innerText = `${index + 1}. ${time} segundos`;
        leaderboardList.appendChild(li);
    });
}

// Restart the quiz
function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('leaderboard').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
}
