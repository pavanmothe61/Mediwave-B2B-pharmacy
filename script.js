/* ─────────────────────────────────────────────
   Intersection Observer – Scroll Animations
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* Animate day cards on scroll */
  const cards = document.querySelectorAll('.day-card[data-aos]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  cards.forEach(card => observer.observe(card));

  /* Navbar scroll effect */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.style.background = 'rgba(6, 10, 20, 0.95)';
      navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.5)';
    } else {
      navbar.style.background = 'rgba(6, 10, 20, 0.75)';
      navbar.style.boxShadow = 'none';
    }
  });

  /* Animated counter for hero stats */
  const statNums = document.querySelectorAll('.stat-num');
  const targets = [3, 5, 26];

  const animateCounter = (el, target) => {
    let current = 0;
    const step = Math.ceil(target / 25);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 40);
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNums.forEach((el, i) => animateCounter(el, targets[i]));
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const statsBlock = document.querySelector('.hero-stats');
  if (statsBlock) statsObserver.observe(statsBlock);

  /* Smooth active day highlight on scroll */
  const dayCards = document.querySelectorAll('.day-card');
  const dayScrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const dayId = entry.target.id;
        // You can add nav highlight logic here if needed
      }
    });
  }, { threshold: 0.3 });

  dayCards.forEach(c => dayScrollObserver.observe(c));

  /* Ripple effect on role cards */
  document.querySelectorAll('.role-card').forEach(card => {
    card.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ripple.style.cssText = `
        position:absolute;
        width:4px;height:4px;
        background:rgba(255,255,255,0.15);
        border-radius:50%;
        transform:scale(0);
        left:${x}px;top:${y}px;
        pointer-events:none;
        animation:ripple 0.5s ease-out forwards;
      `;
      card.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });

  /* Inject ripple keyframes */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to { transform: scale(80); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  /* Day card progress indicator */
  const totalDays = 5;
  dayCards.forEach((card, idx) => {
    const progress = Math.round(((idx + 1) / totalDays) * 100);
    const progressEl = document.createElement('div');
    progressEl.className = 'day-progress';
    progressEl.innerHTML = `
      <div class="progress-bar-wrap">
        <div class="progress-bar-fill" style="width: ${progress}%; animation-delay: ${idx * 0.1}s"></div>
      </div>
      <span class="progress-label">Week 1 Progress: ${progress}%</span>
    `;
    card.querySelector('.day-header').prepend(progressEl);
  });

  /* Inject progress styles */
  const progressStyle = document.createElement('style');
  progressStyle.textContent = `
    .day-progress {
      margin-bottom: 16px;
    }
    .progress-bar-wrap {
      width: 100%;
      height: 3px;
      background: rgba(255,255,255,0.06);
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 6px;
    }
    .progress-bar-fill {
      height: 100%;
      border-radius: 2px;
      background: linear-gradient(90deg, #6b9fff, #a78bfa, #f472b6);
      background-size: 200% 100%;
      animation: progressAnim 1.2s cubic-bezier(0.4,0,0.2,1) both, shimmer 3s linear infinite;
      width: 0;
    }
    @keyframes progressAnim {
      from { width: 0 !important; }
    }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    .progress-label {
      font-size: 11px;
      color: rgba(136, 153, 187, 0.7);
      font-weight: 500;
      letter-spacing: 0.5px;
    }
  `;
  document.head.appendChild(progressStyle);

  console.log('🏥 Pharmacy B2B Portal – Internship Week 1 Loaded!');
});
