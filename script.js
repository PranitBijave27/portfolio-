
(function initWebsitePreloader() {
  const preloader = document.getElementById('preloader');
  const counterEl = document.getElementById('preloader-counter');
  const progressBar = document.getElementById('preloader-progress-bar');
  const logEl = document.getElementById('preloader-log');
  const stagePill = document.getElementById('preloader-stage-pill');
  const btnSkip = document.getElementById('btn-skip-preloader');

  if (!preloader || !counterEl || !progressBar) return;


  document.body.classList.add('overflow-hidden');

  const TOTAL_DURATION_MS = 3000;
  const startTime = performance.now();
  let hasCompleted = false;

  const phases = [
    { progress: 0, text: 'INITIALIZING_CORE_RUNTIME...', phase: '[PHASE 1/4]' },
    { progress: 28, text: 'CALIBRATING_CONCURRENCY_MUTEX...', phase: '[PHASE 2/4]' },
    { progress: 62, text: 'MOUNTING_PHYSICAL_SYSTEMS_MESH...', phase: '[PHASE 3/4]' },
    { progress: 88, text: 'VERIFYING_SERIALIZABLE_INVARIANTS...', phase: '[PHASE 4/4]' },
    { progress: 100, text: 'SUBSYSTEMS_OPERATIONAL_READY', phase: '[READY]' }
  ];

  function finishPreloader() {
    if (hasCompleted) return;
    hasCompleted = true;

    counterEl.textContent = '100';
    progressBar.style.width = '100%';
    logEl.textContent = 'SYSTEM_BOOT_SUCCESSFUL (100%)';
    logEl.className = 'text-emerald-600 font-bold truncate';
    stagePill.textContent = '[ONLINE]';
    stagePill.className = 'text-emerald-600 text-[10px] flex-shrink-0 font-bold ml-2';

    setTimeout(() => {
      preloader.classList.add('preloader-hidden');
      document.body.classList.remove('overflow-hidden');

      setTimeout(() => {
        preloader.remove();
      }, 700);
    }, 220);
  }

  function updateLoader(currentTime) {
    if (hasCompleted) return;

    const elapsed = currentTime - startTime;
    const rawProgress = Math.min(elapsed / (TOTAL_DURATION_MS - 250), 1);


    const easedProgress = 1 - Math.pow(1 - rawProgress, 2.6);
    const percent = Math.min(Math.floor(easedProgress * 100), 100);

    counterEl.textContent = String(percent).padStart(2, '0');
    progressBar.style.width = percent + '%';


    if (percent >= 98) {
      logEl.textContent = phases[4].text;
      stagePill.textContent = phases[4].phase;
    } else if (percent >= 85) {
      logEl.textContent = phases[3].text;
      stagePill.textContent = phases[3].phase;
    } else if (percent >= 55) {
      logEl.textContent = phases[2].text;
      stagePill.textContent = phases[2].phase;
    } else if (percent >= 25) {
      logEl.textContent = phases[1].text;
      stagePill.textContent = phases[1].phase;
    } else {
      logEl.textContent = phases[0].text;
      stagePill.textContent = phases[0].phase;
    }

    if (elapsed >= TOTAL_DURATION_MS - 250) {
      finishPreloader();
    } else {
      requestAnimationFrame(updateLoader);
    }
  }

  requestAnimationFrame(updateLoader);


  if (btnSkip) btnSkip.addEventListener('click', finishPreloader);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !hasCompleted) {
      finishPreloader();
    }
  }, { once: true });
})();

(function init3DPhysicalSystem() {
  const container = document.getElementById('hero-3d-viewport');
  if (!container) return;

  const scene = new THREE.Scene();

  let width = container.clientWidth || 360;
  let height = container.clientHeight || 460;

  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.set(0, 0.4, 7.8);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);


  const system = new THREE.Group();
  scene.add(system);


  const alabasterMat = new THREE.MeshStandardMaterial({
    color: 0xfdfdfd,
    roughness: 0.25,
    metalness: 0.12
  });

  const silverMat = new THREE.MeshStandardMaterial({
    color: 0xdde2ea,
    roughness: 0.35,
    metalness: 0.6
  });

  const electricBlueMat = new THREE.MeshStandardMaterial({
    color: 0x0066ff,
    roughness: 0.2,
    metalness: 0.2,
    emissive: 0x0033aa,
    emissiveIntensity: 0.25
  });

  const subtleLineMat = new THREE.LineBasicMaterial({
    color: 0x94a3b8,
    transparent: true,
    opacity: 0.6
  });


  const coreGroup = new THREE.Group();
  const slab = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.24, 1.2), alabasterMat);
  slab.castShadow = true;
  slab.receiveShadow = true;
  coreGroup.add(slab);


  const band = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.05, 1.22), electricBlueMat);
  band.position.y = -0.04;
  coreGroup.add(band);
  coreGroup.position.set(-0.2, 0.8, 0);
  system.add(coreGroup);

  const dbGroup = new THREE.Group();
  dbGroup.position.set(-1.4, -0.9, 0.4);
  for (let i = 0; i < 3; i++) {
    const disk = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.16, 24), i === 1 ? silverMat : alabasterMat);
    disk.position.y = (i - 1) * 0.24;
    disk.castShadow = true;
    disk.receiveShadow = true;
    dbGroup.add(disk);
  }
  system.add(dbGroup);

  const computeGroup = new THREE.Group();
  computeGroup.position.set(1.4, 0.3, -0.3);
  const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), alabasterMat);
  cube.castShadow = true;
  cube.receiveShadow = true;
  computeGroup.add(cube);

  const cubeTrim = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.12, 0.78), electricBlueMat);
  computeGroup.add(cubeTrim);
  system.add(computeGroup);


  const workerMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), silverMat);
  workerMesh.position.set(1.1, -1.2, 0.3);
  workerMesh.castShadow = true;
  workerMesh.receiveShadow = true;
  system.add(workerMesh);


  const nodeCoords = [
    coreGroup.position,
    computeGroup.position,
    workerMesh.position,
    dbGroup.position
  ];

  for (let i = 0; i < nodeCoords.length; i++) {
    const next = nodeCoords[(i + 1) % nodeCoords.length];
    const points = [nodeCoords[i], next];
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geo, subtleLineMat);
    system.add(line);
  }

  const dataPackets = [];
  const packetGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);

  for (let i = 0; i < 6; i++) {
    const p = new THREE.Mesh(packetGeo, i % 2 === 0 ? electricBlueMat : silverMat);
    p.castShadow = true;
    scene.add(p);
    dataPackets.push({
      mesh: p,
      from: nodeCoords[i % nodeCoords.length],
      to: nodeCoords[(i + 1) % nodeCoords.length],
      t: Math.random(),
      speed: 0.006 + Math.random() * 0.008
    });
  }

  const shadowPlaneGeo = new THREE.PlaneGeometry(10, 10);
  const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.12 });
  const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
  shadowPlane.position.z = -1.2;
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambientLight);

  const mainSun = new THREE.DirectionalLight(0xffffff, 0.95);
  mainSun.position.set(4, 8, 6);
  mainSun.castShadow = true;
  mainSun.shadow.mapSize.width = 1024;
  mainSun.shadow.mapSize.height = 1024;
  mainSun.shadow.camera.near = 0.5;
  mainSun.shadow.camera.far = 15;
  mainSun.shadow.bias = -0.001;
  scene.add(mainSun);

  const fillLight = new THREE.DirectionalLight(0x0066ff, 0.3);
  fillLight.position.set(-6, -2, 4);
  scene.add(fillLight);

  let mouseX = 0, mouseY = 0;
  let targetRotY = -0.25;
  let targetRotX = 0.15;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;

    targetRotY = mouseX * 0.45;
    targetRotX = -mouseY * 0.35;

    mainSun.position.x = 4 + mouseX * 1.5;
    mainSun.position.y = 8 + mouseY * 1.5;
  });

  container.addEventListener('mouseleave', () => {
    targetRotY = -0.25;
    targetRotX = 0.15;
    mainSun.position.set(4, 8, 6);
  });

  function onResize() {
    width = container.clientWidth || 360;
    height = container.clientHeight || 460;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', onResize);

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Smooth Lerp
    system.rotation.y += (targetRotY - system.rotation.y) * 0.05;
    system.rotation.x += (targetRotX - system.rotation.x) * 0.05;

    // Gentle Ambient Floating
    system.position.y = Math.sin(elapsed * 0.8) * 0.08;
    computeGroup.rotation.y = elapsed * 0.35;
    computeGroup.rotation.x = elapsed * 0.2;
    workerMesh.rotation.y = elapsed * 0.6;
    coreGroup.rotation.y = Math.sin(elapsed * 0.5) * 0.08;

    // Packet Flow
    dataPackets.forEach(p => {
      p.t += p.speed;
      if (p.t > 1) p.t = 0;
      p.mesh.position.lerpVectors(p.from, p.to, p.t);
      // slight elevation
      p.mesh.position.z += Math.sin(p.t * Math.PI) * 0.12;
    });

    renderer.render(scene, camera);
  }
  animate();
})();


