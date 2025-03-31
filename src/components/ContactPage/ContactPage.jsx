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
    <div className="contactPage">
      <div className="headline1 fadeSlideIn">
        Get in touch<span className="accent">.</span>
      </div>
      <p className="contactIntro">
        I’m on{" "}
        <a href="https://www.linkedin.com/in/amynguyen" target="_blank">
          LinkedIn
        </a>
        .<br />
        If you want to nerd out about books, design, tech — or debate whether{" "}
        <span className="comicSans">Comic Sans</span> is ever acceptable,{" "}
        <a href="mailto:amy@example.com">shoot me an email</a>.
      </p>
    </div>
  );
}

export default ContactPage;
