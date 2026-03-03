import Experience from "../components/Experience";
import Projects from "../components/Projects";
import Honors from "../components/Honors";
import Skills from "../components/Skills";
import Footer from "../components/Footer";
import { FaGithub, FaLinkedin, FaEnvelope, FaEye, FaDownload } from "react-icons/fa";
import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Breadcrumb from "../components/blog/Breadcrumb";
import { posts } from "../data/posts";
import { ArrowRight } from "lucide-react";
import SidebarNav from "../components/SidebarNav";

const sections = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "honors", label: "Honors" },
  { id: "skills", label: "Skills" },
];

function Home() {
  const [activeSection, setActiveSection] = React.useState("about");

  React.useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  React.useEffect(() => {
    const getActive = () => {
      // If we're at (or very near) the bottom of the page, the last section wins.
      const nearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
      if (nearBottom) return sections[sections.length - 1].id;

      // The "reading line" sits 35% from the top of the viewport.
      // Whichever section contains that point is considered active.
      const readingLine = window.innerHeight * 0.35;
      let current = sections[0].id;

      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= readingLine && bottom > readingLine) {
          current = id;
          break;
        }
        // If we've scrolled past this section, keep it as a candidate
        if (bottom <= readingLine) {
          current = id;
        }
      }

      return current;
    };

    const onScroll = () => setActiveSection(getActive());
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-paper-light">
      <Helmet>
        <title>Sugam Panthi </title>
        <meta name="description" content="Portfolio of Sugam Panthi — software engineer, researcher, and writer based in Hattiesburg, MS." />
        <meta property="og:title" content="Sugam Panthi" />
        <meta property="og:url" content="https://sugampanthi.com.np" />
      </Helmet>

      <Breadcrumb />

      <div className="w-full grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_240px] xl:grid-cols-[280px_minmax(0,1fr)_280px] body-container">

        {/* Left Sidebar */}
        <div className="sidebar-panel hidden lg:flex flex-col border-r border-border-paper sticky top-[3.5rem] h-[calc(100vh-3.5rem)]">
          <SidebarNav title="Sections" items={sections} activeId={activeSection} decoration decorationMode="auto-local" />
        </div>

        {/* Main Content */}
        <main className="w-full px-6 sm:px-12 pt-6 pb-2 lg:pt-10 lg:pb-4">
          <div id="about" className="header-section">
            <div className="text-center mb-8">
              <p className="text-base lg:text-lg text-ink-muted font-medium max-w-2xl mx-auto">
                Co-founder @ {" "}
                <a
                  href="magnoliaed.net"
                  className="text-ink-blue hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MagnoliaEd
                </a>
                {" "}| Research Assistant @{" "}
                <a
                  href="https://www.usm.edu/"
                  className="text-ink-blue hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  The University of Southern Mississippi
                </a>
              </p>
            </div>

            <div className="lg:flex lg:items-start lg:gap-12 mt-8 pb-8 border-b border-border-paper">
              <div className="lg:flex-1 mb-8 lg:mb-0">
                <div className="space-y-6">
                  <p className="text-base lg:text-lg text-ink-dark leading-relaxed">
                    I'm Sugam Panthi, based in Hattiesburg, Mississippi. I have experience building applications using <strong>Go and Python</strong>. I recently completed an internship as an AI and MI intern @{" "}
                    <a
                      href="https://prediction3d.com"
                      className="text-ink-blue hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Prediction3d
                    </a>
                    .
                  </p>

                  <p className="text-base lg:text-lg text-ink-dark leading-relaxed">
                    I'm pursuing a <span className="font-medium text-ink-dark">Bachelor's in Computer Science</span> at{" "}
                    <a
                      href="https://www.usm.edu/"
                      className="text-ink-blue hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      The University of Southern Mississippi
                    </a>
                    .
                  </p>

                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
                    <a
                      href="/resume.pdf"
                      className="flex items-center gap-2 px-6 py-2.5 bg-ink-blue text-white rounded-sm hover:bg-opacity-90 transition-all text-sm font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaEye className="h-4 w-4" />
                      View Resume
                    </a>
                    <a
                      href="/resume.pdf"
                      className="flex items-center gap-2 px-6 py-2.5 border border-ink-blue text-ink-blue rounded-sm hover:bg-blue-50 transition-all text-sm font-medium"
                      download="Sugam_Panthi_Resume.pdf"
                    >
                      <FaDownload className="h-4 w-4" />
                      Download Resume
                    </a>
                  </div>

                  <div className="pt-2">
                    <div className="flex flex-wrap items-center justify-center gap-6 lg:justify-start">
                      <a
                        href="mailto:Sugam.Panthi@usm.edu"
                        className="flex items-center gap-2 text-ink-muted hover:text-ink-blue transition-colors text-sm"
                      >
                        <FaEnvelope className="h-4 w-4" />
                        <span>Sugam.Panthi@usm.edu</span>
                      </a>
                      <a
                        href="https://www.linkedin.com/in/sugam-panthi"
                        className="flex items-center gap-2 text-ink-muted hover:text-ink-blue transition-colors text-sm"
                      >
                        <FaLinkedin className="h-4 w-4" />
                        <span>sugam-panthi</span>
                      </a>
                      <a
                        href="https://www.github.com/vein05"
                        className="flex items-center gap-2 text-ink-muted hover:text-ink-blue transition-colors text-sm"
                      >
                        <FaGithub className="h-4 w-4" />
                        <span>vein05</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center items-center lg:justify-end">
                <img
                  className="object-cover"
                  src="/images/headshot.jpeg"
                  alt="Sugam Panthi headshot"
                  style={{
                    width: "220px",
                    height: "230px",
                    objectPosition: "bottom center",
                    opacity: 0.88,
                  }}
                />
                <span className="text-sm text-ink-muted mt-2">
                  May 2025 | Hattiesburg, MS
                </span>
              </div>
            </div>
          </div>

          <section id="experience" className="mt-10">
            <Experience />
          </section>

          <section id="projects" className="mt-16">
            <Projects />
          </section>

          <section id="honors" className="mt-16">
            <Honors />
          </section>

          <section id="skills" className="mt-16">
            <Skills />
          </section>

          <Footer />
        </main>

        <div className="sidebar-panel hidden lg:flex flex-col border-l border-border-paper sticky top-[3.5rem] h-[calc(100vh-3.5rem)] overflow-y-auto">
          <div className="py-6 px-5 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs uppercase tracking-widest text-ink-muted">
                Writing
              </h2>
              <Link
                to="/blog"
                className="text-xs uppercase tracking-wider text-ink-blue hover:text-ink-dark transition-colors flex items-center gap-1"
              >
                All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <ul className="flex flex-col gap-0 flex-1">
              {[...posts]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 3)
                .map((post) => (
                  <li key={post.slug} className="border-b border-border-paper last:border-0">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="group block py-4 hover:bg-ink-dark transition-colors duration-150 -mx-5 px-5"
                    >
                      <span className="text-[10px] uppercase tracking-wider text-ink-blue block mb-1">
                        {post.category}
                      </span>
                      <p className="text-sm text-ink-dark group-hover:text-paper-light leading-snug transition-colors line-clamp-2">
                        {post.title}
                      </p>
                      <time className="text-[10px] text-ink-muted group-hover:text-paper-light group-hover:opacity-50 mt-1.5 block transition-colors duration-150">
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;