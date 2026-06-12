
const INTERNSHIPS = [
    {
        id: 1, company: 'OpenAI', role: 'AI Research Intern',
        location: 'Remote', stipend: 80000, duration: '3 Months',
        logo: 'OA', logoColor: '#e0f2fe', logoText: '#0369a1',
        skills: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'NLP'],
        description: 'Work alongside researchers on cutting-edge AI models and contribute to real research publications.',
        type: 'Full Time', posted: '2 days ago'
    },
    {
        id: 2, company: 'Google', role: 'ML Engineer Intern',
        location: 'Bangalore', stipend: 75000, duration: '3 Months',
        logo: 'GO', logoColor: '#fce7f3', logoText: '#be185d',
        skills: ['Python', 'TensorFlow', 'Machine Learning', 'SQL', 'Cloud'],
        description: 'Build and improve machine learning pipelines for Google products used by billions of users.',
        type: 'Full Time', posted: '1 week ago'
    },
    {
        id: 3, company: 'Microsoft', role: 'Software Engineer Intern',
        location: 'Hyderabad', stipend: 60000, duration: '2 Months',
        logo: 'MS', logoColor: '#ccfbf1', logoText: '#0f766e',
        skills: ['JavaScript', 'React', 'Node.js', 'Azure', 'TypeScript'],
        description: 'Join Microsoft engineering teams to build features for enterprise products like Azure and Teams.',
        type: 'Full Time', posted: '3 days ago'
    },
    {
        id: 4, company: 'Amazon', role: 'Data Science Intern',
        location: 'Delhi / NCR', stipend: 55000, duration: '6 Months',
        logo: 'AM', logoColor: '#ffedd5', logoText: '#9a3412',
        skills: ['Python', 'SQL', 'Machine Learning', 'Statistics', 'AWS'],
        description: 'Analyze large-scale customer data to build recommendation and forecasting models at Amazon scale.',
        type: 'Full Time', posted: '5 days ago'
    },
    {
        id: 5, company: 'TCS', role: 'AI/ML Intern',
        location: 'Pune', stipend: 20000, duration: '3 Months',
        logo: 'TC', logoColor: '#ede9fe', logoText: '#6d28d9',
        skills: ['Python', 'Machine Learning', 'SQL', 'Pandas', 'Scikit-learn'],
        description: 'Work on AI solutions for TCS enterprise clients across banking, healthcare, and retail sectors.',
        type: 'Full Time', posted: '1 day ago'
    },
    {
        id: 6, company: 'Infosys', role: 'Data Analyst Intern',
        location: 'Bangalore', stipend: 15000, duration: '2 Months',
        logo: 'IN', logoColor: '#dbeafe', logoText: '#1e40af',
        skills: ['SQL', 'Python', 'Excel', 'Tableau', 'Statistics'],
        description: 'Analyze business data and create dashboards to help Infosys clients make data-driven decisions.',
        type: 'Part Time', posted: '4 days ago'
    },
    {
        id: 7, company: 'Flipkart', role: 'Backend Developer Intern',
        location: 'Bangalore', stipend: 35000, duration: '3 Months',
        logo: 'FL', logoColor: '#dcfce7', logoText: '#166534',
        skills: ['Node.js', 'Java', 'MongoDB', 'Redis', 'Docker'],
        description: 'Build and optimize backend services that handle millions of requests daily on Flipkart platform.',
        type: 'Full Time', posted: '6 days ago'
    },
    {
        id: 8, company: 'Razorpay', role: 'Full Stack Developer Intern',
        location: 'Bangalore', stipend: 40000, duration: '3 Months',
        logo: 'RZ', logoColor: '#fef9c3', logoText: '#92400e',
        skills: ['React', 'Node.js', 'JavaScript', 'MongoDB', 'AWS'],
        description: 'Work on Razorpay payment products and build features that power payments for thousands of businesses.',
        type: 'Full Time', posted: '1 week ago'
    },
    {
        id: 9, company: 'NVIDIA', role: 'Deep Learning Intern',
        location: 'Remote', stipend: 90000, duration: '6 Months',
        logo: 'NV', logoColor: '#d1fae5', logoText: '#065f46',
        skills: ['Python', 'Deep Learning', 'CUDA', 'PyTorch', 'Computer Vision'],
        description: 'Research and implement deep learning models optimized for NVIDIA GPUs and accelerated computing.',
        type: 'Full Time', posted: '3 days ago'
    },
    {
        id: 10, company: 'Zomato', role: 'Data Science Intern',
        location: 'Delhi / NCR', stipend: 25000, duration: '2 Months',
        logo: 'ZO', logoColor: '#fee2e2', logoText: '#991b1b',
        skills: ['Python', 'SQL', 'Machine Learning', 'Pandas', 'Data Visualization'],
        description: 'Use data to improve food delivery recommendations, pricing models, and partner analytics at Zomato.',
        type: 'Full Time', posted: '2 days ago'
    },
    {
        id: 11, company: 'Swiggy', role: 'ML Platform Intern',
        location: 'Bangalore', stipend: 30000, duration: '3 Months',
        logo: 'SW', logoColor: '#ffedd5', logoText: '#c2410c',
        skills: ['Python', 'Machine Learning', 'Spark', 'Kafka', 'Docker'],
        description: 'Build ML infrastructure and pipelines to power Swiggy's demand prediction and routing models.',
        type: 'Full Time', posted: '5 days ago'
    },
    {
        id: 12, company: 'Paytm', role: 'Frontend Developer Intern',
        location: 'Noida', stipend: 18000, duration: '3 Months',
        logo: 'PT', logoColor: '#dbeafe', logoText: '#1d4ed8',
        skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Redux'],
        description: 'Build intuitive UI components for Paytm's payment and financial services products.',
        type: 'Part Time', posted: '1 week ago'
    },
];

