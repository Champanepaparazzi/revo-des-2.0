class EnhancedAnimation {
    constructor(containerId) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.clock = new THREE.Clock();
        this.mouse = new THREE.Vector2();
        this.containerId = containerId;

        this.init();
    }

    init() {
        const container = document.getElementById(this.containerId);
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(this.renderer.domElement);

        this.camera.position.z = 30;

        this.createConstellationSystem();
        this.createHolographicUI();

        window.addEventListener('resize', () => this.onWindowResize(), false);
        container.addEventListener('mousemove', (e) => this.onMouseMove(e), false);

        this.animate();
    }

    createConstellationSystem() {
        const geometry = new THREE.BufferGeometry();
        const particles = 1000;
        const positions = new Float32Array(particles * 3);
        
        for(let i = 0; i < positions.length; i += 3) {
            positions[i] = (Math.random() - 0.5) * 100;
            positions[i + 1] = (Math.random() - 0.5) * 100;
            positions[i + 2] = (Math.random() - 0.5) * 100;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            size: 0.2,
            color: 0x9932CC,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.8
        });

        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }

    createHolographicUI() {
        const shapes = [];
        const texts = ['INNOVATION', 'TECHNOLOGY', 'FUTURE'];
        
        texts.forEach((text, i) => {
            const geometry = new THREE.PlaneGeometry(10, 2);
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0x9932CC) }
                },
                vertexShader: `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform vec3 color;
                    varying vec2 vUv;
                    
                    void main() {
                        float opacity = sin(vUv.x * 10.0 + time) * 0.5 + 0.5;
                        gl_FragColor = vec4(color, opacity * 0.5);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(-15, 10 - i * 5, 0);
            mesh.rotation.x = 0.2;
            shapes.push(mesh);
            this.scene.add(mesh);
        });

        this.holographicElements = shapes;
    }

    onMouseMove(event) {
        const container = document.getElementById(this.containerId);
        const rect = container.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
    }

    onWindowResize() {
        const container = document.getElementById(this.containerId);
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }

    updateParticles() {
        const positions = this.particleSystem.geometry.attributes.position.array;
        const time = this.clock.getElapsedTime();
        
        for(let i = 0; i < positions.length; i += 3) {
            positions[i] += Math.sin(time + i) * 0.01;
            positions[i + 1] += Math.cos(time + i) * 0.01;
            positions[i + 2] += Math.sin(time + i) * 0.01;
            
            if(Math.abs(positions[i]) > 50) positions[i] *= -1;
            if(Math.abs(positions[i + 1]) > 50) positions[i + 1] *= -1;
            if(Math.abs(positions[i + 2]) > 50) positions[i + 2] *= -1;
        }
        
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
    }

    updateHolographicUI() {
        const time = this.clock.getElapsedTime();
        
        this.holographicElements.forEach((element, i) => {
            element.material.uniforms.time.value = time;
            element.position.x = -15 + Math.sin(time * 0.5 + i) * 2;
            element.rotation.z = Math.sin(time * 0.3 + i) * 0.1;
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.updateParticles();
        this.updateHolographicUI();

        this.camera.position.x += (this.mouse.x * 30 - this.camera.position.x) * 0.05;
        this.camera.lookAt(this.scene.position);

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize enhanced animation when the page loads
window.addEventListener('load', () => {
    new EnhancedAnimation('animation-container');
    new EnhancedAnimation('about-animation-container');
    new EnhancedAnimation('events-animation-container');
});

// Event-related code
const events = [
    { id: 1, title: "Tech Showcase", description: "Innovative tech showcase with hands-on demonstrations and expert talks.", image: "event 1.jpg" },
    { id: 2, title: "Hackathon", description: "Hackathon challenge: Solve real-world problems with cutting-edge technology.", image: "event 1.jpg" },
    { id: 3, title: "AI-ML Workshop", description: "AI and Machine Learning workshop for beginners and experts.", image: "event 1.jpg" },
    { id: 4, title: "Robotics competition", description: "Robotics competition: Build, program, and battle amazing robots.", image: "event 1.jpg" },
    { id: 5, title: "IoT seminar", description: "IoT seminar: Exploring the future of connected devices.", image: "event 1.jpg" },
    { id: 6, title: "Virtual Reality expo", description: "Virtual Reality expo: Experience the latest in VR technology.", image: "event 1.jpg" },
    { id: 7, title: "Cybersecurity challenge", description: "Cybersecurity challenge: Test your skills against simulated threats.", image: "event 1.jpg" },
    { id: 8, title: "Tech Startup", description: "Tech startup pitch competition with industry-leading judges.", image: "event 1.jpg" },
    { id: 9, title: "Quantum", description: "Quantum computing lecture series: Understanding the next frontier.", image: "event 1.jpg" },
];


function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
        <img src="${event.image}" alt="${event.title}" class="event-image">
        <div class="event-content">
            <h2 class="event-title">${event.title}</h2>
            <p class="event-description">${event.description}</p>
        </div>
    `;
    return card;
}


function renderEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    if (eventsGrid) {
        events.forEach(event => {
            const eventCard = createEventCard(event);
            eventsGrid.appendChild(eventCard);
        });
    }
}

document.addEventListener('DOMContentLoaded', renderEvents);
