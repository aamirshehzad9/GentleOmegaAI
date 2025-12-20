import React, { useRef, useEffect } from 'react';

interface ParticleBackgroundProps {
    className?: string;
    color?: string; // Hex color for particles
    count?: number; // Number of particles
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
    className = '',
    color = '#06b6d4', // Cyan default
    count = 50
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Array<{
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            opacity: number;
        }> = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5, // Slow horizontal movement
                    vy: (Math.random() - 0.5) * 0.5, // Slow vertical movement
                    size: Math.random() * 2 + 0.5,
                    opacity: Math.random() * 0.5 + 0.1,
                });
            }
        };

        const drawParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;

                // Bounce off edges
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.globalAlpha = p.opacity;
                ctx.fill();

                // Draw connections (Data Stream effect)
                particles.forEach((p2, j) => {
                    if (i === j) return;
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = color;
                        ctx.globalAlpha = (1 - distance / 100) * 0.15; // Fade out based on distance
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                });
            });

            animationFrameId = requestAnimationFrame(drawParticles);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        initParticles();
        drawParticles();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [color, count]);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 pointer-events-none z-0 ${className}`}
        />
    );
};

export default ParticleBackground;
