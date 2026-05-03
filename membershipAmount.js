const parameter= new URLSearchParams(window.location.search);
const amountID= parameter.get("id");

const amountDue= document.getElementById("amountDue");

function populateAmount() {
    amountDue.innerText= "";
    amountDue.innerText= `$${amountID}`;
};

document.addEventListener("DOMContentLoaded", () => {
    populateAmount();
});