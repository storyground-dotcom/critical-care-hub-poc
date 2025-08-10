// Navigation
function navigate(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

// Copy-to-Clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Copied to clipboard');
  });
}

// Pledges
function makePledge(text) {
  let pledges = JSON.parse(localStorage.getItem('pledges') || '[]');
  pledges.push({ text, date: new Date().toISOString() });
  localStorage.setItem('pledges', JSON.stringify(pledges));
  alert('Pledge saved');
}

// Crisis Assessment
const assessmentQuestions = [
  "Was suicide reasonably foreseeable?",
  "Did you follow proper assessment protocols?",
  "Is your documentation thorough?",
  "Did you consult appropriately?"
];

let currentQ = 0;
let answers = [];

function startAssessment() {
  currentQ = 0;
  answers = [];
  showQuestion();
}

function showQuestion() {
  const question = assessmentQuestions[currentQ];
  const container = document.createElement('div');
  container.className = 'module-block';
  container.innerHTML = `
    <h3>Question ${currentQ + 1} of ${assessmentQuestions.length}</h3>
    <p>${question}</p>
    <button onclick="recordAnswer('yes')">Yes</button>
    <button onclick="recordAnswer('no')" style="margin-left:0.5rem;">No</button>
  `;
  const liabSection = document.getElementById('liability');
  liabSection.innerHTML = `
    <button class="back-btn" onclick="navigate('home')">← Back</button>
    <h2>Suicide Liability - Assessment</h2>
  `;
  liabSection.appendChild(container);
}

function recordAnswer(answer) {
  answers.push(answer);
  currentQ++;
  if (currentQ < assessmentQuestions.length) {
    showQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  const yesCount = answers.filter(a => a === 'yes').length;
  let resultText = '';
  if (yesCount < 2) {
    resultText = "High concern: Process gaps identified. Contact professional support immediately.";
  } else if (yesCount < 4) {
    resultText = "Moderate concern: Some areas need improvement. Review best practices.";
  } else {
    resultText = "Low concern: You are following best practices. Keep it up.";
  }
  const liabSection = document.getElementById('liability');
  liabSection.innerHTML = `
    <button class="back-btn" onclick="navigate('home')">← Back</button>
    <h2>Suicide Liability - Results</h2>
    <p>${resultText}</p>
    <button onclick="navigate('home')">Return Home</button>
  `;
}

// Add small interactive buttons to placeholder modules
document.addEventListener('DOMContentLoaded', () => {
  const modules = [
    { id: 'culturalCare', text: 'https://example.org/culturally-safe-care-resources' },
    { id: 'oatCare', text: 'https://example.org/oat-care-protocols' },
    { id: 'agricultureCare', text: 'https://example.org/agriculture-care-support' }
  ];

  modules.forEach(mod => {
    const section = document.getElementById(mod.id);
    if (section) {
      const btn = document.createElement('button');
      btn.textContent = 'Copy Resource Link';
      btn.onclick = () => copyToClipboard(mod.text);
      btn.style.marginTop = '1rem';
      section.appendChild(btn);
    }
  });
});

// Register service worker for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(() => console.log("Service Worker registered"));
  });
}
// Force-check for a newer service worker on each load
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistration().then(reg => {
    if (reg) reg.update();
  });

  // If the new SW takes control, reload once to show fresh UI
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    window.location.reload();
  });
}
