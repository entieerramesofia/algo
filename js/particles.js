(() => {
    const canvas = document.getElementById('particle-canvas');
    const context = canvas.getContext('2d');
    const counter = document.getElementById('particle-count');
    const pointer = { x: -1000, y: -1000, active: false };
    const particles = [];
    const pulses = [];
    const colors = ['159, 255, 224', '100, 204, 255', '236, 156, 255'];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let animationFrame;

    class Particle {
        constructor(x, y, fromClick = false) {
            this.x = x;
            this.y = y;
            const angle = Math.random() * Math.PI * 2;
            const speed = fromClick ? Math.random() * 1.8 + .35 : Math.random() * .32 + .06;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.radius = Math.random() * 1.8 + 2;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.phase = Math.random() * Math.PI * 2;
            this.twinkles = Math.random() < .32;
            this.life = fromClick ? 180 : Infinity;
        }

        update() {
            this.phase += .018;
            if (pointer.active) {
                const dx = pointer.x - this.x;
                const dy = pointer.y - this.y;
                const distance = Math.hypot(dx, dy);
                if (distance < 150 && distance > 0) {
                    const force = (1 - distance / 150) * .018;
                    this.vx -= (dx / distance) * force;
                    this.vy -= (dy / distance) * force;
                }
            }
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= .995;
            this.vy *= .995;
            if (this.x < -5) this.x = width + 5;
            if (this.x > width + 5) this.x = -5;
            if (this.y < -5) this.y = height + 5;
            if (this.y > height + 5) this.y = -5;
            if (this.life !== Infinity) this.life--;
        }

        draw() {
            const pulse = this.twinkles ? .45 + (Math.sin(this.phase) + 1) * .275 : 1;
            context.beginPath();
            context.arc(this.x, this.y, this.radius * pulse, 0, Math.PI * 2);
            context.fillStyle = `rgba(${this.color}, ${pulse})`;
            context.shadowBlur = 16;
            context.shadowColor = `rgba(${this.color}, .8)`;
            context.fill();
            context.shadowBlur = 0;
        }
    }

    function resize() {
        pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * pixelRatio);
        canvas.height = Math.floor(height * pixelRatio);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        const target = Math.min(150, Math.max(55, Math.floor((width * height) / 8500)));
        while (particles.length < target) particles.push(new Particle(Math.random() * width, Math.random() * height));
        while (particles.length > target) particles.pop();
        counter.textContent = String(particles.length).padStart(3, '0');
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const first = particles[i];
                const second = particles[j];
                const distance = Math.hypot(first.x - second.x, first.y - second.y);
                if (distance < 105) {
                    context.beginPath();
                    context.moveTo(first.x, first.y);
                    context.lineTo(second.x, second.y);
                    context.strokeStyle = `rgba(107, 221, 212, ${(1 - distance / 105) * .23})`;
                    context.lineWidth = 6;
                    context.stroke();
                }
            }
            if (pointer.active) {
                const p = particles[i];
                const distance = Math.hypot(pointer.x - p.x, pointer.y - p.y);
                if (distance < 145) {
                    context.beginPath();
                    context.moveTo(pointer.x, pointer.y);
                    context.lineTo(p.x, p.y);
                    context.strokeStyle = `rgba(151, 255, 224, ${(1 - distance / 145) * .55})`;
                    context.lineWidth = .8;
                    context.stroke();
                }
            }
        }
    }

    function drawPulses() {
        for (let i = pulses.length - 1; i >= 0; i--) {
            const pulse = pulses[i];
            pulse.radius += 2.4;
            pulse.alpha -= .012;
            context.beginPath();
            context.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
            context.strokeStyle = `rgba(159, 255, 224, ${Math.max(0, pulse.alpha)})`;
            context.lineWidth = 1;
            context.stroke();
            if (pulse.alpha <= 0) pulses.splice(i, 1);
        }
    }

    function draw() {
        context.clearRect(0, 0, width, height);
        for (const particle of particles) {
            particle.update();
            particle.draw();
        }
        drawConnections();
        drawPulses();
        for (let i = particles.length - 1; i >= 0; i--) {
            if (particles[i].life <= 0) particles.splice(i, 1);
        }
        if (!reducedMotion) animationFrame = requestAnimationFrame(draw);
    }

    function setPointer(event) {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        pointer.active = true;
        const overParticle = particles.some((particle) =>
            Math.hypot(pointer.x - particle.x, pointer.y - particle.y) < Math.max(12, particle.radius + 8)
        );
        canvas.style.cursor = overParticle ? 'pointer' : 'default';
    }

    canvas.addEventListener('pointermove', setPointer);
    canvas.addEventListener('pointerleave', () => { pointer.active = false; });
    canvas.addEventListener('pointerdown', (event) => {
        setPointer(event);
        const hitParticle = particles.some((particle) =>
            Math.hypot(pointer.x - particle.x, pointer.y - particle.y) < Math.max(12, particle.radius + 8)
        );
        if (hitParticle) {
            window.location.assign('nueva.html');
            return;
        }
        pulses.push({ x: pointer.x, y: pointer.y, radius: 2, alpha: .8 });
        for (let i = 0; i < 12; i++) particles.push(new Particle(pointer.x, pointer.y, true));
        counter.textContent = String(particles.length).padStart(3, '0');
        if (reducedMotion) draw();
    });
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(animationFrame);
        else if (!reducedMotion) draw();
    });
    resize();
    draw();
})();
