// Minimal dashboard client script: loads mock incidents and users and provides basic interactions
const INCIDENTS_URL = '/mock/incidents.json';
const USERS_URL = '/mock/users.json';

let incidents = [];
let users = [];

async function fetchData() {
    try {
        const [incRes, usrRes] = await Promise.all([fetch(INCIDENTS_URL), fetch(USERS_URL)]);
        incidents = await incRes.json();
        users = await usrRes.json();
    } catch (err) {
        console.error('No se pudieron cargar los datos mock:', err);
        incidents = [];
        users = [];
    }
}

function qs(id) { return document.getElementById(id); }

function formatDate(s) {
    try { return new Date(s).toLocaleString(); } catch { return s; }
}

function computeKPIs() {
    const critical = incidents.filter(i => i.priority === 'critical').length;
    const pending = incidents.filter(i => i.approvalStatus === 'pending').length;
    const materials = incidents.filter(i => i.type === 'material').length;
    const open = incidents.filter(i => i.status === 'open' || i.status === 'inProgress').length;
    const closed = incidents.filter(i => i.status === 'closed').length;
    qs('kpi-critical').textContent = critical;
    qs('kpi-pending').textContent = pending;
    qs('kpi-materials').textContent = materials;
    qs('kpi-performance').textContent = `${open} / ${closed}`;
}

function renderKanban() {
    const statuses = ['pendingApproval', 'open', 'inProgress', 'closed', 'rejected'];
    statuses.forEach(s => {
        const container = qs('col-' + s);
        if (!container) return;
        container.innerHTML = '';
        incidents.filter(i => i.status === s).forEach(i => {
            const card = document.createElement('div');
            card.className = 'inc-card';
            card.innerHTML = `<div class="inc-top"><strong>${i.id}</strong> <span class="inc-proj">${i.projectId}</span></div>
        <div class="inc-meta">${i.type} • <span class="badge">${i.priority}</span></div>
        <div class="inc-updated">${formatDate(i.updatedAt)}</div>
        <div class="inc-actions">
          <button class="btn btn-sm" data-action="view" data-id="${i.id}">Ver</button>
          <select class="status-select" data-id="${i.id}">
            <option value="pendingApproval">Pendiente Aprobación</option>
            <option value="open">Abierto</option>
            <option value="inProgress">En Progreso</option>
            <option value="closed">Cerrado</option>
            <option value="rejected">Rechazado</option>
          </select>
        </div>`;
            const select = card.querySelector('.status-select');
            select.value = i.status;
            select.addEventListener('change', (e) => {
                const id = e.target.dataset.id;
                const it = incidents.find(x => x.id === id);
                if (it) { it.status = e.target.value; renderAll(); }
            });

            card.querySelector('[data-action="view"]').addEventListener('click', () => openModal(i.id));
            container.appendChild(card);
        });
    });
}

function renderActivity() {
    const feed = qs('feed-list');
    if (!feed) return;
    const recent = incidents.slice().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 10);
    feed.innerHTML = '';
    recent.forEach(r => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${r.id}</strong> — ${r.projectId} — ${r.type} — ${formatDate(r.updatedAt)}`;
        feed.appendChild(li);
    });
}

function renderMaterials() {
    const tbody = qs('materials-table').querySelector('tbody');
    tbody.innerHTML = '';
    const materials = incidents.filter(i => i.type === 'material');
    // group by item
    const grouped = {};
    materials.forEach(m => {
        const key = m.material?.item || 'Item desconocido';
        if (!grouped[key]) grouped[key] = { project: m.projectId, item: key, quantity: 0, unit: m.material?.unit || '' };
        grouped[key].quantity += (m.material?.quantity || 0);
    });
    Object.values(grouped).forEach(g => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${g.project}</td><td>${g.item}</td><td>${g.quantity}</td><td>${g.unit}</td><td><button class="btn btn-sm" data-item="${g.item}">Marcar Enviada</button></td>`;
        tbody.appendChild(tr);
    });
}

