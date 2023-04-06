

var SCvp_offest = 50;
let mouseX = 0;
let mouseY = 0;
let cellX = 1;
let cellY = 1;








////////////////////////////
var canvas = document.getElementById("canvas");


// var pieces = [];


// // Circle Class
// function Circle(x, y, r, fill) {
//     this.x = x || 0;
//     this.y = y || 0;
//     this.r = r || 1;
//     this.cellX = 1;
//     this.cellY = 1;
//     this.rank = 1;
//     this.fill = fill || '#AAAAAA';
// }


// // Draws this shape to a given context
// Circle.prototype.draw = function (ctx) {
//     ctx.strokeStyle = this.fill;
//     ctx.beginPath();
//     ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
//     ctx.stroke();
// }


// Circle.prototype.contains = function (mx, my) {
//     return Math.sqrt((mx - this.x) * (mx - this.x) + (my - this.y) * (my - this.y)) < this.r;
// }




// // While draw is called as often as the INTERVAL variable demands,
// // It only ever does something if the canvas gets invalidated by our code
// CanvasState.prototype.draw = function () {
//     // if our state is invalid, redraw and validate!
//     if (!this.valid) {
//         var ctx = this.ctx;
//         var shapes = this.shapes;
//         this.clear();


//         // ** Add stuff you want drawn in the background all the time here **


//         // draw all shapes
//         var l = shapes.length;
//         for (var i = 0; i < l; i++) {
//             var shape = shapes[i];
//             // We can skip the drawing of elements that have moved off the screen:
//             if (shape.x > this.width || shape.y > this.height ||
//                 shape.x + shape.w < 0 || shape.y + shape.h < 0) continue;
//             shapes[i].draw(ctx);
//         }


//         // draw selection
//         // right now this is just a stroke along the edge of the selected Shape
//         if (this.selection != null) {
//             ctx.strokeStyle = this.selectionColor;
//             ctx.lineWidth = this.selectionWidth;
//             var mySel = this.selection;
//             ctx.strokeRect(mySel.x, mySel.y, mySel.w, mySel.h);
//         }


//         // ** Add stuff you want drawn on top all the time here **


//         this.valid = true;
//     }
// }


// let piece = {
//     x: 1,
//     y: 1,
//     rank: 1,
//     clicked: false
// }


// // pieces.push(new Circle());




/////////////////////////////
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


function drawPiece(piece) {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    var centerX = piece.x;
    var centerY = piece.y;
    var radius = 16;


    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'green';
    context.fill();
    context.lineWidth = 2;
    if (piece.clicked == true) {
        context.strokeStyle = '#003300';
    } else {
        context.strokeStyle = '#336600';
    }
    context.stroke();
    context.fillStyle = "#FFFF00";
    context.font = "20px Impact";
    let fontSize = 12;
    context.fillText(piece.rank, centerX - fontSize / 2, centerY + fontSize / 2);
}




drawWhiteSpace();
drawCheckeredBackground();
// drawPiece();






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






    // //Check if a piece is clicked
    // for (var i = 0; i < pieces.length; i++) {
    //     if (pieces[i].x == cellX && pieces[i].y == cellY) {
    //         pieces[i].clicked = true
    //     }
    //     else pieces[0].clicked = false;
    // }
})











