document.addEventListener('DOMContentLoaded', () => {
    initClock();
    populateTicker();
    renderProfile();
    renderExperience();
    renderProjects();
    renderResponsibilities();
    renderFooter();
    initCommandLine();
    initWindowControls();
});


function maximizeWindow(sectionId) {
    // optional: reset others first? taking a safe approach
    document.querySelectorAll('.window').forEach(w => w.classList.remove('maximized'));

    const win = document.getElementById(`win-${sectionId}`);
    if (win) {
        win.classList.remove('minimized');
        win.classList.remove('closed');
        win.classList.add('maximized');
    }
}

function initWindowControls() {
    ['profile', 'skills', 'experience', 'projects', 'responsibilities'].forEach(section => {
        const win = document.getElementById(`win-${section}`);
        if (!win) return;

        const btnMin = win.querySelector('.btn-min');
        const btnMax = win.querySelector('.btn-max');
        const btnClose = win.querySelector('.btn-close');

        btnMin.addEventListener('click', () => {
            win.classList.toggle('minimized');
            // If maximizing, un-minimize
            if (win.classList.contains('maximized') && win.classList.contains('minimized')) {
                win.classList.remove('maximized');
            }
        });

        btnMax.addEventListener('click', () => {
            // Close others if maximizing to avoid z-index hell? Or just absolute position it on top
            win.classList.toggle('maximized');
            win.classList.remove('minimized');
        });

        btnClose.addEventListener('click', () => {
            win.classList.add('closed');
        });
    });
}

function initClock() {
    const clockEl = document.getElementById('clock');
    setInterval(() => {
        const now = new Date();
        clockEl.innerText = now.toISOString().split('T')[1].split('.')[0] + " UTC";
    }, 1000);
}

function populateTicker() {
    const tickerEl = document.getElementById('skill-ticker');

    // Extract unique skills from experience and projects
    const skillSet = new Set();
    resumeData.experience.forEach(job => job.skills.forEach(s => skillSet.add(s)));
    resumeData.projects.forEach(p => p.skills && p.skills.forEach(s => skillSet.add(s)));

    const allSkills = Array.from(skillSet);

    // Shuffle for randomness
    const shuffled = allSkills.sort(() => 0.5 - Math.random());

    shuffled.forEach(skill => {
        const change = (Math.random() * 5 - 2).toFixed(2); // Random % change
        const isUp = change > 0;
        const colorClass = isUp ? 'up' : 'down';
        const arrow = isUp ? '▲' : '▼';

        const item = document.createElement('div');
        item.className = 'ticker-item';
        item.innerHTML = `<span style="color: #fff">${skill.toUpperCase()}</span> <span class="${colorClass}">${arrow} ${change}%</span>`;
        tickerEl.appendChild(item);
    });
}

function renderProfile() {
    const content = document.getElementById('profile-content');
    const p = resumeData.profile;
    const edu = resumeData.education[0]; // Assuming one main edu for now

    // Check if image exists, else use placeholder
    const imgHtml = p.img ? `<img src="${p.img}" class="profile-img" alt="${p.name}">` : `<div class="profile-img-placeholder">[IMG]</div>`;

    content.innerHTML = `
        <div class="profile-header">
            ${imgHtml}
            <div class="profile-info">
                <h2 style="margin: 0; color: var(--text-secondary); font-size: 1.4rem;">${p.name}</h2>
                <p style="color: var(--text-primary); margin: 5px 0;">${p.title}</p>
                <div class="contact-mini">
                    <span>${p.contact.phone}</span> | 
                    <span><a href="mailto:${p.contact.email}">${p.contact.email}</a></span><br>
                    <span>Los Angeles, CA</span>
                </div>
            </div>
        </div>
        
        <div class="divider"></div>
        
        <div class="bio-section">
            <div style="margin-bottom: 5px; color: var(--text-muted); font-weight: bold; font-size: 0.8rem;">>> BIO:</div>
            <div style="color: #ddd;">${p.bio}</div>
        </div>

        <div class="divider"></div>

        <div class="education-section">
            <span class="label">>> EDUCATION:</span>
            <div style="margin-top: 5px;">
                <span style="color: #fff; font-weight: bold;">${edu.school}</span> 
                <span style="float: right; color: var(--text-muted);">${edu.date}</span><br>
                <span style="color: var(--text-secondary);">${edu.degree}</span>
                <div style="margin-top: 5px; color: #ccc; font-size: 0.85rem;">
                    <span style="color: var(--text-muted); margin-right: 5px;">[COURSES]</span>
                    ${edu.courses}
                </div>
            </div>
        </div>
        
        <div class="divider"></div>
        <div style="margin-top: 15px;">
            <a href="Resume.pdf?v=${new Date().getTime()}" target="_blank" class="download-btn" style="width: 100%; display: block; text-align: center;">[ DOWNLOAD RESUME_PDF ]</a>
        </div>
    `;
}

// Removed renderSkills() as it is merged into Profile/Experience context

