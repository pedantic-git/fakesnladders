var tickManager;
var allowClick = true;

function FakesNLadders(layer, gridSize) {
    this.gridSize = gridSize;
    this.layer = layer;
    this.layer.addGameObject(this);
}

FakesNLadders.prototype.draw = function(context) {
    context.fillStyle = 'black';
    context.strokeRect(0, 0, this.gridSize, this.gridSize);

    // grid squares
    var squaresToSide = 10;
    var nSquares = squaresToSide*squaresToSide;
    var squareSize = this.gridSize/squaresToSide;
    for (var x = 0.5; x < this.gridSize; x += squareSize) {    
        context.moveTo(x, 0);
        context.lineTo(x, this.gridSize);
    }

    for (var y = 0.5; y < this.gridSize; y += squareSize) {    
        context.moveTo(0, y);
        context.lineTo(this.gridSize, y);
    }
    
    context.strokeStyle = 'rgba(70, 70, 70, 1)';
    context.stroke();
    
    // grid numbering (centered, alternating direction)
    context.font = "bold 16px sans-serif";
    context.textBaseline = 'bottom';
    context.textAlign = 'middle'; // left is the same??
    var sqNo = 0;
    var centring = squareSize/2;
    for(var y = squaresToSide-1; y >= 0; y--) {
        for(var x = squaresToSide-1; x >= 0; x--) {
            context.fillText(sqNo++, x*squareSize + centring, y*squareSize + centring);
        }
        y--;
        for(var x = 0; x < squaresToSide; x++) {
            context.fillText(sqNo++, x*squareSize + centring, y*squareSize + centring);
        }
    }
    
    // borders and placeholders for dash elements
    // marker text style
    context.font = "bold 24px sans-serif"; // marker text
    context.textBaseline = 'middle';
    context.textAlign = 'middle'; // left is the same??
    
    // board end landing zone
    context.beginPath();
    context.moveTo(this.gridSize, squareSize*2 + 0.5);
    context.lineTo(WIDTH, squareSize*2 + 0.5);
    context.stroke();
    context.fillText("END", this.gridSize - (this.gridSize - WIDTH)/2, squareSize);
    
    // 'A' text option
    context.beginPath();
    context.moveTo(this.gridSize, squareSize*5 + 0.5);
    context.lineTo(WIDTH, squareSize*5 + 0.5);
    context.stroke();
    context.fillText("Option A", this.gridSize - (this.gridSize - WIDTH)/2, squareSize*3.5);
    
    // 'B' text option
    context.beginPath();
    context.moveTo(this.gridSize, squareSize*8 + 0.5);
    context.lineTo(WIDTH, squareSize*8 + 0.5);
    context.stroke();
    context.fillText("Option B", this.gridSize - (this.gridSize - WIDTH)/2, squareSize*6.5);
    
    // status/help text area
    context.fillText("Status", this.gridSize - (this.gridSize - WIDTH)/2, squareSize*9);
}

FakesNLadders.prototype.hit = function(p) {
    alert(p);
}

function init(e) {
    e.stopPropagation();
    var game = document.getElementById('game');
    var gameContext = game.getContext('2d');
    var backBuffer = document.getElementById('back-buffer');
    var context = backBuffer.getContext('2d');

    var background = document.getElementById('background');

    var gameLayer = new Layer();

    function redraw() {
        context.drawImage(background, 0, 0);

        context.save();
        gameLayer.draw(context);
        context.restore();

        gameContext.drawImage(backBuffer, 0, 0);
    }

    tickManager = new TickManager(redraw);

    document.addEventListener('mousedown',
            function(mouseEvent) {
                mouseEvent.stopPropagation();
                var point = new Point(
                    mouseEvent.pageX - game.offsetLeft,
                    mouseEvent.pageY - game.offsetTop);
                gameLayer.hit(point);
                redraw();
            }, false);

    var fakesNLadders = new FakesNLadders(gameLayer, HEIGHT);
    redraw();
}

addEventListener('load', init, false);
