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
                If you want to nerd out about books, design, tech -- or debate whether
        Comic Sans is ever acceptable,{" "}
        <a
          className="linkStyle"
          href="https://www.linkedin.com/in/nguyen-amy"
          target="_blank"
          rel="noopener noreferrer"
        >
         DM me on LinkedIn
        </a>
        .<br />
      </p>
    </div>
  );
}

export default ContactPage;
