const fuelImageSrc = 'assets/fuel-icon.png';

class Fuel{
    constructor(position, width, height, maxFuel){
        this.position = position;
        this.width = width;
        this.height = height;
        this.maxFuel = maxFuel; 
        this.currentFuel = this.maxFuel;
    }
    draw(){
        ctx.fillStyle = "green";
        ctx.fillRect(this.position.x, this.position.y, this.currentFuel, this.height);
    }
    update(){
        if (this.currentFuel > 0 && keys) {
            this.currentFuel -= 0.5; // Adjust the rate of fuel decrease as needed
        }
    }
}

class FuelIcon {
    constructor(position, width, height, color, fuel){
        this.position = position;
        this.width = width;
        this.height = height;
        this.color = color;
        this.isVisible = true;
        this.fuel = fuel;
        this.fuelImage = new Image ();
        this.fuelImage.src = fuelImageSrc;
    }

    draw() {
        if(this.isVisible){
            ctx.drawImage(this.fuelImage,this.position.x, this.position.y, this.width, this.height);
        }
    }
}

