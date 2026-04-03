// --- 1. 테마 및 네비게이션 제어 ---
const themeToggle = document.getElementById('theme-toggle');
const htmlTag = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'light';
htmlTag.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const newTheme = htmlTag.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    htmlTag.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    themeToggle.style.color = theme === 'dark' ? '#ffffff' : '#2c3e50';
}

// --- 2. 오늘의 행운 리포트 (Hash-based) ---
const fortuneBtn = document.getElementById('fortune-btn');
const fortuneResult = document.getElementById('fortune-result');

if (fortuneBtn) {
    fortuneBtn.addEventListener('click', () => {
        const name = document.getElementById('user-name').value;
        const birth = document.getElementById('fortune-birth').value;
        if (!name || !birth) { alert('정확한 리포트 생성을 위해 이름과 생년월일을 입력해주세요!'); return; }

        fortuneBtn.textContent = '알고리즘 연산 중...';
        fortuneBtn.disabled = true;

        setTimeout(() => {
            const today = new Date();
            const seed = name + birth + today.toDateString();
            const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);

            // 확률 데이터 매핑
            const m = (hash * 7) % 31 + 65; // 65~95
            const l = (hash * 13) % 31 + 65;
            const h = (hash * 19) % 31 + 65;
            
            document.getElementById('money-bar').style.width = m + '%';
            document.getElementById('money-text').textContent = m + '%';
            document.getElementById('love-bar').style.width = l + '%';
            document.getElementById('love-text').textContent = l + '%';
            document.getElementById('health-bar').style.width = h + '%';
            document.getElementById('health-text').textContent = h + '%';

            const icons = ["🌟", "🍀", "☀️", "🌈"];
            const titles = ["대길(大吉): 운수대통", "소길(小吉): 평안한 하루", "평범(平安): 무난한 흐름", "유의(留意): 신중한 행보"];
            const comments = [
                "하늘의 기운이 당신을 돕고 있습니다. 망설이던 일을 오늘 추진하세요.",
                "뜻밖의 장소에서 좋은 소식이 들려옵니다. 주변 사람들에게 베푸는 미덕을 발휘하세요.",
                "안정적인 기운이 감도는 날입니다. 평소 미뤄두었던 자기 계발에 집중해보세요.",
                "오늘은 에너지를 비축하는 날입니다. 큰 변화보다는 일상의 루틴을 지키는 것이 좋습니다."
            ];

            const idx = hash % titles.length;
            document.getElementById('total-icon').textContent = icons[idx];
            document.getElementById('luck-title').textContent = titles[idx];
            document.getElementById('total-comment').textContent = comments[idx];

            fortuneResult.style.display = 'block';
            fortuneBtn.textContent = '리포트 업데이트';
            fortuneBtn.disabled = false;
            window.scrollTo({ top: fortuneResult.offsetTop - 120, behavior: 'smooth' });
        }, 1500);
    });
}

// --- 3. AI 동물상 분석 (TensorFlow.js) ---
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/Hscx2n06o/";
let model, maxPredictions;

async function loadAI() {
    try {
        model = await tmImage.load(MODEL_URL + "model.json", MODEL_URL + "metadata.json");
        maxPredictions = model.getTotalClasses();
    } catch(e) { console.log("AI Model Loading..."); }
}
loadAI();

const uploadArea = document.getElementById('upload-area');
const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const loadingMsg = document.getElementById('loading-message');
const labelContainer = document.getElementById('label-container');

if (imageUpload) {
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            imagePreview.src = event.target.result;
            imagePreview.style.display = 'block';
            document.querySelector('.upload-label').style.opacity = '0.1';
            imagePreview.onload = async () => {
                loadingMsg.style.display = 'block';
                labelContainer.innerHTML = '';
                if(!model) await loadAI();
                const prediction = await model.predict(imagePreview);
                prediction.sort((a, b) => b.probability - a.probability);
                labelContainer.innerHTML = '<h3 style="margin-bottom:20px;">AI 정밀 분석 결과</h3>';
                prediction.forEach(p => {
                    const prob = (p.probability * 100).toFixed(0);
                    const res = document.createElement('div');
                    res.className = 'result-bar-wrapper';
                    res.innerHTML = `<div class="label-text"><span>${p.className}</span><span>${prob}%</span></div><div class="bar-bg" style="height:8px; background:#eee; border-radius:4px;"><div class="bar-fill" style="width: ${prob}%; height:100%; background:#3498db; border-radius:4px; transition:width 1s;"></div></div>`;
                    labelContainer.appendChild(res);
                });
                loadingMsg.style.display = 'none';
            };
        };
        reader.readAsDataURL(file);
    });
}

// --- 4. 사주 분석 & 로또 시뮬레이션 ---
const sajuBtn = document.getElementById('saju-btn');
if (sajuBtn) {
    sajuBtn.addEventListener('click', () => {
        const b = document.getElementById('birth-date').value;
        if(!b) return;
        document.getElementById('saju-result').style.display = 'block';
        const year = new Date(b).getFullYear();
        const t = ["경", "신", "임", "계", "갑", "을", "병", "정", "무", "기"];
        const d = ["신", "유", "술", "해", "자", "축", "인", "묘", "진", "사", "오", "미"];
        document.getElementById('nyeon-ju').textContent = t[year % 10] + d[year % 12];
        document.getElementById('wol-ju').textContent = t[(year*3)%10] + d[(year+2)%12];
        document.getElementById('il-ju').textContent = t[(year+7)%10] + d[(year+4)%12];
        document.getElementById('saju-comment').textContent = "본 명조는 오행의 흐름이 막힘없고 중화를 이룬 격으로, 학문적 성취와 명예운이 높습니다.";
    });
}

const generateBtn = document.getElementById('generate-btn');
const numberCircles = document.querySelectorAll('.number-circle');
if (generateBtn) {
    generateBtn.addEventListener('click', () => {
        generateBtn.disabled = true;
        const nums = Array.from({length: 45}, (_, i) => i + 1).sort(() => Math.random() - 0.5);
        const main = nums.slice(0, 6).sort((a,b) => a-b);
        const bonus = nums[6];
        [...main, bonus].forEach((n, i) => {
            setTimeout(() => {
                numberCircles[i].textContent = n;
                numberCircles[i].className = `number-circle ball-${Math.floor((n-1)/10)*10+1}${i===6?' bonus-ball':''}`;
                if(i === 6) generateBtn.disabled = false;
            }, i * 200);
        });
    });
}

// --- 5. 코인 데이터 로드 ---
function loadCoins() {
    const grid = document.getElementById('coin-list');
    if (!grid) return;
    const list = [
        { n: '비트코인', s: 'BTC', i: '₿', p: '+5.2%' },
        { n: '이더리움', s: 'ETH', i: '💎', p: '+3.8%' },
        { n: '솔라나', s: 'SOL', i: '☀️', p: '+12.4%' }
    ];
    grid.innerHTML = '';
    list.forEach(c => {
        const div = document.createElement('div');
        div.className = 'coin-card';
        div.innerHTML = `<div style="font-size:2.5rem; margin-bottom:10px;">${c.i}</div><div style="font-weight:800; font-size:1.1rem;">${c.n}</div><div style="color:#636e72; font-size:0.8rem; margin-bottom:10px;">${c.s}</div><div style="color:#e74c3c; font-weight:800;">${c.p}</div>`;
        grid.appendChild(div);
    });
}
loadCoins();
