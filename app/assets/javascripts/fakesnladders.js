var tickManager;
var allowClick = true;

function FakesNLadders(layer, gridSize) {
    this.gridSize = gridSize;
    this.layer = layer;
    this.layer.addGameObject(this);
    this.squaresToSide = 10;
    this.squareSize = this.gridSize / this.squaresToSide;
}

FakesNLadders.prototype.draw = function(context) {
    context.fillStyle = 'black';
    context.strokeRect(0, 0, this.gridSize, this.gridSize);

    // grid squares
    for (var x = 0.5; x < this.gridSize; x += this.squareSize) {    
        context.moveTo(x, 0);
        context.lineTo(x, this.gridSize);
    }

    for (var y = 0.5; y < this.gridSize; y += this.squareSize) {    
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
    var centring = this.squareSize/2;
    for(var y = this.squaresToSide-1; y >= 0; y--) {
        for(var x = this.squaresToSide-1; x >= 0; x--) {
            context.fillText(sqNo++, x*this.squareSize + centring, y*this.squareSize + centring);
        }
        y--;
        for(var x = 0; x < this.squaresToSide; x++) {
            context.fillText(sqNo++, x*this.squareSize + centring, y*this.squareSize + centring);
        }
    }
    
}

FakesNLadders.prototype.hit = function(p) {
}

function init() {
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

window.onload = init;
