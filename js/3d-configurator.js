/* ==========================================================================
   RAW STUDIOS — THREE.JS INTERACTIVE 3D VEHICLE CONFIGURATOR
   Real-time WebGL Automotive Studio Renderer & Material Shader Engine
   ========================================================================== */

let scene, camera, renderer, currentCarMesh, floorMesh;
let carBodyMaterial, glassMaterial, wheelMaterials = [];
let ppfShieldMesh, studioLights = [];
let isOrbiting = false, targetRotationY = 0, currentRotationY = 0;
let mouseX = 0, mouseY = 0, isMouseDown = false;

// Config state reference
const carConfigs = {
  Sedan: { scale: [1, 1, 1], height: 0.8 },
  SUV: { scale: [1.15, 1.2, 1.1], height: 1.1 },
  Luxury: { scale: [1.2, 0.9, 1.15], height: 0.85 },
  Sports: { scale: [1.05, 0.75, 1.05], height: 0.65 }
};

const finishMaterialProps = {
  original: { roughness: 0.18, metalness: 0.85, clearcoat: 0.3, clearcoatRoughness: 0.2 },
  gloss_ppf: { roughness: 0.04, metalness: 0.90, clearcoat: 1.0, clearcoatRoughness: 0.02 },
  matte_ppf: { roughness: 0.65, metalness: 0.30, clearcoat: 0.0, clearcoatRoughness: 1.0 },
  satin_ppf: { roughness: 0.38, metalness: 0.50, clearcoat: 0.2, clearcoatRoughness: 0.4 },
  ceramic_ppf: { roughness: 0.01, metalness: 0.95, clearcoat: 1.0, clearcoatRoughness: 0.005 }
};

function init3DConfigurator() {
  const container = document.getElementById('canvas3d');
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  // Scene Setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222938);
  scene.fog = new THREE.FogExp2(0x222938, 0.035);

  // Camera Setup
  camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.set(4.5, 2.0, 5.5);
  camera.lookAt(0, 0.6, 0);

  // Renderer Setup
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.32;

  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  // Environment & Studio Lighting
  setupStudioLighting();
  createReflectiveStudioFloor();

  // Initial Vehicle Mesh
  buildVehicleGeometry('Sedan', 0x1a2234, 'gloss_ppf');

  // Mouse & Touch Controls
  setupInteractiveControls(container);

  // Resize Handler
  window.addEventListener('resize', onWindowResize);

  // Animation Loop
  animate();
}

function setupStudioLighting() {
  // Ambient Soft Light
  const ambient = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambient);

  // Top Golden Studio Light
  const topGoldLight = new THREE.SpotLight(0xd4af37, 4.5, 18, Math.PI / 4, 0.5, 1);
  topGoldLight.position.set(0, 7, 0);
  topGoldLight.castShadow = true;
  topGoldLight.shadow.mapSize.width = 2048;
  topGoldLight.shadow.mapSize.height = 2048;
  scene.add(topGoldLight);
  studioLights.push(topGoldLight);

  // Front Key Light
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
  keyLight.position.set(5, 6, 5);
  scene.add(keyLight);

  // Cool Rim Blue Light
  const rimLight = new THREE.DirectionalLight(0x94a3b8, 2.2);
  rimLight.position.set(-5, 4, -5);
  scene.add(rimLight);

  // Side Golden Fill
  const fillLight = new THREE.DirectionalLight(0xd4af37, 1.4);
  fillLight.position.set(-4, 2, 4);
  scene.add(fillLight);
}

function createReflectiveStudioFloor() {
  const floorGeo = new THREE.PlaneGeometry(30, 30);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x2a3346,
    roughness: 0.14,
    metalness: 0.75,
  });
  floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  // Studio Grid Lines Accent
  const gridHelper = new THREE.GridHelper(20, 20, 0xd4af37, 0x3d4b66);
  gridHelper.position.y = 0.01;
  scene.add(gridHelper);
}

