import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";


const Colour = () => {
  const nameRef = useRef();

  useGSAP(() => {
    gsap.registerPlugin(SplitText);
    const split = new SplitText(nameRef.current, { type: "chars" });

    gsap.from(split.chars, {
      opacity: 0,
      y: 50,
      stagger: 0.1,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#colour",
        start: "top bottom",
        end: "top top",
        scrub: false,
      },
    });
  }, []);

  return (
    <section
      id="colour"
      className="relative flex flex-col items-center justify-center h-screen w-full bg-white "
    >
      <h1
        ref={nameRef}
        className="text-6xl md:text-8xl font-bold text-red-600 "
      >
        Madhvendra
      </h1>

    </section>
  );
};

export default Colour;
