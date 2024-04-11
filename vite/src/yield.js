import districts from "./districts.json";

let crops = [
  "Jowar", "Maize", "Potatoes",
  "Rice", "Soybeans", "Sweet potatoes",
  "Tapioca (Cassava)", "Wheat"];

// crop rainfall pesticides_tonnes temperature season
let selectDiv = document.querySelector("#crop");
for (let i = 0; i < crops.length; i++)
  selectDiv.innerHTML += `<option value="${i}">${crops[i]}</option>`;

if (localStorage.getItem("pesticide")) document.querySelector("#pesticide").value = localStorage.getItem("pesticide");
if (localStorage.getItem("crop-planted")) document.querySelector("#crop").value = localStorage.getItem("crop-planted");

selectDiv.onchange = document.querySelector("#pesticide").onchange =
  document.querySelector("#crop").onchange = () => {
    localStorage.setItem("pesticide", document.querySelector("#pesticide").value);
    localStorage.setItem("crop-planted", document.querySelector("#crop").value);
    fetch("/yield", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify([
        selectDiv.value, parseInt(localStorage.getItem("district")),
        document.querySelector("#pesticide").value,
        27, 0, // Rabi
      ]),
    }).then(res => res.json()).then(data => {
      document.querySelector(".result").innerText = parseFloat(data[0]).toFixed(2);
    });
  }

selectDiv.onchange();