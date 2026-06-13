

let allQuestions    = [];
let filteredQuestions = [];
let activeIndex     = -1;
let doneSet         = new Set();
let timerInterval   = null;
let timerSeconds    = 120;
let timerMax        = 120;
let timerRunning    = false;


const QUESTION_BANK = {
    hr: [
        { text: 'Tell me about yourself.', hint: 'Use the Present-Past-Future formula. Start with your current situation, mention past experience, and end with why you want this role.', difficulty: 'easy' },
        { text: 'Why do you want to intern at this company?', hint: 'Research the company beforehand. Mention specific projects, products, or values that align with your goals.', difficulty: 'easy' },
        { text: 'What are your greatest strengths?', hint: 'Choose 2-3 relevant strengths and back each one with a brief example from your projects or academics.', difficulty: 'easy' },
        { text: 'What is your biggest weakness and how are you working on it?', hint: 'Choose a real weakness that is not critical to the role. Show self-awareness and what steps you are taking to improve.', difficulty: 'medium' },
        { text: 'Where do you see yourself in 5 years?', hint: 'Align your answer with growth in the field. Show ambition but stay realistic and connect it to the company.', difficulty: 'medium' },
        { text: 'Why should we hire you over other candidates?', hint: 'Summarize your unique combination of skills, projects, and attitude. Be confident but not arrogant.', difficulty: 'medium' },
        { text: 'Tell me about a challenge you faced and how you overcame it.', hint: 'Use the STAR method: Situation, Task, Action, Result. Pick a technical or academic challenge.', difficulty: 'medium' },
        { text: 'How do you handle working under pressure or tight deadlines?', hint: 'Give a specific example. Mention prioritization, time management, and staying calm under pressure.', difficulty: 'medium' },
        { text: 'Do you prefer working alone or in a team?', hint: 'Show that you can do both. Give one example of individual work and one of team collaboration.', difficulty: 'easy' },
        { text: 'What motivates you to work hard?', hint: 'Be genuine. Talk about curiosity, problem solving, impact, or learning rather than just money.', difficulty: 'easy' },
    ],
    technical: [
        { text: 'Explain the difference between supervised and unsupervised learning.', hint: 'Supervised: labeled data, predicts output. Unsupervised: unlabeled data, finds patterns. Give examples like regression vs clustering.', difficulty: 'easy' },
        { text: 'What is overfitting and how do you prevent it?', hint: 'Overfitting: model memorizes training data but fails on new data. Solutions: dropout, regularization, more data, cross-validation.', difficulty: 'medium' },
        { text: 'Explain how gradient descent works.', hint: 'Iteratively updates model weights in the direction of steepest descent of the loss function. Mention learning rate and local minima.', difficulty: 'medium' },
        { text: 'What is the difference between a list and a tuple in Python?', hint: 'Lists are mutable (can be changed), tuples are immutable. Tuples are faster and used for fixed data.', difficulty: 'easy' },
        { text: 'Explain what a REST API is.', hint: 'REST = Representational State Transfer. Uses HTTP methods (GET, POST, PUT, DELETE) to communicate between client and server in a stateless manner.', difficulty: 'easy' },
        { text: 'What is the difference between SQL and NoSQL databases?', hint: 'SQL: structured tables, fixed schema, ACID compliant. NoSQL: flexible schema, document/key-value stores like MongoDB. Use case depends on data type.', difficulty: 'medium' },
        { text: 'Explain the concept of a neural network.', hint: 'Layers of interconnected nodes (neurons) that learn patterns through forward propagation and backpropagation with a loss function.', difficulty: 'medium' },
        { text: 'What is the time complexity of binary search?', hint: 'O(log n). It divides the search space in half at each step. Only works on sorted arrays.', difficulty: 'easy' },
        { text: 'What is a confusion matrix and what does it tell you?', hint: 'Shows True Positives, True Negatives, False Positives, False Negatives. Used to evaluate classification model performance.', difficulty: 'medium' },
        { text: 'Explain the difference between Git merge and Git rebase.', hint: 'Merge: combines branches and creates a merge commit. Rebase: moves commits to the top of another branch for a cleaner history.', difficulty: 'medium' },
        { text: 'What is a transformer model in deep learning?', hint: 'Architecture using attention mechanisms instead of RNNs. Processes sequences in parallel. Powers models like GPT and BERT.', difficulty: 'hard' },
        { text: 'Explain the bias-variance tradeoff.', hint: 'High bias: underfitting, model is too simple. High variance: overfitting, model is too complex. Goal is to find the right balance.', difficulty: 'hard' },
    ],
    behavioral: [
        { text: 'Describe a project you built from scratch. What was your process?', hint: 'Walk through ideation, design, implementation, and testing. Highlight challenges and what you learned.', difficulty: 'medium' },
        { text: 'Tell me about a time you worked with a difficult team member.', hint: 'Focus on how you handled the situation professionally. Show empathy, communication, and problem solving.', difficulty: 'medium' },
        { text: 'Give an example of when you had to learn something new very quickly.', hint: 'Show adaptability and resourcefulness. Mention how you used documentation, tutorials, or mentors to learn fast.', difficulty: 'medium' },
        { text: 'Tell me about a time you failed and what you learned from it.', hint: 'Be honest. Show that you take ownership of failures and use them to improve. End on a positive note.', difficulty: 'medium' },
        { text: 'Describe a time when you went above and beyond what was expected.', hint: 'Pick a project or task where you added extra value without being asked. Show initiative and ownership.', difficulty: 'medium' },
        { text: 'How do you prioritize tasks when you have multiple deadlines?', hint: 'Mention frameworks like Eisenhower matrix or simple to-do prioritization. Give a real example if possible.', difficulty: 'easy' },
        { text: 'Tell me about a time you received critical feedback. How did you respond?', hint: 'Show that you welcome feedback. Describe how you implemented it and what changed as a result.', difficulty: 'medium' },
        { text: 'Have you ever disagreed with a decision made by your team or professor? How did you handle it?', hint: 'Show that you can voice your opinion respectfully and then commit to the team decision if overruled.', difficulty: 'hard' },
    ]
};


