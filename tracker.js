

let applications = [];
let draggedId    = null;
let addModalStatus = 'applied';

const COLUMNS = ['applied', 'interview', 'offer', 'rejected'];

const LOGO_COLORS = [
    { bg: '#dbeafe', text: '#1e40af' },
    { bg: '#fce7f3', text: '#be185d' },
    { bg: '#dcfce7', text: '#166534' },
    { bg: '#ffedd5', text: '#9a3412' },
    { bg: '#ede9fe', text: '#6d28d9' },
    { bg: '#ccfbf1', text: '#0f766e' },
    { bg: '#fef9c3', text: '#92400e' },
    { bg: '#fee2e2', text: '#991b1b' },
];


function initTracker() {
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


    const saved = localStorage.getItem('internai_applications');
    if (saved) {
        applications = JSON.parse(saved);
    } else {
      
        applications = [
            { id: 1, company: 'OpenAI', role: 'AI Research Intern', location: 'Remote', stipend: 'Rs 80,000/month', status: 'interview', appliedDate: '2024-01-10', notes: 'Referred by college alumni. Interview scheduled for Jan 20.' },
            { id: 2, company: 'Google', role: 'ML Intern', location: 'Bangalore', stipend: 'Rs 75,000/month', status: 'applied', appliedDate: '2024-01-12', notes: 'Applied through campus portal.' },
            { id: 3, company: 'Microsoft', role: 'SWE Intern', location: 'Hyderabad', stipend: 'Rs 60,000/month', status: 'offer', appliedDate: '2023-12-20', notes: 'Offer letter received! Deadline to accept: Jan 25.' },
            { id: 4, company: 'Amazon', role: 'Data Science Intern', location: 'Delhi', stipend: 'Rs 55,000/month', status: 'rejected', appliedDate: '2023-12-15', notes: 'Rejected after 2nd round technical interview.' },
            { id: 5, company: 'TCS', role: 'AI/ML Intern', location: 'Pune', stipend: 'Rs 20,000/month', status: 'applied', appliedDate: '2024-01-14', notes: '' },
        ];
        saveApplications();
    }

    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('modalDate');
    if (dateInput) dateInput.value = today;

    renderBoard();
}


function renderBoard() {
    COLUMNS.forEach(status => {
        const container = document.getElementById('cards-' + status);
        const badge     = document.getElementById('badge-' + status);
        const cards     = applications.filter(a => a.status === status);

        if (badge) badge.textContent = cards.length;

        if (!container) return;

        if (cards.length === 0) {
            container.innerHTML = `
                <div class="col-empty">
                    <i class="fa-solid fa-inbox"></i>
                    No applications here yet
                </div>`;
            return;
        }

        container.innerHTML = cards.map(app => buildCard(app)).join('');
    });

    updateSummary();
}


function buildCard(app) {
    const logoIndex = app.company.charCodeAt(0) % LOGO_COLORS.length;
    const logo      = LOGO_COLORS[logoIndex];
    const initials  = app.company.substring(0, 2).toUpperCase();
    const dateStr   = app.appliedDate
        ? new Date(app.appliedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        : '';

    return `
    <div class="kanban-card"
        draggable="true"
        id="card-${app.id}"
        ondragstart="dragStart(event, ${app.id})"
        ondragend="dragEnd(event)">

        <div class="card-company-row">
            <div class="card-company-logo" style="background:${logo.bg}; color:${logo.text};">${initials}</div>
            <span class="card-company-name">${app.company}</span>
            <button class="card-menu-btn" onclick="openEditModal(${app.id})" title="Edit">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
        </div>

        <div class="card-role">${app.role}</div>

        <div class="card-meta">
            ${app.location ? `<span class="card-meta-tag"><i class="fa-solid fa-location-dot"></i>${app.location}</span>` : ''}
            ${app.stipend  ? `<span class="card-meta-tag"><i class="fa-solid fa-indian-rupee-sign"></i>${app.stipend}</span>` : ''}
            ${dateStr      ? `<span class="card-meta-tag"><i class="fa-solid fa-calendar"></i>${dateStr}</span>` : ''}
        </div>

        ${app.notes ? `<div class="card-notes">${app.notes}</div>` : ''}

        <div class="card-actions-row">
            <select class="card-action-btn" onchange="quickStatusChange(${app.id}, this.value)"
                style="flex:2; font-size:11px; padding:5px 6px;">
                <option value="applied"   ${app.status === 'applied'   ? 'selected' : ''}>Applied</option>
                <option value="interview" ${app.status === 'interview' ? 'selected' : ''}>Interview</option>
                <option value="offer"     ${app.status === 'offer'     ? 'selected' : ''}>Offer</option>
                <option value="rejected"  ${app.status === 'rejected'  ? 'selected' : ''}>Rejected</option>
            </select>
            <button class="card-action-btn delete-btn" onclick="deleteApplication(${app.id})" title="Delete">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    </div>`;
}


function updateSummary() {
    document.getElementById('totalCount').textContent    = applications.length;
    document.getElementById('appliedCount').textContent  = applications.filter(a => a.status === 'applied').length;
    document.getElementById('interviewCount').textContent= applications.filter(a => a.status === 'interview').length;
    document.getElementById('offerCount').textContent    = applications.filter(a => a.status === 'offer').length;
    document.getElementById('rejectedCount').textContent = applications.filter(a => a.status === 'rejected').length;
}


function dragStart(event, id) {
    draggedId = id;
    event.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
        const card = document.getElementById('card-' + id);
        if (card) card.classList.add('dragging');
    }, 0);
}

