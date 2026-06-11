
let skills = [];
let projects = [];
let certs = [];


function initProfile() {
    const stored = localStorage.getItem('loggedInUser');
    if (!stored) { window.location.href = 'index.html'; return; }

    const user = JSON.parse(stored);
    const firstName = user.name.split(' ')[0];
    const initial   = user.name.charAt(0).toUpperCase();

    const userAvatar = document.getElementById('userAvatar');
    const userName   = document.getElementById('userName');
    if (userAvatar) userAvatar.textContent = initial;
    if (userName)   userName.textContent   = firstName;

   
    const dateEl = document.getElementById('topbarDate');
    if (dateEl) {
        dateEl.textContent = new Date().toLocaleDateString('en-IN', {
            weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
        });
    }

  
    const saved = localStorage.getItem('internai_profile');
    if (saved) {
        const profile = JSON.parse(saved);
        fillForm(profile);
    } else {
        
        const nameEl  = document.getElementById('fullName');
        const emailEl = document.getElementById('emailAddr');
        if (nameEl)  nameEl.value  = user.name;
        if (emailEl) emailEl.value = user.email;
        updateHeader();
    }

    updateCompletion();
}


function fillForm(p) {
    const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.value = val; };

    set('fullName',    p.fullName);
    set('emailAddr',   p.email);
    set('college',     p.college);
    set('degree',      p.degree);
    set('branch',      p.branch);
    set('year',        p.year);
    set('phone',       p.phone);
    set('linkedin',    p.linkedin);
    set('github',      p.github);
    set('bio',         p.bio);
    set('prefRole',    p.prefRole);
    set('prefLocation',p.prefLocation);
    set('duration',    p.duration);
    set('availability',p.availability);
    set('stipend',     p.stipend);

    skills   = p.skills   || [];
    projects = p.projects || [];
    certs    = p.certs    || [];

    renderSkills();
    renderProjects();
    renderCerts();
    updateHeader();
    updateCompletion();
}

function updateHeader() {
    const name     = document.getElementById('fullName')?.value     || 'Your Name';
    const college  = document.getElementById('college')?.value      || 'College name will appear here';
    const degree   = document.getElementById('degree')?.value       || 'Degree';
    const role     = document.getElementById('prefRole')?.value     || 'Preferred Role';
    const location = document.getElementById('prefLocation')?.value || 'Location';

    const headerName     = document.getElementById('headerName');
    const headerCollege  = document.getElementById('headerCollege');
    const headerDegree   = document.getElementById('headerDegree');
    const headerRole     = document.getElementById('headerRole');
    const headerLocText  = document.getElementById('headerLocationText');
    const profileAvatar  = document.getElementById('profileAvatar');

    if (headerName)    headerName.textContent    = name;
    if (headerCollege) headerCollege.textContent = college;
    if (headerDegree)  headerDegree.textContent  = degree;
    if (headerRole)    headerRole.textContent     = role;
    if (headerLocText) headerLocText.textContent  = location;

    if (profileAvatar && !profileAvatar.querySelector('img')) {
        profileAvatar.textContent = name.charAt(0).toUpperCase();
    }

 
    const sideAvatar = document.getElementById('userAvatar');
    const sideName   = document.getElementById('userName');
    if (sideAvatar && !sideAvatar.querySelector('img')) {
        sideAvatar.textContent = name.charAt(0).toUpperCase();
    }
    if (sideName) sideName.textContent = name.split(' ')[0];
}


