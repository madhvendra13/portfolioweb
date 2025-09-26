import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

const Hero = () => {
  const videoRef = useRef();
  const spacerRef = useRef();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [videoDuration, setVideoDuration] = useState(0);


// When the video file loads, the browser knows its duration
// We store that in state so GSAP can calculate how much scroll distance we need to match the video’s playtime.
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onloadedmetadata = () => {
        setVideoDuration(videoRef.current.duration);
      };
    }
  }, []);

  useGSAP(() => {
    if (!videoDuration) return;

    const startValue = isMobile ? "100%" : "center 48%";

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: videoRef.current,
        start: startValue,
        end: `+=${videoDuration * 300}px`, // adjust scroll length proportional to video duration
        scrub: true,
        pin: true,
      },
    });

    tl.to(videoRef.current, {
      currentTime: videoRef.current.duration,
      ease: "none",
    });
  }, [videoDuration]);






  return (
    <>
      <section id="hero" className="relative flex items-center justify-center h-screen"></section>

      <div className="video absolute inset-0 ">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          src="/videos/output.mp4"
          className="w-full h-full object-cover absolute top-0 left-0"
		
        />
      </div>

      {/* Spacer div ensures enough scroll height so next page appears after video ends */}
      <div ref={spacerRef} style={{ height: `${videoDuration * 300}px` }}></div>
	  
    </>
  );
};

export default Hero;
