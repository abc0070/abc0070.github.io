// --- 공통: 테마 설정 ---
const themeToggle = document.getElementById('theme-toggle');
const htmlTag = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'light';
htmlTag.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlTag.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    htmlTag.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
        themeToggle.style.backgroundColor = '#2d2d2d';
        themeToggle.style.color = '#ffffff';
    } else {
        icon.className = 'fas fa-moon';
        themeToggle.style.backgroundColor = '#ffffff';
        themeToggle.style.color = '#2c3e50';
    }
}

// --- 로또 추첨기 로직 (보너스 번호 포함) ---
const generateBtn = document.getElementById('generate-btn');
const numberCircles = document.querySelectorAll('.number-circle');

if (generateBtn) {
    generateBtn.addEventListener('click', () => {
        generateBtn.disabled = true;
        generateBtn.textContent = '추첨 중...';

        // 초기화
        numberCircles.forEach(circle => {
            circle.textContent = '?';
            circle.style.transform = 'scale(0) rotate(-180deg)';
            circle.style.opacity = '0';
            circle.className = circle.classList.contains('bonus-circle') ? 'number-circle bonus-circle' : 'number-circle';
        });

        // 7개 번호 생성 (6개 메인 + 1개 보너스)
        const lottoNumbers = [];
        while(lottoNumbers.length < 7) {
            const num = Math.floor(Math.random() * 45) + 1;
            if(!lottoNumbers.includes(num)) lottoNumbers.push(num);
        }

        // 앞의 6개는 정렬, 마지막 1개는 보너스로 유지
        const mainNumbers = lottoNumbers.slice(0, 6).sort((a, b) => a - b);
        const bonusNumber = lottoNumbers[6];
        const finalNumbers = [...mainNumbers, bonusNumber];

        // 순차적으로 표시
        finalNumbers.forEach((num, index) => {
            setTimeout(() => {
                const circle = numberCircles[index];
                circle.textContent = num;
                
                // 대역별 색상 클래스 추가
                const colorClass = `ball-${Math.floor((num - 1) / 10) * 10 + 1}`;
                circle.classList.add(colorClass);

                // 애니메이션
                circle.style.transform = 'scale(1) rotate(0deg)';
                circle.style.opacity = '1';

                if (index === 6) {
                    generateBtn.disabled = false;
                    generateBtn.textContent = '번호 다시 추첨하기';
                }
            }, index * 300);
        });
    });
}

// --- 오늘의 운세 로직 ---
const fortuneBtn = document.getElementById('fortune-btn');
const fortuneResult = document.getElementById('fortune-result');
if (fortuneBtn) {
    fortuneBtn.addEventListener('click', () => {
        const name = document.getElementById('user-name').value;
        const birth = document.getElementById('fortune-birth').value;
        if (!name || !birth) { alert('이름과 생년월일을 입력해주세요!'); return; }
        fortuneBtn.disabled = true;
        setTimeout(() => {
            const today = new Date();
            const seed = name + birth + today.toDateString();
            const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const m = (hash * 7) % 41 + 60; const l = (hash * 13) % 41 + 60; const h = (hash * 19) % 41 + 60;
            document.getElementById('money-bar').style.width = m + '%'; document.getElementById('money-text').textContent = m + '%';
            document.getElementById('love-bar').style.width = l + '%'; document.getElementById('love-text').textContent = l + '%';
            document.getElementById('health-bar').style.width = h + '%'; document.getElementById('health-text').textContent = h + '%';
            const titles = ["대길(大吉)", "소길(小吉)", "평범(平安)", "보통(普通)"];
            document.getElementById('luck-title').textContent = titles[hash % 4];
            fortuneResult.style.display = 'block';
            fortuneBtn.disabled = false;
        }, 1000);
    });
}

// --- 동물상 테스트 로직 ---
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/Hscx2n06o/";
let model, maxPredictions;
async function loadModel() {
    model = await tmImage.load(MODEL_URL + "model.json", MODEL_URL + "metadata.json");
    maxPredictions = model.getTotalClasses();
}
loadModel();
const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
if (imageUpload) {
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            imagePreview.src = event.target.result; imagePreview.style.display = 'block';
            imagePreview.onload = async () => {
                document.getElementById('label-container').innerHTML = '';
                const prediction = await model.predict(imagePreview);
                prediction.sort((a, b) => b.probability - a.probability);
                prediction.forEach(p => {
                    const prob = (p.probability * 100).toFixed(0);
                    const res = document.createElement('div');
                    res.className = 'result-bar-wrapper';
                    res.innerHTML = `<div class="label-text"><span>${p.className}</span><span>${prob}%</span></div><div class="bar-bg"><div class="bar-fill" style="width: ${prob}%"></div></div>`;
                    document.getElementById('label-container').appendChild(res);
                });
            };
        };
        reader.readAsDataURL(file);
    });
}

// --- 사주팔자 분석 로직 ---
const sajuBtn = document.getElementById('saju-btn');
if (sajuBtn) {
    sajuBtn.addEventListener('click', () => {
        document.getElementById('saju-result').style.display = 'block';
        const year = new Date(document.getElementById('birth-date').value).getFullYear();
        const t = ["경", "신", "임", "계", "갑", "을", "병", "정", "무", "기"];
        const d = ["신", "유", "술", "해", "자", "축", "인", "묘", "진", "사", "오", "미"];
        document.getElementById('nyeon-ju').textContent = t[year % 10] + d[year % 12];
        document.getElementById('wol-ju').textContent = t[(year*2)%10] + d[(year+5)%12];
        document.getElementById('il-ju').textContent = t[(year+1)%10] + d[(year+1)%12];
        document.getElementById('si-ju').textContent = "기사";
        document.getElementById('saju-comment').textContent = "조화로운 기운을 타고난 사주입니다. 올해는 꾸준한 노력이 결실을 맺는 해가 될 것입니다.";
    });
}
