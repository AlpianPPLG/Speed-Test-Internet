// Fungsi untuk cek koneksi internet
function checkInternetConnection() {
    if (navigator.onLine) {
        Swal.fire({
            icon: 'success',
            title: 'Connected',
            text: 'You are connected to the internet.'
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Disconnected',
            text: 'You are not connected to the internet.'
        });
    }
}

// Tambahkan event listener untuk perubahan status koneksi
window.addEventListener('online', () => {
    Swal.fire({
        icon: 'success',
        title: 'Connected',
        text: 'You are back online.'
    });
});

window.addEventListener('offline', () => {
    Swal.fire({
        icon: 'error',
        title: 'Disconnected',
        text: 'You are offline.'
    });
});

// Panggil fungsi untuk memeriksa koneksi saat halaman dimuat
checkInternetConnection();

// Fungsi Speed Test yang sebelumnya
document.getElementById("checkBtn").addEventListener("click", function() {
    if (!navigator.onLine) {
        Swal.fire({
            icon: 'error',
            title: 'Disconnected',
            text: 'You are offline. Please connect to the internet and try again.'
        });
        return;
    }

    // Mengecilkan tombol setelah diklik
    this.classList.add('shrink');
    document.getElementById("speedResult").style.display = "block"; // Tampilkan hasil

    // Mulai pengujian kecepatan internet
    measureInternetSpeed();
});


function measureInternetSpeed() {
    const imageUrl = "https://www.google.com/images/phd/px.gif"; // Ganti dengan link gambar lain jika diperlukan
    const downloadSize = 4995374; // Ukuran gambar dalam byte (5MB)
    const downloadStart = new Date().getTime(); // Waktu mulai unduh

    // Buat objek gambar
    const img = new Image();

    // Tambahkan event listener untuk menangani gambar yang diunduh
    img.onload = function () {
        const downloadEnd = new Date().getTime(); // Waktu akhir unduh
        const duration = (downloadEnd - downloadStart) / 1000; // Waktu unduhan dalam detik
        const speedBps = (downloadSize * 8) / duration; // Kecepatan dalam bit per detik
        const speedMbps = (speedBps / 1024 / 1024).toFixed(2); // Kecepatan dalam Mbps
        
        document.getElementById("speedResult").innerText = `${speedMbps} Mbps`;
    };

    img.onerror = function () {
        alert("Error fetching the image for speed test.");
    };

    // Mulai mengunduh gambar
    img.src = imageUrl + "?cache=" + Math.random(); // Tambahkan cache buster
}

// Panggil fungsi ketika tombol diklik
document.getElementById("checkBtn").addEventListener("click", function() {
    // Mengecilkan tombol setelah diklik
    this.classList.add('shrink');
    document.getElementById("speedResult").style.display = "block"; // Tampilkan hasil

    // Mulai pengujian kecepatan internet
    measureInternetSpeed();
});
