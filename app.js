const questionTrivia = document.getElementById('question');
const kindTrivia = document.getElementById('category');
const answersTrivia = document.querySelector('.see_answer');
const goalTrivia = document.getElementById('correct_answer');
const totalQuestions = document.getElementById('total_questions');
const buttonCheck = document.getElementById('check');
const buttonStart = document.getElementById('start_play');
const resultAnswer = document.getElementById('true_answer');
let correctAnswer = "";
// let incorrectAnswer = "";
// let optionsList = "";
let scoreTrivia = 0;
let scoreGoal = 0;
let numberQuestions = 10; 
/*Definir variables de categoria*/
let category = "";
let getCategory = "";
let getCodCategory = "";
/*Definir variables de dificulta*/
let level = "";
let getLevel = "";
/*Definir variables del tipo de respuesta */
let kindAnswer = "";
let getKindAnswer = "";
/*Definir variable URL */
let URL = "";
/*Llamar el boton*/
const checkButton = document.querySelector('#check-button');

/*Activar boton */
checkButton.addEventListener('click', function(){
    /*Seleccionar categoria*/
    category = document.getElementById('category_trivia');
    getCategory = category.options[category.selectedIndex].text;
    getCodCategory = category.value;
    console.log("Categoria: "+getCategory+" Cod: "+getCodCategory);
    /*Seleccionar nivel */
    level = document.getElementById('level_trivia');
    getLevel = level.options[level.selectedIndex].text.toString();
    console.log("Nivel: "+getLevel);
    /*Seleccionar tipo de respuestas */
    kindAnswer = document.getElementById('kind_answer');
    //getKindAnswer = kindAnswer.options[kindAnswer.selectedIndex].text;
    getKindAnswer = kindAnswer.value.toString();
    console.log("Tipo de respuesta: "+getKindAnswer);
    /*Construir URL */
    URL = `https://opentdb.com/api.php?amount=10&category=${getCodCategory}&difficulty=${getLevel}&type=${getKindAnswer}`;
    getTrivia();
})

/*Llamar API */
const getTrivia = async () => {
    const response = await fetch(URL.toString());
    const responseJson = await response.json();
    //console.log(responseJson);
    resultAnswer.innerHTML = "";
    showQuestion(responseJson.results[0]);
}

function evenListeners () {
    buttonCheck.addEventListener('click',checkAnswer);
    buttonStart.addEventListener('click',restartQuiz);
}
/*Activar marcador*/
document.addEventListener('DOMContentLoaded', () => {
    evenListeners();
    totalQuestions.textContent = numberQuestions;
    goalTrivia.textContent = scoreTrivia;
})



/*Mostrar pregunta*/
function showQuestion (responseJson) {
    buttonCheck.disabled = false;
    correctAnswer = responseJson.correct_answer;
    let incorrectAnswer = responseJson.incorrect_answers;
    let optionsList = incorrectAnswer;
    optionsList.splice(Math.floor(Math.random()*(incorrectAnswer.lenght + 1)), 0, correctAnswer);
    console.log(optionsList);
    console.log(correctAnswer);
    /*Mostrar la preguntas y parametrización de la trivia*/
    kindTrivia.innerHTML = `Category: ${responseJson.category}<br>Nivel: ${responseJson.difficulty}<br>Answer Type: ${responseJson.type}`;
    questionTrivia.innerHTML = `${responseJson.question}`;
    /*Mostrar las respuestas*/
    answersTrivia.innerHTML = `${optionsList.map((option, index) => `<li>${index + 1}. <span>${option}</span></li>`).join('')}`;
    selectOption();
}
/*Seleccionar respuesta*/
function selectOption(){
    answersTrivia.querySelectorAll('li').forEach(function(option){
        option.addEventListener('click', function(){
            if(answersTrivia.querySelector('.selected')){
                const activeOption = _options.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
}

/*Verificar respuesta*/
function checkAnswer () {
    //console.log("hola");
    buttonCheck.disabled = true;
    if(answersTrivia.querySelector('.selected')) {
        let selectedAnswer = answersTrivia.querySelector('.selected span').textContent;
        console.log("Respuesta usuario: "+selectedAnswer);
        if(selectedAnswer == HTMLDecode(correctAnswer)) {
            scoreTrivia++;
            resultAnswer.innerHTML = `<p> <i></i>✔ Correct Answer! </p>`;
        } else {
            resultAnswer.innerHTML = `<p> <i></i>❌ Incorrect Answer! <small><br><b>Correct Answer: </b>${correctAnswer}</small></p>`;
        }
    }
    trueCount();
}
/*Mostar si es correcta o no la respuesta */
function HTMLDecode (textString){
    let doc = new DOMParser().parseFromString(textString,"text/html")
    return doc.documentElement.textContent;
}

/*Contador de respuestas correctas */
function trueCount() {
    scoreGoal++;
    setCount();
    if(scoreGoal == numberQuestions) {
        setTimeout(function() {
            getTrivia();
            console.log("");
        },1000);
        resultAnswer.innerHTML += `<p>Your score is ${scoreTrivia*100}.</p>`
        buttonStart.style.display = "block";
        buttonCheck.style.display = "none";
    } else {
        setTimeout(function(){
        getTrivia();
        }, 300);
    }
}

function setCount() {
    totalQuestions.textContent = numberQuestions;
    goalTrivia.textContent = scoreGoal;
}

function restartQuiz(){
    scoreGoal = 0;
    scoreTrivia = 0;
    buttonStart.style.display = "none";
    buttonCheck.style.display = "block";
    buttonCheck.disabled = false;
    setCount();
    loadQuestion();
}