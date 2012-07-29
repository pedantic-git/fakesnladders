function Ladder(e,t){this.fromGrid=e,this.toGrid=t,this.ladderWidth=24,this.ladderStep=16,this.lineWidth=4,this.color="rgb(153, 51, 0)",this.fromGrid.registerAction(this.action())}function Player(e,t,n){this.game=e,this.scoreGrid=t,this.image=n,this.rect=this.scoreGrid.rect}function Grid(e,t,n,r){this.sqNo=e,this.coordinates=t,this.squareSize=n,this.squaresToSide=r,this.position=new Point(this.coordinates.x*this.squareSize,this.coordinates.y*this.squareSize),this.rect=new Rect(this.position.x,this.position.y,this.squareSize,this.squareSize),this.actions=[]}function FakesNLadders(e,t){this.gridSize=t,this.layer=e,this.layer.addGameObject(this),this.squaresToSide=10,this.squareSize=this.gridSize/this.squaresToSide}function init(){function o(){r.drawImage(i,0,0),r.save(),s.draw(r),r.restore(),t.drawImage(n,0,0)}var e=document.getElementById("game"),t=e.getContext("2d"),n=document.getElementById("back-buffer"),r=n.getContext("2d"),i=document.getElementById("background"),s=new Layer;tickManager=new TickManager(o),document.addEventListener("mousedown",function(t){t.stopPropagation();var n=new Point(t.pageX-e.offsetLeft,t.pageY-e.offsetTop);s.hit(n),o()},!1);var u=new FakesNLadders(s,HEIGHT);u.init(o),o()}var tickManager,TICK_INTERVAL=Math.floor(1e3/30),allowClick=!0;Ladder.prototype.action=function(){function t(t){t.moveStraightLine(e.toGrid)}var e=this;return t},Ladder.prototype.drawLadder=function(e,t,n){e.beginPath();var r=t;e.moveTo(r.x+r.width/2-this.ladderWidth/2,r.y+r.height/2),r=n,e.lineTo(r.x+r.width/2-this.ladderWidth/2,r.y+r.height/2),r=t,e.moveTo(r.x+r.width/2+this.ladderWidth/2,r.y+r.height/2),r=n,e.lineTo(r.x+r.width/2+this.ladderWidth/2,r.y+r.height/2);var i=n.x-t.x,s=n.y-t.y,o=Math.sqrt(i*i+s*s),u=this.ladderStep/o,a=(n.x-t.x)*u,f=(n.y-t.y)*u,l=r.x+r.width/2-this.ladderWidth/2,c=r.y+r.height/2,h;for(h=0;h<o-this.ladderStep*2;h+=this.ladderStep)l-=a,c-=f,e.moveTo(l,c),e.lineTo(l+this.ladderWidth,c);e.stroke()},Ladder.prototype.draw=function(e){e.save(),e.lineWidth=this.lineWidth,e.strokeStyle="rgb(70, 70, 70)",this.drawLadder(e,new Rect(this.fromGrid.rect.x,this.fromGrid.rect.y+3,this.fromGrid.rect.width,this.fromGrid.rect.height),new Rect(this.toGrid.rect.x,this.toGrid.rect.y+3,this.toGrid.rect.width,this.toGrid.rect.height)),e.strokeStyle=this.color,this.drawLadder(e,this.fromGrid.rect,this.toGrid.rect),e.restore()},Ladder.prototype.hit=function(e){},Player.prototype.move=function(e){function n(){e.doActions(t)}var t=this;tickManager.addAnimation(new MoveAnimation(this,new Point(e.position.x,e.position.y),.5),n)},Player.prototype.moveStraightLine=function(e){function n(){e.doActions(t)}var t=this;tickManager.addAnimation(new MoveAnimation(this,new Point(e.position.x,e.position.y),.5),n)},Player.prototype.draw=function(e){e.drawImage(this.image,this.rect.x,this.rect.y)},Player.prototype.hit=function(e){this.move(this.game.getGrid(4))},Grid.prototype.draw=function(e){e.save(),e.font="bold 16px sans-serif",e.textBaseline="top",e.textAlign="middle",e.fillText(this.sqNo.toString(),this.position.x+3,this.position.y+3),e.restore()},Grid.prototype.hit=function(e){},Grid.prototype.registerAction=function(e){this.actions.push(e)},Grid.prototype.doActions=function(e){for(var t=0;t<this.actions.length;t++)this.actions[t](e)},FakesNLadders.prototype.init=function(e){var t=0;this.grids=[];for(var n=this.squaresToSide-1;n>=0;n--){for(var r=this.squaresToSide-1;r>=0;r--)this.grids.push(new Grid(t++,new Point(r,n),this.squareSize,this.squaresToSide)),this.layer.addGameObject(this.grids[this.grids.length-1]);n--;for(var r=0;r<this.squaresToSide;r++)this.grids.push(new Grid(t++,new Point(r,n),this.squareSize,this.squaresToSide)),this.layer.addGameObject(this.grids[this.grids.length-1])}this.layer.addGameObject(new Ladder(this.getGrid(3),this.getGrid(22))),this.layer.addGameObject(new Ladder(this.getGrid(25),this.getGrid(43))),this.layer.addGameObject(new Ladder(this.getGrid(40),this.getGrid(58))),this.layer.addGameObject(new Ladder(this.getGrid(81),this.getGrid(99))),this.layer.addGameObject(new Ladder(this.getGrid(55),this.getGrid(86))),this.layer.addGameObject(new Ladder(this.getGrid(49),this.getGrid(92))),this.layer.addGameObject(new Ladder(this.getGrid(12),this.getGrid(31)));var i=new Image;i.src=testPlayerImage,i.onload=e;var s=new Player(this,this.getGrid(0),i);this.layer.addGameObject(s)},FakesNLadders.prototype.getGrid=function(e){return this.grids[e]},FakesNLadders.prototype.draw=function(e){e.save(),e.fillStyle="black",e.strokeRect(0,0,this.gridSize,this.gridSize),e.beginPath();for(var t=.5;t<this.gridSize;t+=this.squareSize)e.moveTo(t,0),e.lineTo(t,this.gridSize);for(var n=.5;n<this.gridSize;n+=this.squareSize)e.moveTo(0,n),e.lineTo(this.gridSize,n);e.strokeStyle="rgba(70, 70, 70, 1)",e.lineWidth=1,e.stroke(),e.restore()},FakesNLadders.prototype.hit=function(e){},window.onload=init;