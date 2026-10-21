// ==========================================
// 1. EFEK MATRIX RAIN (CMATRIX)
// ==========================================
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Karakter yang jatuh: huruf, angka, simbol
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?/'.split('');
const fontSize = 16;
const columns = canvas.width / fontSize;

// Array untuk menyimpan posisi Y dari tiap kolom
const drops = [];
// Isi array dengan 1 (mulai dari atas)
for (let x = 0; x < columns; x++) {
    drops[x] = 1;
}

// Fungsi utama animasi
function drawMatrix() {
    // Background hitam dengan opasitas rendah (buat efek ekor pudar)
    ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        // Pilih karakter random
        const text = chars[Math.floor(Math.random() * chars.length)];
        
        // Warna: Mayoritas hijau, sesekali merah biar serem
        const isRed = Math.random() > 0.95; 
        ctx.fillStyle = isRed ? '#ff3333' : '#00ff41';

        // Gambar teks
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Kirim drop kembali ke atas secara random setelah menyentuh bawah
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }

        drops[i]++;
    }
}

// Loop animasi
setInterval(drawMatrix, 50);

// Handle Resize Window
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Hitung ulang jumlah kolom
    const newColumns = canvas.width / fontSize;
    for (let x = 0; x < newColumns; x++) {
        if (drops[x] === undefined) {
            drops[x] = 1;
        }
    }
});

// ==========================================
// 2. EFEK TYPING (TERMINAL ROLE)
// ==========================================
const textElement = document.getElementById('typing-text');
const textArray = ["Intermediate CTF Player", "Web Developer", "BlackArch Linux User"];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;
let erasingDelay = 50;
let newTextDelay = 2000;

function type() {
    const currentText = textArray[textIndex];
    
    if (isDeleting) {
        textElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        textElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? erasingDelay : typingDelay;

    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = newTextDelay;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % textArray.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

document.addEventListener("DOMContentLoaded", function() {
    setTimeout(type, 1000);
});
