

let currentLetter   = '';
let currentCompany  = '';
let currentRole     = '';
let savedLetters    = JSON.parse(localStorage.getItem('internai_saved_letters') || '[]');


function initCoverLetter() {
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
    if (profile.skills && profile.skills.length > 0) {
        const skillsEl = document.getElementById('clSkills');
        if (skillsEl) skillsEl.value = profile.skills.slice(0, 5).join(', ');
    }
    if (profile.projects && profile.projects.length > 0) {
        const projEl = document.getElementById('clProject');
        if (projEl && !projEl.value) projEl.value = profile.projects[0].title || '';
    }

    
    const prefill = localStorage.getItem('internai_cl_prefill');
    if (prefill) {
        const { company, role } = JSON.parse(prefill);
        const compEl = document.getElementById('clCompany');
        const roleEl = document.getElementById('clRole');
        if (compEl) compEl.value = company;
        if (roleEl) roleEl.value = role;
        localStorage.removeItem('internai_cl_prefill');
        updatePreviewHeader();
    }

    renderSavedLetters();
}


function updatePreviewHeader() {
    const company = document.getElementById('clCompany')?.value.trim();
    const role    = document.getElementById('clRole')?.value.trim();
    const titleEl = document.getElementById('previewTitle');
    if (!titleEl) return;

    if (company && role) {
        titleEl.textContent = `${role} at ${company}`;
    } else if (company) {
        titleEl.textContent = `Cover Letter for ${company}`;
    } else {
        titleEl.textContent = 'Cover Letter Preview';
    }
}


function generateLetter() {
    const company = document.getElementById('clCompany')?.value.trim();
    const role    = document.getElementById('clRole')?.value.trim();
    const manager = document.getElementById('clManager')?.value.trim();
    const skills  = document.getElementById('clSkills')?.value.trim();
    const project = document.getElementById('clProject')?.value.trim();
    const notes   = document.getElementById('clNotes')?.value.trim();
    const tone    = document.querySelector('input[name="tone"]:checked')?.value || 'professional';

    if (!company || !role) {
        showToast('Please enter both company name and role', 'error');
        return;
    }

    currentCompany = company;
    currentRole    = role;

    const profile   = JSON.parse(localStorage.getItem('internai_profile') || '{}');
    const loginData = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    const userName  = profile.fullName || loginData.name || 'Your Name';
    const userEmail = profile.email    || loginData.email || '';
    const userPhone = profile.phone    || '';
    const userCollege = profile.college || '';
    const userDegree  = profile.degree  || '';
    const userBranch  = profile.branch  || '';

    
    document.getElementById('previewEmpty').style.display      = 'none';
    document.getElementById('previewGenerating').style.display = 'block';
    document.getElementById('letterPaper').style.display       = 'none';
    document.getElementById('previewActions').style.display    = 'none';

    const btn = document.getElementById('generateBtn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...'; }

    
    setTimeout(() => {
        const letter = buildLetter({
            userName, userEmail, userPhone, userCollege,
            userDegree, userBranch, company, role,
            manager, skills, project, notes, tone
        });

        currentLetter = letter.body;
        displayLetter(letter, userName, userEmail, userPhone);

        document.getElementById('previewGenerating').style.display = 'none';
        document.getElementById('letterPaper').style.display       = 'block';
        document.getElementById('previewActions').style.display    = 'flex';

        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate Cover Letter';
        }

        showToast('Cover letter generated successfully');
    }, 2200);
}


