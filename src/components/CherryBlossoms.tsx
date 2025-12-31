import React, { useEffect, useRef } from 'react';

const CherryBlossoms: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', resize);
        resize();

        const petals: Petal[] = [];
        const petalCount = 50;

        class Petal {
            x: number;
            y: number;
            size: number;
            speed: number;
            opacity: number;
            angle: number;
            spin: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height - height;
                this.size = Math.random() * 10 + 5;
                this.speed = Math.random() * 1 + 0.5;
                this.opacity = Math.random() * 0.5 + 0.3;
                this.angle = Math.random() * Math.PI * 2;
                this.spin = Math.random() * 0.02 - 0.01;
            }

            update() {
                this.y += this.speed;
                this.x += Math.sin(this.angle) * 0.5;
                this.angle += this.spin;

                if (this.y > height) {
                    this.y = -20;
                    this.x = Math.random() * width;
                }
            }

            draw() {
                if (!ctx) return;
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = '#FFC0CB'; // Pink color
                ctx.beginPath();
                // Draw a simple petal shape (ellipse-ish)
                ctx.ellipse(0, 0, this.size / 2, this.size, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < petalCount; i++) {
            petals.push(new Petal());
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            petals.forEach((petal) => {
                petal.update();
                petal.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1,
            }}
        />
    );
};

export default CherryBlossoms;
