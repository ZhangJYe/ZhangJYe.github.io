(function () {
  const featuredProject = {
    name: 'OpsCaptain AI',
    url: 'https://opscaptain.top/ai/',
    projectsUrl: '/projects/',
    status: 'Active',
    description: '面向 AIOps 和 Agent 工程实践的个人项目入口，承载智能运维、可观测性和 AI 工作流方向的探索。',
    tags: ['AIOps', 'Agent', 'Observability', 'AI Coding']
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

  function renderHomeProjects() {
    const recentPosts = document.querySelector('#recent-posts');
    if (!recentPosts || recentPosts.querySelector('.fire-home-projects')) return;

    const postsList = recentPosts.querySelector('.recent-post-items');
    const projects = document.createElement('section');
    projects.className = 'fire-home-projects';
    projects.innerHTML = `
      <div class="fire-section-head">
        <span>Projects</span>
        <a href="${featuredProject.projectsUrl}">View all <i class="fas fa-arrow-right" aria-hidden="true"></i></a>
      </div>
      <article class="fire-home-project-card">
        <div class="fire-home-project-main">
          <p>${featuredProject.status}</p>
          <h2>${featuredProject.name}</h2>
          <span>${featuredProject.description}</span>
        </div>
        <div class="fire-home-project-side">
          <div class="fire-home-project-tags">
            ${featuredProject.tags.map(tag => `<span>${tag}</span>`).join('')}
          </div>
          <a class="fire-home-project-open" href="${featuredProject.url}" target="_blank" rel="noopener">
            <span>Open project</span>
            <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>
          </a>
        </div>
      </article>
    `;

    const notesHead = document.createElement('div');
    notesHead.className = 'fire-section-head fire-notes-head';
    notesHead.innerHTML = '<span>Latest Notes</span>';

    recentPosts.insertBefore(projects, recentPosts.firstChild);
    if (postsList) {
      recentPosts.insertBefore(notesHead, postsList);
    }
  }

  function initFireProjects() {
    renderHeroActions();
    renderHomeProjects();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFireProjects);
  } else {
    initFireProjects();
  }

  document.addEventListener('pjax:complete', initFireProjects);
})();