function initInterview() {
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

    
    const profile = JSON.parse(localStorage.getItem('internai_profile') || '{}');
    if (profile.prefRole) {
        const roleEl = document.getElementById('targetRole');
        if (roleEl) roleEl.value = profile.prefRole;
    }
}


function quickStart() {
    document.getElementById('targetRole').value = 'AI Engineer Intern';
    generateQuestions();
}


function generateQuestions() {
    const type       = document.getElementById('questionType').value;
    const difficulty = document.getElementById('difficulty').value;
    const role       = document.getElementById('targetRole').value.trim() || 'Software Engineer Intern';
    const company    = document.getElementById('targetCompany').value.trim();

    document.getElementById('qDefaultState').style.display = 'none';
    document.getElementById('qLoading').style.display      = 'block';
    document.getElementById('questionsList').style.display = 'none';

    setTimeout(() => {
        let pool = [];

        if (type === 'all' || type === 'hr')         pool = pool.concat(QUESTION_BANK.hr.map(q => ({ ...q, category: 'hr' })));
        if (type === 'all' || type === 'technical')  pool = pool.concat(QUESTION_BANK.technical.map(q => ({ ...q, category: 'technical' })));
        if (type === 'all' || type === 'behavioral') pool = pool.concat(QUESTION_BANK.behavioral.map(q => ({ ...q, category: 'behavioral' })));

        
        if (difficulty !== 'all') {
            pool = pool.filter(q => {
                if (difficulty === 'easy')   return q.difficulty === 'easy';
                if (difficulty === 'medium') return q.difficulty === 'easy' || q.difficulty === 'medium';
                if (difficulty === 'hard')   return true;
                return true;
            });
        }

        
        pool = pool.sort(() => Math.random() - 0.5);

       
        allQuestions = pool.map((q, i) => ({ ...q, id: i, role, company }));
        filteredQuestions = [...allQuestions];
        doneSet.clear();
        activeIndex = -1;

        document.getElementById('qLoading').style.display      = 'none';
        document.getElementById('questionsList').style.display = 'block';

        const titleEl = document.getElementById('qListTitle');
        const subEl   = document.getElementById('qListSub');
        if (titleEl) titleEl.textContent = `${role} Interview Questions`;
        if (subEl)   subEl.textContent   = `${allQuestions.length} questions${company ? ' for ' + company : ''} — ${difficulty} level`;

        renderQuestions(filteredQuestions);
        updateProgress();

        document.getElementById('practiceIdle').style.display   = 'block';
        document.getElementById('practiceActive').style.display = 'none';
        document.getElementById('progressCard').style.display   = 'block';

        showToast(`${allQuestions.length} questions generated`);
    }, 1200);
}


function renderQuestions(questions) {
    const container = document.getElementById('questionsContainer');
    if (!container) return;

    if (questions.length === 0) {
        container.innerHTML = '<div style="padding:32px; text-align:center; color:var(--text-muted); font-size:14px;">No questions match this filter.</div>';
        return;
    }

    container.innerHTML = questions.map((q, i) => {
        const isDone   = doneSet.has(q.id);
        const isActive = activeIndex === q.id;
        const catClass = `cat-${q.category}`;
        const diffClass = `diff-${q.difficulty}`;

        return `
        <div class="question-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}"
            id="qitem-${q.id}" onclick="selectQuestion(${q.id})">
            <div class="q-num" style="${isDone ? 'background:var(--green)' : ''}">${isDone ? '<i class="fa-solid fa-check"></i>' : (i + 1)}</div>
            <div class="q-content">
                <div class="q-text">${q.text}</div>
                <div class="q-meta">
                    <span class="q-category-tag ${catClass}">${q.category.charAt(0).toUpperCase() + q.category.slice(1)}</span>
                    <span class="q-difficulty-tag ${diffClass}">${q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}</span>
                </div>
            </div>
            ${isDone ? '<i class="q-done-icon fa-solid fa-circle-check"></i>' : ''}
        </div>`;
    }).join('');
}