function buildVehicleGeometry(category = 'Sedan', colorHex = 0x111622, finishType = 'gloss_ppf') {
  if (currentCarMesh) scene.remove(currentCarMesh);

  currentCarMesh = new THREE.Group();

  const cfg = carConfigs[category] || carConfigs.Sedan;
  const finishProps = finishMaterialProps[finishType] || finishMaterialProps.gloss_ppf;

  // Premium Paint Material
  carBodyMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(colorHex),
    metalness: finishProps.metalness,
    roughness: finishProps.roughness,
    clearcoat: finishProps.clearcoat,
    clearcoatRoughness: finishProps.clearcoatRoughness,
    reflectivity: 0.9
  });

  // Glass Material
  glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x050a12,
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.85,
    opacity: 1.0,
    transparent: true
  });

  // Metallic Rim Material
  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xd0d8e2,
    metalness: 0.95,
    roughness: 0.1
  });

  // Rubber Tire Material
  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x151518,
    metalness: 0.1,
    roughness: 0.85
  });

  // --- CAR MAIN BODY CHASSIS ---
  const bodyGeo = new THREE.BoxGeometry(2.1 * cfg.scale[0], 0.7 * cfg.scale[1], 4.2 * cfg.scale[2]);
  const bodyMesh = new THREE.Mesh(bodyGeo, carBodyMaterial);
  bodyMesh.position.y = 0.5 * cfg.scale[1];
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  currentCarMesh.add(bodyMesh);

  // --- CAR CABIN / ROOF ---
  const cabinGeo = new THREE.BoxGeometry(1.8 * cfg.scale[0], 0.6 * cfg.scale[1], 2.2 * cfg.scale[2]);
  const cabinMesh = new THREE.Mesh(cabinGeo, carBodyMaterial);
  cabinMesh.position.set(0, 1.05 * cfg.scale[1], -0.2 * cfg.scale[2]);
  cabinMesh.castShadow = true;
  currentCarMesh.add(cabinMesh);

  // Windshield & Windows
  const glassGeo = new THREE.BoxGeometry(1.76 * cfg.scale[0], 0.52 * cfg.scale[1], 2.1 * cfg.scale[2]);
  const glassMesh = new THREE.Mesh(glassGeo, glassMaterial);
  glassMesh.position.set(0, 1.06 * cfg.scale[1], -0.2 * cfg.scale[2]);
  currentCarMesh.add(glassMesh);

  // Hood Aerodynamic Curve
  const hoodGeo = new THREE.BoxGeometry(1.9 * cfg.scale[0], 0.15 * cfg.scale[1], 1.2 * cfg.scale[2]);
  const hoodMesh = new THREE.Mesh(hoodGeo, carBodyMaterial);
  hoodMesh.position.set(0, 0.8 * cfg.scale[1], 1.2 * cfg.scale[2]);
  hoodMesh.rotation.x = 0.08;
  hoodMesh.castShadow = true;
  currentCarMesh.add(hoodMesh);

  // Front Grille
  const grilleGeo = new THREE.BoxGeometry(1.5 * cfg.scale[0], 0.35 * cfg.scale[1], 0.1);
  const grilleMat = new THREE.MeshStandardMaterial({ color: 0x0a0c10, metalness: 0.9, roughness: 0.2 });
  const grilleMesh = new THREE.Mesh(grilleGeo, grilleMat);
  grilleMesh.position.set(0, 0.5 * cfg.scale[1], 2.12 * cfg.scale[2]);
  currentCarMesh.add(grilleMesh);

  // Headlights
  const lightGeo = new THREE.BoxGeometry(0.4 * cfg.scale[0], 0.15, 0.1);
  const lightMat = new THREE.MeshBasicMaterial({ color: 0xeef4ff });
  const lightL = new THREE.Mesh(lightGeo, lightMat);
  lightL.position.set(0.75 * cfg.scale[0], 0.55 * cfg.scale[1], 2.13 * cfg.scale[2]);
  const lightR = lightL.clone();
  lightR.position.x = -0.75 * cfg.scale[0];
  currentCarMesh.add(lightL);
  currentCarMesh.add(lightR);

  // --- WHEELS (4 Corner Rims & Tires) ---
  const wheelRadius = 0.42 * (category === 'SUV' ? 1.2 : 1.0);
  const wheelThickness = 0.25;
  const wheelPositions = [
    [1.05 * cfg.scale[0], wheelRadius, 1.3 * cfg.scale[2]],
    [-1.05 * cfg.scale[0], wheelRadius, 1.3 * cfg.scale[2]],
    [1.05 * cfg.scale[0], wheelRadius, -1.3 * cfg.scale[2]],
    [-1.05 * cfg.scale[0], wheelRadius, -1.3 * cfg.scale[2]],
  ];

  wheelPositions.forEach(pos => {
    const wheelGroup = new THREE.Group();

    // Tire Outer
    const tireGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelThickness, 32);
    const tire = new THREE.Mesh(tireGeo, tireMat);
    tire.rotation.z = Math.PI / 2;
    tire.castShadow = true;
    wheelGroup.add(tire);

    // Rim Inner
    const rimGeo = new THREE.CylinderGeometry(wheelRadius * 0.7, wheelRadius * 0.7, wheelThickness + 0.02, 16);
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.z = Math.PI / 2;
    wheelGroup.add(rim);

    // Gold Brake Caliper Accent
    const caliperGeo = new THREE.BoxGeometry(0.1, 0.22, 0.22);
    const caliperMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.2 });
    const caliper = new THREE.Mesh(caliperGeo, caliperMat);
    caliper.position.set(0, 0.1, 0);
    wheelGroup.add(caliper);

    wheelGroup.position.set(...pos);
    currentCarMesh.add(wheelGroup);
  });

  // Holographic PPF Shield Overlay
  createPPFHologramShield();

  scene.add(currentCarMesh);
}