function renderExperience() {
    const content = document.getElementById('experience-content');
    let html = '';

    resumeData.experience.forEach(job => {
        // Generate skills tags
        const skillsHtml = job.skills.map(s => `<span class="tag">${s}</span>`).join('');

        // Generate bullet points
        const pointsHtml = job.points.map(pt => `<li>${pt}</li>`).join('');

        html += `
            <div class="news-item">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                    <span class="news-headline" style="font-size: 1rem; color: var(--text-secondary);">${job.company.toUpperCase()}</span>
                    <span class="news-time">${job.date}</span>
                </div>
                <div style="color: var(--text-primary); margin-bottom: 5px;">${job.role} | ${job.location}</div>
                
                <ul class="job-points">
                    ${pointsHtml}
                </ul>
                
                <div style="margin-top: 8px;">
                    <span style="color: var(--text-muted); font-size: 0.75rem; margin-right: 5px;">[STACK]</span>
                    ${skillsHtml}
                </div>
            </div>
        `;
    });

    content.innerHTML = html;
}

function renderProjects() {
    const content = document.getElementById('projects-content');
    let html = '';

    resumeData.projects.forEach(proj => {
        const skillsHtml = proj.skills ? proj.skills.map(s => `<span class="tag">${s}</span>`).join('') : '';

        html += `
            <div class="project-card">
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--text-secondary); font-weight: bold; font-size: 1.1rem;">${proj.name}</span>
                    <span style="color: #666; font-size: 0.8rem;">${proj.date}</span>
                </div>
                <p style="margin-top: 5px; color: #ccc;">${proj.description}</p>
                <div style="margin-top: 10px;">
                    ${skillsHtml}
                </div>
            </div>
        `;
    });

    content.innerHTML = html;
}

function renderResponsibilities() {
    const content = document.getElementById('responsibilities-content');
    if (!content || !resumeData.responsibilities) return;

    let html = '';
    resumeData.responsibilities.forEach(pos => {
        html += `
            <div class="project-card">
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--text-secondary); font-weight: bold; font-size: 1rem;">${pos.role}, ${pos.company}</span>
                    <span style="color: #666; font-size: 0.8rem;">${pos.date}</span>
                </div>
                <p style="margin-top: 5px; color: #ccc; font-size: 0.9rem;">${pos.description}</p>
            </div>
        `;
    });
    content.innerHTML = html;
}

function renderFooter() {
    const links = document.getElementById('footer-links');
    const c = resumeData.profile.contact;

    links.innerHTML = `
        <a href="https://${c.linkedin}" target="_blank">LINKEDIN</a>
        <a href="https://${c.github}" target="_blank">GITHUB</a>
        <a href="mailto:${c.email}">EMAIL</a>
    `;
}

function initCommandLine() {
    const input = document.querySelector('.cmd-input');
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value.trim().toLowerCase();
            input.value = '';

            if (cmd === 'help') {
                alert("Commands: \n- goto [section]\n- maximize [section]\n- theme [cyber|retro]\n- linkedin | github | email");
            } else if (cmd === 'reset' || cmd === 'restore') {
                document.querySelectorAll('.window').forEach(w => {
                    w.classList.remove('closed');
                    w.classList.remove('minimized');
                    w.classList.remove('maximized');
                });
            } else if (cmd === 'linkedin') {
                window.open(`https://${resumeData.profile.contact.linkedin}`, '_blank');
            } else if (cmd === 'github') {
                window.open(`https://${resumeData.profile.contact.github}`, '_blank');
            } else if (cmd === 'email') {
                window.location.href = `mailto:${resumeData.profile.contact.email}`;
            } else if (cmd === 'resume') {
                window.open('Resume.pdf?v=' + new Date().getTime(), '_blank');
            } else if (cmd.startsWith('maximize ')) {
                const target = cmd.split(' ')[1];
                maximizeWindow(target);
            } else if (cmd.startsWith('goto ')) {
                const target = cmd.split(' ')[1];
                const win = document.getElementById(`win-${target}`);
                if (win) {
                    // Normalize state
                    win.classList.remove('minimized');
                    win.classList.remove('closed');
                    win.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Visual cue
                    win.style.borderColor = 'var(--text-secondary)';
                    setTimeout(() => win.style.borderColor = '', 1000);
                } else {
                    alert(`Section not found: ${target}. Try: profile, experience, projects, responsibilities`);
                }
            } else if (cmd.startsWith('theme ')) {
                const themeName = cmd.split(' ')[1];
                const validThemes = ['cyber', 'retro'];

                if (validThemes.includes(themeName)) {
                    document.body.className = ''; // Reset
                    if (themeName !== 'cyber') {
                        document.body.classList.add(`theme-${themeName}`);
                    }
                    // For cyber, we just remove other classes as it's default
                } else {
                    alert(`Available themes: ${validThemes.join(', ')}`);
                }
            } else {
                // Mock terminal response
                console.log(`Command not found: ${cmd}`);
            }
        }
    });
}