(function initReservationSimulator() {
  const vipContainer = document.getElementById('tier-vip-seats');
  const primeContainer = document.getElementById('tier-prime-seats');
  const activeLockBadge = document.getElementById('active-lock-badge');
  const activeSeatCode = document.getElementById('active-seat-code');
  const btnCollision = document.getElementById('btn-test-collision');
  const feedbackEl = document.getElementById('collision-feedback');

  if (!vipContainer || !primeContainer) return;

  const vipSeats = [
    { id: 'V-01', status: 'booked' },
    { id: 'V-02', status: 'available' },
    { id: 'V-03', status: 'selected' },
    { id: 'V-04', status: 'available' },
    { id: 'V-05', status: 'available' },
    { id: 'V-06', status: 'available' }
  ];

  const primeSeats = [
    { id: 'P-01', status: 'available' },
    { id: 'P-02', status: 'available' },
    { id: 'P-03', status: 'available' },
    { id: 'P-04', status: 'booked' },
    { id: 'P-05', status: 'available' },
    { id: 'P-06', status: 'available' },
    { id: 'P-07', status: 'available' },
    { id: 'P-08', status: 'available' }
  ];

  let allSeats = [];
  let currentSelected = 'V-03';

  function getClasses(status) {
    if (status === 'selected') {
      return 'px-2.5 py-1 rounded text-[11px] font-mono font-bold bg-accent text-white border border-accent shadow-sm cursor-pointer transition-all scale-105';
    } else if (status === 'available') {
      return 'px-2.5 py-1 rounded text-[11px] font-mono font-medium bg-white text-ink border border-borderMuted hover:border-accent hover:text-accent shadow-subtle cursor-pointer transition-all';
    } else if (status === 'booked') {
      return 'px-2.5 py-1 rounded text-[11px] font-mono text-faint bg-slate-100 border border-slate-200 cursor-not-allowed line-through opacity-75';
    }
    return '';
  }

  function renderSeat(seat, container) {
    const btn = document.createElement('button');
    btn.id = `seat-btn-${seat.id}`;
    btn.className = getClasses(seat.status);
    btn.textContent = seat.id;
    btn.title = seat.status === 'booked' ? `Seat ${seat.id} is already booked` : `Seat ${seat.id} (${seat.status})`;

    btn.addEventListener('click', () => {
      if (seat.status === 'booked') {
        feedbackEl.textContent = `[REJECT] Seat ${seat.id} is already booked under compound index.`;
        feedbackEl.className = 'text-[11px] text-amber-700 font-semibold';
        btn.classList.add('animate-bounce');
        setTimeout(() => btn.classList.remove('animate-bounce'), 400);
        return;
      }

      // Deselect previous
      allSeats.forEach(s => {
        if (s.status === 'selected') {
          s.status = 'available';
          s.el.className = getClasses('available');
        }
      });

      // Select this seat
      seat.status = 'selected';
      seat.el.className = getClasses('selected');
      currentSelected = seat.id;

      if (activeSeatCode) activeSeatCode.textContent = seat.id;
      if (activeLockBadge) {
        activeLockBadge.textContent = `Seat ${seat.id} (Mutex Acquired)`;
        activeLockBadge.className = 'font-bold text-accent transition-colors';
      }
      if (feedbackEl) {
        feedbackEl.textContent = `Hold acquired on ${seat.id}. Ready to test race condition.`;
        feedbackEl.className = 'text-[11px] text-emeraldMuted font-medium';
      }
    });

    seat.el = btn;
    container.appendChild(btn);
    allSeats.push(seat);
  }

  vipSeats.forEach(s => renderSeat(s, vipContainer));
  primeSeats.forEach(s => renderSeat(s, primeContainer));

  // Test Race Condition simulation
  if (btnCollision) {
    let isTesting = false;
    btnCollision.addEventListener('click', () => {
      if (isTesting) return;
      isTesting = true;
      btnCollision.disabled = true;

      btnCollision.innerHTML = '<span class="material-symbols-outlined text-[15px] animate-spin">refresh</span><span>Testing Mutex...</span>';
      feedbackEl.className = 'text-[11px] text-accent font-semibold';
      feedbackEl.textContent = `[T+0ms] Concurrent Worker #2 attempting write on ${currentSelected}...`;

      setTimeout(() => {
        feedbackEl.className = 'text-[11px] text-amber-700 font-semibold';
        feedbackEl.textContent = `[T+24ms] Storage Engine: E11000 duplicate key on { showId: 104, seatNo: "${currentSelected}" }`;
      }, 320);

      setTimeout(() => {
        feedbackEl.className = 'text-[11px] text-emeraldMuted font-bold';
        feedbackEl.textContent = `✔ [T+62ms] HTTP 409 CONFLICT caught. 0 double bookings occurred.`;
        btnCollision.innerHTML = '<span class="material-symbols-outlined text-[15px] text-emerald-400">check_circle</span><span>Invariant Verified</span>';
      }, 700);

      setTimeout(() => {
        btnCollision.disabled = false;
        isTesting = false;
        btnCollision.innerHTML = '<span class="material-symbols-outlined text-[15px]">flash_on</span><span>Simulate Concurrent Race Condition</span>';
      }, 2400);
    });
  }
})();

