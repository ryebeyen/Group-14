// console.log("VALIDATION LOADED"); Use this to checck if js file is loading

const cardInput = document.getElementById("cardNumber");
const cvvInput = document.getElementById("cvv");
const zipInput = document.getElementById("zipCode");

const cardError = document.getElementById("cardError");
const cvvError = document.getElementById("cvvError");
const zipError = document.getElementById("zipError");
/* Checks Card NUmber */
function validateCard() {
  const value = cardInput.value.trim();

  if (value === "") {
    cardError.textContent = "Card number is required";
    cardInput.classList.add("invalid");
    cardInput.classList.remove("valid");
  } else if (!/^\d+$/.test(value)) {
    cardError.textContent = "Card must contain only numbers";
    cardInput.classList.add("invalid");
    cardInput.classList.remove("valid");
  } else if (value.length !== 16) {
    cardError.textContent = "Card must be 16 digits";
    cardInput.classList.add("invalid");
    cardInput.classList.remove("valid");
  } else {
    cardError.textContent = "";
    cardInput.classList.add("valid");
    cardInput.classList.remove("invalid");
  }
}
/* Checks CVV */
function validateCVV() {
  const value = cvvInput.value.trim();

  if (value === "") {
    cvvError.textContent = "CVV is required";
    cvvInput.classList.add("invalid");
    cvvInput.classList.remove("valid");
  } else if (!/^\d+$/.test(value)) {
    cvvError.textContent = "CVV must contain only numbers";
    cvvInput.classList.add("invalid");
    cvvInput.classList.remove("valid");
  } else if (value.length !== 3) {
    cvvError.textContent = "CVV must be 3 digits";
    cvvInput.classList.add("invalid");
    cvvInput.classList.remove("valid");
  } else {
    cvvError.textContent = "";
    cvvInput.classList.add("valid");
    cvvInput.classList.remove("invalid");
  }
}
/*Checks Zip*/
function validateZip() {
  const value = zipInput.value.trim();

  if (value === "") {
    zipError.textContent = "Zip code is required";
    zipInput.classList.add("invalid");
    zipInput.classList.remove("valid");
  } else if (!/^\d+$/.test(value)) {
    zipError.textContent = "Zip must contain only numbers";
    zipInput.classList.add("invalid");
    zipInput.classList.remove("valid");
  } else if (value.length !== 5) {
    zipError.textContent = "Zip must be 5 digits";
    zipInput.classList.add("invalid");
    zipInput.classList.remove("valid");
  } else {
    zipError.textContent = "";
    zipInput.classList.add("valid");
    zipInput.classList.remove("invalid");
  }
}
cardInput.addEventListener("input", validateCard);
cardInput.addEventListener("blur", validateCard);
cvvInput.addEventListener("input", validateCVV);
cvvInput.addEventListener("blur", validateCVV);
zipInput.addEventListener("input", validateZip);
zipInput.addEventListener("blur", validateZip);