function filterTab(category, btn) {
    document.querySelectorAll('.q-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    filteredQuestions = category === 'all'
        ? [...allQuestions]
        : allQuestions.filter(q => q.category === category);

    renderQuestions(filteredQuestions);
}


function selectQuestion(id) {
    const q = allQuestions.find(q => q.id === id);
    if (!q) return;

    activeIndex = id;
    resetTimer();

    
    document.getElementById('practiceIdle').style.display   = 'none';
    document.getElementById('practiceActive').style.display = 'block';
    document.getElementById('hintSection').style.display    = 'none';
    document.getElementById('answerNotes').value = '';

    const catEl  = document.getElementById('practiceCategory');
    const diffEl = document.getElementById('practiceDifficulty');
    const qEl    = document.getElementById('practiceQuestion');

    if (catEl)  { catEl.textContent = q.category.charAt(0).toUpperCase() + q.category.slice(1); catEl.className = 'practice-category cat-' + q.category; }
    if (diffEl) { diffEl.textContent = q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1); diffEl.className = 'practice-difficulty diff-' + q.difficulty; }
    if (qEl)    qEl.textContent = q.text;

    
    timerMax = q.difficulty === 'easy' ? 90 : q.difficulty === 'medium' ? 120 : 180;
    timerSeconds = timerMax;
    updateTimerDisplay();

    
    renderQuestions(filteredQuestions);
}


function nextQuestion() {
    const idx = filteredQuestions.findIndex(q => q.id === activeIndex);
    const next = filteredQuestions[idx + 1];
    if (next) {
        selectQuestion(next.id);
    } else {
        showToast('You have reached the last question!');
    }
}


function markDone() {
    if (activeIndex === -1) return;
    doneSet.add(activeIndex);
    renderQuestions(filteredQuestions);
    updateProgress();
    showToast('Question marked as done');
    nextQuestion();
}


function showHint() {
    const q = allQuestions.find(q => q.id === activeIndex);
    if (!q) return;

    const hintSection = document.getElementById('hintSection');
    const hintText    = document.getElementById('hintText');

    if (hintText)    hintText.textContent = q.hint;
    if (hintSection) hintSection.style.display = 'block';
}

function shuffleQuestions() {
    filteredQuestions = filteredQuestions.sort(() => Math.random() - 0.5);
    renderQuestions(filteredQuestions);
    showToast('Questions shuffled');
}

function startTimer() {
    if (timerRunning) {
        clearInterval(timerInterval);
        timerRunning = false;
        const btn = document.getElementById('timerStartBtn');
        if (btn) btn.innerHTML = '<i class="fa-solid fa-play"></i> Resume';
        btn.classList.remove('running');
        return;
    }

    timerRunning = true;
    const btn = document.getElementById('timerStartBtn');
    if (btn) { btn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause'; btn.classList.add('running'); }

    timerInterval = setInterval(() => {
        timerSeconds--;
        updateTimerDisplay();

        if (timerSeconds <= 0) {
            clearInterval(timerInterval);
            timerRunning = false;
            const b = document.getElementById('timerStartBtn');
            if (b) { b.innerHTML = '<i class="fa-solid fa-play"></i> Start Timer'; b.classList.remove('running'); }
            showToast('Time is up! Move to the next question.');
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    timerSeconds = timerMax;
    updateTimerDisplay();
    const btn = document.getElementById('timerStartBtn');
    if (btn) { btn.innerHTML = '<i class="fa-solid fa-play"></i> Start Timer'; btn.classList.remove('running'); }
}

function updateTimerDisplay() {
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    const display = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
    const pct = (timerSeconds / timerMax) * 100;

    const dispEl = document.getElementById('timerDisplay');
    const barEl  = document.getElementById('timerBar');

    if (dispEl) {
        dispEl.textContent = display;
        dispEl.className = 'timer-display' + (pct <= 25 ? ' danger' : pct <= 50 ? ' warning' : '');
    }

    if (barEl) {
        barEl.style.width = pct + '%';
        barEl.className = 'timer-bar' + (pct <= 25 ? ' danger' : pct <= 50 ? ' warning' : '');
    }
}

function updateProgress() {
    const total    = allQuestions.length;
    const done     = doneSet.size;
    const pct      = total > 0 ? Math.round((done / total) * 100) : 0;

    const doneEl  = document.getElementById('progDone');
    const totalEl = document.getElementById('progTotal');
    const pctEl   = document.getElementById('progPct');
    const barEl   = document.getElementById('progressBarFill');

    if (doneEl)  doneEl.textContent  = done;
    if (totalEl) totalEl.textContent = total;
    if (pctEl)   pctEl.textContent   = pct + '%';
    if (barEl)   barEl.style.width   = pct + '%';
}

document.addEventListener('DOMContentLoaded', initInterview);