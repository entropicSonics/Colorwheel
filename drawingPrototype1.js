let circles = [];
let lines = [];
let isDrawing = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
}

function draw() {
  background(0);
  for(let i = 0; i < circles.length; i++) {
    ellipse(circles[i].x, circles[i].y, 50, 50);
  }

  for(let i = 0; i < lines.length; i++) {
    let lineObj = lines[i];
    stroke(255);
    line(lineObj.start.x, lineObj.start.y, lineObj.end.x, lineObj.end.y);
  }

  if (isDrawing && circles.length > 0) {
    let lastCircle = circles[circles.length - 1];
    stroke(255);
    line(lastCircle.x, lastCircle.y, mouseX, mouseY);
  }
}

function mouseClicked() {
    if (isDrawing && circles.length > 0) {
      let lastCircle = circles[circles.length - 1];
      lines.push({start: {x: lastCircle.x, y: lastCircle.y}, end: {x: mouseX, y: mouseY}});
    }
    circles.push({x: mouseX, y: mouseY});
  
    for(let i = 0; i < circles.length - 1; i++) { // check all circles except the last one
      let circle = circles[i];
      let distance = dist(mouseX, mouseY, circle.x, circle.y);
      if (distance < 50) { // assuming the radius of the circle is 50
        isDrawing = false; // if the new circle overlaps with an existing circle, stop drawing
        return;
      }
    }
  }