function updateCompletion() {
    const fields = [
        'fullName', 'college', 'degree', 'branch',
        'year', 'phone', 'linkedin', 'prefRole', 'prefLocation'
    ];

    let filled = 0;
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.value.trim() !== '') filled++;
    });

    if (skills.length > 0) filled++;
    if (projects.length > 0) filled++;

    const total = fields.length + 2;
    const pct   = Math.round((filled / total) * 100);

    const pctEl    = document.getElementById('completionPct');
    const circleEl = document.getElementById('completionCircle');

    if (pctEl) pctEl.textContent = pct + '%';

    // Circle: circumference = 213.6, dashoffset = 213.6 - (pct/100 * 213.6)
    if (circleEl) {
        const offset = 213.6 - (pct / 100) * 213.6;
        circleEl.style.strokeDashoffset = offset;
        circleEl.style.stroke = pct >= 80 ? '#16a34a' : pct >= 50 ? '#2563eb' : '#f59e0b';
    }
}


function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const avatar = document.getElementById('profileAvatar');
        const sideAvatar = document.getElementById('userAvatar');
        if (avatar) {
            avatar.innerHTML = `<img src="${e.target.result}" alt="Avatar">`;
        }
        if (sideAvatar) {
            sideAvatar.innerHTML = `<img src="${e.target.result}" alt="Avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
        }
        localStorage.setItem('internai_avatar', e.target.result);
    };
    reader.readAsDataURL(file);
}

function handleSkillKey(e) {
    if (e.key === 'Enter') { e.preventDefault(); addSkill(); }
}

function addSkill() {
    const input = document.getElementById('skillInput');
    const val   = input.value.trim();
    if (!val) return;

    const parts = val.split(',').map(s => s.trim()).filter(s => s.length > 0);
    parts.forEach(skill => {
        if (!skills.includes(skill)) skills.push(skill);
    });

    input.value = '';
    renderSkills();
    updateCompletion();
}

function addSkillValue(val) {
    if (!skills.includes(val)) {
        skills.push(val);
        renderSkills();
        updateCompletion();
    }
}

function removeSkill(index) {
    skills.splice(index, 1);
    renderSkills();
    updateCompletion();
}

function renderSkills() {
    const container = document.getElementById('skillTags');
    if (!container) return;
    if (skills.length === 0) {
        container.innerHTML = '<p style="font-size:13px; color:var(--text-muted); padding:8px 0;">No skills added yet. Type above or click a suggestion.</p>';
        return;
    }
    container.innerHTML = skills.map((skill, i) => `
        <span class="skill-tag">
            ${skill}
            <button class="skill-remove" onclick="removeSkill(${i})" title="Remove">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </span>
    `).join('');
}


function showAddProject() {
    document.getElementById('addProjectForm').style.display = 'block';
    document.getElementById('projTitle').focus();
}

function hideAddProject() {
    document.getElementById('addProjectForm').style.display = 'none';
    ['projTitle','projTech','projDesc','projGithub','projDemo'].forEach(id => {
        document.getElementById(id).value = '';
    });
}

function saveProject() {
    const title  = document.getElementById('projTitle').value.trim();
    const tech   = document.getElementById('projTech').value.trim();
    const desc   = document.getElementById('projDesc').value.trim();
    const github = document.getElementById('projGithub').value.trim();
    const demo   = document.getElementById('projDemo').value.trim();

    if (!title || !desc) {
        showToast('Please fill in project title and description', 'error');
        return;
    }

    projects.push({ title, tech, desc, github, demo });
    renderProjects();
    hideAddProject();
    updateCompletion();
    showToast('Project added successfully');
}

function deleteProject(index) {
    if (confirm('Remove this project?')) {
        projects.splice(index, 1);
        renderProjects();
        updateCompletion();
    }
}

function renderProjects() {
    const list  = document.getElementById('projectList');
    const empty = document.getElementById('projectEmpty');
    if (!list) return;

    if (projects.length === 0) {
        list.innerHTML = `
            <div class="empty-state" id="projectEmpty">
                <i class="fa-solid fa-folder-open"></i>
                <p>No projects added yet. Add your best work!</p>
            </div>`;
        return;
    }

    list.innerHTML = projects.map((p, i) => `
        <div class="project-card">
            <div class="project-card-header">
                <span class="project-card-title">${p.title}</span>
                <button class="btn-delete-item" onclick="deleteProject(${i})" title="Remove">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
            ${p.tech ? `<div class="project-card-tech"><i class="fa-solid fa-code" style="margin-right:5px;"></i>${p.tech}</div>` : ''}
            <div class="project-card-desc">${p.desc}</div>
            <div class="project-card-links">
                ${p.github ? `<a href="${p.github}" target="_blank" class="project-link"><i class="fa-brands fa-github"></i> GitHub</a>` : ''}
                ${p.demo   ? `<a href="${p.demo}"   target="_blank" class="project-link"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</a>` : ''}
            </div>
        </div>
    `).join('');
}


function showAddCert() {
    document.getElementById('addCertForm').style.display = 'block';
    document.getElementById('certName').focus();
}

function hideCertForm() {
    document.getElementById('addCertForm').style.display = 'none';
    ['certName','certIssuer','certYear','certLink'].forEach(id => {
        document.getElementById(id).value = '';
    });
}

function saveCert() {
    const name   = document.getElementById('certName').value.trim();
    const issuer = document.getElementById('certIssuer').value.trim();
    const year   = document.getElementById('certYear').value.trim();
    const link   = document.getElementById('certLink').value.trim();

    if (!name || !issuer) {
        showToast('Please fill in certificate name and issuer', 'error');
        return;
    }

    certs.push({ name, issuer, year, link });
    renderCerts();
    hideCertForm();
    showToast('Certification added');
}

function deleteCert(index) {
    if (confirm('Remove this certification?')) {
        certs.splice(index, 1);
        renderCerts();
    }
}

function renderCerts() {
    const list = document.getElementById('certList');
    if (!list) return;

    if (certs.length === 0) {
        list.innerHTML = `
            <div class="empty-state" id="certEmpty">
                <i class="fa-solid fa-award"></i>
                <p>No certifications added yet.</p>
            </div>`;
        return;
    }

    list.innerHTML = certs.map((c, i) => `
        <div class="cert-card">
            <div class="cert-icon"><i class="fa-solid fa-certificate"></i></div>
            <div class="cert-info">
                <span class="cert-name">${c.name}</span>
                <span class="cert-issuer">${c.issuer}${c.year ? ' &middot; ' + c.year : ''}</span>
            </div>
            ${c.link ? `<a href="${c.link}" target="_blank" class="project-link" style="margin-right:8px;"><i class="fa-solid fa-external-link"></i></a>` : ''}
            <button class="btn-delete-item" onclick="deleteCert(${i})" title="Remove">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function saveProfile() {
    const profile = {
        fullName:     document.getElementById('fullName')?.value.trim(),
        email:        document.getElementById('emailAddr')?.value.trim(),
        college:      document.getElementById('college')?.value.trim(),
        degree:       document.getElementById('degree')?.value,
        branch:       document.getElementById('branch')?.value.trim(),
        year:         document.getElementById('year')?.value,
        phone:        document.getElementById('phone')?.value.trim(),
        linkedin:     document.getElementById('linkedin')?.value.trim(),
        github:       document.getElementById('github')?.value.trim(),
        bio:          document.getElementById('bio')?.value.trim(),
        prefRole:     document.getElementById('prefRole')?.value,
        prefLocation: document.getElementById('prefLocation')?.value,
        duration:     document.getElementById('duration')?.value,
        availability: document.getElementById('availability')?.value,
        stipend:      document.getElementById('stipend')?.value,
        skills,
        projects,
        certs
    };

    localStorage.setItem('internai_profile', JSON.stringify(profile));

   
    const stored = localStorage.getItem('loggedInUser');
    if (stored && profile.fullName) {
        const user = JSON.parse(stored);
        user.name = profile.fullName;
        localStorage.setItem('loggedInUser', JSON.stringify(user));
    }

    showToast('Profile saved successfully');
    updateCompletion();
}


document.addEventListener('DOMContentLoaded', initProfile);