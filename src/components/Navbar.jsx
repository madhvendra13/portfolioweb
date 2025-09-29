import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { navLinks } from "../../constants/index";

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  useGSAP(() => {
    // 1️⃣ Hero section: blur + semi-transparent + white links
    gsap.fromTo(
      "nav",
      { backgroundColor: "transparent", backdropFilter: "blur(0px)" },
      {
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(10px)",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    gsap.fromTo(
      "nav a",
      { color: "white" },
      {
        color: "white",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    // 2️⃣ Colour section: navbar turns solid white + black links
    gsap.to("nav", {
      backgroundColor: "white",
      backdropFilter: "blur(0px)",
      scrollTrigger: {
        trigger: "#colour",
        start: "top bottom", // when colour section enters viewport
        end: "top top",
        scrub: true, // smooth transition
      },
    });

    gsap.to("nav a", {
      color: "black",
      scrollTrigger: {
        trigger: "#colour",
        start: "top bottom",
        end: "top top",
        scrub: true,
      },
    });
  });

  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-colors duration-100">
  <div className="flex justify-between items-center px-6 py-4">
    {/* Logo */}
    <a href="#home" className="flex items-center gap-2">
      <img src="/images/logo.png" alt="logo" className="w-16 h-16" />
      <p className="text-lg font-bold text-white">A D S</p>
    </a>

    {/* Nav Links */}
    <ul className="flex gap-12">
      {navLinks.map((link) => (
        <li key={link.id}>
          <a
            href={`#${link.id}`}
            className="relative px-6 py-2 rounded-full font-medium text-white
                       bg-white/6 border border-white/30 
                       backdrop-blur-xl backdrop-saturate-150
                       shadow-[0_2px_60px_rgba(0,0,0,0.1)]
                       hover:bg-white/20 hover:scale-125 transform 
                        duration-300"
          >
            {/* Glossy shine overlay */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-white/3 opacity-50 pointer-events-none"></span>
            <span className="relative z-10">{link.title}</span>
          </a>
        </li>
      ))}
    </ul>
  </div>
</nav>


  );
};

export default Navbar;
