function FakesNLadders(context, gridSize) {
    this.gridSize = gridSize;
    this.context = context;
}

FakesNLadders.prototype.init = function() {
    this.context.fillStyle = 'black';
    this.context.strokeRect(0, 0, this.gridSize, this.gridSize);

    // grid squares
    var squaresToSide = 10;
    var nSquares = squaresToSide*squaresToSide;
    var squareSize = this.gridSize/squaresToSide;
    for (var x = 0.5; x < this.gridSize; x += squareSize) {    
        this.context.moveTo(x, 0);
        this.context.lineTo(x, this.gridSize);
    }

    for (var y = 0.5; y < this.gridSize; y += squareSize) {    
        this.context.moveTo(0, y);
        this.context.lineTo(this.gridSize, y);
    }
    
    this.context.strokeStyle = 'rgba(70, 70, 70, 1)';
    this.context.stroke();
    
    // grid numbering (centered, alternating direction)
    this.context.font = "bold 16px sans-serif";
    this.context.textBaseline = 'bottom';
    this.context.textAlign = 'middle'; // left is the same??
    var sqNo = 0;
    var centring = squareSize/2;
    for(var y = squaresToSide-1; y >= 0; y--) {
        for(var x = squaresToSide-1; x >= 0; x--) {
            this.context.fillText(sqNo++, x*squareSize + centring, y*squareSize + centring);
        }
        y--;
        for(var x = 0; x < squaresToSide; x++) {
            this.context.fillText(sqNo++, x*squareSize + centring, y*squareSize + centring);
        }
    }
    
    // borders and placeholders for dash elements
    // marker text style
    this.context.font = "bold 24px sans-serif"; // marker text
    this.context.textBaseline = 'middle';
    this.context.textAlign = 'middle'; // left is the same??
    
    // board end landing zone
    this.context.beginPath();
    this.context.moveTo(this.gridSize, squareSize*2 + 0.5);
    this.context.lineTo(WIDTH, squareSize*2 + 0.5);
    this.context.stroke();
    this.context.fillText("END", this.gridSize - (this.gridSize - WIDTH)/2, squareSize);
    
    // 'A' text option
    this.context.beginPath();
    this.context.moveTo(this.gridSize, squareSize*5 + 0.5);
    this.context.lineTo(WIDTH, squareSize*5 + 0.5);
    this.context.stroke();
    this.context.fillText("Option A", this.gridSize - (this.gridSize - WIDTH)/2, squareSize*3.5);
    
    // 'B' text option
    this.context.beginPath();
    this.context.moveTo(this.gridSize, squareSize*8 + 0.5);
    this.context.lineTo(WIDTH, squareSize*8 + 0.5);
    this.context.stroke();
    this.context.fillText("Option B", this.gridSize - (this.gridSize - WIDTH)/2, squareSize*6.5);
    
    // status/help text area
    this.context.fillText("Status", this.gridSize - (this.gridSize - WIDTH)/2, squareSize*9);
}

function init() {
    var game = document.getElementById('game');
    var context = game.getContext('2d');
    var background = document.getElementById('background');

    context.drawImage(background, 0, 0);

    var fakesNLadders = new FakesNLadders(context, HEIGHT);
    fakesNLadders.init();
}

document.addEventListener('load', init, true);
