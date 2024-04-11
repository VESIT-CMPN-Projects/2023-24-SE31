import Chart from 'chart.js/auto';

// var thumb = document.querySelector('.thumb');
var graphs = document.querySelector('.graph-info');
var info = document.querySelector('.layman-info');

// thumb.onclick = () => {
  // info.classList.toggle('active');
  // graphs.classList.toggle('active');
// }

let markets = ["Bhiwandi", "Vasai", "Palghar", "Ulhasnagar"];

let fetchData = async (location) => {
  const response = await fetch(`/price/${location}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify("{}"),
  });

  if (!response.ok) {
    console.error('Error fetching data:', response.status);
    return null;
  }

  const data = await response.json();
  return data.prediction;
}

let createChart = async (location) => {
  const predictedPrices = await fetchData(location);

  console.log(predictedPrices);

  if (!predictedPrices) {
    console.error('Failed to fetch data');
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.classList.add("chartjs-chart", location);
  const ctx = canvas.getContext('2d');

  const today = new Date();
  const fourteenDaysAgo = new Date(today);
  fourteenDaysAgo.setDate(today.getDate() - 12);
  const dateLabels = Array.from({ length: predictedPrices.length }, (_, i) => {
    const date = new Date(fourteenDaysAgo);
    date.setDate(fourteenDaysAgo.getDate() + i);
    return date.toLocaleDateString();
  });

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dateLabels,
      datasets: [{
        label: 'Modal Price (Rs./Quintal)',
        data: predictedPrices,
        borderColor: 'blue',
        borderWidth: 1,
        fill: true,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
    },
  });

  let atom = document.createElement("div");
  atom.classList.add("graph-atom");

  atom.innerHTML += `<h3>${location} Prices</h3>`;
  atom.appendChild(canvas);
  document.querySelector(".graphs").appendChild(atom);

  let latestPrice = predictedPrices[predictedPrices.length - 1];

  console.log(latestPrice);

  let table = document.querySelector(".market-prices");
  table.innerHTML += `<tr><td>${location}</td><td> ${latestPrice.toFixed(2)}</td></tr>`;

  return latestPrice;
}

let prices = {};
(async () => {
  for (let market of markets) {
    prices[market] = await createChart(market);
  }

  function getKeyWithMaxValue(obj) {
    let maxKey = null;
    let maxValue = -Infinity;

    for (const key in obj) {
      if (obj[key] > maxValue) {
        maxKey = key;
        maxValue = obj[key];
      }
    }

    return maxKey;
  }

  let maxkey = getKeyWithMaxValue(prices);
  document.querySelector(".best-market").innerText = `${maxkey} @ Rs. ${prices[maxkey].toFixed(2)}/Quintal`;
})();