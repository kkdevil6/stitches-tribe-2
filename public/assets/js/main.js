// Main UI behavior: dark mode, form submit, mobile menu
document.addEventListener('DOMContentLoaded', () => {
  // dark toggle
  const toggle = document.querySelector('.dark-toggle');
  toggle && toggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
  });

  // quote form submit (support multiple forms on pages)
  document.querySelectorAll('#quote-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      try {
        const res = await fetch('/submit-quote', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.success) {
          alert('Quote saved! ID: ' + data.id);
          form.reset();
        } else if (data.error) {
          alert('Error: ' + data.error);
        }
      } catch (err) {
        alert('Network error: ' + err.message);
      }
    });
  });

  // tiny mobile menu flip
  const menuBtn = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => {
      menu.classList.toggle('open');
      menu.style.transform = menu.classList.contains('open') ? 'rotateY(0deg)' : 'rotateY(180deg)';
    });
  }
});

// Three.js 3D globe fallback minimal init (home page)
function initGlobe() {
  if (!document.getElementById('globe')) return;
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r152/three.min.js';
  script.onload = () => {
    const canvas = document.getElementById('globe');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x00aaff, wireframe: true });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5,5,5);
    scene.add(light);
    camera.position.z = 6;
    function animate(){ requestAnimationFrame(animate); sphere.rotation.y += 0.005; renderer.render(scene,camera); }
    animate();
  };
  document.head.appendChild(script);
}
initGlobe();
