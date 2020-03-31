let
    canv = document.getElementById('canv'),
    ctx = canv.getContext('2d'), 
    
    dx = 0,
    dy = 0,

    cellSize = Math.round((window,innerWidth / 100) * 3.5),
    rectSize = cellSize,
    
    snake = [
        {x: cellSize*1, y: cellSize},
        {x: cellSize*2, y: cellSize},
        {x: cellSize*3, y: cellSize},
        {x: cellSize*4, y: cellSize},
        {x: cellSize*5, y: cellSize}
    ],
    
    appleSize = cellSize,
    appleCords = {x: cellSize*8, y: cellSize},
    interval = 130,
    score = 0, 
    inputForScore = document.getElementById('score'),
    
    status = 'noAction', 
    pressTimes = 0,
    lastDirection = null,
    mc = new Hammer(document.body);

canv.width = window.innerWidth;
canv.height = window.innerHeight;


mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
document.addEventListener('keypress', keypressHandler);

// Свайп вниз
function swipedownHandler() {

    if(lastDirection !== 'up') {
        if(pressTimes === 0) {
            setInterval(gameProcess, interval);
            status = 'start';
        }

        dx = 0;
        dy = cellSize;

        setTimeout(() => {lastDirection = 'down'}, interval);
        pressTimes++;
    }
}
mc.on('swipedown',swipedownHandler) 

// Свайп вверх
function swipeupHandler() {
    if(lastDirection !== 'down') {
        if(pressTimes === 0) {
            setInterval(gameProcess, interval);
            status = 'start';
        }
    
        dx = 0;
        dy = -cellSize;
    
        setTimeout(() => {lastDirection = 'up'}, interval);
        pressTimes++;  
    }
}
mc.on('swipeup', swipeupHandler)

// Свайп вправо
function swiperightHandler() {
    if(lastDirection !== 'left') {    
        if(pressTimes === 0) {
            setInterval(gameProcess, interval);
            status = 'start';
        }

        dx = cellSize;
        dy = 0;

        setTimeout(() => {lastDirection = 'right'}, interval);
        pressTimes++;
    }

}
mc.on('swiperight', swiperightHandler)

// Свайп влево 
function swipeleftHandler() {

    if(lastDirection !== 'right') {        
    
        dx = -cellSize;
        dy = 0;

        setTimeout(() => {lastDirection = 'left'}, interval);
        pressTimes++;
    }
}
mc.on('swipeleft',swipeleftHandler)




function keypressHandler(e) {
    // RIGHT
    if((e.keyCode === 100 || e.keyCode === 1074) && lastDirection !== 'left') {
        if(pressTimes === 0) {
            setInterval(gameProcess, interval);
            status = 'start';
        }

        dx = cellSize;
        dy = 0;

        setTimeout(() => {lastDirection = 'right'}, interval);
        pressTimes++;
    }
    // DOWN
    if((e.keyCode === 115 || e.keyCode === 1099) && lastDirection !== 'up') {
        if(pressTimes === 0) {
            setInterval(gameProcess, interval);
            status = 'start';
        }

        dx = 0;
        dy = cellSize;

        setTimeout(() => {lastDirection = 'down'}, interval);
        pressTimes++;
    }
    // LEFT
    if((e.keyCode === 97 || e.keyCode === 1092) && lastDirection !== 'right') {

        dx = -cellSize;
        dy = 0;

        setTimeout(() => {lastDirection = 'left'}, interval);
        pressTimes++;
    }
    // UP
    if((e.keyCode === 119 || e.keyCode === 1094) && lastDirection !== 'down') {
        if(pressTimes === 0) {
            setInterval(gameProcess, interval);
            status = 'start';
        }

        dx = 0;
        dy = -cellSize;

        setTimeout(() => {lastDirection = 'up'}, interval);
        pressTimes++;
    }
};



function drawSnake() {
    drawSnake.iteration = 0;
    ctx.clearRect(0, 0, canv.width, canv.height);
        snake.forEach(cords => {
            
            if(drawSnake.iteration !== snake.length - 1) {
                ctx.fillStyle = 'black';
                ctx.fillRect(cords.x, cords.y, rectSize, rectSize);
            } else {
                ctx.fillStyle = 'gray';
                ctx.fillRect(cords.x-1, cords.y-1, rectSize+2, rectSize+2);
            }
            drawSnake.iteration++;
        });
}

function drawApple(cords, size) {
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.rect(cords.x, cords.y, size, size);
    ctx.fill();
    ctx.closePath();
}

function appleCordsGeneration() {
    let x, y,
        appleNewCords,
        snakeCopy;
    while(true) {
        x = randomInteger(cellSize, canv.width-cellSize*2);
        y = randomInteger(cellSize, canv.height-cellSize*2);
        if(x % cellSize === 0 && y % cellSize === 0) {
            snakeCopy = arrStringify(snake.slice());
            appleNewCords = {x: x, y: y};
            if(snakeCopy.includes(JSON.stringify(appleNewCords))) {
                continue;
            } else {
                return appleNewCords;
            }
        }
    }
};

    



inputForScore.innerText = score;
drawSnake();
drawApple(appleCords, appleSize);
function gameProcess() {
    canv.width = window.innerWidth;
    canv.height = window.innerHeight;
    
    inputForScore.innerText = score;
    let snakeCopy,
        snakeNewSegmentX,
        snakeNewSegmentY;
    if(status === 'start') {
            inputForScore.value = score;
            ctx.clearRect(0, 0, canv.width, canv.height);
            drawSnake();
            drawApple(appleCords, appleSize);
            // Проверка на столкновение со стеной
            if(snake[snake.length-1].x + cellSize > canv.width || snake[snake.length-1].y > canv.height - cellSize || snake[snake.length-1].x + cellSize < 0+cellSize || snake[snake.length-1].y < 0) {
                gameOver();
                }
            snakeCopy = arrStringify(snake.slice(0, snake.length-1));
            // Проверка на столкновение с собой
            if(snakeCopy.includes(JSON.stringify(snake[snake.length-1]))) {
                    gameOver();
                   }
            snake.shift();
            snake[snake.length] = {x: snake[snake.length-1].x + dx, y: snake[snake.length-1].y + dy};
            // Проверка на съедение яблока
            if(snake[snake.length-1].x === appleCords.x && snake[snake.length-1].y === appleCords.y) {                                
                snakeNewSegmentX = snake[0].x - dx;
                snakeNewSegmentX = snake[0].y - dy;
                snake.unshift({snakeNewSegmentX, snakeNewSegmentY});
                appleCords = appleCordsGeneration();
                score += 15;
                ctx.clearRect(appleCords.x, appleCords.y, appleSize, appleSize);
                }
    }
};


function arrStringify(arr) {
    arr.forEach((element, index) => {
        arr[index] = JSON.stringify(element);
    });
    return arr;
}

function gameOver() {
    status = 'lose';
    document.removeEventListener('keypress', keypressHandler);
    mc.off('swipedown', swipedownHandler);    
    mc.off('swipeup', swipeupHandler);
    mc.off('swiperight', swiperightHandler);
    mc.off('swipeleft', swipeleftHandler);    
    ctx.clearRect(0, 0, canv.width, canv.height);

    // Перезапуск игры
    if(confirm('Вы проиграли. Начать заново?')) {
        location.reload();
    } else {
        alert('Пока');
    }
}
function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}