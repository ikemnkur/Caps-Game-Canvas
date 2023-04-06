

var SCvp_offest = 50;
let mouseX = 0;
let mouseY = 0;
let cellX = 1;
let cellY = 1;

var canvas = document.getElementById("canvas");

var boardWidth = 300;
var boardHeight = 300;
var cellWidth = canvas.width - 100;
var cellHeight = canvas.height - 100;
var ofstV = 50;
var ofstH = 50;
var pad = 5
var dim = 10;


var nRow = nRow || dim;    // default number of rows
var nCol = nCol || dim;    // default number of columns


cellWidth /= nCol;            // cellWidth of a block
cellHeight /= nRow;            // cellHeight of a block


function drawWhiteSpace() {
    var ctx = canvas.getContext("2d");
    ctx.rect(50, 50, canvas.width - 100, canvas.height - 100);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
}


// function drawCheckeredBackground(can, nRow, nCol) {
function drawCheckeredBackground() {
    var ctx = canvas.getContext("2d");
    var cnt = 0;
    for (var y = 0; y < dim; y++) {
        for (var x = 0; x < dim; x++) {
            cnt++;
            if ((cnt % 2 == 0 && y % 2 == 1) || (x % 2 == 0 && y % 2 == 0)) {
                ctx.fillStyle = "#000000";
                ctx.fillRect(50 + x * cellWidth, 50 + y * cellHeight, cellWidth, cellHeight); // y-offest 50
            } else {
                //     console.log("cell: ", x * 8 + y);
                //     ctx.fillStyle = "#FF00FF";
            }
        }
    }
}

drawWhiteSpace();
drawCheckeredBackground();

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.font = "16px Arial";


canvas.addEventListener("mousemove", function (e) {
    var cRect = canvas.getBoundingClientRect();        // Gets CSS pos, and cellWidth/cellHeight
    var canvasX = Math.round(e.clientX - cRect.left);  // Subtract the 'left' of the canvas
    var canvasY = Math.round(e.clientY - cRect.top);   // from the X/Y positions to make  
    // ctx.fillStyle = "#888888";
    ctx.clearRect(0, 0, 112, ofstV);  // (0,0) the top left of the canvas
    ctx.fillStyle = "#000000";
    ctx.fillText("X: " + canvasX + ", Y: " + (Math.abs(400-canvasY)), 10, 20);
    mouseX = canvasX;
    mouseY = 400 - canvasY;
});


canvas.addEventListener("click", function (e) {

    if (ofstV - pad <= mouseY && mouseY <= canvas.height - ofstV + pad) {
        if (ofstH + pad <= mouseX && mouseX <= canvas.width - ofstH + pad) {
            cellX = Math.floor((mouseX - ofstH - pad) / cellWidth) + 1;
            cellY = Math.floor((mouseY - ofstV - pad) / cellHeight) + 1;
            // ctx.fillStyle = "#888888";
            ctx.clearRect(canvas.width - 188, 0, canvas.width, ofstV);  // (0,0) the top left of the canvas
            ctx.fillStyle = "#FF0000";
            ctx.fillText("Cell: [" + cellX + "," + cellY + "]", 190, 20);
            var audio = new Audio('click.wav');
            audio.play();
        }
    }
    console.log("Mouse (X,Y): [" + mouseX + ", " + mouseY + "]");
    console.log("Cell: [" + cellX + ", " + cellY + "]");
})


