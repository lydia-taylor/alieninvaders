
  var levelData = { //the layout for the level. the 1: and 2: are the levels and the number in the brackets corrispond with the alien 1 and 2. It is the orientation of each level.
     1:  [[0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,1,1,0,0,0,0],
          [0,0,0,0,0,1,1,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0]],
     2:  [[0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,2,2,2,2,2,2,2,2,0],
          [0,0,2,2,2,2,2,2,2,2,0],
          [0,0,1,1,1,1,1,1,1,1,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0]],
     3:  [[0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,3,3,3,3,3,3,3,3,0],
          [0,0,2,2,2,2,2,2,2,2,0],
          [0,0,2,2,2,2,2,2,2,2,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,1,1,1,1,1,1,1,1,0],
          [0,0,0,0,0,0,0,0,0,0,0]],
     4:  [[0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,3,3,3,0,0,3,3,3,0],
          [0,0,3,3,3,3,3,3,3,3,0],
          [0,0,2,2,2,3,3,2,2,2,0],
          [0,0,0,0,2,2,2,2,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0]],
     5:  [[0,0,0,0,0,0,0,0,0,0,0],
          [0,0,2,0,0,0,0,0,0,2,0],
          [0,0,3,0,0,2,2,0,0,3,0],
          [0,0,3,0,0,0,0,0,0,3,0],
          [0,0,3,3,3,0,0,3,3,3,0],
          [0,0,3,3,3,3,3,3,3,3,0],
          [0,0,0,0,0,3,3,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0]] };

  var spriteData = {//the sy/sx stands for where to find the aliens in the source file. i.e the png file. and the frames are how many there is of the alien 1 or 2 in the png file. 
      // the writing in black is the class for the sprite, the text in " '' " is the name for each sprite. 
    'alien1': { sx: 0,  sy: 0,  w: 37, h: 21, cls: Alien, frames: 2 },
    'alien2': { sx: 0,  sy: 20, w: 37, h: 21, cls: Alien, frames: 2 },
      'alien3': { sx: 0,  sy: 104, w: 37, h: 21, cls: Alien, frames: 2 },
      
    'player': { sx: 0,  sy: 41, w: 52, h: 42, cls: Player },
    'missile': { sx: 0,  sy: 87, w: 37,  h: 16, cls: Missile },
  
  }

  function startGame() {//starting the game. 
    var screen = new GameScreen("Cake Invaders","Try to box up all the cakes, press space to start",//the title and sub text on the start of the game. 
                                 function() {
                                     Game.loadBoard(new GameBoard(1));
                                 });
    Game.loadBoard(screen);
    Game.loop();
  }

  function endGame() {//the writing for if you lose the game
    var screen = new GameScreen("Game Over","(press space to restart)",//the text that appears for when you lose.
                                 function() {
                                     Game.loadBoard(new GameBoard(1));
                                 });
    Game.loadBoard(screen);
  }


  function winGame() {//the writing for if you win the game
    var screen = new GameScreen("All Cakes are packed!","(press space to restart)",//text that appears when you have won the game. 
                                 function() {
                                     Game.loadBoard(new GameBoard(1));
                                 });
    Game.loadBoard(screen);
  }

  $(function() {//it imports the audio for when you fire or something dies. 
    GameAudio.load({ 'fire' : 'media/missile_shoot.ogg', 'die' : 'media/hit.ogg' },//.ogg is the audio file used to the specific 'fire' or 'die' reasons.  
                   function() { 
                       Game.initialize("#gameboard", levelData, spriteData,
                                      { "start": startGame,
                                        "die"  : endGame,
                                        "win"  : winGame });
                   });
   });



