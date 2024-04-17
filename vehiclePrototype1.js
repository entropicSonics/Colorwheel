let circles = [];
circles.closed = false;
let vehicle = {x: 0, y: 0, targetIndex: 0, firstActivated: false, direction: 1};

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

    if (activatedCircles.length > 0) {
        // Draw lines between activated circles
        stroke(255); // white color for the line
        for (let i = 0; i < activatedCircles.length - 1; i++) {
            line(activatedCircles[i].x, activatedCircles[i].y, activatedCircles[i + 1].x, activatedCircles[i + 1].y);
        }

        // If path is closed, draw line between the last and the first activated circle
        if (circles.closed) {
            line(activatedCircles[0].x, activatedCircles[0].y, activatedCircles[activatedCircles.length - 1].x, activatedCircles[activatedCircles.length - 1].y);
        }
    
        let target = activatedCircles[vehicle.targetIndex];
        let distance = dist(vehicle.x, vehicle.y, target.x, target.y);

        if (distance < 1) { // if the vehicle is close enough to the target
            vehicle.targetIndex += vehicle.direction;
            if (vehicle.targetIndex >= activatedCircles.length || vehicle.targetIndex < 0) { // if the vehicle has reached the end of the path
                vehicle.direction *= -1; // reverse direction
                vehicle.targetIndex += vehicle.direction; // move to the next target in the new direction
            }
        } else {
            let moveSpeed = 0.1; // adjust this to change the speed of the vehicle
            vehicle.x = lerp(vehicle.x, target.x, moveSpeed);
            vehicle.y = lerp(vehicle.y, target.y, moveSpeed);
        }
    
        fill(255, 255, 255); // make the vehicle red
        ellipse(vehicle.x, vehicle.y, 10, 10); // draw the vehicle
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
          if (!vehicle.firstActivated) { // if this is the first circle being activated
            vehicle.x = circle.x;
            vehicle.y = circle.y;
            vehicle.firstActivated = true;
          }
        }
      }
    }
  }