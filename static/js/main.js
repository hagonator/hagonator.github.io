import * as utils from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  /** @type {HTMLDivElement} */
  const inptDiv = document.getElementById("inpt");
  inptDiv.classList.add("center", "stack");

  utils.setupClock(inptDiv);
  
  const dsplDiv = document.getElementById("dspl");
  dsplDiv.classList.add("center");
  
  utils.setupProgressBar(inptDiv, dsplDiv);
});
