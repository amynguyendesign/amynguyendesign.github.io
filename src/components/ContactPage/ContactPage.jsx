import { useEffect } from "react";
import "./ContactPage.css";

function ContactPage() {
  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth", // can also try "auto" for instant scroll
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
        >
          LinkedIn
        </a>
        .<br />
        If you want to nerd out about books, design, tech — or debate whether{" "}
        <span className="comicSans">Comic Sans</span> is ever acceptable,{" "}
        <a
          className="linkStyle"
          href="mailto:&#110;&#103;&#117;&#121;&#101;&#110;&#97;&#108;&#64;&#97;&#108;&#117;&#109;&#110;&#105;&#46;&#115;&#116;&#97;&#110;&#102;&#111;&#114;&#100;&#46;&#101;&#100;&#117;"
        >
          shoot me an email
        </a>
        .
      </p>
    </div>
  );
}

export default ContactPage;
