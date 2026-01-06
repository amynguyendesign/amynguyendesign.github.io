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
      <div className="contactIntro">
        If you want to discuss design, tech, culture -- or debate whether
        Comic Sans is ever acceptable,{" "}
        <a
          className="linkStyle"
          href="https://www.linkedin.com/in/nguyen-amy"
          target="_blank"
          rel="noopener noreferrer"
        >
          message me on LinkedIn
        </a>
        .
      </div>

      <div className="contactIntro">
        You can also keep up with what I'm reading on {" "}
        <a
          className="linkStyle"
          href="https://goodreads.com/amynlha"
          target="_blank"
          rel="noopener noreferrer"
        >
          Goodreads
        </a>
        .<br />
      </div>
    </div>
  );
}

export default ContactPage;
