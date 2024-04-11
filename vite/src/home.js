import Chart from 'chart.js/auto';
import districts from "./districts.json";

let mapSelect = document.querySelector("#map-select");
let mapImage = document.querySelector(".map-image");

let districtName = document.querySelector(".district-name");
let districtRainfall = document.querySelector(".district-rainfall");
let districtTemperature = document.querySelector(".district-temperature");

let getRainfall = (district) => districts[district]?.rainfall;
let getTemp = (district) => districts[district]?.temperature;

mapSelect.innerHTML = Object.keys(districts).map((key, i) =>
  `<option value="${i}">${key}</option>`
).join('');

var ctx = document.querySelector(".user-chart").getContext("2d");

var chart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Nitrogen", "Phosphorus", "Potassium"],
    datasets: [{
      data: [1, 1, 1],
      label: "N:P:K Ratio",
      backgroundColor: ["red", "blue", "yellow"],
    }],
  },
});

let selectDistrict = (district) => {
  districtName.textContent = `${district}`;
  districtRainfall.textContent = `${getRainfall(district)}mm`
  districtTemperature.textContent = `${getTemp(district)}°C`
  const n = districts[district]['N-ratio'];
  const p = districts[district]['P-ratio'];
  const k = districts[district]['K-ratio'];

  chart.data.datasets[0].data = [n, p, k];
  chart.update();

  mapImage.style.background = `url("/assets/maps_district/${district}.jpg")`;
}

mapSelect.oninput = () => {
  selectDistrict(Object.keys(districts)[mapSelect.value]);
}

mapSelect.value = parseInt(localStorage.getItem("district"));
selectDistrict(Object.keys(districts)[mapSelect.value]);

// mapImage.style.background = `url("/assets/maps_district/${Object.keys(districts)[mapSelect.value]}.jpg")`;
