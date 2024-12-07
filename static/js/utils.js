import * as myMath from "./math.js";

function makeTimerInput() {
  const inputElement = document.createElement("input")
  inputElement.setAttribute("type", "number");
  inputElement.setAttribute("min", 0);
  inputElement.setAttribute("max", 999);
  inputElement.setAttribute("value", 0);
  inputElement.setAttribute("size", 2);
  inputElement.classList.add("time-input");
  
  return inputElement;
}

function makeColon() {
  const colon = document.createElement("span");
  colon.style.fontSize = "3rem";
  colon.innerText = ":";
  
  return colon;
}

/**
 * @param {HTMLDivElement} inpt
 * @param {HTMLDivElement} dpsl
 */
export const setupProgressBar = (inpt, dspl) => {
  
  //make input and button
  const hRule = document.createElement("hr");
  hRule.setAttribute("color", "white");
  hRule.setAttribute("width", "70%");
  inpt.appendChild(hRule);
  
  const inputFields = document.createElement("div");
  
  const hoursInput = makeTimerInput();
  const minutesInput = makeTimerInput();
  const secondsInput = makeTimerInput();
  
  const firstColon = makeColon();
  const secondColon = makeColon();
  
  inputFields.append(hoursInput, firstColon, minutesInput, secondColon, secondsInput);
  inpt.appendChild(inputFields);
  
  const createTimer = document.createElement("button");
  createTimer.innerText = "Create Timer";
  createTimer.style.fontSize = "1rem";
  
  createTimer.addEventListener("click", (_ev) => {
    const h = hoursInput.value;
    const m = minutesInput.value;
    const s = secondsInput.value;
    
    if (h < 0 || m < 0 || s < 0) {
      hoursInput.value = 0;
      minutesInput.value = 0;
      secondsInput.value = 0;
      return;
    }
    const regex = /^[0-9]+$/;
    if (!h.match(regex) || !m.match(regex) || !s.match(regex)) {
      hoursInput.value = 0;
      minutesInput.value = 0;
      secondsInput.value = 0;
      return;
    }
    
    if (h + m + s == 0) {
      hoursInput.value = 0;
      minutesInput.value = 0;
      secondsInput.value = 0;
      return;
    }
    
    makeTimer(h, m, s);
  });
  
  inpt.appendChild(createTimer);
};

const makeTimer = (hours, minutes, seconds) => {
  
  const container = document.createElement("div");
  container.classList.add("container", "center", "stack");
  container.style.gap = "5px";
  
  const duration = ((parseInt(hours) * 60 + parseInt(minutes)) * 60 + parseInt(seconds)) * 1000
  const h = hours.padStart(2, "0");
  const m = minutes.padStart(2, "0");
  const s = seconds.padStart(2, "0");
  const logWindowWidth = 7;
  const logWindowHeight = 7;
  const logAvgLength = (logWindowWidth + logWindowHeight) / 2;
  const logNumberSteps = Math.min(Math.floor(Math.log2(duration / 30) / 2), logAvgLength);
  const logNumberStepsHor = Math.ceil(logNumberSteps * (logWindowWidth / logAvgLength));
  const logNumberStepsVer = Math.floor(logNumberSteps * (logWindowHeight / logAvgLength));
  const logBlockWidth = logWindowWidth - logNumberSteps;
  
  const progBar = document.createElement("canvas");
  progBar.width = 2**logWindowWidth;
  progBar.height = 2**logWindowHeight;
  progBar.style.border = "2px solid white";
  
  const barHandler = document.createElement("div");
  const barLabel = document.createElement("label");
  barLabel.innerText = (duration / 1000).toString();
  barLabel.style.marginRight = "3px";
  
  const barRemover = document.createElement("button");
  barRemover.innerText = "Remove";
  barRemover.style.marginLeft = "3px";
  
  barHandler.append(barLabel, barRemover);
  container.append(barHandler, progBar);
  dspl.appendChild(container);
  
  const reset = () => {
    const ctx = progBar.getContext("2d");
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, 2**logWindowWidth, 2**logWindowHeight);
  }
  
  reset();
  
  let recs = myMath.makeRandomCoordinates(logNumberStepsHor, logNumberStepsVer, logBlockWidth);
  
  const tickTime = duration / 4**logNumberSteps;
  
  let running = false;
  
  async function runTimer(startTime) {
    
    const ctx = progBar.getContext("2d");
    ctx.fillStyle = "white";
    let count = 0;
    while (recs.length > 0) {
      count++;
      const [x, y] = recs.pop();
      ctx.fillRect(x, y, 2**logBlockWidth, 2**logBlockWidth);
      await new Promise(r => setTimeout(r, startTime + Math.floor(count * tickTime) - Date.now() - 22));
    }
    
    await new Promise((resolve) => setTimeout(resolve, startTime + duration - Date.now() - 22));
    reset();
    console.log(`Duration ${Date.now() - startTime} ms`);
    
    recs = myMath.makeRandomCoordinates(logNumberStepsHor, logNumberStepsVer, logBlockWidth);
    running = false;
  }
  
  progBar.addEventListener("click", (_ev) => {
    if (!running) {
      const t0 = Date.now();
      running = true;
      runTimer(t0);
    }
  });
  
  barRemover.addEventListener("click", (_ev) => {
    container.remove();
  });
}

export const setupClock = (inpt) => {
  
  // create span element
  const clockSpan = document.createElement("span");
  clockSpan.style.fontSize = "5rem";
  inpt.appendChild(clockSpan);
  
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
  setInterval(updateClock, 100);
};