// ---------------------------------------------------------------------------
// 3. CASE STUDY 02: API DEPENDENCY & INCIDENT MATRIX SIMULATOR
// ---------------------------------------------------------------------------
(function initMatrixSimulator() {
  const btnTrigger = document.getElementById('btn-trigger-matrix');
  const globalBar = document.getElementById('matrix-global-bar');
  const statusDot = document.getElementById('matrix-status-dot');
  const statusText = document.getElementById('matrix-status-text');
  const statusPill = document.getElementById('matrix-status-pill');
  const stripeRow = document.getElementById('matrix-stripe-row');
  const stripeDot = document.getElementById('matrix-stripe-dot');
  const stripeSub = document.getElementById('matrix-stripe-sub');
  const stripeStatus = document.getElementById('matrix-stripe-status');
  const actionHint = document.getElementById('matrix-action-hint');

  if (!btnTrigger) return;

  let isDegraded = false;

  btnTrigger.addEventListener('click', () => {
    isDegraded = !isDegraded;

    if (isDegraded) {
      // Trigger Outage sequence
      btnTrigger.innerHTML = '<span class="material-symbols-outlined text-emerald-600 text-[16px]">check_circle</span><span>Resolve Stripe Outage</span>';
      btnTrigger.className = 'px-3.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-mono text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5 btn-tactile';

      stripeRow.className = 'p-3 rounded-lg bg-amber-50/60 border border-amber-300 flex items-center justify-between shadow-subtle transition-all';
      stripeDot.className = 'w-2 h-2 rounded-full bg-amber-500 animate-ping';
      stripeSub.textContent = '3/3 Consecutive Probe Timeouts';
      stripeSub.className = 'text-[10px] text-amber-700 font-semibold';
      stripeStatus.className = 'text-[11px] text-amber-700 font-bold';
      stripeStatus.textContent = '504 TIMEOUT (ERR_GATEWAY)';

      globalBar.className = 'p-3.5 rounded-xl bg-amber-50/70 border border-amber-300 flex items-center justify-between shadow-sm transition-all';
      statusDot.className = 'w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping';
      statusText.textContent = 'UPSTREAM STRIPE OUTAGE — CIRCUIT TRIPPED';
      statusText.className = 'font-bold text-amber-900 text-xs';
      statusPill.className = 'text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300';
      statusPill.textContent = 'INCIDENT #9482 DISPATCHED';

      actionHint.textContent = 'Automated incident dispatched to on-call via PagerDuty webhook.';
      actionHint.className = 'text-[11px] text-amber-700 font-medium';
    } else {
      // Restore Nominal state
      btnTrigger.innerHTML = '<span class="material-symbols-outlined text-amber-500 text-[16px]">warning</span><span>Simulate Stripe API Outage</span>';
      btnTrigger.className = 'px-3.5 py-2 rounded-lg bg-surface hover:bg-surfaceHover border border-borderMuted text-ink font-mono text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5 btn-tactile';

      stripeRow.className = 'p-3 rounded-lg bg-surface border border-borderMuted flex items-center justify-between shadow-subtle transition-all';
      stripeDot.className = 'w-2 h-2 rounded-full bg-emerald-500';
      stripeSub.textContent = 'External REST API';
      stripeSub.className = 'text-[10px] text-muted';
      stripeStatus.className = 'text-[11px] text-emeraldMuted font-bold';
      stripeStatus.textContent = '84ms (OK)';

      globalBar.className = 'p-3.5 rounded-xl bg-surface border border-borderMuted flex items-center justify-between shadow-sm transition-all';
      statusDot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse';
      statusText.textContent = 'ALL UPSTREAM DEPENDENCIES OPERATIONAL';
      statusText.className = 'font-bold text-ink text-xs';
      statusPill.className = 'text-[10px] font-semibold text-emeraldMuted bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200';
      statusPill.textContent = 'HEALTHY';

      actionHint.textContent = 'Circuit breaker closed. Incident #9482 marked resolved.';
      actionHint.className = 'text-[11px] text-emeraldMuted font-medium';
    }
  });
})();

// ---------------------------------------------------------------------------
// 3. CASE STUDY 03: NESTIFY TABS & INTERACTIVE PHOTO SELECTOR
// ---------------------------------------------------------------------------
(function initNestifyShowcase() {
  const tabs = document.querySelectorAll('.nest-tab');
  const tabPreview = document.getElementById('tab-content-preview');
  const tabSchema = document.getElementById('tab-content-schema');
  const tabAuth = document.getElementById('tab-content-auth');
  const photoBtns = document.querySelectorAll('.photo-btn');
  const photoTitle = document.getElementById('nest-photo-title');
  const photoCaption = document.getElementById('nest-preview-caption');

  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active', 'bg-ink', 'text-white');
        t.classList.add('bg-surface', 'text-muted', 'border', 'border-borderMuted');
      });
      tab.classList.add('active', 'bg-ink', 'text-white');
      tab.classList.remove('bg-surface', 'text-muted', 'border', 'border-borderMuted');

      const target = tab.dataset.tab;
      if (tabPreview) tabPreview.classList.toggle('hidden', target !== 'preview');
      if (tabSchema) tabSchema.classList.toggle('hidden', target !== 'schema');
      if (tabAuth) tabAuth.classList.toggle('hidden', target !== 'auth');
    });
  });

  // Photo switcher
  const photoImg = document.getElementById('nest-photo-img');
  const photoData = {
    exterior: {
      title: 'VIEW: EXTERIOR PATIO & INFINITY POOL',
      caption: '✦ Modern Architectural Villa (Panoramic Deck & Pool)',
      src: 'nestify-exterior.jpg'
    },
    interior: {
      title: 'VIEW: MASTER LIVING & DINING SUITE',
      caption: '✦ Minimalist Living Area (Curated Timber & Nordic Stone)',
      src: 'nestify-interior.jpg'
    },
    balcony: {
      title: 'VIEW: SUNSET VERANDA & MEDITERRANEAN SEA',
      caption: '✦ Private Sunset Balcony (Unobstructed Sea Horizon)',
      src: 'nestify-balcony.jpg'
    }
  };

  photoBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      photoBtns.forEach(b => {
        b.classList.remove('active', 'bg-ink', 'text-white');
        b.classList.add('bg-white', 'text-muted');
      });
      btn.classList.add('active', 'bg-ink', 'text-white');
      btn.classList.remove('bg-white', 'text-muted');

      const view = btn.dataset.view;
      const data = photoData[view];
      if (data) {
        if (photoTitle) photoTitle.textContent = data.title;
        if (photoCaption) photoCaption.textContent = data.caption;
        if (photoImg) {
          photoImg.style.opacity = '0.4';
          photoImg.style.transform = 'scale(0.98)';
          setTimeout(() => {
            photoImg.src = data.src;
            photoImg.style.opacity = '1';
            photoImg.style.transform = 'scale(1)';
          }, 120);
        }
      }
    });
  });
})();

// ---------------------------------------------------------------------------
// 3. TACTILE 3D CARD PARALLAX & HOVER DEPTH
// ---------------------------------------------------------------------------
(function initTactileParallax() {
  const cards = document.querySelectorAll('article, .photo-card, #about .rounded-2xl');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Subtle tilt (max 3 degrees)
      const rotateX = ((y - centerY) / centerY) * -1.8;
      const rotateY = ((x - centerX) / centerX) * 1.8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
      card.style.transition = 'transform 0.1s ease-out';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      card.style.transition = 'transform 0.4s ease-out';
    });
  });
})();

