let scene, camera, renderer, controls, bookGroup;

function init3D() {
  const container = document.getElementById('webgl-container');
  
  // إعداد المشهد ولون الطاولة الخشبية
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x7c6e59);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 12, 14);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // إضاءة المشهد
  const light = new THREE.DirectionalLight(0xffffff, 1.2);
  light.position.set(5, 15, 8);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));

  // مجسم الكتاب المفتوح
  bookGroup = new THREE.Group();

  // الغلاف الأصفر
  const cover = new THREE.Mesh(
    new THREE.BoxGeometry(14.4, 0.2, 9.4),
    new THREE.MeshStandardMaterial({ color: 0xeab308 })
  );
  cover.position.y = -0.1;
  bookGroup.add(cover);

  // الصفحات البيضاء
  const pageMat = new THREE.MeshStandardMaterial({ color: 0xfefcf0 });
  const leftPage = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.3, 9), pageMat);
  leftPage.position.set(-3.5, 0.1, 0);
  bookGroup.add(leftPage);

  const rightPage = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.3, 9), pageMat);
  rightPage.position.set(3.5, 0.1, 0);
  bookGroup.add(rightPage);

  // المكعبات التفاعلية على الصفحة اليمنى
  const track = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.1, 1), new THREE.MeshStandardMaterial({ color: 0xd4d4d8 }));
  track.position.set(3.5, 0.3, 0);
  bookGroup.add(track);

  const blueBox = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), new THREE.MeshStandardMaterial({ color: 0x3b82f6 }));
  blueBox.position.set(2, 0.7, 0);
  bookGroup.add(blueBox);

  const redBox = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
  redBox.position.set(4, 0.7, 0);
  bookGroup.add(redBox);

  // زاوية ميل الكتاب
  bookGroup.rotation.y = -Math.PI / 12;
  scene.add(bookGroup);

  window.addEventListener('resize', onWindowResize);
  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

window.onload = init3D;