function buildLetter({ userName, userEmail, userPhone, userCollege, userDegree,
    userBranch, company, role, manager, skills, project, notes, tone }) {

    const skillList = skills
        ? skills.split(',').map(s => s.trim()).filter(Boolean)
        : ['programming', 'problem-solving', 'teamwork'];

    const topSkills = skillList.slice(0, 3).join(', ');
    const extraSkill = skillList[3] || skillList[0];

    const greeting = manager
        ? `Dear ${manager},`
        : `Dear Hiring Manager,`;

    let opening, body2, body3, closing;

    if (tone === 'enthusiastic') {
        opening = `I am extremely excited to apply for the ${role} position at ${company}! As a passionate ${userDegree || 'Computer Science'} student${userBranch ? ` specializing in ${userBranch}` : ''}${userCollege ? ` at ${userCollege}` : ''}, I have been following ${company}'s work closely and I believe this opportunity aligns perfectly with my career aspirations and technical skills.`;

        body2 = `My technical expertise includes ${topSkills}, which I have developed through both academic coursework and hands-on projects.${project ? ` One of my most exciting projects was building ${project}, where I applied these skills to solve a real-world problem and gained invaluable experience.` : ''} I thrive on challenging problems and I am always eager to learn new technologies that push the boundaries of what's possible.`;

        body3 = `What excites me most about ${company} is your commitment to innovation and impact. I am highly motivated to contribute to your team and bring fresh perspectives and energy to the table. I am confident that my skills in ${extraSkill} and my passion for technology will make me a valuable addition to your internship program.`;

        closing = `I would absolutely love the opportunity to discuss how my background and enthusiasm can contribute to ${company}'s goals. Thank you so much for considering my application — I look forward to hearing from you!`;
    } else if (tone === 'concise') {
        opening = `I am applying for the ${role} position at ${company}. I am a ${userDegree || 'B.Tech'} student${userBranch ? ` in ${userBranch}` : ''}${userCollege ? ` at ${userCollege}` : ''} with strong skills in ${topSkills}.`;

        body2 = `Key highlights: ${project ? `Built ${project} using ${topSkills}.` : `Proficient in ${topSkills} with hands-on project experience.`} Strong foundation in ${extraSkill} and quick to adapt to new technologies.`;

        body3 = `I am confident I can add immediate value to your team at ${company}. My technical background and problem-solving ability make me well-suited for this role.${notes ? ` ${notes}` : ''}`;

        closing = `I would welcome the opportunity to discuss my application. Thank you for your consideration.`;
    } else {
        
        opening = `I am writing to express my strong interest in the ${role} position at ${company}. As a ${userDegree || 'B.Tech'} student${userBranch ? ` specializing in ${userBranch}` : ''}${userCollege ? ` at ${userCollege}` : ''}, I have developed a solid foundation in ${topSkills}, and I am eager to apply this knowledge in a professional environment.`;

        body2 = `During my academic journey, I have honed my technical skills through a combination of coursework and independent projects.${project ? ` Most notably, I developed ${project}, which allowed me to apply ${topSkills} to solve a meaningful problem. This experience strengthened my ability to work with real-world constraints and deliver quality results.` : ` I have consistently applied my knowledge of ${topSkills} to build practical solutions and improve my understanding of the field.`}`;

        body3 = `I am particularly drawn to ${company} because of your reputation for fostering innovation and providing interns with meaningful, impactful work. I am confident that the skills I have developed in ${extraSkill} and beyond will allow me to contribute effectively to your team from day one.${notes ? ` Additionally, ${notes}.` : ''}`;

        closing = `I would welcome the opportunity to discuss how my background and skills align with the goals of ${company}. Thank you for considering my application, and I look forward to the possibility of contributing to your team.`;
    }

    const body = `${greeting}\n\n${opening}\n\n${body2}\n\n${body3}\n\n${closing}`;

    return {
        greeting,
        opening,
        paragraphs: [opening, body2, body3, closing],
        body,
        senderName: userName,
        senderInfo: [userEmail, userPhone, userCollege].filter(Boolean).join(' | '),
        recipient: `${manager || 'The Hiring Team'}\n${company}`,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        signature: `Sincerely,\n\n${userName}${userEmail ? '\n' + userEmail : ''}${userPhone ? '\n' + userPhone : ''}`
    };
}


function displayLetter(letter, userName, userEmail, userPhone) {
    const senderEl    = document.getElementById('letterSenderName');
    const senderInfo  = document.getElementById('letterSenderInfo');
    const dateEl      = document.getElementById('letterDate');
    const recipientEl = document.getElementById('letterRecipient');
    const bodyEl      = document.getElementById('letterBody');
    const signEl      = document.getElementById('letterSignature');

    if (senderEl)   senderEl.textContent  = userName;
    if (senderInfo) senderInfo.innerHTML  = letter.senderInfo.replace(/ \| /g, '<br>');
    if (dateEl)     dateEl.textContent    = letter.date;
    if (recipientEl) recipientEl.innerHTML = letter.recipient.replace(/\n/g, '<br>');

    if (bodyEl) {
     
        bodyEl.innerHTML = '';
        letter.paragraphs.forEach((para, i) => {
            const p = document.createElement('p');
            p.style.opacity = '0';
            p.style.transform = 'translateY(8px)';
            p.style.transition = `opacity 0.4s ease ${i * 0.15}s, transform 0.4s ease ${i * 0.15}s`;
            p.textContent = para;
            bodyEl.appendChild(p);
            setTimeout(() => {
                p.style.opacity = '1';
                p.style.transform = 'translateY(0)';
            }, 50);
        });
    }

    if (signEl) signEl.innerHTML = letter.signature.replace(/\n/g, '<br>');
}

