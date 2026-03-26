gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// --- DICIONÁRIO ATUALIZADO (Troca de Desenho Urbano por Design Estratégico) ---
const translations = {
    pt: { m_title: "Grandes ideias precisam de um <span class='highlight'>lugar seguro</span> para nascer.", m_p1: "Projetar é um ato de confiança. No <b>STUDIO DUCK</b>, nós protegemos a sua visão, não importa a escala.", m_p2: "Do <b>traço urbano</b> que acolhe a vida, ao <b>mobiliário</b> que abraça o corpo. Da <b>cenografia</b> que transporta o olhar, à <b>marca</b> que dá voz a um propósito.", m_p3: "Você traz a visão. Nós construímos o ninho.", bando_text: "Os patos não andam sozinhos, estão sempre em bando.<br><span class='highlight'>Se torne um PATO</span> e junte-se a nós nesse voo.", btn_quack: "Ready to quack?", form_title: "JUNTE-SE AO BANDO!", ph_name: "NOME", ph_email: "E-MAIL", int_1: "Arquitetura", int_2: "Design Estratégico", int_3: "Mobiliário", int_4: "Cenografia", int_5: "Branding / Marca", int_6: "Parceria", btn_send: "ENVIAR", btn_back: "[ VOLTAR AO LAGO ]", success: "QUACK! ✓" },
    en: { m_title: "Great ideas need a <span class='highlight'>safe place</span> to be born.", m_p1: "Design is an act of trust. At <b>STUDIO DUCK</b>, we shield your vision, regardless of scale.", m_p2: "From the <b>urban planning</b> that welcomes life, to the <b>furniture</b> that embraces the body. From the <b>scenography</b> that transports the gaze, to the <b>brand</b> that voices a purpose.", m_p3: "You bring the vision. We build the nest.", bando_text: "Ducks don't fly alone, they fly in a flock.<br><span class='highlight'>Become a DUCK</span> and join us on this flight.", btn_quack: "Ready to quack?", form_title: "JOIN THE FLOCK!", ph_name: "NAME", ph_email: "EMAIL", int_1: "Architecture", int_2: "Strategic Design", int_3: "Furniture", int_4: "Scenography", int_5: "Branding", int_6: "Partnership", btn_send: "SEND", btn_back: "[ BACK TO THE LAKE ]", success: "QUACK! ✓" }
};

const cursor = document.getElementById('custom-cursor');
const spotlight = document.getElementById('spotlight');
let lastX = 0, lastY = 0, stepCount = 0;
let currentLang = 'pt';

// Variaveis para o Pato Autônomo (Mobile)
let autoX = window.innerWidth / 2;
let autoY = window.innerHeight / 2;
let autoAngle = Math.random() * 360;

// --- SISTEMA DE ÁUDIO ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const quackAudio = document.getElementById('quack-audio');

function playDuckStep() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'triangle'; 
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(10, now + 0.05);
    
    gain.gain.setValueAtTime(0.09, now); 
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    
    osc.connect(gain); 
    gain.connect(audioCtx.destination);
    osc.start(); 
    osc.stop(now + 0.1);
}

function playQuackSound() {
    if (quackAudio) {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        quackAudio.currentTime = 0;
        quackAudio.play().catch(e => console.log("Interação necessária para áudio."));
    }
}

// --- CLIQUE EM QUALQUER LUGAR ---
window.addEventListener('mousedown', playQuackSound);
window.addEventListener('touchstart', playQuackSound);

// --- LÓGICA DE MOVIMENTO (Desktop) ---
window.addEventListener('mousemove', (e) => {
    gsap.set(cursor, { x: e.clientX, y: e.clientY });
    gsap.to(spotlight, { x: e.clientX, y: e.clientY, duration: 0.8, opacity: 1 });
    
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    
    if (Math.sqrt(dx*dx + dy*dy) > 120) { 
        playDuckStep(); 
        const moveAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        stepCount++;
        createFootprint(e.clientX, e.clientY, moveAngle, stepCount % 2 !== 0);
        lastX = e.clientX; lastY = e.clientY;
    }
});

function createFootprint(x, y, angle, isLeft) {
    const foot = document.createElement('div');
    foot.className = `duck-step`;
    foot.style.left = x + 'px'; foot.style.top = y + 'px';
    const sX = isLeft ? -0.13 : 0.13;
    foot.style.transform = `translate(-50%, -50%) rotate(${angle+(isLeft?-10:10)}deg) scale(${sX}, 0.13)`;
    document.body.appendChild(foot);
    gsap.fromTo(foot, { opacity: 0.8 }, { opacity: 0, duration: 1.2, onComplete: () => foot.remove() });
}

// --- SISTEMA MOBILE: PATO AUTÔNOMO ---
function startAutoWalk() {
    setInterval(() => {
        stepCount++;
        playDuckStep();

        const distance = 40; 
        autoX += Math.cos(autoAngle * Math.PI / 180) * distance;
        autoY += Math.sin(autoAngle * Math.PI / 180) * distance;

        // Rebater nas bordas
        if (autoX < 50 || autoX > window.innerWidth - 50) autoAngle = 180 - autoAngle;
        if (autoY < 50 || autoY > window.innerHeight - 50) autoAngle = -autoAngle;

        autoAngle += (Math.random() - 0.5) * 30; // Mudança suave de direção
        createFootprint(autoX, autoY, autoAngle + 90, stepCount % 2 !== 0);
    }, 700);
}

// Detecta se é mobile e inicia após primeiro toque
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;

// --- CONFIGURAÇÃO INICIAL ---
window.onload = () => {
    document.querySelectorAll('button, .lang-btn, #open-form').forEach(el => {
        el.onmouseenter = () => cursor.classList.add('hovering');
        el.onmouseleave = () => cursor.classList.remove('hovering');
    });

    if (isMobile) {
        window.addEventListener('touchstart', () => {
            if (stepCount === 0) startAutoWalk();
        }, { once: true });
    }

    gsap.to("#main-logo", { opacity: 1, filter: "blur(0px)", scale: 1, y: 0, duration: 2 });
};
