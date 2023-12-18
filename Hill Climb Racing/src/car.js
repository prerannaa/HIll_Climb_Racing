const carImageSrc = 'assets/Car.png';
const wheelImageSrc = 'assets/Tire.png';

function createImage(path){
    let image = new Image();
    image.src = path;
    return image;
  }
  
  let images = {
    wheels:[
      createImage(wheelImageSrc),
      createImage(wheelImageSrc)
    ],
    car:createImage(carImageSrc)
  }

  let prevLeftY  = 10;
  let prevRightY = 10;

class Car {
    constructor(position, carWidth, carHeight, wheelWidth, wheelHeight, terrains, currentTerrainIndex) {
        this.carImage = images.car;
        this.LWheelImage = images.wheels[0];
        this.RWheelImage = images.wheels[1];
        this.position = position;
        this.carWidth = carWidth;
        this.carHeight = carHeight;
        this.wheelWidth = wheelWidth;
        this.wheelHeight = wheelHeight;
        this.wheelRadius = wheelWidth / 2;
        this.vx = 0; // Velocity along x axis
        this.vy = 1; // Velocity along y axis
        this.rotation = 0; // Initial rotation angle for wheels
        this.rotationSpeed = 0.2; // Rotation speed for wheels
        this.terrain = terrains;
        this.distanceCovered = 0;
        this.lastXPosition = position.x;
        this.loaded = false;
        this.leftWheelCenter = { x: 20, y: 100 }
        this.rightWheelCenter = { x: 140, y: 100 }
        this.angle = 0;
        this.leftTerrainIndex = currentTerrainIndex;
        this.rightTerrainIndex = currentTerrainIndex;
        this.leftTerrain = terrains[this.leftTerrainIndex];
        this.rightTerrain = terrains[this.rightTerrainIndex];

    }

    draw(/*angle*/) {

        ctx.save(); 
        this.drawLWheel(this.leftWheelCenter.x, this.leftWheelCenter.y);
        this.drawRWheel(this.rightWheelCenter.x, this.rightWheelCenter.y);
        ctx.drawImage(this.carImage, this.position.x, this.position.y, this.carWidth, this.carHeight);

        ctx.restore();
        this.angle = (180 / Math.PI) * Math.atan((this.rightWheelCenter.y - this.leftWheelCenter.y) / car.carWidth);
        if (this.rightWheelCenter.y < this.leftWheelCenter.y) {
            this.angle = -this.angle;
        }
    }

    drawLWheel(x, y) {
        ctx.save();
        ctx.translate(x + this.wheelWidth / 2, y + this.wheelHeight / 2);
        ctx.rotate(this.rotation);
        ctx.drawImage(this.LWheelImage, -this.wheelWidth / 2, -this.wheelHeight / 2, this.wheelWidth, this.wheelHeight);
        ctx.restore();
    }

    drawRWheel(x, y) {
        ctx.save();
        ctx.translate(x, y + this.wheelHeight/3);
        ctx.rotate(this.rotation);
        ctx.drawImage(this.RWheelImage, -this.wheelWidth/2, -this.wheelHeight / 2, this.wheelWidth, this.wheelHeight);
        ctx.restore();
    }    


    checkCollision(lineSegments, wheelCenter) {
        let collision = this.circleLineCollision({ center: wheelCenter, radius: this.wheelRadius }, lineSegments);

        if (collision.isCollided) {
            this.position = { x: collision.x, y: collision.y };
            return collision.isCollided;
        } else {
            return false
        }

    }

    circleLineCollision(circle, lineSegments) {
        for (let i = 0; i < lineSegments.length; i++) {
            const lineSegment = lineSegments[i];
            for (let j = 0; j < lineSegment.length; j++) {
                let line = lineSegment[j];
                let x1 = line.x1;
                let x2 = line.x2;
                let y = line.y1; //y is equal for line
                if (circle.center.x >= line.x1 && circle.center.x <= line.x2) {
                    if (circle.center.y + this.wheelRadius < y) {
                        continue;
                    }
                    return { isCollided: true, x: circle.center.x, y: y }

                }
            }
        }
        return false;
    }

    update() {
        car.position.x = this.leftWheelCenter.x - 15;
        car.position.y = this.leftWheelCenter.y - 70;
        if(isNaN(this.leftWheelCenter.y)) 
        {
            this.leftWheelCenter.y = this.leftTerrain.calculateTerrainHeightAtX(prevLeftY);
        }
        if(isNaN(this.rightWheelCenter.y)) 
        {
            this.rightWheelCenter.y = prevRightY;
          
        }

        if (this.leftWheelCenter.x < this.leftTerrain.x) {
            if (this.leftTerrainIndex != 0) {
                this.leftTerrainIndex--;
            }
        }
        else if (this.leftWheelCenter.x > (this.leftTerrain.x + this.leftTerrain.getTerrainWidth())) {
            this.leftTerrainIndex++;
            this.leftWheelCenter.x++;
        }
        this.leftTerrain = null;
        this.leftTerrain = terrains[this.leftTerrainIndex];

        if (this.rightWheelCenter.x < this.rightTerrain.x) {
            if (this.rightTerrainIndex != 0) {
                this.rightTerrainIndex--;

            }
        }
        else if (this.rightWheelCenter.x > (this.rightTerrain.x + this.rightTerrain.getTerrainWidth())) {
            this.rightTerrainIndex++;
            this.rightWheelCenter.x++;
        }
        this.rightTerrain = null;
        this.rightTerrain = terrains[this.rightTerrainIndex];

        this.updateWheel();
        // car.draw();
    }


    updateWheel() {
        if (this.leftWheelCenter.x < 0) {
            this.leftWheelCenter.x = 1;
        }
        if ((this.rightWheelCenter.x - this.carWidth) < 0) {
            this.rightWheelCenter.x = 1 + this.carWidth;
        }
        this.leftWheelCenter.x += this.vx;
        this.rightWheelCenter.x += this.vx;

        if (!(this.leftWheelCenter.y + this.wheelWidth < this.leftTerrain.calculateTerrainHeightAtX(this.leftWheelCenter.x))) {
            if(isNaN(this.leftTerrain.calculateTerrainHeightAtX(this.leftWheelCenter.x))) {
                this.leftWheelCenter.y = prevLeftY;
            }
            else {
            this.leftWheelCenter.y = this.leftTerrain.calculateTerrainHeightAtX(this.leftWheelCenter.x) - car.wheelWidth;
            }
        } else {
            this.leftWheelCenter.y += GRAVITY;
        }
        if (!(this.rightWheelCenter.y + this.wheelWidth <  this.rightTerrain.calculateTerrainHeightAtX(this.rightWheelCenter.x))) {
            if (isNaN(this.rightTerrain.calculateTerrainHeightAtX(this.rightWheelCenter.x))) {
                this.rightWheelCenter.y = prevRightY;    
            } else {
            this.rightWheelCenter.y = this.rightTerrain.calculateTerrainHeightAtX(this.rightWheelCenter.x) - car.wheelWidth;
            }
        } else {
        this.rightWheelCenter.y += GRAVITY;
        }
        prevLeftY = this.leftWheelCenter.y;
        prevRightY = this.rightWheelCenter.y;
        this.rotation += this.vx * this.rotationSpeed
    }
}
