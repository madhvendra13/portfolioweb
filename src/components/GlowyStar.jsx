// GlowyStar.jsx
import React, { useRef, useEffect } from "react";
import p5 from "p5";

const GlowyStar = ({ widthPercent = 50, fadeStart = 1700, fadeEnd = 2000 }) => {
  const containerRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      let baseRadius;
      let rotation = 0;
      let lastScroll = 0;
      let rotationSpeed = 0.1; // default slow clockwise

      p.setup = () => {
        const container = containerRef.current;
        p.createCanvas(container.offsetWidth, container.offsetHeight);
        p.angleMode(p.DEGREES);
        baseRadius = Math.min(p.width, p.height) * 0.17;
      };

      p.windowResized = () => {
        if (containerRef.current) {
          const container = containerRef.current;
          p.resizeCanvas(container.offsetWidth, container.offsetHeight);
          baseRadius = Math.min(p.width, p.height) * 0.18;
        }
      };

      // Recursive fractal drawer
      function drawFractal(x, y, length, angle, depth) {
        if (depth === 0 || length < 1) return;

        const x2 = x + p.cos(angle) * length;
        const y2 = y + p.sin(angle) * length;
        p.line(x, y, x2, y2);

        const newLength = length * 0.15;
        const branchAngle = 45;

        drawFractal(x2, y2, newLength, angle - branchAngle, depth - 1);
        drawFractal(x2, y2, newLength, angle + branchAngle, depth - 1);
      }

      p.draw = () => {
        p.clear();
        const cx = p.width / 2;
        const cy = p.height / 2;

        // Scroll delta
        const scrollNow = window.scrollY;
        const scrollDelta = scrollNow - lastScroll;
        lastScroll = scrollNow;

        // Adjust spin speed
        rotationSpeed += scrollDelta * 0.01;
        rotationSpeed *= 0.85; // friction
        rotationSpeed = p.lerp(rotationSpeed, 0.1, 0.02); // settle back

        rotation += rotationSpeed;

        // Fade factor based on scroll
        let fadeFactor = 1;
        if (scrollNow >= fadeStart) {
          fadeFactor = p.constrain(1 - (scrollNow - fadeStart) / (fadeEnd - fadeStart), 0, 1);
        }

        p.push();
        p.translate(cx, cy);
        p.rotate(rotation);

        const layers = 7;
        for (let layer = layers; layer > 0; layer--) {
          const radius = baseRadius * (1 + layer * 0.16);
          const points = 5 + layer;
          const step = 360 / points;

          // Layered glow: inner layers glow stronger
          const glow = p.map(layer, 1, layers, 40, 5) * fadeFactor;
          p.drawingContext.shadowBlur = glow;
          p.drawingContext.shadowColor = `rgba(255,255,255,${fadeFactor})`;

          // Stroke opacity adjusted per layer
          p.stroke(255, 255 * fadeFactor);

          for (let a = 0; a < 360; a += step) {
            drawFractal(0, 0, radius, a, 20);
          }
        }

        p.pop();
      };
    };

    const myP5 = new p5(sketch, containerRef.current);
    return () => myP5.remove();
  }, [widthPercent, fadeStart, fadeEnd]);

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
