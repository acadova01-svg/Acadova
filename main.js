/**
 * ACADOVA - Peer-to-Peer Academic Skill & Knowledge Sharing Platform
 * Client-Side Interactive Engine & State Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initApiHealthCheck();
  initScrollReveal();
  initHeroParallaxAndExchange();
  initCreditSimulator();
  initSkillNetwork();
  initDashboardMockup();
  initModals();
  initSmoothScroll();
});

/* ==========================================================================
   1. NAVBAR & MOBILE DRAWER
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.desktop-nav-link');

  // Sticky blur on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
  });

  // Mobile Drawer Toggle
  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('active');
      hamburgerBtn.classList.toggle('active', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ScrollSpy Active Link Indicator
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id], header[id]');
    let currentId = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }
}

/* ==========================================================================
   2. API HEALTH CHECK (Live Backend Sync)
   ========================================================================== */
function initApiHealthCheck() {
  const statusIndicator = document.getElementById('apiStatusIndicator');
  const statusText = document.getElementById('apiStatusText');

  async function checkHealth() {
    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        const data = await response.json();
        if (statusText) statusText.textContent = 'API Online';
        if (statusIndicator) {
          statusIndicator.title = `Backend Status: ${data.status || 'Active'}`;
          statusIndicator.style.borderColor = 'rgba(16, 185, 129, 0.4)';
        }
      } else {
        throw new Error('API degraded');
      }
    } catch (err) {
      if (statusText) statusText.textContent = 'Demo Mode';
      if (statusIndicator) {
        statusIndicator.title = 'Running in preview mode (Backend offline or local)';
        statusIndicator.style.borderColor = 'rgba(56, 189, 248, 0.4)';
      }
    }
  }

  checkHealth();
  // Poll every 30 seconds
  setInterval(checkHealth, 30000);

  if (statusIndicator) {
    statusIndicator.addEventListener('click', () => {
      checkHealth();
      showToast('Checking Acadova Server & Database cluster status...');
    });
  }
}

/* ==========================================================================
   3. SCROLL REVEAL (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('revealed'));
  }
}

/* ==========================================================================
   4. HERO NETWORK PARALLAX & LIVE EXCHANGE CYCLER
   ========================================================================== */
