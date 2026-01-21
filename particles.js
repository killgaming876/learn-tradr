// Particle System for Background Effects

function createBackgroundParticles() {
    const container = document.getElementById('backgroundParticles');
    if (!container) return;
    
    // Clear existing particles
    container.innerHTML = '';
    
    // Create initial particles
    for (let i = 0; i < 50; i++) {
        createParticle(container, true);
    }
    
    // Add new particles periodically
    setInterval(() => {
        if (document.visibilityState === 'visible') {
            createParticle(container, false);
        }
    }, 500);
    
    // Create interactive particles on mouse move
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Create trail particles on fast movement
        if (Math.abs(e.movementX) > 10 || Math.abs(e.movementY) > 10) {
            createTrailParticle(container, mouseX, mouseY);
        }
    });
    
    // Create particles on click
    document.addEventListener('click', (e) => {
        createClickParticleBurst(container, e.clientX, e.clientY);
    });
}

function createParticle(container, isInitial) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random size
    const size = Math.random() * 4 + 1;
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
    
    // Random color with blue/purple theme
    const colors = [
        'rgba(59, 130, 246, 0.3)',   // Blue
        'rgba(139, 92, 246, 0.3)',   // Purple
        'rgba(236, 72, 153, 0.3)',   // Pink
        'rgba(16, 185, 129, 0.3)',   // Green
        'rgba(245, 158, 11, 0.3)'    // Yellow
    ];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.boxShadow = `0 0 ${size * 2}px currentColor`;
    particle.style.borderRadius = '50%';
    
    // Random movement
    const duration = Math.random() * 20 + 20; // 20-40 seconds
    const delay = Math.random() * 5;
    
    particle.style.transition = `all ${duration}s linear ${delay}s`;
    
    container.appendChild(particle);
    
    // Animate
    setTimeout(() => {
        if (particle.parentNode) {
            particle.style.transform = `translate(${Math.random() * 100 - 50}px, ${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`;
            particle.style.opacity = '0';
        }
    }, 10);
    
    // Remove after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
        }
    }, (duration + delay) * 1000);
}

function createTrailParticle(container, x, y) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    particle.style.width = '3px';
    particle.style.height = '3px';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.background = 'rgba(59, 130, 246, 0.5)';
    particle.style.borderRadius = '50%';
    particle.style.boxShadow = '0 0 10px #3b82f6';
    particle.style.zIndex = '1';
    
    container.appendChild(particle);
    
    // Random movement from mouse direction
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 30 + 20;
    
    particle.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    
    setTimeout(() => {
        particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
        particle.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
        }
    }, 900);
}

function createClickParticleBurst(container, x, y) {
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 10 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = '0 0 20px currentColor';
        particle.style.zIndex = '2';
        
        container.appendChild(particle);
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 80 + 40;
        
        particle.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`;
            particle.style.opacity = '0';
        }, 10);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 700);
    }
}

// Particle effects for specific events
function createSuccessParticles() {
    const container = document.getElementById('backgroundParticles');
    if (!container) return;
    
    for (let i = 0; i < 25; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 12 + 8;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        particle.style.background = '#10b981';
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = '0 0 30px #10b981';
        particle.style.zIndex = '3';
        
        container.appendChild(particle);
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 150 + 100;
        
        particle.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`;
            particle.style.opacity = '0';
        }, 10);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 1100);
    }
}

function createErrorParticles() {
    const container = document.getElementById('backgroundParticles');
    if (!container) return;
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 8 + 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        particle.style.background = '#ef4444';
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = '0 0 20px #ef4444';
        particle.style.zIndex = '3';
        
        container.appendChild(particle);
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 80 + 40;
        
        particle.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`;
            particle.style.opacity = '0';
        }, 10);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 900);
    }
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createBackgroundParticles);
} else {
    createBackgroundParticles();
}

// Export functions for use in other files
window.particleSystem = {
    createBackgroundParticles,
    createSuccessParticles,
    createErrorParticles,
    createClickParticleBurst
};