// ---------------------------------------------------------------------------
// 4. ARCHITECTURE TOPOLOGY TABS
// ---------------------------------------------------------------------------
(function initSystemTabs() {
  const tabs = document.querySelectorAll('.sys-tab');
  const badge = document.getElementById('tab-badge');
  const title = document.getElementById('tab-title');
  const desc = document.getElementById('tab-desc');
  const lang = document.getElementById('tab-lang');
  const code = document.getElementById('tab-code');

  const data = {
    ingress: {
      badge: '01 // INGRESS GATEWAY',
      title: 'Ingress Perimeter & Concurrency Guards',
      desc: 'Every request is verified for cryptographic JWT validity and schema compliance before database allocation. Zero-allocation schema guards prevent payload injection and throttle burst abusers using sliding-window rate limiters.',
      lang: 'Node.js / Express',
      code: `router.post('/seats/hold',
  rateLimiter({ windowMs: 1000, max: 20 }),
  validatePayload(HoldSchema),
  authenticateJWT,
  holdSeatController
);`
    },
    compute: {
      badge: '02 // COMPUTE SERVICE',
      title: 'Stateless Services & Deterministic State Machines',
      desc: 'Compute layers remain strictly stateless for horizontal scaling. Transactions follow explicit state machine transitions (AVAILABLE -> HELD -> BOOKED) throwing deterministic domain exceptions upon any invalid state leap.',
      lang: 'TypeScript / Node.js',
      code: `function transitionSeat(current, target) {
  const allowed = {
    AVAILABLE: ['HELD'],
    HELD: ['BOOKED', 'AVAILABLE'],
    BOOKED: []
  };
  if (!allowed[current]?.includes(target)) {
    throw new InvalidTransitionError();
  }
}`
    },
    database: {
      badge: '03 // DATABASE CLUSTER',
      title: 'Compound Unique Indexes & ACID Guarantees',
      desc: 'Mutual exclusion is enforced at the database layer rather than in volatile application memory. Compound indexes guarantee 0% duplicate bookings under multi-client bursts.',
      lang: 'MongoDB / Index',
      code: `// Compound unique constraint
SeatSchema.index(
  { showId: 1, seatNumber: 1 },
  { unique: true }
);`
    },
    concurrency: {
      badge: '04 // CONCURRENCY CONTROLS',
      title: 'Row-Level Locking & Isolation Fallbacks',
      desc: 'When multi-table updates are required, row-level locks prevent dirty reads and lost updates by serializing competing transactions at the storage engine.',
      lang: 'PostgreSQL / SQL',
      code: `BEGIN TRANSACTION;
SELECT * FROM seats 
WHERE show_id = $1 AND seat_no = $2 
FOR UPDATE;
-- Atomic mutation executed here
COMMIT;`
    },
    workers: {
      badge: '05 // ASYNC RECOVERY',
      title: 'Scheduled Lock Expiration (TTL)',
      desc: 'Automated background cron routines sweep expired temporary holds every minute, preventing orphaned locks if clients abandon checkouts.',
      lang: 'Node.js / Cron',
      code: `cron.schedule('*/1 * * * *', async () => {
  const cutoff = new Date(Date.now() - 5 * 60 * 1000);
  await SeatHold.deleteMany({
    status: 'HELD',
    createdAt: { $lt: cutoff }
  });
});`
    },
    telemetry: {
      badge: '06 // OBSERVABILITY',
      title: 'Consecutive Failure Rules & Telemetry',
      desc: 'Single network blips are logged as warnings, but consecutive failures breach circuit breakers and escalate directly to incident lifecycles.',
      lang: 'TypeScript / Observability',
      code: `if (healthCheck.status === 'FAIL') {
  service.consecutiveFailures++;
  if (service.consecutiveFailures >= 3) {
    await escalateIncident(service.id);
  }
}`
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active', 'border-accent', 'bg-accentSubtle');
        t.classList.add('border-borderMuted', 'bg-surface');
        t.querySelector('div:first-child').classList.replace('text-accent', 'text-faint');
      });

      tab.classList.add('active', 'border-accent', 'bg-accentSubtle');
      tab.classList.remove('border-borderMuted', 'bg-surface');
      tab.querySelector('div:first-child').classList.replace('text-faint', 'text-accent');

      const key = tab.dataset.key;
      const info = data[key];
      if (!info) return;

      badge.textContent = info.badge;
      title.textContent = info.title;
      desc.textContent = info.desc;
      lang.textContent = info.lang;
      code.textContent = info.code;
    });
  });
})();

// ---------------------------------------------------------------------------
// 5. GLOBAL HELPERS: COUNT-UP, EMAIL COPY, SCROLL NAV
// ---------------------------------------------------------------------------
(function initGlobalHelpers() {
  // Navigation transform on scroll
  const nav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('py-2', 'nav-scrolled');
      nav.classList.remove('py-3');
    } else {
      nav.classList.add('py-3');
      nav.classList.remove('py-2', 'nav-scrolled');
    }
  });

  // Animated Metric Numbers Count-Up on Scroll
  const counters = document.querySelectorAll('.count-up');
  let counted = false;

  function checkCounters() {
    if (counted) return;
    const rect = counters[0]?.getBoundingClientRect();
    if (rect && rect.top < window.innerHeight - 40) {
      counted = true;
      counters.forEach(counter => {
        const target = parseInt(counter.dataset.target, 10);
        const duration = 1200;
        const start = performance.now();

        function update(now) {
          const progress = Math.min((now - start) / duration, 1);
          counter.textContent = Math.floor(progress * target);
          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            counter.textContent = target;
          }
        }
        requestAnimationFrame(update);
      });
    }
  }
  window.addEventListener('scroll', checkCounters);
  checkCounters();

  // Copy Email Button
  const copyBtn = document.getElementById('btn-copy-mail');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('bijwepranit@gmail.com').then(() => {
        copyBtn.textContent = 'COPIED!';
        copyBtn.classList.add('bg-accent', 'text-white');
        setTimeout(() => {
          copyBtn.textContent = 'COPY';
          copyBtn.classList.remove('bg-accent', 'text-white');
        }, 2000);
      });
    });
  }
})();

