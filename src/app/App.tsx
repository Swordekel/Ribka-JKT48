import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { About } from "./components/About";
import { Schedule } from "./components/Schedule";
import { Merchandise } from "./components/Merchandise";
import { Gallery } from "./components/Gallery";
import { SocialHub } from "./components/SocialHub";
import { Footer } from "./components/Footer";
import { Preloader } from "./components/Preloader";
import { ScrollProgress } from "./components/ScrollProgress";
import { CustomCursor } from "./components/CustomCursor";
import { BackToTop } from "./components/BackToTop";
import { ThemeProvider } from "./lib/theme";
import { useLenis } from "./lib/useLenis";

export default function App() {
  const [ready, setReady] = useState(false);
  useLenis();

  return (
    <ThemeProvider>
      <Preloader onComplete={() => setReady(true)} />
      <ScrollProgress />
      <CustomCursor />

      <div
        className="min-h-screen w-full bg-white dark:bg-[#0f0f0f] transition-colors duration-500"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <Navbar />
        <main>
          <Hero start={ready} />
          <Marquee />
          <About />
          <Schedule />
          <Merchandise />
          <Gallery />
          <SocialHub />
        </main>
        <Footer />
      </div>

      <BackToTop />
    </ThemeProvider>
  );
}
