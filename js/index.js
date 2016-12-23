const gui = new dat.GUI();
let opt; // options for gui

let bugs = []; // holds bug objects
let dRange = [1, 5]; // diameter range
const N = 100; // number of bugs

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  background(255);

  //setup gui
  opt = new Options();
  gui.add(opt, 'walkAlgorithm', ['Random', 'Perlin']);
  gui.add(opt, 'noiseIncrement', -.02, .02);
  gui.add(opt, 'paused');
  gui.add(opt, 'clear');
  
  // initialize bugs
  for (var i = 0; i < N; i++) {
    bugs[i] = new Jitter();
  }
}

function draw() {
  if (opt.paused === false) {  
    for (var i = 0; i < bugs.length; i++) {
      bugs[i].update();
      bugs[i].display();
    }
  }  
}

// Jitter class
function Jitter() {
  this.x;
  this.y;
  this.prevX;
  this.prevY;
  this.d = random(dRange[0], dRange[1]); //diameter
  this.speed = random(1, 5);
  this.off1 = random(0, 100000);
  this.off2 = random(100000, 200000);
  this.color = color(0, 0.1);

  this.sw = floor(random(3,5)); // strokeWeight

  this.update = function() {
    if (opt.walkAlgorithm === "Random") {
      this.x += random(-this.speed, this.speed);
      this.y += random(-this.speed, this.speed);
      this.d += random(-this.speed, this.speed);
    } else if (opt.walkAlgorithm === "Perlin") {
      this.x = noise(this.off1) * width;
      this.y = noise(this.off2) * height;
    }

    this.x = constrain(this.x, 0 + this.d / 2, width - this.d / 2);
    this.y = constrain(this.y, 0 + this.d / 2, height - this.d / 2);
    this.d = constrain(this.d, dRange[0], dRange[1]);
    
    this.off1 += opt.noiseIncrement;
    this.off2 += opt.noiseIncrement;
  }
  this.display = function() {
    strokeWeight(this.sw);
    stroke(this.color);
    line(this.x, this.y, this.prevX, this.prevY);
    this.prevX = this.x;
    this.prevY = this.y;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  for (var i = 0; i < N; i++) {
    bugs[i] = new Jitter();
  }
}
/***** INTERFACE *****/
var Options = function() {
  this.walkAlgorithm = 'Perlin';
  this.noiseIncrement = 0.005;
  this.paused = false;
  this.clear = function() {
    background(255);
  }
};