// ---------------------------------------------------------------------------
// 6. INBOX MESSAGE DISPATCHER (bijwepranit@gmail.com)
// ---------------------------------------------------------------------------
(function initContactDispatcher() {
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('sender-name');
  const emailInput = document.getElementById('sender-email');
  const topicInput = document.getElementById('sender-topic');
  const messageInput = document.getElementById('sender-message');
  const feedback = document.getElementById('contact-feedback');
  const btnGmail = document.getElementById('btn-gmail-web');

  if (!form) return;

  function constructPayload() {
    const name = (nameInput ? nameInput.value.trim() : '') || 'Inquirer';
    const email = (emailInput ? emailInput.value.trim() : '') || 'Not provided';
    const topic = (topicInput ? topicInput.value.trim() : '') || 'General Inquiry';
    const message = (messageInput ? messageInput.value.trim() : '') || '';
    const subject = `[Portfolio Inquiry] ${topic} — from ${name}`;
    const body = `Hi Pranit,\n\n${message}\n\n---\nSender Details:\nName: ${name}\nEmail: ${email}\nTopic: ${topic}`;
    return { name, email, topic, message, subject, body };
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { name, email, subject, body } = constructPayload();

    if (!name || !email) return;

    // Open mailto
    const mailtoUrl = `mailto:bijwepranit@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;

    // Display confirmation feedback
    if (feedback) {
      feedback.className = 'p-3.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-900 text-xs font-sans space-y-1 block';
      feedback.innerHTML = `
            <div class="font-bold flex items-center gap-1.5 text-emerald-800">
              <span class="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
              <span>Message Prepared for bijwepranit@gmail.com</span>
            </div>
            <p class="text-emerald-700 leading-relaxed">
              Your email client was invoked. If it didn't open automatically, you can <a href="${mailtoUrl}" class="underline font-semibold text-emerald-900">click here to dispatch</a> or use the <strong>Open in Gmail Web</strong> button.
            </p>
          `;
    }
  });

  if (btnGmail) {
    btnGmail.addEventListener('click', () => {
      const { subject, body } = constructPayload();
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=bijwepranit@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(gmailUrl, '_blank', 'noopener,noreferrer');

      if (feedback) {
        feedback.className = 'p-3.5 rounded-xl border border-accent/40 bg-accentSubtle text-ink text-xs font-sans space-y-1 block';
        feedback.innerHTML = `
              <div class="font-bold flex items-center gap-1.5 text-ink">
                <span class="material-symbols-outlined text-[16px] text-accent">open_in_new</span>
                <span>Opened Gmail Web Composer</span>
              </div>
              <p class="text-muted leading-relaxed">
                If the composer was blocked by your browser popup settings, <a href="${gmailUrl}" target="_blank" class="underline font-semibold text-accent">click here to launch Gmail</a> directly.
              </p>
            `;
      }
    });
  }
})();


// ---------------------------------------------------------------------------
// SYSTEMS ARCHITECTURE INSPECTOR (6-STEP INTERACTIVE TOPOLOGY)
// ---------------------------------------------------------------------------
(function initSystemsInspector() {
  const tabs = document.querySelectorAll('.sys-tab');
  const badge = document.getElementById('tab-badge');
  const title = document.getElementById('tab-title');
  const desc = document.getElementById('tab-desc');
  const lang = document.getElementById('tab-lang');
  const code = document.getElementById('tab-code');

  if (!tabs.length || !title) return;

  const data = {
    ingress: {
      badge: '01 // INGRESS GATEWAY',
      title: 'Ingress Perimeter & Concurrency Guards',
      desc: 'Every request is verified for cryptographic JWT validity and schema compliance before database allocation. Zero-allocation schema guards prevent payload injection and throttle burst abusers using sliding-window rate limiters.',
      lang: 'Node.js / Express',
      code: `router.post('/seats/hold',
  rateLimiter({ windowMs: 1000, max: 20 }),
  validatePayload(HoldSchema),
  authenticateJWT,
  holdSeatController
);`
    },
    compute: {
      badge: '02 // STATELESS COMPUTE',
      title: 'Deterministic State Machine Controllers',
      desc: 'Application nodes operate completely statelessly. High-frequency state transitions (e.g. AVAILABLE -> HELD -> CONFIRMED) execute via idempotent finite state machine guards, ensuring that duplicated incoming webhook events cannot trigger dual executions.',
      lang: 'TypeScript / Node.js',
      code: `async function transitionSeat(seatId, targetState) {
  const allowed = StateMachine[current.state]?.includes(targetState);
  if (!allowed) throw new InvalidStateTransitionError(current.state, targetState);
  return await SeatRepository.atomicSetState(seatId, targetState);
}`
    },
    database: {
      badge: '03 // STORAGE LAYER',
      title: 'Compound Unique Indexes & Schema Normalization',
      desc: 'Database performance relies on compound B-Tree indexes designed precisely for query patterns. In the Reservation Engine, { showId: 1, seatNo: 1 } strictly prevents double-holds at the storage engine level with zero reliance on application-layer locks.',
      lang: 'MongoDB WiredTiger',
      code: `// Enforce zero double-booking invariant at engine level
ReservationSchema.index(
  { showId: 1, seatNo: 1 }, 
  { unique: true, background: true }
);`
    },
    concurrency: {
      badge: '04 // CONCURRENCY MUTEX',
      title: 'Pessimistic Row Locks & Serializable Isolation',
      desc: 'For multi-step financial mutations, transactions elevate to SERIALIZABLE isolation with SELECT FOR UPDATE row-level locks. This ensures that concurrent reads are strictly serialized, eliminating phantom reads and dirty state mutations.',
      lang: 'PostgreSQL / SQL',
      code: `BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
SELECT * FROM seats 
  WHERE id = $1 AND status = 'AVAILABLE' 
  FOR UPDATE;
UPDATE seats SET status = 'HELD', locked_at = NOW();
COMMIT;`
    },
    workers: {
      badge: '05 // BACKGROUND SWEEP',
      title: 'Synchronized TTL Lock Eviction Sweeper',
      desc: 'Automated background daemons run on high-frequency cron ticks to reclaim abandoned reservations whose 5-minute hold timestamps have expired. This prevents deadlock starvation and safely returns expired seats to the global inventory.',
      lang: 'Node-Cron / Bounded Workers',
      code: `cron.schedule('*/30 * * * * *', async () => {
  const expired = await Seat.updateMany(
    { status: 'HELD', holdExpiresAt: { $lt: new Date() } },
    { $set: { status: 'AVAILABLE', heldBy: null } }
  );
  if (expired.modifiedCount > 0) logger.info('Reclaimed seats: ' + expired.modifiedCount);
});`
    },
    telemetry: {
      badge: '06 // OBSERVABILITY',
      title: 'Circuit Breakers & Automated Incident Dispatch',
      desc: 'External third-party dependencies (like payment gateways and notification hooks) are wrapped inside fail-fast circuit breakers. If 3 consecutive health probes time out, the circuit opens immediately and an automated PagerDuty alert is triggered.',
      lang: 'Monitoring & Alerting',
      code: `circuitBreaker.on('trip', async (incident) => {
  metrics.increment('upstream.gateway.tripped');
  await pagerDutyWebhook.dispatch({
    severity: 'HIGH',
    service: 'Payment_Gateway',
    reason: 'Consecutive probe timeouts > 3'
  });
});`
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.key;
      const info = data[key];
      if (!info) return;

      // Tab active styles
      tabs.forEach(t => {
        t.className = 'sys-tab p-4 rounded-xl border border-borderMuted bg-surface hover:border-borderHover text-left font-mono transition-all group cursor-pointer';
        const fBadge = t.querySelector('.text-\\[10px\\]');
        if (fBadge) fBadge.className = 'text-[10px] text-faint mb-1';
      });

      tab.className = 'sys-tab active p-4 rounded-xl border border-accent bg-accentSubtle text-left font-mono transition-all group cursor-pointer';
      const activeBadge = tab.querySelector('.text-\\[10px\\]');
      if (activeBadge) activeBadge.className = 'text-[10px] text-accent font-bold mb-1';

      // Update content
      badge.textContent = info.badge;
      title.textContent = info.title;
      desc.textContent = info.desc;
      lang.textContent = info.lang;
      code.querySelector('code').textContent = info.code;
    });
  });
})();

// ---------------------------------------------------------------------------
// 8. INTERACTIVE DEVELOPER TERMINAL / CLI (Ctrl+K)
// ---------------------------------------------------------------------------
(function initDeveloperConsole() {
  const drawer = document.getElementById('terminal-drawer');
  const btnToggle = document.getElementById('btn-terminal-toggle');
  const btnClose = document.getElementById('btn-close-terminal');
  const btnCloseText = document.getElementById('btn-close-terminal-text');
  const input = document.getElementById('terminal-input');
  const history = document.getElementById('terminal-history');
  const quickBtns = document.querySelectorAll('.term-quick-btn');

  if (!drawer || !input) return;

  function openTerminal() {
    drawer.classList.remove('hidden');
    setTimeout(() => input.focus(), 60);
  }

  function closeTerminal() {
    drawer.classList.add('hidden');
  }

  btnToggle.addEventListener('click', openTerminal);
  if (btnClose) btnClose.addEventListener('click', closeTerminal);
  if (btnCloseText) btnCloseText.addEventListener('click', closeTerminal);

  // Hotkey (Ctrl+K or Cmd+K) and Escape
  window.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (drawer.classList.contains('hidden')) {
        openTerminal();
      } else {
        closeTerminal();
      }
    }
    if (e.key === 'Escape' && !drawer.classList.contains('hidden')) {
      closeTerminal();
    }
  });

  function appendLine(html, isCommand = false) {
    const div = document.createElement('div');
    if (isCommand) {
      div.className = 'flex items-center gap-1.5 text-emerald-400 font-bold pt-1';
      div.innerHTML = `<span class="text-slate-500" > pranit@portfolio: ~$</span> <span>${html}</span>`;
    } else {
      div.className = 'text-slate-300 leading-relaxed pl-2';
      div.innerHTML = html;
    }
    history.appendChild(div);
    history.scrollTop = history.scrollHeight;
  }

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    appendLine(cmd, true);

    switch (cmd) {
      case 'help':
        appendLine(`
              <div class="space-y-1 text-slate-300" >
  <div class="text-emerald-400 font-bold">AVAILABLE COMMANDS:</div>
  <div><span class="text-white font-bold w-24 inline-block">skills</span> Display full engineering technical stack matrix</div>
  <div><span class="text-white font-bold w-24 inline-block">patterns</span> View practiced DSA pattern frequencies across 800+ problems</div>
  <div><span class="text-white font-bold w-24 inline-block">projects</span> List flagship architecture projects & repositories</div>
  <div><span class="text-white font-bold w-24 inline-block">resume</span> Open official in-browser PDF resume viewer</div>
  <div><span class="text-white font-bold w-24 inline-block">stats</span> View DSA problem-solving and academic benchmarks</div>
  <div><span class="text-white font-bold w-24 inline-block">contact</span> Print verified email & social channels</div>
  <div><span class="text-white font-bold w-24 inline-block">clear</span> Clear terminal buffer</div>
  <div><span class="text-white font-bold w-24 inline-block">exit</span> Close terminal drawer</div>
</div>
              `);
        break;

      case 'skills':
        appendLine(`
              <div class="space-y-1 text-slate-300 font-mono text-[10px]" >
  <div class="text-accent font-bold">PRANIT'S TECHNICAL STACK:</div>
  <div>• <span class="text-white font-bold">Languages:</span> C++, JavaScript, Java, Python, SQL</div>
  <div>• <span class="text-white font-bold">Backend & DB:</span> Node.js, Express.js, REST APIs, Mongoose, MongoDB, MySQL</div>
  <div>• <span class="text-white font-bold">Frontend:</span> HTML, CSS, EJS, Bootstrap, React</div>
  <div>• <span class="text-white font-bold">Tools & Fundamentals:</span> Docker, Git, GitHub, Postman, DSA, OOP, DBMS, OS, Networks</div>
</div>
              `);
        break;

      case 'patterns':
        appendLine(`
              <div class="space-y-1 text-slate-300 font-mono text-[10px]">
  <div class="text-accent font-bold">SELECTED DSA PATTERNS (800+ PRACTICED):</div>
  <div>• Hash Table: <span class="text-white font-bold">×96</span></div>
  <div>• Dynamic Programming: <span class="text-white font-bold">×83</span></div>
  <div>• Depth-First Search: <span class="text-white font-bold">×70</span></div>
  <div>• Tree: <span class="text-white font-bold">×60</span></div>
  <div>• Breadth-First Search: <span class="text-white font-bold">×56</span></div>
  <div>• Binary Search: <span class="text-white font-bold">×53</span></div>
  <div>• Greedy: <span class="text-white font-bold">×36</span></div>
  <div>• Backtracking: <span class="text-white font-bold">×24</span></div>
  <div>• Union-Find: <span class="text-white font-bold">×18</span></div>
  <div>• Monotonic Stack: <span class="text-white font-bold">×16</span></div>
</div>
              `);
        break;

      case 'projects':
        appendLine(`
              <div class="space-y-2 text-slate-300">
  <div>1. <a href="https://github.com/PranitBijave27/High-Concurrency-Ticket-Reservation-Engine" target="_blank" class="text-emerald-300 font-bold hover:underline">Ticket Reservation Engine ↗</a> <span class="text-slate-400 text-[10px]">(Node.js · MongoDB · Concurrency · React)</span></div>
     <div class="text-slate-400 pl-4">Atomic mutex locking, 0% double-booking, 5-min synchronized TTL sweep.</div>
  <div>2. <a href="https://github.com/PranitBijave27/API_Monitoring_System" target="_blank" class="text-emerald-300 font-bold hover:underline">API Dependency &amp; Incident Platform ↗</a> <span class="text-slate-400 text-[10px]">(PostgreSQL · Row-Locks · node-cron)</span></div>
     <div class="text-slate-400 pl-4">Multi-level health monitors, 3/3 consecutive threshold, circuit breaker.</div>
  <div>3. <a href="https://github.com/PranitBijave27/Nestify-Full-Stack-Rental-Booking-System" target="_blank" class="text-emerald-300 font-bold hover:underline">Nestify Property Platform ↗</a> <span class="text-slate-400 text-[10px]">(Node.js · MongoDB · Cloudinary · EJS)</span></div>
     <div class="text-slate-400 pl-4">Normalized 1:N relations, 32ms query projections, server ownership guards.</div>
  <div class="text-emerald-400 pt-1">GitHub Profile: <a href="https://github.com/PranitBijave27" target="_blank" class="underline text-white">github.com/PranitBijave27 ↗</a></div>
</div>
              `);
        break;

      case 'resume':
        appendLine('<span class="text-emerald-400 font-bold">[200 OK]</span> Opening resume viewer: <a href="resume.html" class="text-accent underline font-bold">Open Resume Viewer →</a>');
        window.location.href = 'resume.html';
        break;

      case 'stats':
        appendLine(`
              <div class="space-y-1 text-slate-300" >
  <div class="text-accent font-bold">ENGINEERING BENCHMARKS:</div>
  <div>• <span class="text-white font-bold">DSA Solved in C++:</span> 800+ Problems</div>
  <div>  ├─ LeetCode: 500+</div>
  <div>  ├─ GeeksforGeeks: 140+</div>
  <div>  └─ Coding Ninjas: 200+</div>
  <div>• <span class="text-white font-bold">Academic Merit:</span> 8.76 / 10 CGPA (B.E. IT @ SSGMCE)</div>
  <div>• <span class="text-white font-bold">ACM Chapter:</span> AI/ML Workshop Lead (100+ Participants)</div>
</div>
              `);
        break;

      case 'contact':
        appendLine(`
              <div class="space-y-1 text-slate-300" >
  <div>• <span class="text-white font-bold">Email:</span> <a href="mailto:bijwepranit@gmail.com" class="text-accent underline">bijwepranit@gmail.com</a></div>
  <div>• <span class="text-white font-bold">GitHub:</span> <a href="https://github.com/PranitBijave27" target="_blank" class="text-accent underline">github.com/PranitBijave27</a></div>
  <div>• <span class="text-white font-bold">LinkedIn:</span> <a href="https://linkedin.com/in/pranitbijave" target="_blank" class="text-accent underline">linkedin.com/in/pranitbijave</a></div>
  <div>• <span class="text-white font-bold">Location:</span> Shegaon, Maharashtra, India</div>
</div>
              `);
        break;

      case 'clear':
        history.innerHTML = '';
        break;

      case 'exit':
        closeTerminal();
        break;

      default:
        appendLine(`<span class="text-amber-400" > Command not recognized: '${rawCmd}'.</span> Type <span class="text-emerald-400 font-bold" > help</span> to see valid commands.`);
    }
  }

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const val = input.value;
      input.value = '';
      executeCommand(val);
    }
  });

  quickBtns.forEach(b => {
    b.addEventListener('click', () => {
      const cmd = b.dataset.cmd;
      executeCommand(cmd);
      input.focus();
    });
  });
})();

// ---------------------------------------------------------------------------
// SCATTERED INTERACTIVE SUITE: CANVAS LIGHT GRID, HUD, SFX & TOAST
// ---------------------------------------------------------------------------
(function initScatteredInteractivity() {
  // 1. Ambient Dynamic Light-Grid Canvas
  const canvas = document.getElementById('ambient-grid-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let mouseX = -1000;
    let mouseY = -1000;
    const GRID_SPACING = 36;
    const RADIUS = 130;
    const ripples = [];

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Click ripple wave
    window.addEventListener('click', (e) => {
      // Do not ripple on terminal input
      if (e.target.closest('#terminal-drawer')) return;
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 180,
        alpha: 0.35
      });
    });

    function drawGrid() {
      ctx.clearRect(0, 0, width, height);

      // Render active click ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 4;
        r.alpha *= 0.94;

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 102, 255, ${r.alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        if (r.alpha < 0.01 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // Render subtle illuminated grid dots near mouse
      if (mouseX > -500) {
        const startX = Math.floor((mouseX - RADIUS) / GRID_SPACING) * GRID_SPACING;
        const endX = Math.ceil((mouseX + RADIUS) / GRID_SPACING) * GRID_SPACING;
        const startY = Math.floor((mouseY - RADIUS) / GRID_SPACING) * GRID_SPACING;
        const endY = Math.ceil((mouseY + RADIUS) / GRID_SPACING) * GRID_SPACING;

        for (let x = startX; x <= endX; x += GRID_SPACING) {
          for (let y = startY; y <= endY; y += GRID_SPACING) {
            if (x < 0 || x > width || y < 0 || y > height) continue;

            const dx = x - mouseX;
            const dy = y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < RADIUS) {
              const factor = 1 - dist / RADIUS;
              const alpha = factor * 0.45;

              ctx.beginPath();
              ctx.arc(x, y, 1.4, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(0, 102, 255, ${alpha})`;
              ctx.fill();

              // Subtle connecting rays to cursor
              if (dist < RADIUS * 0.6) {
                ctx.beginPath();
                ctx.moveTo(mouseX, mouseY);
                ctx.lineTo(x, y);
                ctx.strokeStyle = `rgba(0, 102, 255, ${factor * 0.08})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
              }
            }
          }
        }
      }

      requestAnimationFrame(drawGrid);
    }

    requestAnimationFrame(drawGrid);
  }

  // 2. Bottom-Left Telemetry HUD Tracking
  const hudCoords = document.getElementById('hud-coords');
  const hudScroll = document.getElementById('hud-scroll');
  const hudPill = document.getElementById('hud-telemetry');

  if (hudCoords && hudScroll) {
    window.addEventListener('mousemove', (e) => {
      hudCoords.textContent = `X:${String(e.clientX).padStart(3, '0')} Y:${String(e.clientY).padStart(3, '0')}`;
    });

    window.addEventListener('scroll', () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = totalHeight > 0 ? Math.round((window.scrollY / totalHeight) * 100) : 0;
      hudScroll.textContent = `${pct}%`;
    });

    if (hudPill) {
      hudPill.addEventListener('click', () => {
        showToast('SYSTEM_DIAGNOSTIC', 'Node runtime: healthy · WiredTiger storage ready · Memory isolation serializable.');
        playHapticClick();
      });
    }
  }

  // 3. Web Audio API Mechanical Keyboard Switch Synthesizer
  let audioCtx = null;
  let sfxEnabled = false;
  const btnAudio = document.getElementById('btn-audio-toggle');
  const audioIcon = document.getElementById('audio-icon');
  const audioLabel = document.getElementById('audio-label');

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playHapticClick() {
    if (!sfxEnabled || !audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.09, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.036);
    } catch (e) { }
  }

  if (btnAudio) {
    btnAudio.addEventListener('click', () => {
      initAudio();
      sfxEnabled = !sfxEnabled;

      if (sfxEnabled) {
        audioIcon.textContent = 'volume_up';
        audioIcon.className = 'material-symbols-outlined text-[15px] text-accent';
        audioLabel.textContent = 'SFX: ON';
        btnAudio.classList.add('border-accent', 'text-ink');
        playHapticClick();
        showToast('AUDIO_HAPTICS_ENABLED', 'Mechanical switch acoustic feedback enabled for clicks & terminal.');
      } else {
        audioIcon.textContent = 'volume_off';
        audioIcon.className = 'material-symbols-outlined text-[15px] text-muted';
        audioLabel.textContent = 'SFX: OFF';
        btnAudio.classList.remove('border-accent', 'text-ink');
      }
    });
  }

  // Attach audio click to all buttons and links
  document.addEventListener('click', (e) => {
    if (sfxEnabled && (e.target.closest('button') || e.target.closest('a'))) {
      playHapticClick();
    }
  });

  // 4. Right-Side Minimap Scroll Spy
  const minimapItems = document.querySelectorAll('.minimap-rail-item');
  if (minimapItems.length) {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          minimapItems.forEach(item => {
            if (item.dataset.target === id) {
              item.classList.add('active');
            } else {
              item.classList.remove('active');
            }
          });
        }
      });
    }, { threshold: 0.25 });

    sections.forEach(s => observer.observe(s));
  }

  // 5. Interactive Toast & Scattered Chip Notifications
  const toastEl = document.getElementById('interactive-toast');
  const toastTitle = document.getElementById('toast-title');
  const toastBody = document.getElementById('toast-body');
  let toastTimer = null;

  function showToast(title, message) {
    if (!toastEl) return;
    toastTitle.innerHTML = `<span class="material-symbols-outlined text-[14px]">terminal</span><span>${title}</span>`;
    toastBody.textContent = message;

    toastEl.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-2');
    toastEl.classList.add('opacity-100', 'translate-y-0');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('opacity-100', 'translate-y-0');
      toastEl.classList.add('opacity-0', 'pointer-events-none', 'translate-y-2');
    }, 3600);
  }

  const chips = document.querySelectorAll('.easter-chip');
  const chipData = {
    dsa: {
      title: 'DSA_ENGINE_BENCHMARK',
      msg: '800+ solved problems across LeetCode, GfG, and Coding Ninjas in modern C++ with optimal time/space complexity.'
    },
    mutex: {
      title: 'CONCURRENCY_MUTEX_VERIFIED',
      msg: 'Compound unique index { showId: 1, seatNo: 1 } guarantees mathematical 0% double-booking probability at WiredTiger storage level.'
    },

    acm: {
      title: 'ACM_WORKSHOP_LEADERSHIP',
      msg: 'Organized and facilitated a hands-on AI/ML workshop for 100+ participants as part of the SSGMCE ACM Student Chapter.'
    }
  };

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const type = chip.dataset.chip;
      const info = chipData[type];
      if (info) {
        showToast(info.title, info.msg);
      }
      playHapticClick();
    });
  });
})();

// ---------------------------------------------------------------------------
// 9. INTERACTIVE CODE SNIPPET COPY BUTTONS
// ---------------------------------------------------------------------------
(function initCodeSnippetCopy() {
  const codeBlocks = document.querySelectorAll('pre');
  codeBlocks.forEach(block => {
    if (block.closest('#terminal-drawer') || block.id === 'api-request-body' || block.id === 'api-response-body') return;

    block.classList.add('relative', 'group');
    const btn = document.createElement('button');
    btn.className = 'absolute top-2 right-2 px-2 py-0.5 rounded bg-surface border border-borderMuted text-muted hover:text-ink text-[10px] font-mono shadow-subtle opacity-70 group-hover:opacity-100 transition-opacity cursor-pointer';
    btn.textContent = 'Copy';

    btn.addEventListener('click', () => {
      const text = block.querySelector('code')?.textContent || block.textContent;
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = 'Copied!';
        btn.classList.add('text-emerald-600', 'font-bold');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('text-emerald-600', 'font-bold');
        }, 2000);
      });
    });

    block.appendChild(btn);
  });
})();

(function initPatternConstellation() {
  const container = document.getElementById('constellation-container');
  const svg = document.getElementById('constellation-svg');
  if (!container || !svg) return;

  const nodes = svg.querySelectorAll('.constellation-node');
  const edges = svg.querySelectorAll('.constellation-edge');
  const infoTitle = document.getElementById('info-pattern-title');
  const infoCount = document.getElementById('info-pattern-count');
  const infoDesc = document.getElementById('info-pattern-desc');
  const infoRelWrapper = document.getElementById('info-relationships-wrapper');
  const infoRelList = document.getElementById('info-relationships-list');
  const btnClear = document.getElementById('btn-constellation-clear');

  const patternData = {
    'hash-table': {
      id: 'hash-table',
      name: 'Hash Table',
      title: 'HASH TABLE',
      count: '96 problems',
      desc: 'Frequently practiced',
      relations: []
    },
    'dp': {
      id: 'dp',
      name: 'Dynamic Programming',
      title: 'DYNAMIC PROGRAMMING',
      count: '83 problems',
      desc: 'Frequently practiced',
      relations: ['backtracking', 'greedy']
    },
    'dfs': {
      id: 'dfs',
      name: 'Depth-First Search',
      title: 'DEPTH-FIRST SEARCH',
      count: '70 problems',
      desc: 'Frequently practiced',
      relations: ['tree', 'bfs', 'backtracking', 'union-find']
    },
    'tree': {
      id: 'tree',
      name: 'Tree',
      title: 'TREE',
      count: '60 problems',
      desc: 'Frequently practiced',
      relations: ['dfs', 'bfs']
    },
    'bfs': {
      id: 'bfs',
      name: 'Breadth-First Search',
      title: 'BREADTH-FIRST SEARCH',
      count: '56 problems',
      desc: 'Frequently practiced',
      relations: ['dfs', 'tree']
    },
    'binary-search': {
      id: 'binary-search',
      name: 'Binary Search',
      title: 'BINARY SEARCH',
      count: '53 problems',
      desc: 'Frequently practiced',
      relations: ['greedy', 'monotonic-stack']
    },
    'greedy': {
      id: 'greedy',
      name: 'Greedy',
      title: 'GREEDY',
      count: '36 problems',
      desc: 'Frequently practiced',
      relations: ['binary-search', 'dp']
    },
    'backtracking': {
      id: 'backtracking',
      name: 'Backtracking',
      title: 'BACKTRACKING',
      count: '24 problems',
      desc: 'Frequently practiced',
      relations: ['dp', 'dfs']
    },
    'union-find': {
      id: 'union-find',
      name: 'Union-Find',
      title: 'UNION-FIND',
      count: '18 problems',
      desc: 'Frequently practiced',
      relations: ['dfs']
    },
    'monotonic-stack': {
      id: 'monotonic-stack',
      name: 'Monotonic Stack',
      title: 'MONOTONIC STACK',
      count: '16 problems',
      desc: 'Frequently practiced',
      relations: ['binary-search']
    }
  };

  let activeId = null;

  function isConnected(nodeA, nodeB) {
    if (nodeA === nodeB) return true;
    for (const edge of edges) {
      const from = edge.dataset.from;
      const to = edge.dataset.to;
      if ((from === nodeA && to === nodeB) || (from === nodeB && to === nodeA)) {
        return true;
      }
    }
    return false;
  }

  function applyHighlight(targetId) {
    edges.forEach(edge => {
      const from = edge.dataset.from;
      const to = edge.dataset.to;
      if (from === targetId || to === targetId) {
        edge.classList.add('edge-active');
        edge.classList.remove('edge-dimmed');
      } else {
        edge.classList.add('edge-dimmed');
        edge.classList.remove('edge-active');
      }
    });

    nodes.forEach(node => {
      const id = node.dataset.id;
      if (id === targetId) {
        node.classList.add('is-active');
        node.classList.remove('node-dimmed');
      } else if (isConnected(targetId, id)) {
        node.classList.remove('is-active', 'node-dimmed');
      } else {
        node.classList.remove('is-active');
        node.classList.add('node-dimmed');
      }
    });
  }

  function clearAllHighlights() {
    edges.forEach(edge => {
      edge.classList.remove('edge-active', 'edge-dimmed');
    });
    nodes.forEach(node => {
      node.classList.remove('is-active', 'node-dimmed');
    });
  }

  function updateInfoPanel(id) {
    const data = patternData[id];
    if (!data) return;

    if (infoTitle) infoTitle.textContent = data.title;
    if (infoCount) infoCount.textContent = data.count;
    if (infoDesc) infoDesc.textContent = data.desc;

    if (infoRelWrapper && infoRelList) {
      infoRelList.innerHTML = '';
      if (data.relations && data.relations.length > 0) {
        infoRelWrapper.classList.remove('hidden');
        data.relations.forEach(relId => {
          const relData = patternData[relId];
          if (!relData) return;
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = 'px-2 py-0.5 rounded bg-slate-100 hover:bg-accent hover:text-white text-ink border border-slate-200 font-mono text-[10px] transition-colors cursor-pointer';
          chip.textContent = `${relData.name} (${relData.count.replace(' problems', '')})`;
          chip.title = `Inspect ${relData.name}`;
          chip.addEventListener('click', (e) => {
            e.stopPropagation();
            selectNode(relId);
          });
          infoRelList.appendChild(chip);
        });
      } else {
        infoRelWrapper.classList.remove('hidden');
        const span = document.createElement('span');
        span.className = 'text-faint text-[10px] italic';
        span.textContent = 'Independent core data structure';
        infoRelList.appendChild(span);
      }
    }

    if (btnClear) btnClear.classList.remove('hidden');
  }

  function resetInfoPanel() {
    if (infoTitle) infoTitle.textContent = 'SELECT A PATTERN';
    if (infoCount) infoCount.textContent = '10 Core Patterns Practiced';
    if (infoDesc) infoDesc.textContent = 'Click or tap any node in the constellation to trace problem-solving relationships.';
    if (infoRelWrapper) infoRelWrapper.classList.add('hidden');
    if (infoRelList) infoRelList.innerHTML = '';
    if (btnClear) btnClear.classList.add('hidden');
  }

  function selectNode(id) {
    if (activeId === id) {
      deselect();
      return;
    }
    activeId = id;
    applyHighlight(id);
    updateInfoPanel(id);
  }

  function deselect() {
    activeId = null;
    clearAllHighlights();
    resetInfoPanel();
  }

  nodes.forEach(node => {
    const id = node.dataset.id;

    node.addEventListener('mouseenter', () => {
      if (!activeId) {
        applyHighlight(id);
      }
    });

    node.addEventListener('mouseleave', () => {
      if (!activeId) {
        clearAllHighlights();
      } else {
        applyHighlight(activeId);
      }
    });

    node.addEventListener('focus', () => {
      if (!activeId) {
        applyHighlight(id);
      }
    });

    node.addEventListener('blur', () => {
      if (!activeId) {
        clearAllHighlights();
      }
    });

    node.addEventListener('click', (e) => {
      e.stopPropagation();
      selectNode(id);
    });

    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectNode(id);
      }
    });
  });

  if (btnClear) {
    btnClear.addEventListener('click', (e) => {
      e.stopPropagation();
      deselect();
    });
  }

  svg.addEventListener('click', (e) => {
    if (!e.target.closest('.constellation-node')) {
      deselect();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeId) {
      deselect();
    }
  });

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced && 'IntersectionObserver' in window) {
    container.classList.add('constellation-entering');

    nodes.forEach((node, i) => {
      node.style.transitionDelay = `${i * 35}ms`;
    });
    edges.forEach(edge => {
      edge.style.transitionDelay = '240ms';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          container.classList.remove('constellation-entering');
          container.classList.add('constellation-settled');
          setTimeout(() => {
            nodes.forEach(node => {
              node.style.transitionDelay = '';
            });
            edges.forEach(edge => {
              edge.style.transitionDelay = '';
            });
          }, 800);
          observer.disconnect();
        }
      });
    }, { threshold: 0.15 });

    observer.observe(container);
  } else {
    container.classList.add('constellation-settled');
  }
})();

(function initMobileNavigation() {
  const toggleBtn = document.getElementById('btn-mobile-menu-toggle');
  const menu = document.getElementById('mobile-nav-menu');
  const menuIcon = document.getElementById('mobile-menu-icon');
  if (!toggleBtn || !menu) return;

  function openMenu() {
    menu.classList.remove('hidden');
    if (menuIcon) menuIcon.textContent = 'close';
    toggleBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    menu.classList.add('hidden');
    if (menuIcon) menuIcon.textContent = 'menu';
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (menu.classList.contains('hidden')) {
      openMenu();
    } else {
      closeMenu();
    }
  });

  const links = menu.querySelectorAll('.mobile-nav-link, a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggleBtn.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && !menu.classList.contains('hidden')) {
      closeMenu();
    }
  });
})();

