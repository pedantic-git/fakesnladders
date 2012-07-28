function init() {
    var game = document.getElementById('game');
    var context = game.getContext('2d');
    var background = document.getElementById('background');
    var gridSize = HEIGHT;

    context.drawImage(background, 0, 0);

    context.fillStyle = 'black';
    context.strokeRect(0, 0, gridSize, gridSize);

//    context.fillStyle = 'rgba(100, 100, 100, 0.5)';
//    context.fillRect(200, 200, HEIGHT - 400, HEIGHT - 400);
    
    // grid squares
    var squaresToSide = 10;
    var nSquares = squaresToSide*squaresToSide;
    var squareSize = gridSize/squaresToSide;
    for (var x = 0.5; x < gridSize; x += squareSize) {    
        context.moveTo(x, 0);
        context.lineTo(x, gridSize);
    }

    for (var y = 0.5; y < gridSize; y += squareSize) {    
        context.moveTo(0, y);
        context.lineTo(gridSize, y);
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
    context.moveTo(gridSize, squareSize*2 + 0.5);
    context.lineTo(WIDTH, squareSize*2 + 0.5);
    context.stroke();
    context.fillText("END", gridSize - (gridSize - WIDTH)/2, squareSize);
    
    // 'A' text option
    context.beginPath();
    context.moveTo(gridSize, squareSize*5 + 0.5);
    context.lineTo(WIDTH, squareSize*5 + 0.5);
    context.stroke();
    context.fillText("Option A", gridSize - (gridSize - WIDTH)/2, squareSize*3.5);
    
    // 'B' text option
    context.beginPath();
    context.moveTo(gridSize, squareSize*8 + 0.5);
    context.lineTo(WIDTH, squareSize*8 + 0.5);
    context.stroke();
    context.fillText("Option B", gridSize - (gridSize - WIDTH)/2, squareSize*6.5);
    
    // status/help text area
    context.fillText("Status", gridSize - (gridSize - WIDTH)/2, squareSize*9);
}

document.addEventListener('load', init, true);
