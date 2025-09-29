// GlowyStar.jsx
import React, { useRef, useEffect } from "react";
import p5 from "p5";

const GlowyStar = ({ widthPercent = 50 }) => {
  const containerRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      let baseRadius;

      p.setup = () => {
        const container = containerRef.current;
        const canvasWidth = container.offsetWidth;
        const canvasHeight = container.offsetHeight;

        p.createCanvas(canvasWidth, canvasHeight);
        p.angleMode(p.DEGREES);
        p.strokeWeight(2);
        baseRadius = Math.min(p.width, p.height) * 0.18;
      };

      p.windowResized = () => {
        const container = containerRef.current;
        p.resizeCanvas(container.offsetWidth, container.offsetHeight);
        baseRadius = Math.min(p.width, p.height) * 0.18;
      };

      // Recursive radial fractal function
      function drawFractal(x, y, length, angle, depth) {
        if (depth === 0 || length < 1) return;

        const x2 = x + p.cos(angle) * length;
        const y2 = y + p.sin(angle) * length;

        p.line(x, y, x2, y2);

        const newLength = length * 0.2; // shrink factor
        const branchAngle = 30;         // angle between branches

        drawFractal(x2, y2, newLength, angle - branchAngle, depth - 1);
        drawFractal(x2, y2, newLength, angle + branchAngle, depth - 1);
      }

      p.draw = () => {
        p.clear();
        const cx = p.width / 2;
        const cy = p.height / 2;

        p.push();
        p.translate(cx, cy);

        const rot = p.frameCount * 0.05;

        // 🔥 Collapse to center as you scroll down
        const scrollProgress = p.constrain(
          window.scrollY / (document.body.scrollHeight - window.innerHeight),
          0,
          1
        );

        // Start big at top (1.3), shrink to 0 (point) at bottom
        const scrollFactor = p.lerp(1.3, 0, p.constrain(scrollProgress * 8 , 0, 1));


        p.drawingContext.shadowColor = "white";
        p.drawingContext.shadowBlur = 25;

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

        // At very end → just a glowing point
        if (scrollFactor < 0.05) {
          p.noStroke();
          p.fill(255, 200);
          p.ellipse(0, 0, 10, 10);
        }

        p.pop();
      };
    };

    const myP5 = new p5(sketch, containerRef.current);

    return () => {
      myP5.remove();
    };
  }, []);

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
