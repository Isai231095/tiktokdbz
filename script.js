// specify variable based on CSS classes
const selectBox = document.querySelector(".select-box"),
selectBtnX = selectBox.querySelector(".options .playerX"),
selectBtnO = selectBox.querySelector(".options .playerO"),
playBoard = document.querySelector(".play-board"),
players = document.querySelector(".players"),
allBox = document.querySelectorAll("section span"),

resultBox = document.querySelector(".result-box"),
wonText = resultBox.querySelector(".won-text"),
replayBtn = resultBox.querySelector("button");

let minutes = 0;
let seconds = 0;
let timer;

function startTimer() {
    timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
    seconds++;
    if (seconds === 60) {
        seconds = 0;
        minutes++;
    }

    const formattedMinutes = padZero(minutes);
    const formattedSeconds = padZero(seconds);

    document.getElementById('minutes').innerText = formattedMinutes;
    document.getElementById('seconds').innerText = formattedSeconds;
}

function padZero(value) {
    return value < 10 ? '0' + value : value;
}

function stopTimer() {
    clearInterval(timer);
}


window.onload = ()=>{
    // make sure all the boxes in the board are clickable
    for (let i = 0; i < allBox.length; i++) {
       allBox[i].setAttribute("onclick", "clickedBox(this)");
    }
}

selectBtnX.onclick = () => {
    selectBox.classList.add("hide");
    playBoard.classList.add("show");
    startTimer(); // Inicia el cronómetro al elegir el jugador X
}

selectBtnO.onclick = () => { 
    selectBox.classList.add("hide");
    playBoard.classList.add("show");
    players.setAttribute("class", "players active player");
    startTimer(); // Inicia el cronómetro al elegir el jugador O
}


let playerXIcon = "fas fa-times", playerOIcon = "far fa-circle", playerSign = "X", runBot = true;

// user interaction with the board
function clickedBox(element){
    // console.log("Clicked")
    if(players.classList.contains("player")){
        playerSign = "O";
        element.innerHTML = `<i class="${playerOIcon}"></i>`;
        players.classList.remove("active");
        element.setAttribute("id", playerSign);
    }
    else{
        element.innerHTML = `<i class="${playerXIcon}"></i>`;
        element.setAttribute("id", playerSign);
        players.classList.add("active");
    }
    selectWinner();
    element.style.pointerEvents = "none";
    playBoard.style.pointerEvents = "none";

    // buffer time to pretend that the AI's thinking
    let randomTimeDelay = ((Math.random() * 1000) + 200).toFixed();
    setTimeout(()=>{
        bot(runBot);
    }, randomTimeDelay);
    console.log(playBoard);

}
  
// computer interaction with the board
function bot(){
    let array = [];
    if(runBot){
        playerSign = "O";
        // find the remaining boxes that has not been marked
        for (let i = 0; i < allBox.length; i++) {
            if(allBox[i].childElementCount == 0){
                array.push(i);
            }
        }
        // get random box from remaining tiles
        let randomBox = array[Math.floor(Math.random() * array.length)];
        if(array.length > 0){
            if(players.classList.contains("player")){ 
                playerSign = "X";
                allBox[randomBox].innerHTML = `<i class="${playerXIcon}"></i>`;
                allBox[randomBox].setAttribute("id", playerSign);
                players.classList.add("active"); 
            }
            else{
                allBox[randomBox].innerHTML = `<i class="${playerOIcon}"></i>`;
                players.classList.remove("active");
                allBox[randomBox].setAttribute("id", playerSign);
            }
            selectWinner();
        }
        allBox[randomBox].style.pointerEvents = "none";
        playBoard.style.pointerEvents = "auto";
        playerSign = "X";        
    }
}
// get the sign of a certain box
function getIdVal(classname){
    return document.querySelector(".box" + classname).id;
}
// check 3 tiles to see if they are the same
function checkIdSign(val1, val2, val3, sign){ 
    if(getIdVal(val1) == sign && getIdVal(val2) == sign && getIdVal(val3) == sign){
        return true;
    }
    return false;
}
// check winner
function selectWinner() {
    if (checkIdSign(1, 2, 3, playerSign) || checkIdSign(4, 5, 6, playerSign) || checkIdSign(7, 8, 9, playerSign) || checkIdSign(1, 4, 7, playerSign) || checkIdSign(2, 5, 8, playerSign) || checkIdSign(3, 6, 9, playerSign) || checkIdSign(1, 5, 9, playerSign) || checkIdSign(3, 5, 7, playerSign)) {
        runBot = false;
        bot(runBot);

        // buffer time
        setTimeout(() => {
            resultBox.classList.add("show");
            playBoard.classList.remove("show");
        }, 700);
        wonText.innerHTML = `Jugador ${playerSign}<br> ha ganado!`;

        stopTimer(); // Detener el cronómetro al determinar un ganador
    } else {
        // if the board is full
        if (getIdVal(1) !== "" && getIdVal(2) !== "" && getIdVal(3) !== "" && getIdVal(4) !== "" && getIdVal(5) !== "" && getIdVal(6) !== "" && getIdVal(7) !== "" && getIdVal(8) !== "" && getIdVal(9) !== "") {
            runBot = false;
            bot(runBot);

            // buffer time for showing the match has been drawn
            setTimeout(() => {
                resultBox.classList.add("show");
                playBoard.classList.remove("show");
            }, 700);
            wonText.textContent = "Ha sido un empate!";

            stopTimer(); // Detener el cronómetro en caso de empate
        }
    }
}

// reload page when replay button is clicked
replayBtn.onclick = () => {
    window.location.reload();
}

// Variable para manejar los tiempos guardados
let savedTimes = JSON.parse(localStorage.getItem('ticTacToeTimes')) || [];

// Función para mostrar la caja de ingreso de nombre
function showScoreboard() {
    resultBox.classList.remove('show');
    document.getElementById('scoreboardInput').classList.remove('hide');
    document.getElementById('scoreboardList').classList.remove('hide');
    displayScoreList();
}

// Función para guardar el tiempo actual
function saveScore() {
    const playerName = document.getElementById('playerName').value;
    const time = `${padZero(minutes)}:${padZero(seconds)}`;

    if (playerName && time) {
        const score = { name: playerName, time: `${padZero(minutes)}:${padZero(seconds)}` };
        savedTimes.push(score);
        savedTimes.sort((a, b) => (a.time > b.time) ? 1 : -1);
        savedTimes = savedTimes.slice(0, 10); // Limitar a los mejores 10 tiempos
        localStorage.setItem('ticTacToeTimes', JSON.stringify(savedTimes));
        displayScoreList();
        resetScoreboard();
    }
}

// Función para mostrar la lista de mejores tiempos
function displayScoreList() {
    const scoreList = document.getElementById('scoreList');
    scoreList.innerHTML = '';

    savedTimes.forEach((score, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${score.name} - ${score.time}`;
        scoreList.appendChild(listItem);
    });
}

// Función para resetear la caja de ingreso de nombre
function resetScoreboard() {
    document.getElementById('playerName').value = '';
    document.getElementById('scoreboardInput').classList.add('hide');
    document.getElementById('scoreboardList').classList.add('hide');
    resultBox.classList.add('show');
}
