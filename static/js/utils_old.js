class ProgressLog {
  constructor(goal=100, start=0) {
    if (goal < 0) {
      throw new Error("Give a positive goal.");
    }
    this.goal = goal;
    if (start < 0 || start > this.goal) {
      throw new Error(`Give a start between 0 and ${this.goal}`);
    }
    this.current = start;
  }
  
  step(stepsize=1) {
    if (stepsize < 0) {
      throw new Error("Give a positive stepsize.");
    }
    this.current = this.current + stepsize;
    this.current = Math.min(this.current, this.goal);
  }

  set(position) {
    if (position < 0 || position > this.goal) {
      throw new Error(`Give a position between 0 and ${this.goal}`);
    }
    this.current = position;
  }
  
  getProgress() {
    const progress = Math.floor((this.current * 100) / this.goal);
    return progress;
  }
  
  getPosition() {
    return this.current;
  }
}

class ProgressCoordinator {
  constructor() {
//    const ids = Array.from({ length: 100 }, (_, i) => i + 1);
    const coords = [];
    for (let i = 0; i < 10000; i++) {
      coords.push([(i % 100), Math.floor(i / 100)])
    }
    for (let i = 0; i < 100; i++) {
      coords.sort(() => Math.random() - 0.5);
    }
    this.coords = coords;
    
//    for (let i = 0; i < 10; i++) {
//      ids.sort(() => Math.random() - 0.5);
//    }
//    this.ids = ids;
  }    
  
  getCoordinates(idx) {
    return this.coords[idx]
//    const i = this.ids[idx] - 1;
//    const x = (i % 10) * 10;
//    const y = Math.floor(i / 10) * 10;
    
//    return [x, y];
  }
  
  reset() {
    this.coords.sort(() => Math.random() - 0.5);
//    this.ids.sort(() => Math.random() - 0.5);
  }
}

/**
 * @param {HTMLDivElement} root
 */
export const setupDate = (root) => {
  
  // create span element
  const clockSpan = document.createElement("span");
  root.appendChild(clockSpan);
  
  // add default text (new Date())
  const updateClock = () => {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, "0");
    const m = now.getMinutes().toString().padStart(2, "0");
    const s = now.getSeconds().toString().padStart(2, "0");
    clockSpan.innerText = `${h}:${m}:${s}`;
  }
  updateClock();
  
  // setup timer for updating the thing
  setInterval(updateClock, 500);
};

export const setupProgressBar = (prog) => {
  
  //make input and button
  //input: positive integer(seconds)
  //button: create timer of length given by input
  
  const progLog = new ProgressLog(10000);
  const progCoo = new ProgressCoordinator();
  
  const progBar = document.createElement("canvas");
  progBar.width = 100;
  progBar.height = 100;
  progBar.style.border = "2px solid white";
  
  prog.appendChild(progBar);  
  
  const reset = () => {
    progLog.set(0);
    progCoo.reset();
    progBar.style.borderColor = "white";
    const ctx = progBar.getContext("2d");
    ctx.clearRect(0, 0, 100, 100);
  }
  
  const recs = [];
  
  const makeProg = () => {
   
    progLog.step();
    const progress = progLog.getPosition();
    
    if (progress == 10000) {
      progBar.style.borderColor = "red";
    }
    if (progress > 10000) return;
    recs.push(progCoo.getCoordinates(progress - 1))
//    const [x, y] = progCoo.getCoordinates(progress - 1);
//    recs.push([x, y]);
//    ctx.fillRect(x, y, 10, 10);
  }
   
  const ctx = progBar.getContext("2d");
  ctx.fillStyle = "white"; 
  
  const updateBar = () => {
    while (recs.length > 0) {
      const [x, y] = recs.pop();
      ctx.fillRect(x, y, 1, 1);
    }
  }
  
  setInterval(updateBar);
  setInterval(makeProg, 10);
  
  
  document.addEventListener("keydown", (ev) => {
    //if (ev.key == "Enter") makeProg();
    if (ev.key == "c") reset();
  });
};