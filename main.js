const generateBtn = document.getElementById('generate-btn');
const numberCircles = document.querySelectorAll('.number-circle');

generateBtn.addEventListener('click', () => {
    // Reset animations
    numberCircles.forEach(circle => {
        circle.style.transform = 'translateY(20px) scale(0)';
        circle.style.opacity = '0';
        circle.style.backgroundImage = ''; 
    });

    const lottoNumbers = generateLottoNumbers();

    setTimeout(() => displayNumbers(lottoNumbers), 100); 
});

function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }
    return Array.from(numbers).sort((a, b) => a - b); // Sort the numbers
}

function displayNumbers(numbers) {
    numberCircles.forEach((circle, index) => {
        setTimeout(() => {
            circle.textContent = numbers[index];
            circle.style.backgroundColor = getNumberColor(numbers[index]);
            circle.style.transform = 'translateY(0) scale(1)';
            circle.style.opacity = '1';
        }, index * 100); 
    });
}

function getNumberColor(number) {
    const hue = (number * 137.508) % 360; 
    return `hsl(${hue}, 70%, 50%)`;
}
