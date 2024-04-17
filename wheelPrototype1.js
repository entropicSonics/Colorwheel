let circles = [];
circles.closed = false;

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES);
//   noLoop();

  let maxRadius = min(width, height) / 2;
  let circlesPerRing = 6;
  let ringGap = 50;

  for (let r = ringGap; r < maxRadius; r += ringGap) {
    let circlesInThisRing = circlesPerRing * (r / ringGap);
    for (let i = 0; i < circlesInThisRing; i++) {
      let angle = map(i, 0, circlesInThisRing, 0, 360);
      let x = r * cos(angle);
      let y = r * sin(angle);
      let hue = map(i, 0, circlesInThisRing, 0, 360);
      circles.push({x: x, y: y, hue: hue, activated: false, activatedAt: 0});
    }
  }
}

function draw() {
    background(0);
    translate(width / 2, height / 2);
    colorMode(HSB);
  
    for (let circle of circles) {
      let c = circle.activated ? color(0, 0, 100) : color(circle.hue, 100, 100);
      fill(c);
      noStroke(); // remove stroke for the circles
      ellipse(circle.x, circle.y, 20, 20);
    }

    let activatedCircles = circles.filter(circle => circle.activated).sort((a, b) => a.activatedAt - b.activatedAt);

    for (let i = 0; i < activatedCircles.length; i++) {
      if (i < activatedCircles.length - 1) { // don't draw a line for the last circle
        stroke(255); // white color for the line
        line(activatedCircles[i].x, activatedCircles[i].y, activatedCircles[i + 1].x, activatedCircles[i + 1].y);
      }
    }

    if (circles.closed) {
        let firstCircle = activatedCircles[0];
        stroke(255); // white color for the line
        line(activatedCircles[activatedCircles.length - 1].x, activatedCircles[activatedCircles.length - 1].y, firstCircle.x, firstCircle.y);
      }
  }
  
  function mousePressed() {
    for (let circle of circles) {
      let distance = dist(mouseX - width / 2, mouseY - height / 2, circle.x, circle.y);
      if (distance < 10) { // assuming the radius of the circle is 10
        if (circle.activated) {
          circles.closed = true;
        } else if (!circles.closed) {
          circle.activated = true;
          circle.activatedAt = frameCount;
        }
      }
    }
  }