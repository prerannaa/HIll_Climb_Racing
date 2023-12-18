const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const terrainStride = 100;

const initialTerrain = new Terrain(0, 250, 500, 300);
const middleTerrain = new Terrain(501, 200, 1000, 300);
const terrains = [initialTerrain, middleTerrain];
let currentTerrainIndex = 0;

function createNewTerrain() {
    const lastTerrain = terrains[terrains.length - 1];
    const newTerrainX = lastTerrain.x + lastTerrain.getTerrainWidth(); // Move the new terrain next to the last one
    const newTerrain = new Terrain(newTerrainX);
    terrains.push(newTerrain);
    car.terrain = [newTerrain];;
}

const car = new Car({ x: 5, y: 30 }, 200, 100, 50, 50, terrains, currentTerrainIndex);

const coinPatterns = [];
const newCoinPattern = [
    { x: 200, y: 250, width: 40, height: 40 },
    { x: 250, y: 250, width: 40, height: 40 },
    { x: 300, y: 250, width: 40, height: 40 },
    { x: 350, y: 250, width: 40, height: 40 },
    { x: 400, y: 250, width: 40, height: 40 },

];
let lastCoinTime = 0;
let collectedCoinsScore = 0;

const fuel = new Fuel({ x: 10, y: 40 }, FUEL_MAX_WIDTH, 10, FUEL_MAX_WIDTH);
const fuelIcon = new FuelIcon({ x: 400, y: 250 }, 40, 40, fuel);

let buttons  = [];
var gameState = new Button('Pause', 'white', 'black')
let isAnimationRunning = true;

createNewTerrain();
createNewTerrain();
createNewTerrain();

let frameRate = 1000 / 60;
let lastFrame = 0;
let startTime;
let time;
let currentFrame;

const generateCoins = () => {
    const currentCoinTime = new Date();
    if(currentCoinTime - lastCoinTime >= COIN_INTERVAL){

        const numCoinsToGenerate = Math.floor(Math.random() * newCoinPattern.length) + 1;
        const shuffledCoins = newCoinPattern.slice().sort(() => Math.random() - 0.5);
        const selectedCoins = shuffledCoins.slice(0, numCoinsToGenerate);

        selectedCoins.forEach((coin) => {
             let coinObj = new Coin(
                coin.x,
                coin.y, 
                coin.width, 
                coin.height,
            )
            coinPatterns.push((coinObj));
        })
        lastCoinTime = currentCoinTime;
    }
}

const collisionDetectionWithCoin = (car) => {
    for (let i = coinPatterns.length - 1; i >= 0; i--) { 
        let coin = coinPatterns[i];
        if (coinCollisionDetection(car, coin)) {
            coinPatterns.splice(i, 1);
            collectedCoinsScore += 100;
            displayCollectedCoin();
        }
    }
}

const displayCollectedCoin = () => {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + collectedCoinsScore, canvas.width - 950, 20); // Adjust position as needed
};

const collisionDetectionWithFuel = (car) => {
    if (fuelCollisionDetection(car, fuelIcon)) {
        fuel.currentFuel = FUEL_MAX_WIDTH;
        fuel.draw(); 
        fuelIcon.isVisible = false; 
    }
};

function drawPauseButton() {
    //button
    gameState.setPosition(940, 10);
    gameState.setSize(50, 20);
    buttons.push(gameState);
}

function animate() {
    //rotate wheel with the same angle
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    car.currentTerrain = terrains[currentTerrainIndex];
    terrains.forEach((terrain) => {
        terrain.update();
    })


    // Draw coins from patterns in coinPatterns array
    generateCoins();
    collisionDetectionWithCoin(car);
    coinPatterns.forEach(coin => {
        coin.update (); 
    });
    displayCollectedCoin(); 

    //Methods for fuel class
    fuel.draw();
    fuelIcon.draw();
    collisionDetectionWithFuel(car);
    //Game state management methodss
    drawPauseButton();
    buttons.forEach(button => button.draw());
    gameState.draw();

    if (keys.A || keys.D) {
        car.vx = keys.D ? SPEED : -SPEED;
        fuel.update();
    } else {
        car.vx = 0;
    }


    // Implementation of translate the terrains
    if (car.position.x >= canvas.width / 4 && keys.D) {
        const translationDistance = car.position.x - canvas.width / 4;

        terrains.forEach((terrain) => {
            terrain.x -= translationDistance; // Move terrains
            terrain.lineSegments = terrain.generateLineSegments();
        });
        
        car.vx = 0;
        car.position.x = canvas.width / 3; // Fix car position
        createNewTerrain();
    }
    car.update(/*angle*/);
    car.draw();


    terrains.forEach((terrain) => terrain.draw());
    let deltaTime = 0;

    if (startTime === undefined) {
        startTime = time;
    }
    else {
        currentFrame = Math.round((time - startTime) / frameRate);
        deltaTime = (currentFrame - lastFrame) * frameRate;
    }
    lastFrame = currentFrame;


    if (fuel.currentFuel <= 0) {
        // Clear the canvas
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        // Display game over message
        ctx.fillStyle = "black"; // Set text color
        ctx.font = "30px Arial";
        ctx.fillText("Game Over, Press 'Space' to restart", canvas.width / 2 - 100, canvas.height / 2);
    
        // Stop the animation loop
        isAnimationRunning = false;
    }
    
    if(isAnimationRunning){
        requestAnimationFrame(animate);
    }
}

canvas.addEventListener('click', function (event){
    let rect = canvas.getBoundingClientRect();
    let  x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    let buttonPosition = {x: gameState.x + gameState.width, y :  gameState.y + gameState.height}
    
    if (x > gameState.x && x < buttonPosition.x && y > gameState.y && y < buttonPosition.y) 
      {
        if (gameState.text === 'Pause') {
          isAnimationRunning = false;
          gameState.text = 'Resume';
        } else if (gameState.text === 'Resume')
        {
            isAnimationRunning = true;
            if(isAnimationRunning){
                requestAnimationFrame(animate);
            }
          gameState.text = 'Pause';
        }
      }
  });

requestAnimationFrame(animate);
