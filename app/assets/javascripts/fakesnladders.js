function init() {
    var game = document.getElementById('game');
    var context = game.getContext('2d');
    var background = document.getElementById('background');

    context.drawImage(background, 0, 0);

    context.fillStyle = 'black';
    context.strokeRect(0, 0, HEIGHT, HEIGHT);
}

document.addEventListener('load', init, true);
