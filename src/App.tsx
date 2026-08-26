import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Expertise } from "./components/Expertise";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Navbar } from "./components/Navbar";
import { Work } from "./components/Work";
import { ScrollProgress } from "./components/ui/ScrollProgress";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <span className="grain" aria-hidden="true" />
      <ScrollProgress />

      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <main id="main">
        <Hero />
        <About />
        <Expertise />
        <Work />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
