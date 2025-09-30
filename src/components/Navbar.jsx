import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { navLinks } from "../../constants/index";

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
 

 return (
  <nav className="fixed top-0 left-0 w-full h-20 z-50 transition-colors duration-100">
    <div className="flex justify-between items-center px-10 py-14">
      
      {/* Nav Links */}
      <ul className="flex gap-12 ml-auto">
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