function dragEnd(event) {
    const card = document.getElementById('card-' + draggedId);
    if (card) card.classList.remove('dragging');
    document.querySelectorAll('.kanban-col').forEach(col => col.classList.remove('drag-over'));
}

function allowDrop(event) {
    event.preventDefault();
    const col = event.currentTarget;
    document.querySelectorAll('.kanban-col').forEach(c => c.classList.remove('drag-over'));
    col.classList.add('drag-over');
}

function drop(event, newStatus) {
    event.preventDefault();
    document.querySelectorAll('.kanban-col').forEach(c => c.classList.remove('drag-over'));

    if (draggedId === null) return;

    const app = applications.find(a => a.id === draggedId);
    if (!app || app.status === newStatus) return;

    const oldStatus = app.status;
    app.status = newStatus;
    saveApplications();
    renderBoard();

    showToast(`Moved to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`);
    draggedId = null;
}


function quickStatusChange(id, newStatus) {
    const app = applications.find(a => a.id === id);
    if (!app) return;
    app.status = newStatus;
    saveApplications();
    renderBoard();
    showToast(`Status updated to ${newStatus}`);
}


function openAddModal(status = 'applied') {
    addModalStatus = status;
    const statusEl = document.getElementById('modalStatus');
    if (statusEl) statusEl.value = status;

    const today = new Date().toISOString().split('T')[0];
    const dateEl = document.getElementById('modalDate');
    if (dateEl) dateEl.value = today;

    
    ['modalCompany','modalRole','modalLocation','modalStipend','modalNotes'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    document.getElementById('addModal').style.display = 'flex';
}

function closeAddModal() {
    document.getElementById('addModal').style.display = 'none';
}

function closeModalOutside(event) {
    if (event.target.id === 'addModal') closeAddModal();
}

function saveApplication() {
    const company  = document.getElementById('modalCompany')?.value.trim();
    const role     = document.getElementById('modalRole')?.value.trim();
    const location = document.getElementById('modalLocation')?.value.trim();
    const stipend  = document.getElementById('modalStipend')?.value.trim();
    const status   = document.getElementById('modalStatus')?.value;
    const date     = document.getElementById('modalDate')?.value;
    const notes    = document.getElementById('modalNotes')?.value.trim();

    if (!company || !role) {
        showToast('Please enter company name and role', 'error');
        return;
    }

    const newApp = {
        id: Date.now(),
        company, role, location, stipend, status,
        appliedDate: date,
        notes
    };

    applications.push(newApp);
    saveApplications();
    renderBoard();
    closeAddModal();
    showToast(`Application added for ${company}`);
}


function openEditModal(id) {
    const app = applications.find(a => a.id === id);
    if (!app) return;

    document.getElementById('editId').value       = app.id;
    document.getElementById('editCompany').value  = app.company;
    document.getElementById('editRole').value     = app.role;
    document.getElementById('editLocation').value = app.location || '';
    document.getElementById('editStipend').value  = app.stipend  || '';
    document.getElementById('editStatus').value   = app.status;
    document.getElementById('editDate').value     = app.appliedDate || '';
    document.getElementById('editNotes').value    = app.notes    || '';

    document.getElementById('editModal').style.display = 'flex';
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

function closeEditOutside(event) {
    if (event.target.id === 'editModal') closeEditModal();
}

function updateApplication() {
    const id = parseInt(document.getElementById('editId').value);
    const app = applications.find(a => a.id === id);
    if (!app) return;

    app.company     = document.getElementById('editCompany').value.trim();
    app.role        = document.getElementById('editRole').value.trim();
    app.location    = document.getElementById('editLocation').value.trim();
    app.stipend     = document.getElementById('editStipend').value.trim();
    app.status      = document.getElementById('editStatus').value;
    app.appliedDate = document.getElementById('editDate').value;
    app.notes       = document.getElementById('editNotes').value.trim();

    if (!app.company || !app.role) {
        showToast('Company and role are required', 'error');
        return;
    }

    saveApplications();
    renderBoard();
    closeEditModal();
    showToast('Application updated');
}


function deleteApplication(id) {
    const app = applications.find(a => a.id === id);
    if (!app) return;
    if (!confirm(`Remove application for ${app.role} at ${app.company}?`)) return;
    applications = applications.filter(a => a.id !== id);
    saveApplications();
    renderBoard();
    showToast('Application removed');
}


function saveApplications() {
    localStorage.setItem('internai_applications', JSON.stringify(applications));
}


document.addEventListener('DOMContentLoaded', initTracker);