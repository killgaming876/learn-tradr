// TradeDojo Pro Particle System - Optimized for 60fps

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.container = null;
        this.animationId = null;
        this.lastTime = 0;
        this.init();
    }
    
    init() {
        this.container = document.getElementById('particlesOverlay');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'particlesOverlay';
            this.container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1000;
            `;
            document.body.appendChild(this.container);
        }
        
        this.createInitialParticles();
        this.startAnimation();
        this.setupMouseInteraction();
    }
    
    createInitialParticles() {
        // Create initial particles (optimized count)
        for (let i = 0; i < 40; i++) {
            this.createParticle(true);
        }
    }
    
    createParticle(isInitial = false) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size (smaller for better performance)
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        if (isInitial) {
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.top = `${Math.random() * 100}vh`;
        } else {
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.top = '-10px';
        }
        
        // Random color with transparency
        const colors = [
            'rgba(59, 130, 246, 0.15)',   // Blue
            'rgba(96, 165, 250, 0.15)',   // Light Blue
            'rgba(139, 92, 246, 0.15)',   // Purple
            'rgba(16, 185, 129, 0.15)',   // Green
            'rgba(245, 158, 11, 0.15)'    // Yellow
        ];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.position = 'absolute';
        particle.style.pointerEvents = 'none';
        particle.style.willChange = 'transform';
        
        this.container.appendChild(particle);
        
        // Store particle data
        const particleData = {
            element: particle,
            x: parseFloat(particle.style.left),
            y: parseFloat(particle.style.top),
            vx: (Math.random() - 0.5) * 0.3,
            vy: Math.random() * 0.2 + 0.1,
            size: size,
            opacity: Math.random() * 0.3 + 0.1,
            rotation: Math.random() * 360
        };
        
        this.particles.push(particleData);
        return particleData;
    }
    
    startAnimation() {
        const animate = (currentTime) => {
            // Limit to 60fps
            const deltaTime = currentTime - this.lastTime;
            if (deltaTime < 16) { // 60fps
                this.animationId = requestAnimationFrame(animate);
                return;
            }
            this.lastTime = currentTime;
            
            // Update particles
            this.updateParticles();
            
            // Continue animation
            this.animationId = requestAnimationFrame(animate);
        };
        
        this.animationId = requestAnimationFrame(animate);
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            // Update position with boundaries
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += 0.5;
            
            // Bounce off edges
            if (p.x <= 0 || p.x >= 100) p.vx *= -1;
            if (p.y <= 0 || p.y >= 100) p.vy *= -1;
            
            // Apply subtle floating motion
            p.x += Math.sin(Date.now() * 0.001 + i) * 0.05;
            
            // Update element
            p.element.style.transform = `translate3d(${p.x}vw, ${p.y}vh, 0) rotate(${p.rotation}deg)`;
            p.element.style.opacity = p.opacity;
            
            // Remove particles that are too old (for memory management)
            if (p.y > 110) { // Below viewport
                p.element.remove();
                this.particles.splice(i, 1);
                
                // Create new particle to maintain count
                if (this.particles.length < 40) {
                    this.createParticle();
                }
            }
        }
    }
    
    setupMouseInteraction() {
        let mouseX = 0;
        let mouseY = 0;
        let lastMouseMove = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            lastMouseMove = Date.now();
            
            // Create trail particles on fast movement
            if (Math.abs(e.movementX) > 5 || Math.abs(e.movementY) > 5) {
                this.createTrailParticle(mouseX, mouseY);
            }
            
            // Repel nearby particles
            this.repelParticles(mouseX, mouseY);
        });
        
        // Click effect
        document.addEventListener('click', (e) => {
            this.createClickEffect(e.clientX, e.clientY);
        });
        
        // Add occasional particles
        setInterval(() => {
            if (Date.now() - lastMouseMove > 5000) { // Only when inactive
                if (Math.random() > 0.7 && this.particles.length < 50) {
                    this.createParticle();
                }
            }
        }, 1000);
    }
    
    createTrailParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        particle.style.cssText = `
            position: fixed;
            width: 3px;
            height: 3px;
            background: rgba(59, 130, 246, 0.6);
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 1000;
            will-change: transform, opacity;
        `;
        
        this.container.appendChild(particle);
        
        // Animate with Web Animations API (more performant)
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 30 + 20;
        
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 0.8 },
            { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`, opacity: 0 }
        ], {
            duration: 600,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });
        
        setTimeout(() => particle.remove(), 600);
    }
    
    createClickEffect(x, y) {
        // Create burst effect
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 6 + 3;
            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: rgba(59, 130, 246, 0.8);
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                z-index: 1000;
                will-change: transform, opacity;
            `;
            
            this.container.appendChild(particle);
            
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 60 + 40;
            
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`, opacity: 0 }
            ], {
                duration: 800,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            });
            
            setTimeout(() => particle.remove(), 800);
        }
    }
    
    repelParticles(x, y) {
        const mouseXPercent = (x / window.innerWidth) * 100;
        const mouseYPercent = (y / window.innerHeight) * 100;
        const repelRadius = 15; // vw
        
        this.particles.forEach(p => {
            const dx = p.x - mouseXPercent;
            const dy = p.y - mouseYPercent;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < repelRadius) {
                const force = (repelRadius - distance) / repelRadius;
                p.vx += (dx / distance) * force * 0.5;
                p.vy += (dy / distance) * force * 0.5;
            }
        });
    }
    
    createSuccessEffect() {
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 8 + 4;
            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: #10b981;
                border-radius: 50%;
                left: 50%;
                top: 50%;
                pointer-events: none;
                z-index: 1000;
                will-change: transform, opacity;
                box-shadow: 0 0 20px #10b981;
            `;
            
            this.container.appendChild(particle);
            
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 150 + 100;
            
            particle.animate([
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                { transform: `translate(${Math.cos(angle) * distance - 50}px, ${Math.sin(angle) * distance - 50}px) scale(0)`, opacity: 0 }
            ], {
                duration: 1000,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            });
            
            setTimeout(() => particle.remove(), 1000);
        }
    }
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.particles.forEach(p => p.element.remove());
        this.particles = [];
    }
}

// Start particle system
document.addEventListener('DOMContentLoaded', () => {
    window.particleSystem = new ParticleSystem();
});

// Export for use
window.ParticleSystem = ParticleSystem;
