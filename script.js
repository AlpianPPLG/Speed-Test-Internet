const speedHistory = [];
const chartLabels = [];
const chartData = [];

let speedChart;
let totalSpeed = 0; // Variabel untuk menyimpan total kecepatan
let testCount = 0; // Variabel untuk menghitung jumlah tes
let averageSpeed = 0; // Variabel untuk kecepatan rata-rata

const speedThreshold = 5; // Ambang batas kecepatan dalam Mbps (misalnya 5 Mbps)

// Fungsi untuk memeriksa kecepatan internet
function measureInternetSpeed() {
  const imageUrl = "https://www.google.com/images/phd/px.gif";
  const downloadSize = 4995374; // Ukuran file dalam byte
  const startTime = new Date().getTime();
  const img = new Image();

  img.onload = function () {
    const endTime = new Date().getTime();
    const duration = (endTime - startTime) / 1000; // Waktu dalam detik
    const speedBps = (downloadSize * 8) / duration;
    const speedMbps = (speedBps / 1024 / 1024).toFixed(2); // Dalam Mbps

    updateSpeedResult(speedMbps);
    addToHistory(speedMbps);
    updateChart(speedMbps);
    updateAverageSpeed(speedMbps);
    checkSpeedNotification(speedMbps);
    assessNetworkQuality(speedMbps); // Penilaian kualitas jaringan
    compareWithGlobalAverage(speedMbps); // Perbandingan dengan rata-rata global
  };

  img.onerror = function () {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to perform the speed test. Please try again.",
    });
  };

  img.src = imageUrl + "?cache=" + Math.random();
}

// Fungsi untuk memperbarui tampilan hasil
function updateSpeedResult(speed) {
  const speedResult = document.getElementById("speedResult");
  speedResult.innerText = `${speed} Mbps`;
  speedResult.style.display = "block";
}

// Fungsi untuk menambahkan hasil ke riwayat
function addToHistory(speed) {
  const historyList = document.getElementById("historyList");
  const timestamp = new Date().toLocaleTimeString();
  const listItem = document.createElement("li");
  listItem.textContent = `${timestamp}: ${speed} Mbps`;
  historyList.appendChild(listItem);

  speedHistory.push({ time: timestamp, speed });
}

// Fungsi untuk memperbarui grafik
function updateChart(speed) {
  const timestamp = new Date().toLocaleTimeString();
  chartLabels.push(timestamp);
  chartData.push(speed);

  if (speedChart) {
    speedChart.update();
  } else {
    createChart();
  }
}

