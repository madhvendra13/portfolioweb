// Hero.jsx
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { useRef, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import GlowyStar from "./GlowyStar";

const Hero = () => {
  const videoRef = useRef();
  const spacerRef = useRef();
  const textRef = useRef();
  const extraTextRef = useRef();
  const imageRef = useRef();
  const starRef = useRef();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [videoDuration, setVideoDuration] = useState(0);


  // Time state
  const [time, setTime] = useState("");

  // IST Time updater
  useEffect(() => {
    const updateTime = () => {
      const options = { timeZone: "Asia/Kolkata", hour12: false, hour: "2-digit", minute: "2-digit" };
      const now = new Intl.DateTimeFormat("en-GB", options).format(new Date());
      setTime(now);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000 * 30); // refresh every 30s
    return () => clearInterval(interval);
  }, []);


  // Mouse spotlight state
  const [spot, setSpot] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState({ x: 0, y: 0 });

  // Video duration
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onloadedmetadata = () => {
        setVideoDuration(videoRef.current.duration || 0);
      };
    }
  }, []);

  // Mouse move event
  useEffect(() => {
    const handleMouseMove = (e) => setSpot({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Trail animation
  useEffect(() => {
    const lerp = (start, end, amt) => start + (end - start) * amt;
    let animationFrame;
    const animate = () => {
      setTrail((prev) => ({
        x: lerp(prev.x, spot.x, 0.1),
        y: lerp(prev.y, spot.y, 0.05),
      }));
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [spot]);

  // GSAP animations
  useGSAP(() => {
    gsap.registerPlugin(SplitText);

    // ✅ Wait for fonts before running SplitText
    document.fonts.ready.then(() => {
      if (textRef.current) {
        const split = new SplitText(textRef.current, { type: "chars" });
        gsap.fromTo(
          split.chars,
          { opacity: 0, y: 100, rotateX: -90 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            stagger: 0.05,
            duration: 1,
            ease: "back.out(1.7)",
          }
        );
      }

      if (extraTextRef.current) {
        const splitExtra = new SplitText(extraTextRef.current, { type: "lines" });
        gsap.from(splitExtra.lines, {
          opacity: 0,
          duration: 3,
          ease: "sine.out",
          stagger: 0.1,
          delay: 0.5,
        });
      }
    });

    // Video scroll control
    if (!videoDuration || !videoRef.current) return;
    const startValue = isMobile ? "100%" : "center 48%";
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: videoRef.current,
        start: startValue,
        end: `+=${videoDuration * 300}px`,
        scrub: true,
        pin: true,
      },
    });

    tl.to(videoRef.current, {
      currentTime: videoDuration,
      duration: videoDuration,
      ease: "none",
    });

    const disappearAt = Math.min(1, videoDuration - 0.5);
    tl.to(
      [textRef.current, extraTextRef.current],
      { opacity: 0, y: -50, duration: 1.2, ease: "power3.inOut" },
      disappearAt
    );

    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scrollTrigger: {
          trigger: "#colour",
          start: "top bottom",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        duration: 1.2,
        ease: "power3.inOut",
      });
    }
  }, [videoDuration, isMobile]);

  // Pulse + Glow animation for GlowyStar
  useEffect(() => {
    if (!starRef.current) return;

    gsap.to(starRef.current, {
      scale: 1.05,
      opacity: 0.7,
      boxShadow: "0px 50px 50px white",
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <>

    {/* 🔹 Top Info Bar */}
      <div className="fixed top-16 left-70 -translate-x-1/2 flex items-center gap-6 text-white/100 text-sm tracking-wide z-30">
        <span className="font-medium">My Studio</span>
        <span>·</span>
        <span>Design & Development</span>
        <span>·</span>
        <span className="opacity-70">IST {time}</span>
      </div>


      <section
        id="hero"
        className="relative flex flex-col gap-6 items-start justify-center h-screen bg-black overflow-hidden px-5 mt-40"
      >
        <h1
          ref={textRef}
          className="text-white text-7xl md:text-8xl z-20 max-w-[70%] leading-tight"
        >
          HEY! Welcome
        </h1>
        <p
          ref={extraTextRef}
          className="animate-me text-white text-lg md:text-2xl font-light max-w-[60%] z-20"
        >
          This is a demo of GSAP SplitText animation.
        </p>
      </section>

      {/* GlowyStar with pulse + glow */}
      <div
        ref={starRef}
        className="fixed top-0 right-3 h-full w-full z-10 pointer-events-none"
      >
        <GlowyStar />
      </div>

      {/* Hero image */}
      <div
        ref={imageRef}
        className="fixed top-0 h-screen w-screen z-20 md:block opacity-35"
        style={{
          maskImage: `radial-gradient(circle 100px at ${trail.x}px ${trail.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 120%)`,
          WebkitMaskImage: `radial-gradient(circle 100px at ${trail.x}px ${trail.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 120%)`,
          transition:
            "mask-position 0.1s, -webkit-mask-position 0.1s",
        }}
      >
        <img
          src="/images/hero-image.jpg"
          alt="Hero Visual"
          className="w-380 h-190"
        />
      </div>

      {/* Video background */}
      <div className="video absolute inset-0">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          src="/videos/output.mp4"
          className="w-full h-full object-cover absolute top-0 left-0"
        />
      </div>

      {/* Spacer for scroll */}
      <div
        ref={spacerRef}
        style={{ height: `${videoDuration * 300}px` }}
      />
    </>
  );
};

export default Hero;
