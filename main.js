const generateBtn = document.getElementById('generate-btn');
const numberCircles = document.querySelectorAll('.number-circle');

generateBtn.addEventListener('click', () => {
    // 버튼 비활성화 (애니메이션 도중 클릭 방지)
    generateBtn.disabled = true;
    generateBtn.textContent = '추첨 중...';

    // 기존 번호 초기화 및 애니메이션 준비
    numberCircles.forEach(circle => {
        circle.style.transform = 'scale(0) rotate(-180deg)';
        circle.style.opacity = '0';
        // 기존 클래스 제거 (ball-* 클래스들)
        circle.className = 'number-circle';
    });

    const lottoNumbers = generateLottoNumbers();

    // 약간의 지연 후 숫자 표시 시작
    setTimeout(() => {
        displayNumbers(lottoNumbers);
    }, 300);
});

function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

function displayNumbers(numbers) {
    numbers.forEach((number, index) => {
        setTimeout(() => {
            const circle = numberCircles[index];
            circle.textContent = number;
            
            // 번호 대역별 클래스 추가
            const colorClass = getBallColorClass(number);
            circle.classList.add(colorClass);

            // 애니메이션 실행
            circle.style.transform = 'scale(1) rotate(0deg)';
            circle.style.opacity = '1';

            // 마지막 번호까지 표시되면 버튼 다시 활성화
            if (index === numbers.length - 1) {
                setTimeout(() => {
                    generateBtn.disabled = false;
                    generateBtn.textContent = '번호 다시 추첨하기';
                }, 500);
            }
        }, index * 250); // 0.25초 간격으로 하나씩 등장
    });
}

function getBallColorClass(number) {
    if (number <= 10) return 'ball-1';
    if (number <= 20) return 'ball-11';
    if (number <= 30) return 'ball-21';
    if (number <= 40) return 'ball-31';
    return 'ball-41';
}
