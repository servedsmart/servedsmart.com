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
// Modify all consent scripts, string should be either "0" or "1"
function modifyAllConsent(scripts, string) {
  let consentValue = "";
  scripts.forEach(function () {
    consentValue = consentValue + string;
  });
  modifySomeConsent(consentValue);
}
// Modify certain consent scripts by checking consentValue
function modifySomeConsent(consentValue) {
  setConsentInputs(consentValue);
  createCookie("consent-settings", consentValue, 31);
  deactivateWithParent(document.getElementById("consent-notice"));
  deactivateWithParent(document.getElementById("consent-overlay"));
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
  const documentScripts = Array.from(document.querySelectorAll("script")).map(
    (scr) => scr.src
  );
  console.log(documentScripts)
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
// Activate element and parentElement
function activateWithParent(element) {
  element.classList.add("active");
  element.parentElement.classList.add("active");
}
// Deactivate element and parentElement
function deactivateWithParent(element) {
  element.classList.remove("active");
  element.parentElement.classList.remove("active");
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
  activateWithParent(document.getElementById("consent-notice"));
}
// Handle consent buttons
addClickExec(document.querySelectorAll(".manage-consent"), function () {
  activateWithParent(document.getElementById("consent-overlay"));
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
      deactivateWithParent(this);
    }
  });
