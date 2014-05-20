//Connects the keyboard to the game 
var Game = new function() {                                                                  
  var KEY_CODES = { 37:'left', 39:'right', 32 :'fire' };//each corresponds with a key on the keyboard, in this instace 37 is the left arrow, 39 is the right and 32 is space, these are the same codes for each web browser. 
  this.keys = {};

    //this is the specifications of the canvas for the game to work on. 
  this.initialize = function(canvas_dom,level_data,sprite_data,callbacks) {
    this.canvas_elem = $(canvas_dom)[0];
    this.canvas = this.canvas_elem.getContext('2d');//sets the canvas width and height and if it is 2d or 3d
    this.width = $(this.canvas_elem).attr('width');
    this.height= $(this.canvas_elem).attr('height');

    $(window).keydown(function(event) { //if statement for if the above key codes are pressed. 
      if(KEY_CODES[event.keyCode]) Game.keys[KEY_CODES[event.keyCode]] = true;
    });//if the key is pressed it sends a function for the ship to act according to the key that has been pressed. 

    $(window).keyup(function(event) {//if statment for if the key is not pressed. 
      if(KEY_CODES[event.keyCode]) Game.keys[KEY_CODES[event.keyCode]] = false;
    });//if this is true nothing happens. 

    this.level_data = level_data;
    this.callbacks = callbacks;
    Sprites.load(sprite_data,this.callbacks['start']);//this loads the sprite.png at the beging of the game
  }

  this.loadBoard = function(board) { Game.board = board; };

  this.loop = function() {//loading of the game board 
    Game.board.step(30/1000); 
    Game.board.render(Game.canvas);
    setTimeout(Game.loop,30);//something to do with time. 
  };
};

var Sprites = new function() { //this gives specifications to the sprite image.  
  this.map = { }; 

  this.load = function(sprite_data,callback) { 
    this.map = sprite_data;
    this.image = new Image();//declares that it will be a new image. 
    this.image.onload = callback;
    this.image.src = 'images/sprites.png';//where to find the sprites file.
  };

  this.draw = function(canvas,sprite,x,y,frame) {//draws the canvas and sprite images onto the gameboard. 
    var s = this.map[sprite];
    if(!frame) frame = 0;
    canvas.drawImage(this.image, s.sx + frame * s.w, s.sy, s.w, s.h, x,y, s.w, s.h);
  };
}

var GameScreen = function GameScreen(text,text2,callback) {//writing appearing on the screen.
  this.step = function(dt) {
    if(Game.keys['fire'] && callback) callback();// if the space bar is pressed. 
  };

  this.render = function(canvas) {//rendering the game.
    canvas.clearRect(0,0,Game.width,Game.height);
    canvas.font = "bold 40px arial";//this is the specifications for the first heading.
    var measure = canvas.measureText(text); //gives a variable/name to the first text.  
    canvas.fillStyle = "#FFFFFF";//white colour for the text 
    canvas.fillText(text,Game.width/2 - measure.width/2,Game.height/2);//places the text in the centre of the game that is why everything is divided by 2
    canvas.font = "bold 20px arial";//sub text for the game. so the information rather than the title.
    var measure2 = canvas.measureText(text2);//gives a variable/name to the second text. 
    canvas.fillText(text2,Game.width/2 - measure2.width/2,Game.height/2 + 40);
  };
};

var GameBoard = function GameBoard(level_number) {
  this.removed_objs = [];
  this.missiles = 0;
  this.level = level_number;
  var board = this;

  this.add =    function(obj) { obj.board=this; this.objects.push(obj); return obj; };
  this.remove = function(obj) { this.removed_objs.push(obj); };

  this.addSprite = function(name,x,y,opts) {
    var sprite = this.add(new Sprites.map[name].cls(opts));
    sprite.name = name;
    sprite.x = x; sprite.y = y;
    sprite.w = Sprites.map[name].w; 
    sprite.h = Sprites.map[name].h;
    return sprite;
  };
  

  this.iterate = function(func) {
     for(var i=0,len=this.objects.length;i<len;i++) {
       func.call(this.objects[i]);
     }
  };

  this.detect = function(func) {
    for(var i = 0,val=null, len=this.objects.length; i < len; i++) {
      if(func.call(this.objects[i])) return this.objects[i];
    }
    return false;
  };

  this.step = function(dt) { 
    this.removed_objs = [];
    this.iterate(function() { 
        if(!this.step(dt)) this.die();
    }); 

    for(var i=0,len=this.removed_objs.length;i<len;i++) {
      var idx = this.objects.indexOf(this.removed_objs[i]);
      if(idx != -1) this.objects.splice(idx,1);
    }
  };

  this.render = function(canvas) {
    canvas.clearRect(0,0,Game.width,Game.height);
    this.iterate(function() { this.draw(canvas); });
  };

  this.collision = function(o1,o2) { //are there any collisions between the missles and machines
    return !((o1.y+o1.h-1<o2.y) || (o1.y>o2.y+o2.h-1) ||
             (o1.x+o1.w-1<o2.x) || (o1.x>o2.x+o2.w-1));
  };

  this.collide = function(obj) {
    return this.detect(function() {
      if(obj != this && !this.invulnrable)
       return board.collision(obj,this) ? this : false;
    });
  };

  this.loadLevel = function(level) { //level setup
    this.objects = [];
    this.player = this.addSprite('player', // Sprite
                                 Game.width/2, // X
                                 Game.height - Sprites.map['player'].h - 10); // Y

    var flock = this.add(new AlienFlock());
    for(var y=0,rows=level.length;y<rows;y++) {
      for(var x=0,cols=level[y].length;x<cols;x++) {
        var alien = Sprites.map['alien' + level[y][x]];
        if(alien) { 
          this.addSprite('alien' + level[y][x], // Which Sprite
                         (alien.w+10)*x,  // X
                         alien.h*y,       // Y
                         { flock: flock }); // Options
        }
      }
    }
  };

  this.nextLevel = function() { 
    return Game.level_data[level_number + 1] ? (level_number + 1) : false 
  };
 
  this.loadLevel(Game.level_data[level_number]);
};

var GameAudio = new function() { //music for the game
  this.load_queue = [];
  this.loading_sounds = 0;
  this.sounds = {};

  var channel_max = 10;		
  audio_channels = new Array();
  for (a=0;a<channel_max;a++) {	
    audio_channels[a] = new Array();
    audio_channels[a]['channel'] = new Audio(); 
    audio_channels[a]['finished'] = -1;	
  }

  this.load = function(files,callback) {
    var audioCallback = function() { GameAudio.finished(callback); }

    for(name in files) {
      var filename = files[name];
      this.loading_sounds++;
      var snd = new Audio();
      this.sounds[name] = snd;
      snd.addEventListener('canplaythrough',audioCallback,false);
      snd.src = filename;
      snd.load();
    }
  };

  this.finished = function(callback) { // stop the audio when it isnt needed
    this.loading_sounds--;
    if(this.loading_sounds == 0) {
      callback();
    }
  };

  this.play = function(s) { //loading and playing for the audio
    for (a=0;a<audio_channels.length;a++) {
      thistime = new Date();
      if (audio_channels[a]['finished'] < thistime.getTime()) {	
        audio_channels[a]['finished'] = thistime.getTime() + this.sounds[s].duration*1000;
        audio_channels[a]['channel'].src = this.sounds[s].src;
        audio_channels[a]['channel'].load();
        audio_channels[a]['channel'].play();
        break;
      }
    }
  };
};