function copyLetter() {
    if (!currentLetter) return;
    navigator.clipboard.writeText(currentLetter)
        .then(() => showToast('Cover letter copied to clipboard'))
        .catch(() => {
            // Fallback
            const ta = document.createElement('textarea');
            ta.value = currentLetter;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showToast('Cover letter copied to clipboard');
        });
}


function downloadLetter() {
    if (!currentLetter) return;
    const blob = new Blob([currentLetter], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `Cover_Letter_${currentCompany}_${currentRole}.txt`.replace(/\s+/g, '_');
    a.click();
    URL.revokeObjectURL(url);
    showToast('Cover letter downloaded');
}


function saveLetter() {
    if (!currentLetter) return;
    const entry = {
        id: Date.now(),
        company: currentCompany,
        role: currentRole,
        content: currentLetter,
        date: new Date().toLocaleDateString('en-IN')
    };
    savedLetters.unshift(entry);
    if (savedLetters.length > 10) savedLetters = savedLetters.slice(0, 10);
    localStorage.setItem('internai_saved_letters', JSON.stringify(savedLetters));
    renderSavedLetters();
    showToast('Letter saved to your collection');
}


function regenerateLetter() {
    document.getElementById('letterPaper').style.display       = 'none';
    document.getElementById('previewActions').style.display    = 'none';
    document.getElementById('previewGenerating').style.display = 'block';

    setTimeout(() => generateLetter(), 200);
}


function renderSavedLetters() {
    const wrap = document.getElementById('savedLetters');
    const list = document.getElementById('savedLettersList');
    if (!wrap || !list) return;

    if (savedLetters.length === 0) {
        wrap.style.display = 'none';
        return;
    }

    wrap.style.display = 'block';
    list.innerHTML = savedLetters.map(l => `
        <div class="saved-letter-item" onclick="loadSavedLetter(${l.id})">
            <div class="saved-letter-icon"><i class="fa-solid fa-envelope"></i></div>
            <div class="saved-letter-info">
                <span class="saved-letter-company">${l.role} at ${l.company}</span>
                <span class="saved-letter-date">${l.date}</span>
            </div>
            <button class="saved-letter-delete" onclick="event.stopPropagation(); deleteSaved(${l.id})"
                title="Delete">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function loadSavedLetter(id) {
    const letter = savedLetters.find(l => l.id === id);
    if (!letter) return;

    document.getElementById('clCompany').value = letter.company;
    document.getElementById('clRole').value    = letter.role;
    currentLetter  = letter.content;
    currentCompany = letter.company;
    currentRole    = letter.role;

    updatePreviewHeader();

    
    document.getElementById('previewEmpty').style.display   = 'none';
    document.getElementById('previewGenerating').style.display = 'none';

    const bodyEl = document.getElementById('letterBody');
    if (bodyEl) {
        const paras = letter.content.split('\n\n').filter(p => p.trim());
        bodyEl.innerHTML = paras.map(p => `<p>${p}</p>`).join('');
    }

    const loginData = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    const profile   = JSON.parse(localStorage.getItem('internai_profile') || '{}');
    const senderEl  = document.getElementById('letterSenderName');
    if (senderEl) senderEl.textContent = profile.fullName || loginData.name || 'Your Name';

    document.getElementById('letterPaper').style.display    = 'block';
    document.getElementById('previewActions').style.display = 'flex';

    showToast('Letter loaded');
}

function deleteSaved(id) {
    savedLetters = savedLetters.filter(l => l.id !== id);
    localStorage.setItem('internai_saved_letters', JSON.stringify(savedLetters));
    renderSavedLetters();
    showToast('Letter deleted');
}

document.addEventListener('DOMContentLoaded', initCoverLetter);