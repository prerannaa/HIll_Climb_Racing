function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function coinCollisionDetection(car, coin){
    return (
        car.position.x < coin.x + coin.width &&
        car.position.x + car.carWidth > coin.x &&
        car.position.y < coin.y + coin.height &&
        car.position.y + car.carHeight > coin.y
    );
};


function fuelCollisionDetection(car, fuelIcon){
    return (
        car.position.x < fuelIcon.position.x + fuelIcon.width &&
        car.position.x + car.carWidth > fuelIcon.position.x &&
        car.position.y < fuelIcon.position.y + fuelIcon.height &&
        car.position.y + car.carHeight > fuelIcon.position.y
    );
};


function circleLineCollision(circleCenter, circleRadius, lineStart, lineEnd) {
    const a = lineStart.y - lineEnd.y;
    const b = lineEnd.x - lineStart.x;
    const c = lineStart.x * lineEnd.y - lineEnd.x * lineStart.y;

    const distanceToLine = (a * circleCenter.x + b * circleCenter.y + c) / Math.sqrt(a * a + b * b);
    const closestPointOnLine = {
        x: (b * (b * circleCenter.x - a * circleCenter.y) - a * c) / (a * a + b * b),
        y: (a * (-b * circleCenter.x + a * circleCenter.y) - b * c) / (a * a + b * b)
    };

    const distanceFromStart = Math.sqrt((closestPointOnLine.x - lineStart.x) ** 2 + (closestPointOnLine.y - lineStart.y) ** 2);
    const distanceFromEnd = Math.sqrt((closestPointOnLine.x - lineEnd.x) ** 2 + (closestPointOnLine.y - lineEnd.y) ** 2);

    if (distanceToLine <= circleRadius && distanceFromStart <= Math.sqrt((lineStart.x - lineEnd.x) ** 2 + (lineStart.y - lineEnd.y) ** 2) && distanceFromEnd <= Math.sqrt((lineStart.x - lineEnd.x) ** 2 + (lineStart.y - lineEnd.y) ** 2)) {
        return true;
    }

    return false;
}
