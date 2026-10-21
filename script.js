// --- EFEK TYPING UNTUK ROLE ---
const textElement = document.getElementById('typing-text');
const textArray = ["Siswa SMA", "Web Developer", "Cyber Security Enthusiast"];
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
        // Jeda sebelum menghapus teks
        typeSpeed = newTextDelay;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % textArray.length;
        typeSpeed = 500; // Jeda sebelum ngetik teks baru
    }

    setTimeout(type, typeSpeed);
}

// Mulai efek typing saat halaman dimuat
document.addEventListener("DOMContentLoaded", function() {
    setTimeout(type, 1000);
});
