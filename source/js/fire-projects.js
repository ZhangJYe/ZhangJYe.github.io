(function () {
  const featuredProject = {
    name: 'OpsCaptain AI',
    url: 'https://opscaptain.top/ai/',
    projectsUrl: '/projects/',
    status: 'Active',
    description: 'AIOps + Agent 工程实践入口，聚焦可观测性、智能运维和 AI 工作流。',
    tags: ['AIOps', 'Agent', 'Observability', 'AI Coding']
  };

  function renderHeroActions() {
    const siteInfo = document.querySelector('#page-header.full_page #site-info');
    if (!siteInfo) return;

    const heroCopy = siteInfo.querySelector('.fire-hero-copy') || siteInfo;
    if (heroCopy.querySelector('.fire-hero-actions')) return;

    const actions = document.createElement('div');
    actions.className = 'fire-hero-actions';
    actions.innerHTML = `
      <a class="fire-hero-action fire-hero-action-primary" href="#recent-posts">
        <span>Latest Notes</span>
        <i class="fas fa-arrow-down" aria-hidden="true"></i>
      </a>
      <a class="fire-hero-action fire-hero-action-secondary" href="${featuredProject.projectsUrl}">
        <span>Projects</span>
        <i class="fas fa-arrow-right" aria-hidden="true"></i>
      </a>
    `;

    heroCopy.appendChild(actions);
  }

  function renderHeroProject() {
    const siteInfo = document.querySelector('#page-header.full_page #site-info');
    if (!siteInfo) return;

    let heroCopy = siteInfo.querySelector('.fire-hero-copy');
    if (!heroCopy) {
      heroCopy = document.createElement('div');
      heroCopy.className = 'fire-hero-copy';

      while (siteInfo.firstChild) {
        heroCopy.appendChild(siteInfo.firstChild);
      }

      siteInfo.appendChild(heroCopy);
    }

    if (siteInfo.querySelector('.fire-hero-project-card')) return;

    const projectCard = document.createElement('article');
    projectCard.className = 'fire-hero-project-card';
    projectCard.innerHTML = `
      <div class="fire-hero-project-kicker">${featuredProject.status}</div>
      <h2>${featuredProject.name}</h2>
      <p>${featuredProject.description}</p>
      <div class="fire-hero-project-tags">
        ${featuredProject.tags.map(tag => `<span>${tag}</span>`).join('')}
      </div>
      <div class="fire-hero-project-footer">
        <a class="fire-hero-project-url" href="${featuredProject.url}" target="_blank" rel="noopener">opscaptain.top/ai</a>
        <a class="fire-hero-project-open" href="${featuredProject.url}" target="_blank" rel="noopener" aria-label="Open OpsCaptain AI">
          <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>
        </a>
      </div>
    `;

    siteInfo.appendChild(projectCard);
  }

  function renderLatestNotesHead() {
    const recentPosts = document.querySelector('#recent-posts');
    if (!recentPosts) return;

    const oldProjects = recentPosts.querySelector('.fire-home-projects');
    if (oldProjects) {
      oldProjects.remove();
    }

    if (recentPosts.querySelector('.fire-notes-head')) return;
    const postsList = recentPosts.querySelector('.recent-post-items');
    const notesHead = document.createElement('div');
    notesHead.className = 'fire-section-head fire-notes-head';
    notesHead.innerHTML = '<span>Latest Notes</span>';

    if (postsList) {
      recentPosts.insertBefore(notesHead, postsList);
    }
  }

  function initFireProjects() {
    renderHeroProject();
    renderHeroActions();
    renderLatestNotesHead();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFireProjects);
  } else {
    initFireProjects();
  }

  document.addEventListener('pjax:complete', initFireProjects);
})();