function renderMapLegend() {
    const legend = qs('map-legend');
    if (!legend) return;
    // hotspot detection: count criticals by place
    const hotspot = {};
    incidents.filter(i => i.priority === 'critical').forEach(c => {
        const place = c.location?.place || 'Sin lugar';
        hotspot[place] = (hotspot[place] || 0) + 1;
    });
    legend.innerHTML = Object.entries(hotspot).map(([p, n]) => `<div>${p}: ${n} crítica(s)</div>`).join('') || '<div>No hay puntos críticos</div>';
}

function renderUsers() {
    const out = qs('users-list');
    out.innerHTML = '';
    users.forEach(u => {
        const div = document.createElement('div');
        div.className = 'user-row';
        div.innerHTML = `<strong>${u.name || u.username}</strong><div class="muted">${u.email || ''}</div>`;
        out.appendChild(div);
    });
}

function renderAudit() {
    const body = qs('audit-body');
    body.innerHTML = '';
    incidents.forEach(i => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${i.id}</td><td>${formatDate(i.createdAt)}</td><td>${formatDate(i.updatedAt)}</td>`;
        body.appendChild(tr);
    });
}

function openModal(id) {
    const it = incidents.find(x => x.id === id);
    if (!it) return;
    qs('incident-modal').setAttribute('aria-hidden', 'false');
    qs('incident-modal').classList.add('open');
    qs('modal-title').textContent = `${it.id} — ${it.type}`;
    qs('meta-id').textContent = it.id;
    qs('meta-project').textContent = it.projectId;
    qs('meta-priority').textContent = it.priority;
    qs('meta-approval').textContent = it.approvalStatus;
    // gallery
    const gal = qs('evidence-gallery'); gal.innerHTML = '';
    (it.photos || []).forEach(p => { const img = document.createElement('img'); img.src = p; img.className = 'evidence-thumb'; gal.appendChild(img); });
    // assign-to
    const sel = qs('assign-to'); sel.innerHTML = '';
    users.forEach(u => { const opt = document.createElement('option'); opt.value = u.username || u.email; opt.textContent = u.name || u.username; sel.appendChild(opt); });
    sel.value = it.assignedTo || '';
    qs('btn-approve').onclick = () => { it.approvalStatus = 'approved'; it.updatedAt = new Date().toISOString(); renderAll(); closeModal(); };
    qs('btn-reject').onclick = () => {
        const reason = prompt('Motivo del rechazo (se mostrará en la app móvil)');
        if (!reason) { alert('Se requiere motivo para rechazar.'); return; }
        it.approvalStatus = 'rejected'; it.updatedAt = new Date().toISOString(); // store reason in comment
        it.lastRejection = reason;
        renderAll(); closeModal();
    };
    qs('btn-close-incident').onclick = () => {
        const note = qs('close-note').value.trim();
        if (!note) { alert('La nota de cierre es obligatoria para cerrar la incidencia.'); return; }
        it.status = 'closed'; it.closeNote = note; it.updatedAt = new Date().toISOString(); renderAll(); closeModal();
    };
}

function closeModal() {
    qs('incident-modal').setAttribute('aria-hidden', 'true');
    qs('incident-modal').classList.remove('open');
}

function addModalHandlers() {
    qs('modal-close').addEventListener('click', closeModal);
    qs('incident-modal').addEventListener('click', (e) => { if (e.target === qs('incident-modal')) closeModal(); });
}

function addControls() {
    qs('btn-refresh-materials').addEventListener('click', () => { renderMaterials(); });
    qs('btn-export-pdf').addEventListener('click', () => { alert('Exportar PDF (simulado)'); });
    qs('btn-export-xlsx').addEventListener('click', () => { alert('Exportar Excel (simulado)'); });
}

function renderAll() {
    computeKPIs();
    renderKanban();
    renderActivity();
    renderMaterials();
    renderMapLegend();
    renderUsers();
    renderAudit();
}

async function init() {
    await fetchData();
    addModalHandlers();
    addControls();
    renderAll();
}

document.addEventListener('DOMContentLoaded', init);

// expose for debugging
window.__dashboard = { incidents, users };
