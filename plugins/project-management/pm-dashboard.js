/**
 * PM Dashboard Widget
 * Loads from master-ai-data.json and renders a live KPI dashboard.
 * Consumed by portfolio index.html and shareable with external AIs.
 */

class PMDashboard {
  constructor(containerId, dataPath) {
    this.container = document.getElementById(containerId);
    this.dataPath = dataPath || './plugins/project-management/master-ai-data.json';
    this.data = null;
  }

  async init() {
    try {
      const res = await fetch(this.dataPath);
      if (!res.ok) throw new Error('Failed to load master AI data');
      this.data = await res.json();
      this.render();
      this.animateCounters();
    } catch (err) {
      console.error('[PMDashboard] Load error:', err);
      if (this.container) {
        this.container.innerHTML = '<p style="color:#7a8099;padding:24px;text-align:center;font-size:0.8rem;">Dashboard unavailable.</p>';
      }
    }
  }

  render() {
    if (!this.container || !this.data) return;
    const { expert, kpis, projects, skills } = this.data;

    this.container.innerHTML = `
      <div class="pm-dashboard">

        <!-- Header -->
        <div class="pm-header">
          <div class="pm-header-left">
            <h2>Project Management Dashboard</h2>
            <p>${expert.name} · ${expert.title}</p>
          </div>
          <div class="pm-sync-badge">
            <div class="pm-sync-dot"></div>
            Master AI Synced
          </div>
        </div>

        <!-- KPI Cards -->
        <div class="pm-kpi-grid">
          <div class="pm-kpi-card cyan">
            <div class="pm-kpi-icon">🚀</div>
            <div class="pm-kpi-value" data-count="${kpis.yearsExperience}">0</div>
            <div class="pm-kpi-label">Years Experience</div>
          </div>
          <div class="pm-kpi-card green">
            <div class="pm-kpi-icon">👥</div>
            <div class="pm-kpi-value" data-count="${kpis.userAdoptionRate}" data-suffix="%">0</div>
            <div class="pm-kpi-label">User Adoption</div>
          </div>
          <div class="pm-kpi-card yellow">
            <div class="pm-kpi-icon">📈</div>
            <div class="pm-kpi-value" data-count="${kpis.mrrGrowth}" data-suffix="%">0</div>
            <div class="pm-kpi-label">MRR Growth</div>
          </div>
          <div class="pm-kpi-card purple">
            <div class="pm-kpi-icon">✅</div>
            <div class="pm-kpi-value">${kpis.projectsSLAMet}/${kpis.projectsTotal}</div>
            <div class="pm-kpi-label">Projects SLA Met</div>
          </div>
          <div class="pm-kpi-card cyan">
            <div class="pm-kpi-icon">🔗</div>
            <div class="pm-kpi-value" data-count="${kpis.integrations}" data-suffix="+">0</div>
            <div class="pm-kpi-label">Integrations</div>
          </div>
          <div class="pm-kpi-card green">
            <div class="pm-kpi-icon">⭐</div>
            <div class="pm-kpi-value" data-count="${kpis.satisfactionScore}" data-suffix="%">0</div>
            <div class="pm-kpi-label">Satisfaction Score</div>
          </div>
        </div>

        <!-- Projects -->
        <div class="pm-section-title">Key Projects</div>
        <div class="pm-projects">
          ${projects.map(p => this.renderProject(p)).join('')}
        </div>

        <!-- Skills -->
        <div class="pm-section-title">Core Skills & Tools</div>
        <div class="pm-skills">
          ${[...skills.methodologies, ...skills.tools].map(s =>
            `<span class="pm-skill-tag">${s}</span>`
          ).join('')}
        </div>

        <!-- Footer -->
        <div class="pm-footer">
          <div class="pm-footer-text">
            <a href="mailto:${expert.email}">${expert.email}</a> ·
            <a href="${expert.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
          </div>
          <div class="pm-ai-sync-info">Synced from master-ai-data.json · v${this.data.version}</div>
        </div>

      </div>
    `;
  }

  renderProject(p) {
    const metricKey = Object.keys(p.metrics)[0];
    const metricVal = p.metrics[metricKey];
    const metricLabels = {
      userAdoption: 'User Adoption',
      mrrGrowth: 'MRR Growth',
      revenueTarget2016: 'Revenue Target',
      satisfactionScore: 'Satisfaction',
      slaCompliance: 'SLA %'
    };

    return `
      <div class="pm-project-row">
        <div class="pm-project-info">
          <div class="pm-project-name">${p.name}</div>
          <div class="pm-project-meta">${p.company} · ${p.region} · ${p.period}</div>
        </div>
        <span class="pm-status-badge ${p.status}">${p.status === 'in-progress' ? 'In Progress' : 'Delivered'}</span>
        ${metricVal ? `
          <div class="pm-project-metric">
            <span class="value">${metricVal}%</span>
            <span class="label">${metricLabels[metricKey] || metricKey}</span>
          </div>
        ` : '<div class="pm-project-metric"></div>'}
      </div>
    `;
  }

  animateCounters() {
    const counters = this.container.querySelectorAll('[data-count]');
    counters.forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1200;
      const step = target / (duration / 16);
      let current = 0;

      const tick = () => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current) + suffix;
        if (current < target) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }
}

// Export for module use OR auto-init if script loaded standalone
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PMDashboard;
} else {
  window.PMDashboard = PMDashboard;
}
