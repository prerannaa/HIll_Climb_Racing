const coinImageSrc = 'assets/Coin.png';

class Coin{
    constructor(x, y, width, height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.coinImage = new Image ();
        this.coinImage.src = coinImageSrc;
        this.vx = 0;
    }

    draw(){
        ctx.drawImage(this.coinImage, this.x, this.y, this.width, this.height);
    }
    update(){
        this.x += this.vx;
    }
}

