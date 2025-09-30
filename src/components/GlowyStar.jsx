// GlowyStar.jsx
import React, { useRef, useEffect } from "react";
import p5 from "p5";

const GlowyStar = ({ widthPercent = 60, targetX = 150, targetY = 50 }) => {
  const containerRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      let baseRadius;
      let expanding = [];

      p.setup = () => {
        const container = containerRef.current;
        p.createCanvas(container.offsetWidth, container.offsetHeight);
        p.angleMode(p.DEGREES);
        baseRadius = Math.min(p.width, p.height) * 0.18;
      };

      p.windowResized = () => {
        const container = containerRef.current;
        p.resizeCanvas(container.offsetWidth, container.offsetHeight);
        baseRadius = Math.min(p.width, p.height) * 0.18;
      };

      function drawFractal(x, y, length, angle, depth) {
        if (depth === 0 || length < 1) return;

        const x2 = x + p.cos(angle) * length;
        const y2 = y + p.sin(angle) * length;
        p.line(x, y, x2, y2);

        const newLength = length * 0.2;
        const branchAngle = 30;

        drawFractal(x2, y2, newLength, angle - branchAngle, depth - 1);
        drawFractal(x2, y2, newLength, angle + branchAngle, depth - 1);
      }

      p.draw = () => {
        p.clear();
        const cx = p.width / 2;
        const cy = p.height / 2;
        const rot = p.frameCount * 0.05;

        // Scroll-based collapse
        const scrollProgress = p.constrain(
          window.scrollY / (document.body.scrollHeight - window.innerHeight),
          0,
          1
        );

        // scrollFactor goes from 1.3 → 0
        const scrollFactor = p.lerp(1.8, 0, p.constrain(scrollProgress * 2.8, 0, 1));

        // Move toward target as scrollFactor decreases
        const xOffset = p.lerp(0, -cx + targetX, 1 - scrollFactor);
        const yOffset = p.lerp(0, -cy + targetY, 1 - scrollFactor);

        // Fade out based on scrollFactor
        const alphaFactor = p.map(scrollFactor, 0.02, 0, 255, 0, true);

        p.push();
        p.translate(cx + xOffset, cy + yOffset);
        p.drawingContext.shadowColor = "white";
        p.drawingContext.shadowBlur = 25;

        if (scrollFactor > 0.05) {
          // Normal fractal star
          const layers = 5;
          for (let layer = layers; layer > 0; layer--) {
            const radius = baseRadius * scrollFactor * (1 + layer * 0.12);
            const points = 8 + layer;
            const step = 360 / points;

            p.stroke(255, p.map(layer, layers, 1, 50, 200));

            for (let a = 0; a < 360; a += step) {
              drawFractal(0, 0, radius, a + rot * layer * 0.3, 3);
            }
          }
        } else if (alphaFactor > 0) {
          // Collapse animation (fades out with scroll)
          const t = p.frameCount * 0.1;

          const coreSize = p.map(scrollFactor, 0.05, 0, 40, 40, true);

          // Concentric glow rings
          for (let i = 0; i < 5; i++) {
            const glow = coreSize + i * 10;
            const alpha = alphaFactor / (i + 1);
            p.noFill();
            p.stroke(255, alpha);
            p.ellipse(0, 0, glow, glow);
          }

          // Core bright point
          p.noStroke();
          p.fill(255, alphaFactor);
          p.ellipse(0, 0, coreSize, coreSize);

          // Orbit sparks
          const numSparks = 6;
          for (let i = 0; i < numSparks; i++) {
            const angle = (360 / numSparks) * i + t * 30;
            const r = coreSize * 0.6 + p.sin(t + i) * 5;
            const x = p.cos(angle) * r;
            const y = p.sin(angle) * r;
            p.fill(255, 180, 0, alphaFactor * 0.7);
            p.ellipse(x, y, 4, 4);
          }

          // Radiating expanding rings
          if (p.frameCount % 20 === 0) {
            expanding.push({ r: 0, alpha: alphaFactor });
          }

          for (let i = expanding.length - 1; i >= 0; i--) {
            const ring = expanding[i];
            p.noFill();
            p.stroke(255, ring.alpha);
            p.ellipse(0, 0, ring.r, ring.r);
            ring.r += 4;
            ring.alpha -= 10;
            if (ring.alpha <= 0) expanding.splice(i, 1);
          }
        }

        p.pop();
      };
    };

    const myP5 = new p5(sketch, containerRef.current);
    return () => myP5.remove();
  }, [targetX, targetY]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: `${widthPercent}vw`,
        height: "100vh",
        zIndex: 20,
        pointerEvents: "none",
      }}
    />
  );
};

export default GlowyStar;
