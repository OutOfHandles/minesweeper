const boardDiv = document.getElementById('board');

const txt = document.querySelector('.txt');
const gameOverDiv = document.querySelector('.gameOver');
let current = [9, 10];


class cell{
    constructor(){
        this.mine = false;
        this.state = 0;
        this.revealed = false;
        this.minesNear = 0;
    }
}

class game{
    constructor(size, nMines){
        this.size = size;
        this.board = new Array(size);
        this.nMines = nMines;
        this.over = false;
        this.revealCounter = 0;
        this.generateBoard();
    }

    addNumber(row, col){
        row = parseInt(row);
        col = parseInt(col);
        for(let i = row - 1 ; i <= row + 1; i++){
            for(let j = col - 1; j <= col + 1; j++){
                if(i >= 0 && j >= 0 && i < this.size && j < this.size){
                    this.board[i][j].minesNear++;
                }
            }
        }
    }

    addMine(){
        for(let i = 0; i <  this.nMines; i++){
            do{
                let row = Math.floor(Math.random() * this.size);
                let col = Math.floor(Math.random() * this.size);
                if(this.board[row][col].mine === false){                    
                    this.board[row][col].mine = true;
                    this.addNumber(row, col);
                    break;
                }
            }while(true);
        }
    }

    floodFill(row, col){
        if(row < 0 || row >= this.size || col < 0 || col >= this.size || this.board[row][col].revealed === true)
        return;
    
        const cell = this.board[row][col];
        let btn = document.getElementById(`${row} ${col}`);

        this.revealCounter++;
        btn.classList.add('revealed');
    
        if(cell.minesNear > 0){
            switch(cell.minesNear){
                case 1:
                    btn.style.color = "#0000FF";
                    break;
                case 2:
                    btn.style.color = "#008000";
                    break;
                case 3:
                    btn.style.color = "#FF0000";
                    break;
                case 4:
                    btn.style.color = "#800080";
                    break;
                case 5:
                    btn.style.color = "#FF4500";
                    break;
                case 6:
                    btn.style.color = "#006400";
                    break;
                case 7:
                    btn.style.color = "#000000";
                    break;
                case 8:
                    btn.style.color = "#808080";
                    break;
                default:
                    btn.style.color = "#000000";
                    break;
            }
            btn.textContent = cell.minesNear;
            cell.revealed = true;
        }
        else{
            cell.revealed = true;
            
            this.floodFill(row - 1, col);
            this.floodFill(row + 1, col);
            this.floodFill(row, col - 1);
            this.floodFill(row, col + 1);
        }
    }

    kaboom(){
        this.over = true;
        for(let i = 0; i < this.size; i++){
            for(let j = 0; j < this.size; j++){

                let btn = document.getElementById(`${i} ${j}`);
                
                let cell = this.board[i][j];
                if(cell.state != 0)
                    btn.textContent = '';

                if(cell.mine === true)
                    btn.textContent = '💣';
            }
        }
        retryBtn.textContent = 'Retry';
        txt.textContent = 'Skill issue';
        gameOverDiv.style.display = 'block';
    }

    reveal(event, row, col){
        if(this.over)
            return;
        const cell = this.board[row][col];
        if(cell.revealed === true)
            return;

        event.target.classList.add('revealed');
        let btn = document.getElementById(`${row} ${col}`);

        if(cell.mine === true){
            btn.style.backgroundColor = 'red';
            this.kaboom();
            return;
        }
        if(cell.minesNear === 0){
            this.floodFill(row, col);
        }
        else{
            this.revealCounter++;
            switch(cell.minesNear){
                case 1:
                    btn.style.color = "#0000FF";
                    break;
                case 2:
                    btn.style.color = "#008000";
                    break;
                case 3:
                    btn.style.color = "#FF0000";
                    break;
                case 4:
                    btn.style.color = "#800080";
                    break;
                case 5:
                    btn.style.color = "#FF4500";
                    break;
                case 6:
                    btn.style.color = "#006400";
                    break;
                case 7:
                    btn.style.color = "#000000";
                    break;
                case 8:
                    btn.style.color = "#808080";
                    break;
                default:
                    btn.style.color = "#000000";
                    break;
            }
            event.target.textContent = cell.minesNear;
            cell.revealed = true;
        }
        
        if(this.revealCounter == ((this.size * this.size) - this.nMines) ){
            retryBtn.textContent = 'Play again';
            txt.textContent = 'You won!';
            gameOverDiv.style.display = 'block';
        }
    }
    
