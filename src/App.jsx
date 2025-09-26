import React from 'react'
import gsap from 'gsap';
import { ScrollTrigger, SplitText } from "gsap/all";
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Colour from './components/Colour.jsx';


gsap.registerPlugin(ScrollTrigger, SplitText);


const App = () => {
  return (
    <main>
      <Navbar/>
      <Hero/>
      <Colour/>
      
    </main>
  )
}

export default App