let currentResults = [];
let savedJobs      = JSON.parse(localStorage.getItem('internai_saved_jobs') || '[]');


function initInternships() {
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


function loadFromProfile() {
    const saved = localStorage.getItem('internai_profile');
    if (!saved) {
        showToast('No profile found. Please complete your profile first.', 'error');
        return;
    }
    const profile = JSON.parse(saved);
    const skills  = (profile.skills || []).join(', ');

    if (!skills) {
        showToast('No skills found in your profile. Please add skills first.', 'error');
        return;
    }

    document.getElementById('skillsInput').value = skills;

    if (profile.prefRole)     document.getElementById('roleFilter').value     = profile.prefRole;
    if (profile.prefLocation) document.getElementById('locationFilter').value = profile.prefLocation;

    showToast('Skills loaded from your profile');
    runMatch();
}

function parseSkills(input) {
    return input.split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
}


function calcMatch(userSkills, internship) {
    if (!userSkills || userSkills.length === 0) return Math.floor(Math.random() * 30) + 60;

    const userLower  = userSkills.map(s => s.toLowerCase());
    const internLower = internship.skills.map(s => s.toLowerCase());

    let matched = 0;
    internLower.forEach(skill => {
        const isMatch = userLower.some(us =>
            us.includes(skill) || skill.includes(us) ||
            levenshtein(us, skill) <= 2
        );
        if (isMatch) matched++;
    });

    const base = Math.round((matched / internship.skills.length) * 100);
    return Math.min(99, Math.max(40, base + Math.floor(Math.random() * 8)));
}


function levenshtein(a, b) {
    const dp = Array.from({ length: a.length + 1 }, (_, i) =>
        Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    );
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            dp[i][j] = a[i-1] === b[j-1]
                ? dp[i-1][j-1]
                : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
        }
    }
    return dp[a.length][b.length];
}