    rightClick(event, row, col){
        event.preventDefault();
        if(this.over)
            return;

        const target = event.target
        let cell = this.board[row][col]

        if(cell.revealed && cell.state == 0)
            return;

        switch(cell.state){
            case 0:
                target.textContent = '🚩'
                cell.state = 1;
                cell.revealed = true;
                break;
            case 1:
                target.textContent = '❓';
                cell.state = 2;
                cell.revealed = true;
                break;
            default:
                target.textContent = '';
                cell.state = 0;
                cell.revealed = false;
                break;
        }
    }

    generateBoard(){
        boardDiv.style.gridTemplateRows = `repeat(${this.size}, 50px)`;
        boardDiv.style.gridTemplateColumns = `repeat(${this.size}, 50px)`;

        if(current[0] <= 9)
            boardDiv.style.gap = '1px';
        else
            boardDiv.style.gap = '0px';

        for(let i = 0; i < this.size; i++){
            this.board[i] = new Array(this.size);

            for(let j = 0; j < this.size; j++){

                this.board[i][j] = new cell;
                
                let btn = document.createElement('button');
                btn.id = `${i} ${j}`;

                btn.addEventListener('click', (event) => { this.reveal(event, i, j) });
                btn.addEventListener('contextmenu', (event) => { this.rightClick(event, i, j) });

                boardDiv.appendChild(btn);

            }

        }
        this.addMine();
    }
}

let newGame;
newGame = new game(9, 10);

const retryBtn = document.getElementById('retry');
const hoverOpts = document.querySelector('.files');
const hiddenOpts = document.querySelector('.hidden');

const customContainer = document.querySelector('.customSize');
const closeBtn = document.getElementById('close');
const errorWarning = document.getElementById('error');
const inputSize = document.getElementById('inputSize');
const inputNumber = document.getElementById('inputNumber');
const applyCustom = document.getElementById('apply');

inputSize.oninput = () => {
    errorWarning.textContent = "";
}

inputNumber.oninput = () => {
    errorWarning.textContent = "";
}

closeBtn.addEventListener('click', function(){
    customContainer.style.display = 'none';
    inputSize.value = '';
    inputNumber.value = '';
})



applyCustom.addEventListener('click', function(){
    try{
        inputValue0 = inputSize.value.replace(/ /g, '');
        inputValue1 = inputNumber.value.replace(/ /g, '');
    
        if(inputValue0 === '' || inputValue1 === '' || isNaN(inputValue0) || isNaN(inputValue1)){
            errorWarning.textContent = "Invalid input";
            return;
        }
        if(inputValue0 > 25){
            errorWarning.textContent = "Board size exceeds the maximum size of 25!";
            return;
        }
        if(inputValue0 < 3){
            errorWarning.textContent = "Board size is too small!";
            return;
        }
        if(inputValue1 >= (inputValue0 * inputValue0) || inputValue1 <= 0){
            errorWarning.textContent = "Invalid number of bombs!";
            return;
        }

        boardDiv.innerHTML = '';
        current = [inputValue0, inputValue1];
        newGame = new game(inputValue0, inputValue1);
        customContainer.style.display = 'none';
        inputSize.value = '';
        inputNumber.value = '';
        return;
    }
    catch(e){
        errorWarning.textContent = "Invalid input";
        console.warn(e);
    }
})

retryBtn.addEventListener('click', function(){
    gameOverDiv.style.display = 'none';
    boardDiv.innerHTML = '';
    newGame = new game(current[0], current[1]);
})

hoverOpts.addEventListener('mouseenter', function(){
    hiddenOpts.style.display = 'flex';
})

hoverOpts.addEventListener('mouseleave', function(){
    hiddenOpts.style.display = 'none';
})

hoverOpts.addEventListener('click', function(event){
    try{
        const targetClass = event.target.classList.value;
        switch(targetClass){
            case "easy":
                boardDiv.innerHTML = '';
                current = [9, 10];
                newGame = new game(9, 10);
                break;
            case "medium":
                boardDiv.innerHTML = '';
                current = [16, 40];
                newGame = new game(16, 40);
                break;
            case "hard":
                boardDiv.innerHTML = '';
                current = [22, 99];
                newGame = new game(22, 99);
                break;
            case "custom":
                customContainer.style.display = 'block';
                break;
            default:
                break;
        }
    }
    catch(e){
        console.warn(e);
    }
})