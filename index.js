let scene, camera, renderer, controls, bookGroup;

// بيانات الدروس التفاعلية
const lessonsData = [
  {
    lesson_id: "٦-١",
    title: "القدرة والكفاءة",
    concept: "القدرة هي معدل بذل الشغل أو تحويل الطاقة، بينما تعبر الكفاءة عن نسبة الطاقة الناتجة المفيدة إلى الطاقة الكلية المضافة.",
    formula: "P = W / t",
    quiz: {
      question: "إذا زادت الطاقة المستهلكة لجهاز مع ثبات الشغل الناتج، فماذا يحدث لكفاءته؟",
      options: ["تزداد كفاءة الجهاز.", "تقل كفاءة الجهاز."],
      correct: 1
    },
    flap: "التفسير العلمي: الكفاءة تعتمد عكسياً على الطاقة المفقودة، وكلما زادت الطاقة المستهلكة بدون زيادة في الناتج المفيد انخفضت الكفاءة."
  }
];

let currentSpreadIndex = 0;
let quizAnswered = false;

function init3D() {
  const container = document.getElementById('webgl-container');
  
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x7c6e59);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 12, 14);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const light = new THREE.DirectionalLight(0xffffff, 1.2);
  light.position.set(5, 15, 8);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));

  // مجسم الكتاب
  bookGroup = new THREE.Group();
  const cover = new THREE.Mesh(
    new THREE.BoxGeometry(14.4, 0.2, 9.4),
    new THREE.MeshStandardMaterial({ color: 0xeab308 })
  );
  cover.position.y = -0.1;
  bookGroup.add(cover);

  const pageMat = new THREE.MeshStandardMaterial({ color: 0xfefcf0 });
  const leftPage = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.3, 9), pageMat);
  leftPage.position.set(-3.5, 0.1, 0);
  bookGroup.add(leftPage);

  const rightPage = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.3, 9), pageMat);
  rightPage.position.set(3.5, 0.1, 0);
  bookGroup.add(rightPage);

  // المكعبات التفاعلية
  const track = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.1, 1), new THREE.MeshStandardMaterial({ color: 0xd4d4d8 }));
  track.position.set(3.5, 0.3, 0);
  bookGroup.add(track);

  const blueBox = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), new THREE.MeshStandardMaterial({ color: 0x3b82f6 }));
  blueBox.position.set(2, 0.7, 0);
  bookGroup.add(blueBox);

  const redBox = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
  redBox.position.set(4, 0.7, 0);
  bookGroup.add(redBox);

  bookGroup.rotation.y = -Math.PI / 12;
  scene.add(bookGroup);

  // تحميل بيانات الدرس الأول وتفعيل الأزرار
  loadLessonData();

  window.addEventListener('resize', onWindowResize);
  animate();
}

function loadLessonData() {
  const data = lessonsData[currentSpreadIndex];
  document.getElementById('lesson-id-badge').innerText = `الدرس ${data.lesson_id}`;
  document.getElementById('lesson-title-text').innerText = data.title;
  document.getElementById('concept-text').innerText = data.concept;
  document.getElementById('formula-text').innerText = data.formula;
  document.getElementById('quiz-question').innerText = data.quiz.question;
  document.getElementById('flap-text').innerText = data.flap;

  const optionsContainer = document.getElementById('quiz-options-container');
  optionsContainer.innerHTML = '';
  
  data.quiz.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.innerText = opt;
    btn.onclick = () => selectOption(idx, data.quiz.correct);
    optionsContainer.appendChild(btn);
  });

  const flapBtn = document.getElementById('flap-btn');
  flapBtn.onclick = toggleFlap;
}

function selectOption(selectedIndex, correctIndex) {
  quizAnswered = true;
  const options = document.querySelectorAll('.quiz-option');
  
  options.forEach((btn, idx) => {
    btn.style.pointerEvents = 'none';
    if(idx === correctIndex) {
      btn.style.backgroundColor = '#dcfce7';
      btn.style.borderColor = '#22c55e';
      btn.style.color = '#15803d';
      btn.style.fontWeight = 'bold';
    } else if(idx === selectedIndex) {
      btn.style.backgroundColor = '#fee2e2';
      btn.style.borderColor = '#ef4444';
      btn.style.color = '#b91c1c';
    }
  });

  const flapBtn = document.getElementById('flap-btn');
  flapBtn.style.background = '#fef08a';
  flapBtn.innerText = '🔓 اضغط هنا لفتح التفسير العلمي ("لماذا؟")';
}

function toggleFlap() {
  if(!quizAnswered) {
    alert('من فضلك اختر الإجابة على السؤال أولاً!');
    return;
  }
  const flapText = document.getElementById('flap-text');
  if(flapText.style.display === 'none') {
    flapText.style.display = 'block';
    document.getElementById('flap-btn').innerText = '🔒 إخفاء التفسير العلمي';
  } else {
    flapText.style.display = 'none';
    document.getElementById('flap-btn').innerText = '🔓 إظهار التفسير العلمي';
  }
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
