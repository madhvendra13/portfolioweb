// GlowyStar.jsx
import React, { useRef, useEffect } from "react";
import p5 from "p5";

const GlowyStar = ({ widthPercent = 50 }) => {
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

      // Recursive fractal drawer (balanced)
      function drawFractal(x, y, length, angle, depth) {
        if (depth === 0 || length < 1) return;

        const x2 = x + p.cos(angle) * length;
        const y2 = y + p.sin(angle) * length;
        p.line(x, y, x2, y2);

        const newLength = length * 0.15; // faster shrink
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

        // Update rotation
        rotation += rotationSpeed;

        p.push();
        p.translate(cx, cy);
        p.rotate(rotation);
        p.drawingContext.shadowColor = "white";
        p.drawingContext.shadowBlur = 25;

        // 🌟 Balanced fractal star
        const layers = 6; // fewer layers = less clutter
        for (let layer = layers; layer > 0; layer--) {
          const radius = baseRadius * (1 + layer * 0.25);
          const points = 5 + layer; // fewer points per ring
          const step = 360 / points;

          p.stroke(255, p.map(layer, layers, 1, 100, 200));

          for (let a = 0; a < 360; a += step) {
            drawFractal(0, 0, radius, a, 20); // depth = 2
          }
        }

        p.pop();
      };
    };

    const myP5 = new p5(sketch, containerRef.current);
    return () => myP5.remove();
  }, [widthPercent]);

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