function initHeroParallaxAndExchange() {
  const heroVisualizer = document.getElementById('heroVisualizer');
  const studentCards = document.querySelectorAll('.student-card');
  const liveSwapPill = document.getElementById('liveSwapPill');

  // Mouse Parallax effect on Hero Visualizer
  if (heroVisualizer && window.innerWidth > 768) {
    heroVisualizer.addEventListener('mousemove', (e) => {
      const rect = heroVisualizer.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      studentCards.forEach((card, idx) => {
        const depth = (idx + 1) * 8;
        card.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
      });
    });

    heroVisualizer.addEventListener('mouseleave', () => {
      studentCards.forEach(card => {
        card.style.transform = '';
      });
    });
  }

  // Cycler for Live Peer Exchange stories
  const exchangeStories = [
    { text: 'Maria teaches Mathematics ➔ <strong>+2 Credits</strong> ➔ Maria learns Python' },
    { text: 'John teaches Web Dev ➔ <strong>+2 Credits</strong> ➔ John learns Database SQL' },
    { text: 'Alex teaches Networking ➔ <strong>+2 Credits</strong> ➔ Alex learns UI/UX Design' },
    { text: 'Sophia teaches Academic English ➔ <strong>+2 Credits</strong> ➔ Sophia learns Statistics' },
    { text: 'Daniel teaches Database ➔ <strong>+2 Credits</strong> ➔ Daniel learns Cybersecurity' }
  ];

  let currentStoryIndex = 0;
  if (liveSwapPill) {
    setInterval(() => {
      currentStoryIndex = (currentStoryIndex + 1) % exchangeStories.length;
      liveSwapPill.style.opacity = '0';
      setTimeout(() => {
        liveSwapPill.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/></svg>
          <span>${exchangeStories[currentStoryIndex].text}</span>
        `;
        liveSwapPill.style.opacity = '1';
      }, 300);
    }, 4500);
  }

  // Click on Hero Student Card to trigger session booking modal
  studentCards.forEach(card => {
    card.addEventListener('click', () => {
      const name = card.querySelector('.student-name')?.textContent || 'Peer Tutor';
      const skill = card.querySelector('.student-skill')?.textContent || 'Skill';
      openBookingModal(name, skill);
    });
  });
}

/* ==========================================================================
   5. CREDIT SYSTEM & INTERACTIVE EXCHANGE SIMULATOR
   ========================================================================== */
function initCreditSimulator() {
  const teachSelect = document.getElementById('simTeachSelect');
  const learnSelect = document.getElementById('simLearnSelect');
  const simBalanceCount = document.getElementById('simBalanceCount');
  const simExchangeBtn = document.getElementById('simExchangeBtn');
  const simSummaryText = document.getElementById('simSummaryText');

  let currentBalance = 24;

  function updateSimulation() {
    const teachSkill = teachSelect ? teachSelect.value : 'JavaScript';
    const learnSkill = learnSelect ? learnSelect.value : 'Python';

    if (simSummaryText) {
      simSummaryText.innerHTML = `
        By tutoring <strong>${teachSkill}</strong>, you earn <span style="color:var(--color-credit-400); font-weight:700;">+2 Credits</span>.<br>
        You immediately reinvest those credits to learn <strong>${learnSkill}</strong> with zero monetary cost.
      `;
    }
  }

  if (teachSelect) teachSelect.addEventListener('change', updateSimulation);
  if (learnSelect) learnSelect.addEventListener('change', updateSimulation);

  if (simExchangeBtn) {
    simExchangeBtn.addEventListener('click', () => {
      const teachSkill = teachSelect ? teachSelect.value : 'JavaScript';
      const learnSkill = learnSelect ? learnSelect.value : 'Python';

      // Visual animation
      simExchangeBtn.style.transform = 'scale(0.9) rotate(360deg)';
      setTimeout(() => {
        simExchangeBtn.style.transform = '';
      }, 400);

      // Temporary balance increment simulation
      currentBalance += 2;
      if (simBalanceCount) {
        simBalanceCount.textContent = `${currentBalance} Credits`;
        simBalanceCount.style.color = 'var(--color-electric-400)';
        setTimeout(() => {
          currentBalance -= 2;
          simBalanceCount.textContent = `${currentBalance} Credits`;
          simBalanceCount.style.color = 'var(--color-credit-400)';
        }, 1200);
      }

      showToast(`⚡ Knowledge Swapped: Taught ${teachSkill} (+2) & Learned ${learnSkill} (-2)! Balance intact.`);
    });
  }

  updateSimulation();
}

/* ==========================================================================
   6. INTERACTIVE SKILL NETWORK GRAPH
   ========================================================================== */
const skillDataset = {
  web: {
    title: 'Web Development',
    desc: 'Master Modern JavaScript, React, Tailwind CSS, REST APIs, and Responsive UI architecture.',
    category: 'Software Engineering',
    peers: [
      { name: 'John Doe', avatar: 'JD', rating: '5.0 (24 reviews)', avail: 'Today at 4:00 PM', credits: '2 Credits / hr', bg: '#3B82F6' },
      { name: 'Chloe Lin', avatar: 'CL', rating: '4.9 (18 reviews)', avail: 'Tomorrow 2:00 PM', credits: '2 Credits / hr', bg: '#EC4899' }
    ]
  },
  math: {
    title: 'Mathematics & Calculus',
    desc: 'Linear algebra, multivariable calculus, discrete math, and applied probability for computer science.',
    category: 'STEM Core',
    peers: [
      { name: 'Maria Santos', avatar: 'MS', rating: '5.0 (31 reviews)', avail: 'Today at 6:30 PM', credits: '2 Credits / hr', bg: '#8B5CF6' },
      { name: 'Liam Vance', avatar: 'LV', rating: '4.8 (14 reviews)', avail: 'Thursday 10:00 AM', credits: '2 Credits / hr', bg: '#10B981' }
    ]
  },
  net: {
    title: 'Computer Networking',
    desc: 'OSI 7 layers, TCP/IP protocols, subnetting, Cisco packet tracer, socket programming & network security.',
    category: 'Infrastructure',
    peers: [
      { name: 'Alex Rivera', avatar: 'AR', rating: '4.9 (19 reviews)', avail: 'Wednesday 3:00 PM', credits: '2 Credits / hr', bg: '#F59E0B' },
      { name: 'David Kim', avatar: 'DK', rating: '5.0 (12 reviews)', avail: 'Friday 5:00 PM', credits: '2 Credits / hr', bg: '#06B6D4' }
    ]
  },
  prog: {
    title: 'Programming & Algorithms',
    desc: 'Data structures, algorithm complexity, Python, C++, Java, and competitive coding problem solving.',
    category: 'Computer Science',
    peers: [
      { name: 'Ethan Zhao', avatar: 'EZ', rating: '5.0 (42 reviews)', avail: 'Today at 8:00 PM', credits: '2 Credits / hr', bg: '#6366F1' },
      { name: 'Sarah Jenkins', avatar: 'SJ', rating: '4.9 (27 reviews)', avail: 'Tomorrow 1:00 PM', credits: '2 Credits / hr', bg: '#EC4899' }
    ]
  },
  db: {
    title: 'Database Systems & SQL',
    desc: 'Relational database design, Normalization (1NF-BCNF), MongoDB Atlas, indexing, and complex queries.',
    category: 'Data Engineering',
    peers: [
      { name: 'Daniel Scott', avatar: 'DS', rating: '4.9 (29 reviews)', avail: 'Tomorrow 4:30 PM', credits: '2 Credits / hr', bg: '#06B6D4' },
      { name: 'Aisha Malik', avatar: 'AM', rating: '5.0 (16 reviews)', avail: 'Saturday 11:00 AM', credits: '2 Credits / hr', bg: '#10B981' }
    ]
  },
  ui: {
    title: 'UI/UX & Product Design',
    desc: 'Figma wireframing, design systems, heuristic evaluation, visual hierarchy, and user research.',
    category: 'Design & Experience',
    peers: [
      { name: 'Maya Patel', avatar: 'MP', rating: '5.0 (22 reviews)', avail: 'Thursday 2:00 PM', credits: '2 Credits / hr', bg: '#F43F5E' },
      { name: 'Leo Gomez', avatar: 'LG', rating: '4.9 (15 reviews)', avail: 'Sunday 4:00 PM', credits: '2 Credits / hr', bg: '#8B5CF6' }
    ]
  },
  cyber: {
    title: 'Cybersecurity & Ethical Hacking',
    desc: 'Penetration testing basics, OWASP Top 10, cryptographic ciphers, and defensive system hardening.',
    category: 'Information Security',
    peers: [
      { name: 'Victor Vance', avatar: 'VV', rating: '5.0 (17 reviews)', avail: 'Friday 7:00 PM', credits: '2 Credits / hr', bg: '#EF4444' }
    ]
  },
  eng: {
    title: 'Academic English & Writing',
    desc: 'Research paper structure, academic thesis defense preparation, literature synthesis, and presentation.',
    category: 'Communication',
    peers: [
      { name: 'Sophia Bennett', avatar: 'SB', rating: '5.0 (38 reviews)', avail: 'Tomorrow 11:00 AM', credits: '2 Credits / hr', bg: '#A855F7' }
    ]
  },
  stat: {
    title: 'Applied Statistics & Data Science',
    desc: 'Hypothesis testing, regression analysis, R, pandas, data visualization, and statistical modeling.',
    category: 'Analytics',
    peers: [
      { name: 'Dr. Ryan Ross', avatar: 'RR', rating: '4.9 (25 reviews)', avail: 'Monday 5:00 PM', credits: '2 Credits / hr', bg: '#10B981' }
    ]
  }
};

function initSkillNetwork() {
  const nodeButtons = document.querySelectorAll('.skill-node-btn');
  const panelTitle = document.getElementById('skillPanelTitle');
  const panelDesc = document.getElementById('skillPanelDesc');
  const panelCategory = document.getElementById('skillPanelCategory');
  const peerList = document.getElementById('skillPanelPeerList');
  const requestSwapBtn = document.getElementById('skillRequestSwapBtn');

  let currentSelectedSkillKey = 'web';

  function renderSkillDetails(key) {
    const data = skillDataset[key];
    if (!data) return;

    currentSelectedSkillKey = key;

    nodeButtons.forEach(btn => {
      btn.classList.toggle('selected', btn.getAttribute('data-skill') === key);
    });

    if (panelTitle) panelTitle.textContent = data.title;
    if (panelDesc) panelDesc.textContent = data.desc;
    if (panelCategory) panelCategory.textContent = data.category;

    if (peerList) {
      peerList.innerHTML = data.peers.map(peer => `
        <div class="peer-mini-item">
          <div class="peer-mini-user">
            <div class="student-avatar" style="background: ${peer.bg}; width: 2.1rem; height: 2.1rem; font-size: 0.75rem;">
              ${peer.avatar}
            </div>
            <div>
              <div style="font-size: 0.875rem; font-weight: 700; color: var(--text-pure);">${peer.name}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Available: ${peer.avail}</div>
            </div>
          </div>
          <div style="text-align: right;">
            <div class="peer-mini-rating">★ ${peer.rating}</div>
            <button class="btn btn-sm btn-secondary" onclick="openBookingModal('${peer.name}', '${data.title}')" style="margin-top: 0.25rem; padding: 0.25rem 0.6rem; font-size: 0.75rem;">
              Connect
            </button>
          </div>
        </div>
      `).join('');
    }
  }

  nodeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-skill');
      renderSkillDetails(key);
    });
  });

  if (requestSwapBtn) {
    requestSwapBtn.addEventListener('click', () => {
      const data = skillDataset[currentSelectedSkillKey];
      if (data && data.peers.length > 0) {
        openBookingModal(data.peers[0].name, data.title);
      } else {
        openBookingModal('Peer Tutor', data.title);
      }
    });
  }

  // Initial render
  renderSkillDetails('web');
}

/* ==========================================================================
   7. DASHBOARD MOCKUP INTERACTION
   ========================================================================== */
function initDashboardMockup() {
  const dashNavItems = document.querySelectorAll('.dash-nav-item');
  const dashSessionsPanel = document.getElementById('dashSessionsPanel');

  dashNavItems.forEach(item => {
    item.addEventListener('click', () => {
      dashNavItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const view = item.getAttribute('data-dash-view');
      showToast(`Switched Dashboard view to: ${item.textContent.trim()}`);
    });
  });
}

/* ==========================================================================
   8. MODALS & AUTHENTICATION INTEGRATION
   ========================================================================== */
let globalBookingData = { peerName: '', skillName: '' };

function initModals() {
  const authModal = document.getElementById('authModal');
  const bookingModal = document.getElementById('bookingModal');
  const openAuthBtns = document.querySelectorAll('.trigger-auth-modal');
  const closeBtns = document.querySelectorAll('.modal-close-trigger');
  const tabBtns = document.querySelectorAll('.modal-tab-btn');
  const authForm = document.getElementById('authForm');
  const authSubmitBtn = document.getElementById('authSubmitBtn');
  const authModalTitle = document.getElementById('authModalTitle');
  const authNameGroup = document.getElementById('authNameGroup');
  const authSkillsGroup = document.getElementById('authSkillsGroup');
  const bookingForm = document.getElementById('bookingForm');

  let currentAuthMode = 'register'; // 'login' or 'register'

  function openAuthModal(mode = 'register') {
    currentAuthMode = mode;
    updateAuthModalView();
    authModal.classList.add('active');
  }

  function closeAllModals() {
    if (authModal) authModal.classList.remove('active');
    if (bookingModal) bookingModal.classList.remove('active');
  }

  function updateAuthModalView() {
    tabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === currentAuthMode);
    });

    if (currentAuthMode === 'login') {
      if (authModalTitle) authModalTitle.textContent = 'Welcome Back to Acadova';
      if (authNameGroup) authNameGroup.style.display = 'none';
      if (authSkillsGroup) authSkillsGroup.style.display = 'none';
      if (authSubmitBtn) authSubmitBtn.textContent = 'Sign In to Dashboard';
    } else {
      if (authModalTitle) authModalTitle.textContent = 'Create Your Peer Profile';
      if (authNameGroup) authNameGroup.style.display = 'block';
      if (authSkillsGroup) authSkillsGroup.style.display = 'block';
      if (authSubmitBtn) authSubmitBtn.textContent = 'Join & Claim 2 Free Credits';
    }
  }

  // Open triggers
  openAuthBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const mode = btn.getAttribute('data-auth-mode') || 'register';
      openAuthModal(mode);
    });
  });

  // Tab switching
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentAuthMode = btn.getAttribute('data-tab');
      updateAuthModalView();
    });
  });

  // Close triggers
  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  // Close on backdrop click
  [authModal, bookingModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAllModals();
      });
    }
  });

  // Close on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  // Form submission: Real Auth API with Mock Fallback
  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('authNameInput')?.value || '';
      const email = document.getElementById('authEmailInput')?.value || '';
      const password = document.getElementById('authPasswordInput')?.value || '';
      const teachSkill = document.getElementById('authTeachInput')?.value || '';
      const learnSkill = document.getElementById('authLearnInput')?.value || '';

      const originalBtnText = authSubmitBtn.textContent;
      authSubmitBtn.disabled = true;
      authSubmitBtn.textContent = 'Processing...';

      try {
        const endpoint = currentAuthMode === 'register' ? '/api/auth/register' : '/api/auth/login';
        const payload = currentAuthMode === 'register' 
          ? { name, email, password, skillsToTeach: [teachSkill], skillsToLearn: [learnSkill] }
          : { email, password };

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('acadova_token', data.token);
          localStorage.setItem('acadova_user', JSON.stringify(data.user));
          closeAllModals();
          showToast(`🎉 Welcome ${data.user?.name || 'Scholar'}! Credits: ${data.user?.credits || 2}`);
        } else {
          // If server error or user exists, provide helpful response
          throw new Error(data.message || 'Authentication error');
        }
      } catch (err) {
        // Graceful Demo Simulation if offline or error
        closeAllModals();
        showToast(`✨ [Demo Mode] Signed in as ${name || email.split('@')[0] || 'Peer Scholar'}. 2 Credits Allocated!`);
      } finally {
        authSubmitBtn.disabled = false;
        authSubmitBtn.textContent = originalBtnText;
      }
    });
  }

  // Booking Form Submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const topic = document.getElementById('bookingTopicInput')?.value || globalBookingData.skillName;
      const date = document.getElementById('bookingDateInput')?.value || 'Upcoming Slot';
      
      closeAllModals();
      showToast(`📅 Session Request sent to ${globalBookingData.peerName} for "${topic}"! (2 Credits Reserved)`);
    });
  }
}

// Global modal helper for inline onclick handlers
window.openBookingModal = function(peerName, skillName) {
  const modal = document.getElementById('bookingModal');
  const targetPeer = document.getElementById('bookingPeerName');
  const targetSkill = document.getElementById('bookingSkillBadge');
  const topicInput = document.getElementById('bookingTopicInput');

  globalBookingData = { peerName, skillName };

  if (targetPeer) targetPeer.textContent = peerName;
  if (targetSkill) targetSkill.textContent = skillName;
  if (topicInput) topicInput.value = `Mastering ${skillName} Fundamentals`;

  if (modal) modal.classList.add('active');
};

/* ==========================================================================
   9. SMOOTH SCROLL & TOAST NOTIFICATIONS
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function showToast(message, duration = 4000) {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast toast-success';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