// Fungsi untuk membuat grafik
function createChart() {
  const ctx = document.getElementById("speedChart").getContext("2d");
  speedChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: chartLabels,
      datasets: [
        {
          label: "Internet Speed (Mbps)",
          data: chartData,
          borderColor: "#00e0ff",
          backgroundColor: "rgba(0, 224, 255, 0.2)",
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45,
          },
        },
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Fungsi untuk memperbarui kecepatan rata-rata
function updateAverageSpeed(speed) {
  totalSpeed += parseFloat(speed); // Menambahkan kecepatan saat ini ke total
  testCount++; // Menambah jumlah tes
  averageSpeed = (totalSpeed / testCount).toFixed(2); // Menghitung rata-rata kecepatan

  // Menampilkan kecepatan rata-rata
  const averageSpeedResult = document.getElementById("averageSpeedResult");
  averageSpeedResult.innerText = `Average Speed: ${averageSpeed} Mbps`;
}

// Fungsi untuk memberikan notifikasi jika kecepatan terlalu lambat
function checkSpeedNotification(speed) {
  if (parseFloat(speed) < speedThreshold) {
    Swal.fire({
      icon: "warning",
      title: "Slow Speed",
      text: `Your internet speed is too slow! It is below the threshold of ${speedThreshold} Mbps.`,
    });
  }
}

// Fungsi untuk menilai kualitas jaringan
function assessNetworkQuality(speed) {
  const networkQuality = document.getElementById("networkQuality");

  let quality = "Poor";
  if (speed >= 25) {
    quality = "Excellent";
  } else if (speed >= 10) {
    quality = "Good";
  } else if (speed >= 5) {
    quality = "Average";
  }

  networkQuality.innerText = `Network Quality: ${quality}`;
}

// Fungsi untuk perbandingan dengan kecepatan global
function compareWithGlobalAverage(speed) {
  const globalAverageSpeed = 30; // Rata-rata kecepatan global dalam Mbps
  const comparisonResult = document.getElementById("speedComparison");

  let comparison = "Below average";
  if (speed >= globalAverageSpeed) {
    comparison = "Above average";
  }

  comparisonResult.innerText = `Your speed is ${comparison} compared to the global average of ${globalAverageSpeed} Mbps.`;
}

// Event listener untuk tombol cek
document.getElementById("checkBtn").addEventListener("click", function () {
  if (!navigator.onLine) {
    Swal.fire({
      icon: "error",
      title: "Disconnected",
      text: "You are offline. Please connect to the internet and try again.",
    });
    return;
  }

  this.classList.add("shrink");
  measureInternetSpeed();
});

// Event listener untuk tombol Clear History
document
  .getElementById("clearHistoryBtn")
  .addEventListener("click", function () {
    const historyList = document.getElementById("historyList");
    historyList.innerHTML = ""; // Menghapus semua item riwayat
    speedHistory.length = 0; // Mengosongkan array riwayat

    // Reset kecepatan rata-rata dan total tes
    totalSpeed = 0;
    testCount = 0;
    averageSpeed = 0;
    document.getElementById("averageSpeedResult").innerText =
      "Average Speed: 0 Mbps";
  });

// Event listener untuk tombol Download Report
document
  .getElementById("downloadReportBtn")
  .addEventListener("click", function () {
    const doc = new jsPDF();
    let historyText = "Internet Speed Test Report\n\n";

    speedHistory.forEach((entry) => {
      historyText += `${entry.time}: ${entry.speed} Mbps\n`;
    });

    historyText += `\nAverage Speed: ${averageSpeed} Mbps`;

    doc.text(historyText, 10, 10);
    doc.save("speed-test-report.pdf");
  });

// Event listener untuk perubahan bahasa
document
  .getElementById("languageSelect")
  .addEventListener("change", function () {
    const selectedLanguage = this.value;
    const title = document.getElementById("title");
    const speedResult = document.getElementById("speedResult");
    const historySection = document.getElementById("history-section");
    const chartSection = document.getElementById("chart-section");
    const tipsSection = document.getElementById("tips-section");

    if (selectedLanguage === "id") {
      title.innerText = "CEK KECEPATAN INTERNET ANDA";
      speedResult.innerText = "0 Mbps";
      historySection.querySelector("h3").innerText = "Riwayat Pengujian";
      chartSection.querySelector("h3").innerText = "Analisis Kecepatan";
      tipsSection.querySelector("h3").innerText =
        "Tips untuk Meningkatkan Kecepatan Internet";
      document.getElementById("clearHistoryBtn").innerText =
        "Bersihkan Riwayat";
      document.getElementById("downloadReportBtn").innerText = "Unduh Laporan";
      document.getElementById("averageSpeedResult").innerText =
        "Kecepatan Rata-rata: 0 Mbps";
    } else {
      title.innerText = "CHECK YOUR INTERNET SPEED";
      speedResult.innerText = "0 Mbps";
      historySection.querySelector("h3").innerText = "Test History";
      chartSection.querySelector("h3").innerText = "Speed Analysis";
      tipsSection.querySelector("h3").innerText =
        "Tips to Improve Internet Speed";
      document.getElementById("clearHistoryBtn").innerText = "Clear History";
      document.getElementById("downloadReportBtn").innerText =
        "Download Report";
      document.getElementById("averageSpeedResult").innerText =
        "Average Speed: 0 Mbps";
    }
  });
