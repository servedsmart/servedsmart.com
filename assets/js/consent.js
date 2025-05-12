/*
 * File: consent.js
 * Author: Leopold Meinel (leo@meinel.dev)
 * -----
 * Copyright (c) 2025 Leopold Meinel & contributors
 * SPDX ID: MIT
 * URL: https://opensource.org/licenses/MIT
 * -----
 */

// Wait for readyState
function waitForReadyState(fn) {
  if (
    document.readyState === "interactive" ||
    document.readyState === "complete"
  ) {
    fn();
  } else {
    document.addEventListener("readystatechange", function checkReadyState() {
      if (
        document.readyState === "interactive" ||
        document.readyState === "complete"
      ) {
        fn();
        document.removeEventListener("readystatechange", checkReadyState);
      }
    });
  }
}
// Set localStorage
function setLocalStorage(consentValue) {
  localStorage.setItem("optional-scripts", optionalScripts.toString());
  localStorage.setItem("consent-settings", consentValue);
}
// Get from localStorage or remove if optionalScripts don't match
function getLocalStorageOrRemove() {
  if (localStorage.getItem("optional-scripts") === optionalScripts.toString()) {
    return localStorage.getItem("consent-settings");
  } else {
    localStorage.removeItem("optional-scripts");
    localStorage.removeItem("consent-settings");
    return null;
  }
}
// Calculate consentValue, string should be either "0" or "1"
function getConsentValue(scripts, string) {
  let consentValue = "";
  scripts.forEach(() => {
    consentValue = consentValue + string;
  });
  return consentValue;
}
// Load optional javascript
function loadOptionalJS(consentValue) {
  deactivateWithParent(document.getElementById("consent-notice"));
  deactivateWithParent(document.getElementById("consent-overlay"));
  if (!consentValue) {
    setLocalStorage("0");
    return;
  }
  setCheckboxes(consentValue);
  setLocalStorage(consentValue);
  loadJS(optionalScripts, consentValue);
}
// Load funcional javascript
function loadFunctionalJS() {
  let consentValue = "";
  functionalScripts.forEach(() => {
    consentValue = consentValue + "1";
  });
  loadJS(functionalScripts, consentValue);
}
// Load javascript
function loadJS(scripts, consentValue) {
  const documentScripts = Array.from(document.querySelectorAll("script")).map(
    (scr) => scr.src
  );
  scripts.forEach((value, key) => {
    if (
      !documentScripts.includes(value) &&
      !documentScripts.includes(window.location.origin + value) &&
      consentValue[key] === "1"
    ) {
      let script = document.createElement("script");
      script.type = "text/javascript";
      script.src = value;
      document.body.appendChild(script);
    }
  });
}
// Set checkboxes from consentValue
function setCheckboxes(consentValue) {
  const elements = document.querySelectorAll(
    "#consent-overlay input:not([disabled])"
  );
  elements.forEach((element, index) => {
    element.checked = consentValue[index] === "1";
  });
}
// Set consent value from checkboxes
function setConsentValue() {
  const elements = document.querySelectorAll(
    "#consent-overlay input:not([disabled])"
  );
  let consentValue = "";
  elements.forEach((element) => {
    consentValue = element.checked ? consentValue + "1" : consentValue + "0";
  });
  document.getElementById("consent-settings-confirm").dataset.consentvalue =
    consentValue;
}
// Set all elements unchecked
function setUnchecked(elements) {
  elements.forEach((element) => {
    element.checked = false;
  });
}
// Handle event listeners on click for elements
function addClickExec(elements, fn) {
  if (elements instanceof HTMLElement) {
    elements = [elements];
  }
  elements.forEach((element) => {
    element.addEventListener("click", fn);
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
  window.location.hash = "#consent-exit";
}

waitForReadyState(() => {
  // Set empty hash
  window.location.hash = "#";

  // Load functional javascript
  loadFunctionalJS();

  // Uncheck checkboxes
  setUnchecked(
    document.querySelectorAll("#consent-overlay input:not([disabled])")
  );

  // Open consent-overlay if hash is #consent-overlay
  window.onhashchange = () => {
    if (window.location.hash === "#consent-overlay") {
      activateWithParent(document.getElementById("consent-overlay"));
    }
  };

  // Load javascript if user has consented or show notice
  if (getLocalStorageOrRemove()) {
    const consentValue = getLocalStorageOrRemove();
    setCheckboxes(consentValue);
    loadJS(optionalScripts, consentValue);
  } else {
    activateWithParent(document.getElementById("consent-notice"));
  }
  // Handle consent buttons
  addClickExec(document.querySelectorAll(".consent-settings"), () => {
    window.location.href = "#consent-overlay";
  });
  addClickExec(document.querySelectorAll(".consent-reject-optional"), () => {
    let consentValue = getConsentValue(optionalScripts, "0");
    loadOptionalJS(consentValue);
  });
  addClickExec(document.querySelectorAll(".consent-accept-all"), () => {
    let consentValue = getConsentValue(optionalScripts, "1");
    loadOptionalJS(consentValue);
  });
  addClickExec(document.getElementById("consent-settings-confirm"), (event) => {
    setConsentValue();
    loadOptionalJS(event.currentTarget.dataset.consentvalue);
  });
  // Remove active attribute if clicking outside of div
  addClickExec(document.getElementById("consent-overlay"), (event) => {
    if (
      !document.querySelector("#consent-overlay > div").contains(event.target)
    ) {
      deactivateWithParent(event.currentTarget);
    }
  });
});
