import "./ContactPage.css";

function ContactPage() {
  return (
    <div className="contactContainer fadeSlideIn">
      <div className="headline1">Get in touch<span className="accent">.</span></div>
      <div>
        I’m on{" "}
        <a
          href="https://www.linkedin.com/in/nguyen-amy/"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          LinkedIn
        </a>
        .
        <div>
          For book chats or product critiques,{" "}
          <a href="mailto:anguyen6809@gmail.com" className="link">
            email works best.
          </a>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;