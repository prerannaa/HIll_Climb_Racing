const keys = {
    A: false,
    D: false,
    SPACE: false,
}

window.onkeydown = e => {
    switch(e.code){
        case 'KeyA':
            keys.A = true;
            break;
        case 'KeyD':
            keys.D = true;
            break;        
        case 'Space':
            keys.SPACE = true;
            if (!isAnimationRunning) {
                isAnimationRunning = true;
                collectedCoinsScore = 0;
                fuel.currentFuel = FUEL_MAX_WIDTH;
                requestAnimationFrame(animate);
            }
            break;
        default:
        console.log(keys);
    }
}

window.onkeyup = e => {
    switch(e.code){
        case 'KeyA':
            keys.A = false;
            break;
        case 'KeyD':
            keys.D = false;
            break;        ;
        case 'Space':
            keys.SPACE = false;
            break;
        default:
        console.log(keys);

    }
}