function runMatch() {
    const skillsRaw  = document.getElementById('skillsInput').value.trim();
    const role       = document.getElementById('roleFilter').value;
    const location   = document.getElementById('locationFilter').value;
    const stipendVal = document.getElementById('stipendFilter').value;

    const userSkills = parseSkills(skillsRaw);

    
    const activeDiv  = document.getElementById('activeSkills');
    const tagsDiv    = document.getElementById('activeSkillTags');
    if (userSkills.length > 0) {
        activeDiv.style.display = 'flex';
        tagsDiv.innerHTML = userSkills.map(s =>
            `<span class="active-skill-tag">${s}</span>`
        ).join('');
    } else {
        activeDiv.style.display = 'none';
    }

   
    document.getElementById('defaultState').style.display      = 'none';
    document.getElementById('matchLoading').style.display      = 'block';
    document.getElementById('matchResultsList').style.display  = 'none';

    setTimeout(() => {
        
        let results = INTERNSHIPS.filter(intern => {
            if (role && !intern.role.toLowerCase().includes(role.toLowerCase()) &&
                !intern.company.toLowerCase().includes(role.toLowerCase())) {
                
            }
            if (location && intern.location !== location) return false;

            if (stipendVal) {
                if (stipendVal === 'Unpaid'    && intern.stipend > 0)      return false;
                if (stipendVal === 'Under 10k' && intern.stipend >= 10000)  return false;
                if (stipendVal === '10k - 20k' && (intern.stipend < 10000 || intern.stipend > 20000)) return false;
                if (stipendVal === '20k - 40k' && (intern.stipend < 20000 || intern.stipend > 40000)) return false;
                if (stipendVal === 'Above 40k' && intern.stipend <= 40000)  return false;
            }

            return true;
        });

        
        results = results.map(intern => ({
            ...intern,
            matchPct: calcMatch(userSkills, intern)
        }));

        
        results.sort((a, b) => b.matchPct - a.matchPct);
        currentResults = results;

        document.getElementById('matchLoading').style.display     = 'none';
        document.getElementById('matchResultsList').style.display = 'block';

        const titleEl = document.getElementById('resultsTitle');
        const subEl   = document.getElementById('resultsSub');
        if (titleEl) titleEl.textContent = `${results.length} Internships Found`;
        if (subEl) {
            subEl.textContent = userSkills.length > 0
                ? `Matched based on: ${userSkills.slice(0, 4).join(', ')}${userSkills.length > 4 ? '...' : ''}`
                : 'Showing all available internships';
        }

        renderCards(results, userSkills);

        if (results.length > 0) {
            showToast(`Found ${results.length} matches for you`);
        } else {
            showToast('No matches found. Try adjusting your filters.', 'error');
        }
    }, 1400);
}


function renderCards(results, userSkills) {
    const grid = document.getElementById('internshipGrid');
    if (!grid) return;

    if (results.length === 0) {
        grid.innerHTML = `
            <div style="grid-column:span 2; text-align:center; padding:48px; color:var(--text-secondary);">
                <i class="fa-solid fa-circle-xmark" style="font-size:32px; margin-bottom:12px; display:block; color:var(--text-muted);"></i>
                No internships match your current filters. Try removing some filters.
            </div>`;
        return;
    }

    const userLower = (userSkills || []).map(s => s.toLowerCase());

    grid.innerHTML = results.map((intern, idx) => {
        const matchClass = intern.matchPct >= 85 ? 'match-high'
                         : intern.matchPct >= 70 ? 'match-good'
                         : intern.matchPct >= 55 ? 'match-medium'
                         : 'match-low';

        const barColor = intern.matchPct >= 85 ? '#16a34a'
                       : intern.matchPct >= 70 ? '#2563eb'
                       : intern.matchPct >= 55 ? '#f59e0b'
                       : '#dc2626';

        const isSaved   = savedJobs.includes(intern.id);
        const stipendFmt = intern.stipend === 0
            ? 'Unpaid'
            : 'Rs ' + (intern.stipend / 1000).toFixed(0) + 'k/month';

        const skillsHtml = intern.skills.map(skill => {
            const matched = userLower.some(us =>
                us.includes(skill.toLowerCase()) ||
                skill.toLowerCase().includes(us) ||
                levenshtein(us, skill.toLowerCase()) <= 2
            );
            return `<span class="skill-match-tag ${matched ? 'skill-matched' : 'skill-unmatched'}">${skill}</span>`;
        }).join('');

        return `
        <div class="internship-card" style="animation-delay:${idx * 0.06}s;">
            <div class="card-top">
                <div class="company-logo" style="background:${intern.logoColor}; color:${intern.logoText};">
                    ${intern.logo}
                </div>
                <div class="card-top-info">
                    <div class="internship-role">${intern.role}</div>
                    <div class="internship-company">${intern.company}</div>
                </div>
                <div class="match-badge">
                    <span class="match-pct-big ${matchClass}">${intern.matchPct}%</span>
                    <span class="match-pct-label">match</span>
                </div>
            </div>

            <div class="match-bar-row">
                <div class="match-bar-bg">
                    <div class="match-bar-fill" style="width:${intern.matchPct}%; background:${barColor};"></div>
                </div>
            </div>

            <div class="internship-meta">
                <span class="meta-tag"><i class="fa-solid fa-location-dot"></i>${intern.location}</span>
                <span class="meta-tag"><i class="fa-solid fa-indian-rupee-sign"></i>${stipendFmt}</span>
                <span class="meta-tag"><i class="fa-solid fa-clock"></i>${intern.duration}</span>
                <span class="meta-tag"><i class="fa-solid fa-briefcase"></i>${intern.type}</span>
            </div>

            <p style="font-size:13px; color:var(--text-secondary); line-height:1.5;">${intern.description}</p>

            <div class="skills-match">
                <span class="skills-match-label">Required Skills</span>
                <div class="skills-match-tags">${skillsHtml}</div>
            </div>

            <div class="card-actions">
                <button class="btn-apply" id="applyBtn${intern.id}" onclick="applyJob(${intern.id}, this)">
                    <i class="fa-solid fa-paper-plane"></i>
                    Apply Now
                </button>
                <button class="btn-cover-letter" onclick="goToCoverLetter('${intern.company}', '${intern.role}')" title="Generate Cover Letter">
                    <i class="fa-solid fa-envelope"></i>
                </button>
                <button class="btn-save-job ${isSaved ? 'saved' : ''}" id="saveBtn${intern.id}"
                    onclick="toggleSave(${intern.id})" title="${isSaved ? 'Saved' : 'Save Job'}">
                    <i class="fa-${isSaved ? 'solid' : 'regular'} fa-bookmark"></i>
                </button>
            </div>
            <div style="font-size:11px; color:var(--text-muted);">Posted ${intern.posted}</div>
        </div>`;
    }).join('');
}