function createPPFHologramShield() {
  if (ppfShieldMesh) scene.remove(ppfShieldMesh);

  const shieldGeo = new THREE.BoxGeometry(2.18, 1.3, 4.3);
  const shieldMat = new THREE.MeshBasicMaterial({
    color: 0xd4af37,
    wireframe: true,
    transparent: true,
    opacity: 0.0 // hidden by default, animated when PPF selected
  });
  ppfShieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
  ppfShieldMesh.position.y = 0.65;
  scene.add(ppfShieldMesh);
}

function setVehicleColor(hexColor) {
  if (carBodyMaterial) {
    carBodyMaterial.color.setHex(hexColor);
  }
}

function setVehicleFinish(finishType) {
  const props = finishMaterialProps[finishType] || finishMaterialProps.gloss_ppf;
  if (carBodyMaterial) {
    carBodyMaterial.roughness = props.roughness;
    carBodyMaterial.metalness = props.metalness;
    carBodyMaterial.clearcoat = props.clearcoat;
    carBodyMaterial.clearcoatRoughness = props.clearcoatRoughness;
    carBodyMaterial.needsUpdate = true;
  }

  // Animate Holographic PPF Pulse
  if (ppfShieldMesh) {
    ppfShieldMesh.material.opacity = 0.35;
    setTimeout(() => {
      ppfShieldMesh.material.opacity = 0.0;
    }, 1200);
  }
}

function setCeramicGlossBoost(glossPercent) {
  if (carBodyMaterial) {
    const boost = glossPercent / 100;
    carBodyMaterial.clearcoat = 0.5 + (boost * 0.5);
    carBodyMaterial.clearcoatRoughness = Math.max(0.001, 0.2 * (1 - boost));
    carBodyMaterial.needsUpdate = true;
  }
}

function setPaintCorrectionMode(isSwirled) {
  if (carBodyMaterial) {
    if (isSwirled) {
      carBodyMaterial.roughness = 0.45;
      carBodyMaterial.clearcoat = 0.1;
    } else {
      carBodyMaterial.roughness = 0.02;
      carBodyMaterial.clearcoat = 1.0;
    }
    carBodyMaterial.needsUpdate = true;
  }
}

function setCameraPresetView(viewName) {
  if (!camera) return;

  let targetPos = [4.5, 2.0, 5.5];
  let targetLookAt = [0, 0.6, 0];

  switch(viewName) {
    case 'front':
      targetPos = [0, 1.2, 5.0];
      break;
    case 'side':
      targetPos = [5.5, 1.2, 0];
      break;
    case 'rear':
      targetPos = [0, 1.5, -5.2];
      break;
    case 'wheel':
      targetPos = [2.2, 0.8, 1.8];
      targetLookAt = [1.05, 0.4, 1.3];
      break;
    case '3d':
    default:
      targetPos = [4.5, 2.0, 5.5];
      break;
  }

  // Smooth Interpolation
  const duration = 600;
  const startPos = camera.position.clone();
  const startTime = performance.now();

  function animateCam(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1.0);
    const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic

    camera.position.x = startPos.x + (targetPos[0] - startPos.x) * ease;
    camera.position.y = startPos.y + (targetPos[1] - startPos.y) * ease;
    camera.position.z = startPos.z + (targetPos[2] - startPos.z) * ease;
    camera.lookAt(...targetLookAt);

    if (progress < 1.0) {
      requestAnimationFrame(animateCam);
    }
  }

  requestAnimationFrame(animateCam);
}

function setupInteractiveControls(container) {
  container.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    mouseX = e.clientX;
  });

  window.addEventListener('mouseup', () => {
    isMouseDown = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isMouseDown || !currentCarMesh) return;
    const deltaX = e.clientX - mouseX;
    targetRotationY += deltaX * 0.008;
    mouseX = e.clientX;
  });

  // Touch Support
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isMouseDown = true;
      mouseX = e.touches[0].clientX;
    }
  });

  window.addEventListener('touchend', () => {
    isMouseDown = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isMouseDown || !currentCarMesh || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - mouseX;
    targetRotationY += deltaX * 0.008;
    mouseX = e.touches[0].clientX;
  });
}

function onWindowResize() {
  const container = document.getElementById('canvas3d');
  if (!container || !renderer || !camera) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
}

function animate() {
  requestAnimationFrame(animate);

  if (currentCarMesh) {
    // Smooth rotation damping
    currentRotationY += (targetRotationY - currentRotationY) * 0.1;
    currentCarMesh.rotation.y = currentRotationY;

    // Slow ambient rotation when idle
    if (!isMouseDown) {
      targetRotationY += 0.002;
    }
  }

  renderer.render(scene, camera);
}

// Global Exports
window.init3DConfigurator = init3DConfigurator;
window.buildVehicleGeometry = buildVehicleGeometry;
window.setVehicleColor = setVehicleColor;
window.setVehicleFinish = setVehicleFinish;
window.setCeramicGlossBoost = setCeramicGlossBoost;
window.setPaintCorrectionMode = setPaintCorrectionMode;
window.setCameraPresetView = setCameraPresetView;
