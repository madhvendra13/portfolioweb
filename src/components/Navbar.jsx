import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { navLinks } from "../../constants/index";

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  useGSAP(() => {
    gsap.to("nav", {
      scrollTrigger: {
        trigger: "#hero", // your hero section
        start: "bottom top", // when hero leaves viewport
        toggleClass: { targets: "nav", className: "nav-dark" },
      },
    });
  });

  return (
    <nav>
      <div>
        <a href="#home" className="flex items-center gap-2">
          <img src="" alt="logo" className="" />
          <p>MAD Creations</p>
        </a>

        <ul>
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className="px-4 py-2 border rounded-lg transition-colors"
              >
                {link.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
