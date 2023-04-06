var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

var canvasCreate = function(w, h) {
  canvas.width = w;
  canvas.height = h;
};

function resetCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  arr = genArray(6);
  drawGrid(arr);
}

// Generate a 6x6 array of 0s or 1s
function genArray(aSize) {
  var a = [];
  for (i=0;i<aSize;i++) {
    a[i] = [];
    for (j=0;j<aSize;j++) {
      a[i][j] = Math.floor(Math.random() * 2);
    }
  }
  return a;
}

function drawGrid(arr) {
  var n = 6;
  for (var i=0;i<n;i++) {
    for (var j=0;j<n;j++) {
      ctx.beginPath();
      ctx.strokeStyle = '#555';
      if (arr[i][j] === 1) {
        ctx.fillStyle = '#faf';
        ctx.fillRect(i*50, j*50, 50, 50);
      } else {
        ctx.fillStyle = '#ffa';
        ctx.fillRect(i*50, j*50, 50, 50);
      }
      ctx.rect(i*50, j*50, 50, 50);
      ctx.stroke();
    }
  }
};

var arr = genArray(6);
canvasCreate(300, 300);
drawGrid(arr);

// Get mouse position within canvas
function mouseClick(e) {
  var mouseX, mouseY;

  if(e.offsetX) {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
  }
  else if(e.layerX) {
    mouseX = e.layerX;
    mouseY = e.layerY;
  }
  var gridX = Math.floor(mouseX / 50);
  var gridY = Math.floor(mouseY / 50);
  console.log(gridX, gridY);

  var xy = arr[gridX][gridY];
  if (xy == 0) {
    arr[gridX][gridY] = 1;
    console.log("white");
  }
  else if (xy == 1) {
    arr[gridX][gridY] = 0;
    console.log("black");
  }

  drawGrid(arr);
}

canvas.addEventListener('mousedown', mouseClick, false);