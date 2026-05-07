// PWA Install Handler Super Canggih

class PWAInstaller {
  constructor() {
    this.deferredPrompt = null;
    this.installButton = null;
    this.isInstalled = false;
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Tangkap event beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallPromotion();
      console.log('[PWA] Install prompt ready');
    });
    
    // Deteksi jika sudah terinstall
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.hideInstallButton();
      
      // Rayakan!
      this.showConfetti();
      
      // Tracking
      this.trackEvent('pwa_installed');
      
      console.log('[PWA] App installed successfully! 🎉');
    });
    
    // Deteksi display mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
      console.log('[PWA] Running in standalone mode');
    }
  }
  
  showInstallPromotion() {
    // Buat tombol install keren
    const installHTML = `
      <div id="pwa-install-card" class="pwa-install-card">
        <div class="pwa-install-content">
          <img src="/logo192.png" alt="MapExplorer" class="pwa-icon">
          <div class="pwa-info">
            <h3>Install MapExplorer</h3>
            <p>Navigate. Track. Explore.</p>
            <div class="pwa-features">
              <span>📱 Full Screen</span>
              <span>🚀 Fast Loading</span>
              <span>📡 Offline Maps</span>
            </div>
          </div>
        </div>
        <div class="pwa-actions">
          <button id="pwa-install-btn" class="pwa-install-btn">
            Install App
          </button>
          <button id="pwa-dismiss-btn" class="pwa-dismiss-btn">
            Maybe Later
          </button>
        </div>
      </div>
    `;
    
    // Tambahkan ke halaman (setelah loading)
    setTimeout(() => {
      if (!document.getElementById('pwa-install-card')) {
        document.body.insertAdjacentHTML('beforeend', installHTML);
        this.setupButtonListeners();
        this.animateIn();
      }
    }, 3000);
  }
  
  setupButtonListeners() {
    this.installButton = document.getElementById('pwa-install-btn');
    const dismissButton = document.getElementById('pwa-dismiss-btn');
    
    this.installButton?.addEventListener('click', () => {
      this.installApp();
    });
    
    dismissButton?.addEventListener('click', () => {
      this.hideInstallButton();
      // Simpan preferensi
      localStorage.setItem('pwa_dismissed', Date.now());
    });
  }
  
  async installApp() {
    if (!this.deferredPrompt) return;
    
    // Tampilkan loading
    this.installButton.innerHTML = '⏳ Installing...';
    this.installButton.disabled = true;
    
    // Show prompt
    this.deferredPrompt.prompt();
    
    // Tunggu user response
    const result = await this.deferredPrompt.userChoice;
    
    if (result.outcome === 'accepted') {
      console.log('[PWA] User accepted install');
      this.trackEvent('pwa_accepted');
    } else {
      console.log('[PWA] User dismissed install');
      this.trackEvent('pwa_dismissed');
      this.hideInstallButton();
    }
    
    // Reset
    this.deferredPrompt = null;
  }
  
  hideInstallButton() {
    const card = document.getElementById('pwa-install-card');
    if (card) {
      this.animateOut(card);
      setTimeout(() => card?.remove(), 300);
    }
  }
  
  animateIn() {
    const card = document.getElementById('pwa-install-card');
    if (card) {
      requestAnimationFrame(() => {
        card.style.transform = 'translateY(0)';
        card.style.opacity = '1';
      });
    }
  }
  
  animateOut(element) {
    element.style.transform = 'translateY(100px)';
    element.style.opacity = '0';
  }
  
  showConfetti() {
    // Simple confetti effect
    const colors = ['#0066ff', '#764ba2', '#00ff88', '#ff6b6b', '#ffa502'];
    
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
          position: fixed;
          top: -10px;
          left: ${Math.random() * 100}vw;
          width: 10px;
          height: 10px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          z-index: 9999;
          animation: confettiFall ${1 + Math.random() * 2}s ease-out forwards;
          border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        `;
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
      }, i * 30);
    }
  }
  
  trackEvent(eventName) {
    // Analytics tracking
    if (window.gtag) {
      gtag('event', eventName);
    }
    
    // Local tracking
    const events = JSON.parse(localStorage.getItem('pwa_events') || '[]');
    events.push({ event: eventName, timestamp: Date.now() });
    localStorage.setItem('pwa_events', JSON.stringify(events.slice(-100)));
  }
}

// CSS untuk install card
const style = document.createElement('style');
style.textContent = `
  .pwa-install-card {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    opacity: 0;
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    border: 1px solid #2a2a4e;
    border-radius: 20px;
    padding: 20px;
    width: 90%;
    max-width: 400px;
    z-index: 9999;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
  }
  
  .pwa-install-content {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    align-items: center;
  }
  
  .pwa-icon {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0,102,255,0.3);
  }
  
  .pwa-info h3 {
    color: white;
    font-size: 18px;
    margin: 0 0 4px 0;
  }
  
  .pwa-info p {
    color: #aaa;
    font-size: 13px;
    margin: 0 0 8px 0;
  }
  
  .pwa-features {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  
  .pwa-features span {
    background: rgba(255,255,255,0.1);
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 11px;
    color: #ccc;
  }
  
  .pwa-actions {
    display: flex;
    gap: 8px;
  }
  
  .pwa-install-btn {
    flex: 1;
    padding: 12px;
    background: linear-gradient(135deg, #0066ff, #764ba2);
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: transform 0.2s;
  }
  
  .pwa-install-btn:hover {
    transform: scale(1.02);
  }
  
  .pwa-install-btn:disabled {
    opacity: 0.7;
  }
  
  .pwa-dismiss-btn {
    padding: 12px 16px;
    background: transparent;
    color: #aaa;
    border: 1px solid #2a2a4e;
    border-radius: 12px;
    font-size: 13px;
    cursor: pointer;
  }
  
  @keyframes confettiFall {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }
  
  @media (prefers-color-scheme: light) {
    .pwa-install-card {
      background: white;
      border-color: #e0e0e0;
    }
    
    .pwa-info h3 {
      color: #1a1a2e;
    }
  }
`;

document.head.appendChild(style);

// Initialize
const pwaInstaller = new PWAInstaller();

// Export untuk global use
window.pwaInstaller = pwaInstaller;

// Manual install trigger
window.installPWA = () => {
  if (pwaInstaller.deferredPrompt) {
    pwaInstaller.installApp();
  } else {
    alert('Install prompt not available. You may already have the app installed.');
  }
};

console.log('🚀 PWA Installer ready!');