// Circle Class
function Circle(x, y, r, fill) {
    this.x = x || 0;
    this.y = y || 0;
    this.r = r || 1;
    this.fill = fill || '#AAAAAA';
  }
 
  // Draws this shape to a given context
  Circle.prototype.draw = function(ctx) {
    ctx.strokeStyle = this.fill;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
    ctx.stroke();
  }
 
  Circle.prototype.contains = function(mx, my) {
    return Math.sqrt((mx-this.x)*(mx-this.x) + (my-this.y)*(my-this.y)) < this.r;
  }
 
  // Rectangle Class
  function Shape(x, y, w, h, fill) {
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 1;
    this.h = h || 1;
    this.fill = fill || '#AAAAAA';
  }
 
  Shape.prototype.draw = function(ctx) {
    ctx.fillStyle = this.fill;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
 
  Shape.prototype.contains = function(mx, my) {
    return (this.x <= mx) && (this.x + this.w >= mx) &&
      (this.y <= my) && (this.y + this.h >= my);
  }
 
  function CanvasState(canvas) {
    // **** First some setup! ****
 
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');
    // This complicates things a little but but fixes mouse co-ordinate problems
    // when there's a border or padding. See getMouse for more detail
    var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
    if (document.defaultView && document.defaultView.getComputedStyle) {
      this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10) || 0;
      this.stylePaddingTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10) || 0;
      this.styleBorderLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10) || 0;
      this.styleBorderTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10) || 0;
    }
    // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
    // They will mess up mouse coordinates and this fixes that
    var html = document.body.parentNode;
    this.htmlTop = html.offsetTop;
    this.htmlLeft = html.offsetLeft;
 
    // **** Keep track of state! ****
 
    this.valid = false; // when set to false, the canvas will redraw everything
    this.shapes = []; // the collection of things to be drawn
    this.dragging = false; // Keep track of when we are dragging
    // the current selected object. In the future we could turn this into an array for multiple selection
    this.selection = null;
    this.dragoffx = 0; // See mousedown and mousemove events for explanation
    this.dragoffy = 0;
 
    // **** Then events! ****
 
    // This is an example of a closure!
    // Right here "this" means the CanvasState. But we are making events on the Canvas itself,
    // and when the events are fired on the canvas the variable "this" is going to mean the canvas!
    // Since we still want to use this particular CanvasState in the events we have to save a reference to it.
    // This is our reference!
    var myState = this;
 
    //fixes a problem where double clicking causes text to get selected on the canvas
    canvas.addEventListener('selectstart', function(e) {
      e.preventDefault();
      return false;
    }, false);
    // Up, down, and move are for dragging
    canvas.addEventListener('mousedown', function(e) {
      var mouse = myState.getMouse(e);
      var mx = mouse.x;
      var my = mouse.y;
      var shapes = myState.shapes;
      var l = shapes.length;
      for (var i = l - 1; i >= 0; i--) {
        if (shapes[i].contains(mx, my)) {
          var mySel = shapes[i];
          // Keep track of where in the object we clicked
          // so we can move it smoothly (see mousemove)
          myState.dragoffx = mx - mySel.x;
          myState.dragoffy = my - mySel.y;
          myState.dragging = true;
          myState.selection = mySel;
          myState.valid = false;
          return;
        }
      }
      // havent returned means we have failed to select anything.
      // If there was an object selected, we deselect it
      if (myState.selection) {
        myState.selection = null;
        myState.valid = false; // Need to clear the old selection border
      }
    }, true);
    canvas.addEventListener('mousemove', function(e) {
      if (myState.dragging) {
        var mouse = myState.getMouse(e);
        // We don't want to drag the object by its top-left corner, we want to drag it
        // from where we clicked. Thats why we saved the offset and use it here
        myState.selection.x = mouse.x - myState.dragoffx;
        myState.selection.y = mouse.y - myState.dragoffy;
        myState.valid = false; // Something's dragging so we must redraw
      }
    }, true);
    canvas.addEventListener('mouseup', function(e) {
      myState.dragging = false;
    }, true);
    // double click for making new shapes
    canvas.addEventListener('dblclick', function(e) {
      var mouse = myState.getMouse(e);
      myState.addShape(new Circle(mouse.x, mouse.y, 20, 'rgba(0,255,0,.6)'));
    }, true);
 
    // **** Options! ****
 
    this.selectionColor = '#CC0000';
    this.selectionWidth = 2;
    this.interval = 30;
    setInterval(function() {
      myState.draw();
    }, myState.interval);
  }
 
  CanvasState.prototype.addShape = function(shape) {
    this.shapes.push(shape);
    this.valid = false;
  }
 
  CanvasState.prototype.clear = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
 
  // While draw is called as often as the INTERVAL variable demands,
  // It only ever does something if the canvas gets invalidated by our code
  CanvasState.prototype.draw = function() {
    // if our state is invalid, redraw and validate!
    if (!this.valid) {
      var ctx = this.ctx;
      var shapes = this.shapes;
      this.clear();
 
      // ** Add stuff you want drawn in the background all the time here **
 
      // draw all shapes
      var l = shapes.length;
      for (var i = 0; i < l; i++) {
        var shape = shapes[i];
        // We can skip the drawing of elements that have moved off the screen:
        if (shape.x > this.width || shape.y > this.height ||
          shape.x + shape.w < 0 || shape.y + shape.h < 0) continue;
        shapes[i].draw(ctx);
      }
 
      // draw selection
      // right now this is just a stroke along the edge of the selected Shape
      if (this.selection != null) {
        ctx.strokeStyle = this.selectionColor;
        ctx.lineWidth = this.selectionWidth;
        var mySel = this.selection;
        ctx.strokeRect(mySel.x, mySel.y, mySel.w, mySel.h);
      }
 
      // ** Add stuff you want drawn on top all the time here **
 
      this.valid = true;
    }
  }
 
 
  // Creates an object with x and y defined, set to the mouse position relative to the state's canvas
  // If you wanna be super-correct this can be tricky, we have to worry about padding and borders
  CanvasState.prototype.getMouse = function(e) {
    var element = this.canvas,
      offsetX = 0,
      offsetY = 0,
      mx, my;
 
    // Compute the total offset
    if (element.offsetParent !== undefined) {
      do {
        offsetX += element.offsetLeft;
        offsetY += element.offsetTop;
      } while ((element = element.offsetParent));
    }
 
    // Add padding and border style widths to offset
    // Also add the <html> offsets in case there's a position:fixed bar
    offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
    offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;
 
    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;
 
    // We return a simple javascript object (a hash) with x and y defined
    return {
      x: mx,
      y: my
    };
  }
 
 
 
  function init() {
    var s = new CanvasState(document.getElementById('canvas'));
    s.addShape(new Shape(40, 40, 50, 50)); // The default is gray
    s.addShape(new Shape(60, 140, 40, 60, 'lightskyblue'));
    // Lets make some partially transparent
    s.addShape(new Shape(80, 150, 60, 30, 'rgba(127, 255, 212, .5)'));
    s.addShape(new Shape(125, 80, 30, 80, 'rgba(245, 222, 179, .7)'));
  }
 
  init();
 











