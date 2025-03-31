import { useEffect } from "react";
import "./ContactPage.css";

function ContactPage() {
  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="homeContainer">
      <div className="headline1 fadeSlideIn">
        Get in touch<span className="accent">.</span>
      </div>
      <p className="contactIntro">
        I’m on{" "}
        <a
          className="linkStyle"
          href="https://www.linkedin.com/in/amynguyen"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        .<br />
        If you want to nerd out about books, design, tech — or debate whether
        Comic Sans is ever acceptable,{" "}
        <a
          className="linkStyle"
          href="mailto:&#97;&#110;&#103;&#117;&#121;&#101;&#110;&#54;&#56;&#48;&#57;&#64;&#103;&#109;&#97;&#105;&#108;&#46;&#99;&#111;&#109;"
        >
          shoot me an email
        </a>
        .
      </p>
    </div>
  );
}

export default ContactPage;
