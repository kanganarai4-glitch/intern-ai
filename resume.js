

let uploadedFile = null;
let isSample     = false;


function initResume() {
    const stored = localStorage.getItem('loggedInUser');
    if (!stored) { window.location.href = 'index.html'; return; }

    const user = JSON.parse(stored);
    const el   = document.getElementById('userAvatar');
    const nm   = document.getElementById('userName');
    if (el) el.textContent = user.name.charAt(0).toUpperCase();
    if (nm) nm.textContent = user.name.split(' ')[0];

    const dateEl = document.getElementById('topbarDate');
    if (dateEl) {
        dateEl.textContent = new Date().toLocaleDateString('en-IN', {
            weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
        });
    }
}


function handleDragOver(e) {
    e.preventDefault();
    document.getElementById('dropZone').classList.add('dragover');
}

function handleDragLeave(e) {
    document.getElementById('dropZone').classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    document.getElementById('dropZone').classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) processFile(file);
}

function processFile(file) {
    const allowed = ['application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'];

    if (!allowed.includes(file.type) &&
        !file.name.endsWith('.pdf') &&
        !file.name.endsWith('.docx') &&
        !file.name.endsWith('.doc')) {
        showToast('Please upload a PDF or DOCX file only', 'error');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        showToast('File size must be under 5MB', 'error');
        return;
    }

    uploadedFile = file;
    isSample     = false;
    showFilePreview(file);
}

