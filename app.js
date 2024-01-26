// Fisher-Yates algorithm for array shuffling
const shuffleArray = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}

const shuffledStudents = [...students];  // clone `students` array  
shuffleArray(shuffledStudents);  // shuffle the `shuffledStudents` array
            
// Kod för att ändra bilden från js. Återkommer till detta senare.
const imgdiv = document.querySelector('#imgdiv');

// Lite variabler som sätter kontext för spelet
let totalRounds = 0;
let currentRound = 0;
let correctAnswers = 0;
let passedStudents = [];
let incorrectStudents= [];


//Hämta knappar, samt popup för att sätta igång spelet
const gameTen = document.querySelector('#gameTen')
const gameTwenty = document.querySelector('#gameTwenty')
const gameAll = document.querySelector('#gameAll')
const popup = document.querySelector('#popup')

let studentsInGame;

//Sätt vad de olika knapptrycken för en spelomgång ska navigera till
gameTen.addEventListener('click', () => {
    totalRounds = 10;
    studentsInGame = shuffledStudents.slice(0,10);
    //Av nån anledning laddade vissa bilder segt så sidan hoppade till. Därför förladdar jag bilder för varje spelomgång här.
    studentsInGame.forEach(student => {
        const img = new Image();
        img.src = student.image;
    });
    updateNameAndImg();
    popup.style.display = 'none';
});

gameTwenty.addEventListener('click', () => {
    totalRounds = 20;
    studentsInGame = shuffledStudents.slice(0,20);
    studentsInGame.forEach(student => {
        const img = new Image();
        img.src = student.image;
    });
    updateNameAndImg();
    popup.style.display = 'none';
});

gameAll.addEventListener('click', () => {
    studentsInGame = shuffledStudents.slice(0)
    totalRounds = studentsInGame.length 
    studentsInGame.forEach(student => {
        const img = new Image();
        img.src = student.image;
    });
    updateNameAndImg();
    popup.style.display = 'none';
});

// En funktion som uppdaterar bilden och sätter fyra namn (varav ett är personen på bilden) på random knappar
const knappKlass = document.querySelectorAll('.spelknapp')
let currentStudent;
let updateNameAndImg = function() {
let i = currentRound;
currentStudent = studentsInGame[i];

        // Skicka ut current student-bild till bild-div
        imgdiv.innerHTML = `<img src="${studentsInGame[i].image}" />`
        
            //Skaffa fram en shufflad array för knapprendering
            const knappArray = Array.from(knappKlass);

            //Titta, jag använder map! (för att göra en array av enbart index, för att senare kunna slumpa knapparna)
            let knappIndex = knappArray.map((_, index) => index)
            const mixKnapp = [...knappIndex]
            shuffleArray(mixKnapp)

            //Skapa en array med fyra olika namn, varav ett är current student
            let fourStudents = []
            //Titta, jag använder filter! (för att filtrera ut currentStudent, så samma namn inte kommer två gånger på knapparna)
            let filteredStudents = shuffledStudents.filter(student => student !== currentStudent)
            shuffleArray(filteredStudents)
            fourStudents = filteredStudents.slice(0,3) 
            fourStudents.push(currentStudent)

        // Loopa över knapparna och ge dem namn från fourStudents. Randomisera deras position med hjälp av  
        knappKlass.forEach((element, index) => {
            element.textContent = fourStudents[mixKnapp[index]].name
        })
}

// Spelet går ut på att klicka knappar. Nedanstående kod bestämmer vad som händer då användaren trycker. 
let playGame = function() {
    knappKlass.forEach(button => {
        button.addEventListener('click', (e) => {
            currentRound++
            if (e.target.innerHTML === currentStudent.name) {
                correctAnswers++
            } else if (e.target.innerHTML !== currentStudent.name) {
                incorrectStudents.push(currentStudent)    
            }
            score.textContent = `Resultat: ${correctAnswers} av ${currentRound}`

                if (currentRound < totalRounds) {
                    updateNameAndImg();
                } else {
                    showResult();
                }
        })
    })
}
playGame();

// Hämta popups för att visa resultat samt bjuda in till nytt spel 
const visaPop = document.querySelector('#showResult')
const visa = document.querySelector('#showResultContent')
const visaPopDiv = document.querySelector('#showResultContent > div')


//Funktion för att visa resultat och bjuda in till nytt spel
let lastRoundCorrect;
let lastRoundRounds
const showResult = function() {
    visaPop.style.display = 'flex';
    visa.scrollTop = 0;
        //If else som bestämmer vilken respons spelaren ska få
        if(lastRoundCorrect && lastRoundRounds) {
            visaPopDiv.textContent = `\u2022 Ditt resultat: ${correctAnswers} av ${currentRound} möjliga.\n \u2022 Förra rundans resultat: ${lastRoundCorrect} av ${lastRoundRounds}.`
        } else {
            visaPopDiv.textContent = `\u2022 Ditt resultat: ${correctAnswers} av ${currentRound} möjliga.\n`
        }

            //If else för vidare feedback på spelomgången
            if(correctAnswers === currentRound) {
                    visaPopDiv.textContent += '\u2022 Full pott! Hurra! '
                } else if (lastRoundCorrect > correctAnswers) {
                    let feedbackNeg = document.createElement('p')
                    feedbackNeg.textContent = '\u2022 Du fick alltså sämre resultat än förra rundan.';
                    visaPopDiv.appendChild(feedbackNeg);
                } else if (lastRoundCorrect < correctAnswers) {
                    let feedbackPos = document.createElement('p')
                    feedbackPos.textContent = '\u2022 Du förbättrade alltså ditt resultat från förra rundan!';
                    visaPopDiv.appendChild(feedbackPos);
                }
                    
                // let containsError = passedStudents.some(student => student.check === false)
                    if(incorrectStudents.length > 0) {
                        let faultsText = document.createElement('p');
                        faultsText.textContent = '\u2022 Du behöver öva mer på följande:';
                        visaPopDiv.appendChild(faultsText);
                    }
                    // Skapa ny array för felaktiga svar och kör ut dem som bilder 
                    incorrectStudents.forEach(student => {
                            let faultsImg = document.createElement('img');
                            faultsImg.src = student.image;
                            visaPopDiv.appendChild(faultsImg);
                            let faultsName = document.createElement('p');
                            faultsName.textContent = student.name;
                            visaPopDiv.appendChild(faultsName);
        });
}

// Hämta spela igen-knapp. Nollställer alla data så det är en fräsch ny runda. Sparar dessutom antal rätta svar för jämförelse med nästa runda.
const playAgain = document.querySelector('#playAgain');

playAgain.addEventListener('click', () => {
    lastRoundCorrect = correctAnswers;
    lastRoundRounds = totalRounds;
    totalRounds = 0;
    currentRound = 0;
    correctAnswers = 0;
    incorrectStudents = []
    score.textContent = 'Ditt resultat: ';
    popup.style.display = 'flex';
    visaPop.style.display = 'none';
    shuffleArray(shuffledStudents);  
})

