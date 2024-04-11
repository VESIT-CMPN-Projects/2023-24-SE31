import Chart from "chart.js/auto";

import { peek, initSocket, onRecv } from "./socket.js";
import districts from "./districts.json";
import crops from "./crops.json";

let npkGraph = document.querySelector(".npk-chart");
let phGraph = document.querySelector(".ph-chart");
let outDiv = document.querySelector(".crop-recommend-graph");

const CITY = Object.keys(districts)[localStorage.getItem("district")];

var graphs = document.querySelector('.graph-info');
var info = document.querySelector('.layman-info');

// TODO remove later (like seriously huh)
document.querySelector(".city").innerHTML = CITY;
document.querySelector(".avg-humidity").innerHTML = 79;
document.querySelector(".avg-rainfall").innerHTML = districts[CITY].rainfall;
document.querySelector(".avg-temp").innerHTML = districts[CITY].temperature;

let npkChart = new Chart(npkGraph.getContext("2d"), {
  type: "bar",
  data: {
    labels: Array(100).fill(0).map((_, i) => i),
    datasets: [
      {
        label: "N",
        data: Array(100).fill(0).map(_ => .33),
      }, {
        label: "P",
        data: Array(100).fill(0).map(_ => .33),
      }, {
        label: "K",
        data: Array(100).fill(0).map(_ => .33),
      },
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0
    },
    scales: {
      x: { stacked: true, },
      y: {
        stacked: true,
        beginAtZero: true,
      }
    }
  }
});

let phChart = new Chart(phGraph.getContext("2d"), {
  type: 'line',
  data: {
    labels: Array(100).fill(0).map((_, i) => i),
    datasets: [{
      label: "pH value",
      data: Array(100).fill(7 + Math.random() * 0.1 - 0.05),
    },]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0
    },
    scales: {
      x: { stacked: true, },
      y: {
        stacked: true,
        beginAtZero: true,
      }
    }
  }
});

initSocket();
onRecv(() => {
  let n = peek("N");
  let p = peek("P");
  let k = peek("K");
  let ph = peek("ph");

  let total = n.map((v, i) => v + p[i] + k[i]);

  for (let i = 0; i < n.length; i++) {
    n[i] /= total[i];
    p[i] /= total[i];
    k[i] = 1 - n[i] - p[i];
  }

  npkChart.data.datasets[0].data = n;
  npkChart.data.datasets[1].data = p;
  npkChart.data.datasets[2].data = k;
  npkChart.update();

  phChart.data.datasets[0].data = ph;
  phChart.update();

  let index = n.length - 1;

  fetch("/recommend", {
    method: 'POST',
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      n[index], p[index], k[index],
      districts[CITY].temperature, 78,
      ph[index], districts[CITY].rainfall,
      0 // Rabi
    ])
  }).then(res => res.json()).then(data => {
    let cropData = crops.map((crop, index) => ({ crop: crop, value: data[0][index] }));
    cropData.sort((a, b) => a.value - b.value);

    let sortedCrops = cropData.map(pair => pair.crop);
    outDiv.innerHTML =
      `<div class="crop1">${sortedCrops[0]} (most recommended)</div>` +
      `<div class="crop2">${sortedCrops[1]}</div>` +
      `<div class="crop3">${sortedCrops[2]}</div>`;
  });
});