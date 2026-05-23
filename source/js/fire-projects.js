(function () {
  const featuredProject = {
    name: 'OpsCaptain AI',
    url: 'https://opscaptain.top/ai/',
    projectsUrl: '/projects/'
  };

  function renderHeroActions() {
    const siteInfo = document.querySelector('#page-header.full_page #site-info');
    if (!siteInfo || siteInfo.querySelector('.fire-hero-actions')) return;

    const actions = document.createElement('div');
    actions.className = 'fire-hero-actions';
    actions.innerHTML = `
      <a class="fire-hero-action fire-hero-action-primary" href="${featuredProject.url}" target="_blank" rel="noopener">
        <span>${featuredProject.name}</span>
        <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>
      </a>
      <a class="fire-hero-action fire-hero-action-secondary" href="${featuredProject.projectsUrl}">
        <span>Projects</span>
        <i class="fas fa-arrow-right" aria-hidden="true"></i>
      </a>
    `;

    siteInfo.appendChild(actions);
  }

  function initFireProjects() {
    renderHeroActions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFireProjects);
  } else {
    initFireProjects();
  }

  document.addEventListener('pjax:complete', initFireProjects);
})();