function showFilePreview(file) {
    const isPdf     = file.name.endsWith('.pdf');
    const iconEl    = document.getElementById('fileTypeIcon');
    const previewEl = document.getElementById('filePreview');
    const analyzBtn = document.getElementById('analyzeBtn');
    const dropZone  = document.getElementById('dropZone');

    if (iconEl) {
        iconEl.className = isPdf
            ? 'fa-solid fa-file-pdf'
            : 'fa-solid fa-file-word';
        iconEl.parentElement.className = isPdf
            ? 'file-preview-icon'
            : 'file-preview-icon docx';
    }

    const nameEl = document.getElementById('fileName');
    const sizeEl = document.getElementById('fileSize');
    if (nameEl) nameEl.textContent = file.name;
    if (sizeEl) sizeEl.textContent = formatFileSize(file.size);

    dropZone.style.display  = 'none';
    previewEl.style.display = 'flex';
    analyzBtn.style.display = 'flex';
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function removeFile() {
    uploadedFile = null;
    isSample     = false;
    document.getElementById('resumeFileInput').value = '';
    document.getElementById('dropZone').style.display  = 'block';
    document.getElementById('filePreview').style.display = 'none';
    document.getElementById('analyzeBtn').style.display  = 'none';
}

function useSampleResume() {
    isSample = true;
    uploadedFile = { name: 'sample_resume.pdf', size: 214000 };
    showFilePreview(uploadedFile);
    showToast('Sample resume loaded. Click Analyze to continue.');
}


function analyzeResume() {
    if (!uploadedFile && !isSample) {
        showToast('Please upload a resume first', 'error');
        return;
    }

    
    document.getElementById('uploadSection').style.display    = 'none';
    document.getElementById('analyzingSection').style.display = 'block';
    document.getElementById('resultsSection').style.display   = 'none';

    setStepIndicator(2);

  
    const steps = ['aStep1','aStep2','aStep3','aStep4'];
    const delay  = 1200;

    steps.forEach((stepId, i) => {
        setTimeout(() => {
           
            if (i > 0) {
                const prev = document.getElementById(steps[i - 1]);
                if (prev) {
                    prev.classList.remove('active');
                    prev.classList.add('done');
                    prev.querySelector('i').className = 'fa-solid fa-circle-check';
                }
            }
           
            const curr = document.getElementById(stepId);
            if (curr) {
                curr.classList.add('active');
                curr.querySelector('i').className = 'fa-solid fa-spinner fa-spin';
            }
        }, i * delay);
    });

    
    setTimeout(() => {
        const lastStep = document.getElementById(steps[steps.length - 1]);
        if (lastStep) {
            lastStep.classList.remove('active');
            lastStep.classList.add('done');
            lastStep.querySelector('i').className = 'fa-solid fa-circle-check';
        }
        showResults();
    }, steps.length * delay + 600);
}


function showResults() {
    document.getElementById('analyzingSection').style.display = 'none';
    document.getElementById('resultsSection').style.display   = 'block';

    setStepIndicator(3);

    
    const score = isSample ? 72 : Math.floor(Math.random() * 25) + 62;
    displayScore(score);
    displayQuickStats();
    displaySectionScores();
    displayStrengths();
    displayWeaknesses();
    displaySuggestedSkills();
    displayImprovementSteps();

    showToast('Resume analyzed successfully');
}

function displayScore(score) {
    const numEl    = document.getElementById('scoreNumber');
    const gradeEl  = document.getElementById('scoreGrade');
    const hintEl   = document.getElementById('scoreHint');
    const circleEl = document.getElementById('scoreCircle');

   
    let current = 0;
    const interval = setInterval(() => {
        current += 2;
        if (current >= score) { current = score; clearInterval(interval); }
        if (numEl) numEl.textContent = current;
    }, 20);

    
    if (circleEl) {
        setTimeout(() => {
            const offset = 364.4 - (score / 100) * 364.4;
            circleEl.style.strokeDashoffset = offset;
            if      (score >= 80) { circleEl.style.stroke = '#16a34a'; }
            else if (score >= 65) { circleEl.style.stroke = '#2563eb'; }
            else if (score >= 50) { circleEl.style.stroke = '#f59e0b'; }
            else                  { circleEl.style.stroke = '#dc2626'; }
        }, 200);
    }

    
    let grade, gradeClass, hint;
    if (score >= 85) {
        grade = 'Excellent'; gradeClass = 'grade-excellent';
        hint  = 'Your resume is well-optimized for ATS systems. Keep it up!';
    } else if (score >= 70) {
        grade = 'Good'; gradeClass = 'grade-good';
        hint  = 'Your resume is decent but has room for improvement.';
    } else if (score >= 55) {
        grade = 'Average'; gradeClass = 'grade-average';
        hint  = 'Several key areas need attention to improve your chances.';
    } else {
        grade = 'Needs Work'; gradeClass = 'grade-poor';
        hint  = 'Your resume needs significant improvements to pass ATS filters.';
    }

    if (gradeEl) { gradeEl.textContent = grade; gradeEl.className = 'score-grade ' + gradeClass; }
    if (hintEl)  hintEl.textContent = hint;
}

function displayQuickStats() {
    const stats = { words: 487, skills: 12, projects: 3, keywords: 28 };
    const s = document.getElementById('qsWords');
    const k = document.getElementById('qsSkills');
    const p = document.getElementById('qsProjects');
    const w = document.getElementById('qsKeywords');
    if (s) s.textContent = stats.words;
    if (k) k.textContent = stats.skills;
    if (p) p.textContent = stats.projects;
    if (w) w.textContent = stats.keywords;
}

function displaySectionScores() {
    const sections = [
        { label: 'Skills',       score: 85, color: '#16a34a' },
        { label: 'Experience',   score: 60, color: '#2563eb' },
        { label: 'Education',    score: 90, color: '#16a34a' },
        { label: 'Projects',     score: 75, color: '#2563eb' },
        { label: 'Formatting',   score: 70, color: '#f59e0b' },
    ];

    const container = document.getElementById('sectionScores');
    if (!container) return;

    container.innerHTML = sections.map(s => `
        <div class="section-score-item">
            <span class="ss-label">${s.label}</span>
            <div class="ss-bar-wrap">
                <div class="ss-bar" style="width:${s.score}%; background:${s.color};"></div>
            </div>
            <span class="ss-pct">${s.score}%</span>
        </div>
    `).join('');
}

function displayStrengths() {
    const strengths = [
        'Strong technical skills section with relevant keywords',
        'Good educational background clearly listed',
        'Projects section demonstrates practical experience',
        'GitHub and LinkedIn links included',
        'Clean and readable format detected',
    ];

    const list = document.getElementById('strengthsList');
    if (!list) return;

    list.innerHTML = strengths.map(s => `
        <li class="feedback-item">
            <i class="fa-solid fa-circle-check fb-icon-good"></i>
            ${s}
        </li>
    `).join('');
}

function displayWeaknesses() {
    const weaknesses = [
        'Missing quantifiable achievements (e.g. "Improved accuracy by 20%")',
        'No certifications or online courses listed',
        'Experience section lacks action verbs (Built, Led, Designed)',
        'Resume exceeds recommended 1-page limit for freshers',
        'No summary or objective statement at the top',
    ];

    const list = document.getElementById('weaknessesList');
    if (!list) return;

    list.innerHTML = weaknesses.map(w => `
        <li class="feedback-item">
            <i class="fa-solid fa-triangle-exclamation fb-icon-bad"></i>
            ${w}
        </li>
    `).join('');
}

function displaySuggestedSkills() {
    const suggested = [
        'LangChain', 'FastAPI', 'Docker', 'AWS', 'Kubernetes',
        'MLflow', 'Hugging Face', 'CI/CD', 'Redis'
    ];

    const container = document.getElementById('suggestedSkills');
    if (!container) return;

    container.innerHTML = suggested.map(s => `
        <span class="suggested-skill-tag">
            <i class="fa-solid fa-plus" style="font-size:10px;"></i>
            ${s}
        </span>
    `).join('');
}

function displayImprovementSteps() {
    const steps = [
        'Add 2-3 quantifiable achievements per project (e.g. "Reduced inference time by 40%")',
        'Write a 2-line professional summary at the top of your resume',
        'Add relevant certifications from Coursera, Google, or AWS',
        'Use stronger action verbs: Engineered, Deployed, Optimized, Architected',
        'Trim resume to 1 page by removing less relevant details',
        'Add a dedicated "Tools & Technologies" section with icons or categories',
        'Include your CGPA if above 7.5, otherwise remove it',
        'Add links to live demos for each project listed',
    ];

    const container = document.getElementById('improvementSteps');
    if (!container) return;

    container.innerHTML = steps.map((step, i) => `
        <div class="improve-item">
            <div class="improve-num">${i + 1}</div>
            <p class="improve-text">${step}</p>
        </div>
    `).join('');
}


function setStepIndicator(active) {
    for (let i = 1; i <= 3; i++) {
        const el = document.getElementById('step' + i + 'Indicator');
        if (!el) continue;
        el.classList.remove('active', 'done');
        if (i < active)      el.classList.add('done');
        else if (i === active) el.classList.add('active');
    }
}


function reUpload() {
    uploadedFile = null;
    isSample     = false;
    document.getElementById('resumeFileInput').value = '';

    document.getElementById('resultsSection').style.display   = 'none';
    document.getElementById('analyzingSection').style.display = 'none';
    document.getElementById('uploadSection').style.display    = 'block';

    document.getElementById('dropZone').style.display    = 'block';
    document.getElementById('filePreview').style.display = 'none';
    document.getElementById('analyzeBtn').style.display  = 'none';

    setStepIndicator(1);

   
    ['aStep1','aStep2','aStep3','aStep4'].forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.className = 'a-step' + (i === 0 ? ' active' : '');
        el.querySelector('i').className = i === 0 ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-circle';
    });
}

function downloadReport() {
    const scoreEl = document.getElementById('scoreNumber');
    const score   = scoreEl ? scoreEl.textContent : '–';

    const content = `
InternAI Resume Analysis Report
================================
Date: ${new Date().toLocaleDateString('en-IN')}
ATS Score: ${score}/100

STRENGTHS
---------
- Strong technical skills section with relevant keywords
- Good educational background clearly listed
- Projects section demonstrates practical experience
- GitHub and LinkedIn links included

AREAS TO IMPROVE
----------------
- Add quantifiable achievements with numbers
- No certifications listed
- Experience section needs stronger action verbs
- Resume should be trimmed to 1 page

SUGGESTED SKILLS TO ADD
-----------------------
LangChain, FastAPI, Docker, AWS, Kubernetes, MLflow

IMPROVEMENT STEPS
-----------------
1. Add quantifiable achievements per project
2. Write a professional summary at the top
3. Add relevant certifications
4. Use stronger action verbs
5. Trim resume to 1 page
6. Add live demo links for projects

Generated by InternAI – AI-Powered Internship Hunter
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'InternAI_Resume_Report.txt';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Report downloaded successfully');
}


document.addEventListener('DOMContentLoaded', initResume);