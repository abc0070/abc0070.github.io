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

// --- 오늘의 운세 로직 ---
const fortuneBtn = document.getElementById('fortune-btn');
const fortuneResult = document.getElementById('fortune-result');

if (fortuneBtn) {
    fortuneBtn.addEventListener('click', () => {
        const name = document.getElementById('user-name').value;
        const birth = document.getElementById('fortune-birth').value;
        if (!name || !birth) { alert('이름과 생년월일을 입력해주세요!'); return; }

        fortuneBtn.textContent = '오늘의 기운을 불러오는 중...';
        fortuneBtn.disabled = true;

        setTimeout(() => {
            const today = new Date();
            const dateStr = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate();
            const seed = name + birth + dateStr;
            const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);

            // 점수 계산 (해시 기반 고정값)
            const moneyScore = (hash * 7) % 41 + 60; // 60~100
            const loveScore = (hash * 13) % 41 + 60;
            const healthScore = (hash * 19) % 41 + 60;
            const totalScore = Math.floor((moneyScore + loveScore + healthScore) / 3);

            // UI 업데이트
            document.getElementById('money-bar').style.width = moneyScore + '%';
            document.getElementById('money-text').textContent = moneyScore + '%';
            document.getElementById('love-bar').style.width = loveScore + '%';
            document.getElementById('love-text').textContent = loveScore + '%';
            document.getElementById('health-bar').style.width = healthScore + '%';
            document.getElementById('health-text').textContent = healthScore + '%';

            // 등급 및 코멘트
            const icons = ["🌟", "🍀", "☀️", "☁️"];
            const titles = ["대길(大吉)", "소길(小吉)", "평범(平安)", "보통(普通)"];
            const comments = [
                "오늘은 운수대통! 계획했던 일을 바로 실행에 옮기세요.",
                "작은 행운이 따르는 날입니다. 주변 사람들에게 친절을 베푸세요.",
                "무난한 하루가 예상됩니다. 건강 관리에 신경 쓰면 좋습니다.",
                "조용히 자신을 돌아보기에 좋은 날입니다. 무리한 투자는 피하세요."
            ];
            const adviceList = [
                "동쪽에서 귀인을 만날 수 있으니 외출 시 밝은 옷을 입으세요.",
                "오후 3시경 금전운이 상승합니다. 지갑 단속을 잘 하세요.",
                "옛 친구에게 연락이 올 수 있습니다. 반갑게 응대하세요.",
                "오늘의 행운의 숫자는 7과 24입니다. 로또 번호에 참고해보세요."
            ];

            const idx = hash % titles.length;
            document.getElementById('total-icon').textContent = icons[idx];
            document.getElementById('luck-title').textContent = titles[idx];
            document.getElementById('total-comment').textContent = comments[idx];
            document.getElementById('daily-advice').textContent = adviceList[hash % adviceList.length];

            fortuneResult.style.display = 'block';
            fortuneBtn.textContent = '오늘의 운세 다시 보기';
            fortuneBtn.disabled = false;
            window.scrollTo({ top: fortuneResult.offsetTop - 100, behavior: 'smooth' });
        }, 1200);
    });
}

// --- 동물상 테스트 로직 ---
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/Hscx2n06o/";
let model, labelContainer, maxPredictions;

async function loadModel() {
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
}
loadModel();

const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const uploadLabel = document.querySelector('.upload-label');
const loadingMsg = document.getElementById('loading-message');
labelContainer = document.getElementById('label-container');

if (imageUpload) {
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            imagePreview.src = event.target.result;
            imagePreview.style.display = 'block';
            uploadLabel.style.display = 'none';
            imagePreview.onload = async () => {
                loadingMsg.style.display = 'block';
                labelContainer.innerHTML = '';
                if (!model) await loadModel();
                const prediction = await model.predict(imagePreview);
                prediction.sort((a, b) => b.probability - a.probability);
                labelContainer.innerHTML = '';
                for (let i = 0; i < maxPredictions; i++) {
                    const prob = (prediction[i].probability * 100).toFixed(0);
                    const res = document.createElement('div');
                    res.className = 'result-bar-wrapper';
                    res.innerHTML = `<div class="label-text"><span>${prediction[i].className}</span><span>${prob}%</span></div><div class="bar-bg"><div class="bar-fill" style="width: ${prob}%"></div></div>`;
                    labelContainer.appendChild(res);
                }
                loadingMsg.style.display = 'none';
            };
        };
        reader.readAsDataURL(file);
    });
}

// --- 사주팔자 및 로또 로직 ---
const sajuBtn = document.getElementById('saju-btn');
if (sajuBtn) {
    sajuBtn.addEventListener('click', () => {
        const birthDate = document.getElementById('birth-date').value;
        if (!birthDate) { alert('생년월일을 선택해주세요!'); return; }
        document.getElementById('saju-result').style.display = 'block';
        const year = new Date(birthDate).getFullYear();
        const tianGan = ["경", "신", "임", "계", "갑", "을", "병", "정", "무", "기"];
        const diZhi = ["신", "유", "술", "해", "자", "축", "인", "묘", "진", "사", "오", "미"];
        document.getElementById('nyeon-ju').textContent = tianGan[year % 10] + diZhi[year % 12];
        document.getElementById('wol-ju').textContent = tianGan[(year*2)%10] + diZhi[(year+5)%12];
        document.getElementById('il-ju').textContent = tianGan[(year+1)%10] + diZhi[(year+1)%12];
        document.getElementById('si-ju').textContent = tianGan[5] + diZhi[5];
        document.getElementById('saju-comment').textContent = "기운이 조화롭고 총명한 사주입니다. 올해는 큰 성취가 있을 것입니다.";
    });
}

const generateBtn = document.getElementById('generate-btn');
const numberCircles = document.querySelectorAll('.number-circle');
if (generateBtn) {
    generateBtn.addEventListener('click', () => {
        const nums = Array.from({length: 45}, (_, i) => i + 1).sort(() => Math.random() - 0.5).slice(0, 6).sort((a,b) => a-b);
        nums.forEach((n, i) => {
            setTimeout(() => {
                numberCircles[i].textContent = n;
                numberCircles[i].className = `number-circle ball-${Math.floor((n-1)/10)*10+1}`;
            }, i * 200);
        });
    });
}
