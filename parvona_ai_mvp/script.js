const videoInput = document.getElementById('videoInput');
const uploadLabel = document.getElementById('uploadLabel');
const analyzeBtn = document.getElementById('analyzeBtn');
const progress = document.getElementById('progress');
const barFill = document.getElementById('barFill');
const progressText = document.getElementById('progressText');

videoInput?.addEventListener('change', () => {
  const file = videoInput.files?.[0];
  uploadLabel.textContent = file ? file.name : 'Choose MP4 file';
});

analyzeBtn?.addEventListener('click', () => {
  progress.classList.remove('hidden');
  analyzeBtn.disabled = true;
  analyzeBtn.textContent = 'Analyzing…';

  const stages = [
    [18, 'Reading video frames…'],
    [42, 'Detecting people and movement…'],
    [67, 'Evaluating event patterns…'],
    [86, 'Building incident timeline…'],
    [100, 'Demo analysis complete']
  ];

  let i = 0;
  const timer = setInterval(() => {
    const [pct, text] = stages[i];
    barFill.style.width = pct + '%';
    progressText.textContent = text;
    i++;

    if (i >= stages.length) {
      clearInterval(timer);
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = 'Run Demo Analysis Again';
    }
  }, 650);
});