function applyJob(id, btn) {
    const intern = INTERNSHIPS.find(i => i.id === id);
    if (!intern) return;

    // Save to tracker
    const apps = JSON.parse(localStorage.getItem('internai_applications') || '[]');
    const exists = apps.find(a => a.company === intern.company && a.role === intern.role);
    if (!exists) {
        apps.push({
            id: Date.now(),
            company: intern.company,
            role: intern.role,
            location: intern.location,
            status: 'applied',
            appliedDate: new Date().toLocaleDateString('en-IN'),
            stipend: intern.stipend
        });
        localStorage.setItem('internai_applications', JSON.stringify(apps));
    }

    btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Applied';
    btn.classList.add('applied');
    btn.disabled = true;
    showToast(`Applied to ${intern.role} at ${intern.company}`);
}


function toggleSave(id) {
    const btn = document.getElementById('saveBtn' + id);
    if (savedJobs.includes(id)) {
        savedJobs = savedJobs.filter(j => j !== id);
        if (btn) {
            btn.classList.remove('saved');
            btn.innerHTML = '<i class="fa-regular fa-bookmark"></i>';
            btn.title = 'Save Job';
        }
        showToast('Removed from saved jobs');
    } else {
        savedJobs.push(id);
        if (btn) {
            btn.classList.add('saved');
            btn.innerHTML = '<i class="fa-solid fa-bookmark"></i>';
            btn.title = 'Saved';
        }
        showToast('Job saved');
    }
    localStorage.setItem('internai_saved_jobs', JSON.stringify(savedJobs));
}

function goToCoverLetter(company, role) {
    localStorage.setItem('internai_cl_prefill', JSON.stringify({ company, role }));
    window.location.href = 'cover-letter.html';
}

function clearSkills() {
    document.getElementById('skillsInput').value = '';
    document.getElementById('roleFilter').value  = '';
    document.getElementById('locationFilter').value = '';
    document.getElementById('stipendFilter').value  = '';
    document.getElementById('activeSkills').style.display     = 'none';
    document.getElementById('matchResultsList').style.display = 'none';
    document.getElementById('defaultState').style.display     = 'block';
}

function sortResults() {
    const by = document.getElementById('sortBy').value;
    const userSkills = parseSkills(document.getElementById('skillsInput').value);

    const sorted = [...currentResults].sort((a, b) => {
        if (by === 'match')   return b.matchPct - a.matchPct;
        if (by === 'stipend') return b.stipend - a.stipend;
        if (by === 'company') return a.company.localeCompare(b.company);
        return 0;
    });

    currentResults = sorted;
    renderCards(sorted, userSkills);
}


document.addEventListener('DOMContentLoaded', initInternships);