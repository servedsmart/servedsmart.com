/*
 * File = consent.js
 * Author = Leopold Meinel (leo@meinel.dev)
 * -----
 * Copyright (c) 2025 Leopold Meinel & contributors
 * SPDX ID = MIT
 * URL = https://opensource.org/licenses/MIT
 * -----
 */

// Create cookie, stores accepted as 1 and not accepted as 0 in a single string
function createCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}
// Read cookie and return formatted output
function readCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
// Erase cookie
function eraseCookie(name) {
  createCookie(name, "", -1);
}
// Modify all consent scripts, targetString should be either "0" or "1"
function modifyAllConsent(scripts, targetString) {
  let consentValue = "";
  scripts.forEach(function () {
    consentValue = consentValue + targetString;
  });
  modifySomeConsent(consentValue);
}
// Modify certain consent scripts by checking consentValue
function modifySomeConsent(consentValue) {
  setConsentInputs(consentValue);
  createCookie("consent-settings", consentValue, 31);
  document.getElementById("consent-notice").classList.remove("active");
  document.getElementById("consent-overlay").classList.remove("active");
  loadOptionalJS(optionalScripts, consentValue);
}
// Load funcional javascript
function loadFunctionalJS() {
  let functionalConsent = "";
  functionalScripts.forEach(function () {
    functionalConsent = functionalConsent + "1";
  });
  loadOptionalJS(functionalScripts, functionalConsent);
}
// Load optional javascript
function loadOptionalJS(scripts, consentValue) {
  let documentScripts = Array.from(document.querySelectorAll("script")).map(
    (scr) => scr.src
  );
  scripts.forEach(function (value, key) {
    if (documentScripts.includes(value)) {
      return;
    }
    if (consentValue[key] == "1") {
      let s = document.createElement("script");
      s.type = "text/javascript";
      s.src = value;
      document.body.appendChild(s);
    }
  });
}
// Set consent value via checkboxes
function setConsentInputs(consentValue) {
  const elements = document.querySelectorAll(
    "#consent-overlay input:not([disabled])"
  );
  elements.forEach(function (el, index) {
    if (consentValue[index] == "1") el.checked = true;
    else el.checked = false;
  });
}
// Set consent value from checkboxes
function setConsentValue() {
  const elements = document.querySelectorAll(
    "#consent-overlay input:not([disabled])"
  );
  let consentValue = "";
  elements.forEach(function (el) {
    if (el.checked) consentValue = consentValue + "1";
    else consentValue = consentValue + "0";
  });
  document.getElementById("save-consent").dataset.consentvalue = consentValue;
}
// Set all elements unchecked
function setUnchecked(elements) {
  elements.forEach(function (el) {
    el.checked = false;
  });
}
// Handle event listeners on click for elements
function addClickExec(elements, fn) {
  elements.forEach(function (el) {
    el.addEventListener("click", fn);
  });
}
// Modify active attribute in parent elements
function modifyActiveParent(mutationsList, observer) {
  for (const mutation of mutationsList) {
    if (mutation.type === "attributes" && mutation.attributeName === "class") {
      const targetElement = mutation.target;
      // Check if active has been removed
      if (!targetElement.classList.contains("active")) {
        // Set display of targetElement and parentEl to none and remove active attribute
        targetElement.style.display = "none";
        const parentEl = targetElement.parentElement;
        if (parentEl) {
          parentEl.classList.remove("active");
          parentEl.style.display = "none";
        }
        observer.disconnect();
      } else {
        // If it contains active, also add parent element active attribute
        const parentEl = targetElement.parentElement;
        parentEl.classList.add("active");
      }
    }
  }
}
// Observe an element via MutationObserver
function observeElement(element) {
  const observer = new MutationObserver(modifyActiveParent);
  observer.observe(element, { attributes: true });
}

// Load functional javascript
loadFunctionalJS();

// Uncheck checkboxes
setUnchecked(
  document.querySelectorAll("#consent-overlay input:not([disabled])")
);

// Load javascript if user has consented or show notice
if (readCookie("consent-settings")) {
  const consentValue = readCookie("consent-settings").toString();
  setConsentInputs(consentValue);
  loadOptionalJS(optionalScripts, consentValue);
} else {
  document.getElementById("consent-notice").classList.add("active");
  observeElement(document.getElementById("consent-notice"));
}
// Handle consent buttons
addClickExec(document.querySelectorAll(".manage-consent"), function () {
  document.getElementById("consent-overlay").classList.add("active");
  observeElement(document.getElementById("consent-overlay"));
});
addClickExec(document.querySelectorAll(".deny-consent"), function () {
  modifyAllConsent(optionalScripts, "0");
});
addClickExec(document.querySelectorAll(".approve-consent"), function () {
  modifyAllConsent(optionalScripts, "1");
});
document.getElementById("save-consent").addEventListener("click", function () {
  setConsentValue();
  modifySomeConsent(this.dataset.consentvalue);
});
// Remove active attribute if clicking outside of div
document
  .getElementById("consent-overlay")
  .addEventListener("click", function (e) {
    if (!document.querySelector("#consent-overlay > div").contains(e.target)) {
      this.classList.remove("active");
    }
  });

// Use MutationObserver to observe active state
observeElement(document.getElementById("consent-notice"));
observeElement(document.getElementById("consent-overlay"));
