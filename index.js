let scene, camera, renderer, controls, bookGroup;

// بيانات الدروس
const lessonsData = [
  {
    lesson_id: "٦-١",
    title: "القدرة والكفاءة",
    concept: "القدرة هي معدل بذل الشغل أو تحويل الطاقة، بينما تعبر الكفاءة عن نسبة الطاقة الناتجة المفيدة.",
    formula: "P = W / t",
    quiz: {
      question: "إذا زادت الطاقة المستهلكة لجهاز مع ثبات الشغل الناتج، فماذا يحدث لكفاءته؟",
      options: ["تزداد كفاءة الجهاز.", "تقل كفاءة الجهاز."],
      correct: 1
    },
    flap: "التفسير العلمي: الكفاءة تعتمد عكسياً على الطاقة المفقودة، وكلما زادت الطاقة المستهلكة بدون زيادة في الناتج المفيد انخفضت الكفاءة."
  }
];

let quizAnswered = false;

window.onload = function() {
  const container = document.getElementById('webgl-container');
  if(!container) return;

  // إعداد المشهد ثلاثي الأبعاد
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

  // تفعيل أزرار التفاعل واختبار الأسئلة
  setupUI();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();
};

function setupUI() {
  const data = lessonsData[0];
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
    btn.onclick = function() {
      quizAnswered = true;
      const allBtns = optionsContainer.querySelectorAll('button');
      allBtns.forEach((b, i) => {
        b.style.pointerEvents = 'none';
        if(i === data.quiz.correct) {
          b.style.backgroundColor = '#dcfce7';
          b.style.borderColor = '#22c55e';
          b.style.color = '#15803d';
        } else if(i === idx) {
          b.style.backgroundColor = '#fee2e2';
          b.style.borderColor = '#ef4444';
          b.style.color = '#b91c1c';
        }
      });
      document.getElementById('flap-btn').style.background = '#fef08a';
      document.getElementById('flap-btn').innerText = '🔓 اضغط هنا لفتح التفسير العلمي';
    };
    optionsContainer.appendChild(btn);
  });

  document.getElementById('flap-btn').onclick = function() {
    if(!quizAnswered) {
      alert('اختر الإجابة على السؤال أولاً!');
      return;
    }
    const flapText = document.getElementById('flap-text');
    if(flapText.style.display === 'none' || flapText.style.display === '') {
      flapText.style.display = 'block';
      this.innerText = '🔒 إخفاء التفسير العلمي';
    } else {
      flapText.style.display = 'none';
      this.innerText = '🔓 إظهار التفسير العلمي';
    }
  };
}

function animate() {
  requestAnimationFrame(animate);
  if(controls) controls.update();
  if(renderer && scene && camera) renderer.render(scene, camera);
}
