import "./AboutPage.css";
import { useEffect } from "react";
import pic from "../../assets/amy.jpg";

function AboutPage() {
  useEffect(() => {
    const smoothScrollToHero = () => {
      const heroSection = document.querySelector(".aboutContainer");
      if (heroSection) {
        const heroPosition = heroSection.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: heroPosition,
          behavior: "smooth",
        });
      }
    };

    smoothScrollToHero();
  }, []);

  return (
    <div className="homeContainer aboutContainer fadeSlideIn">
      <div className="headline1 aboutPhotoWrapper">
        <div>
          About me<span className="accent">.</span>
        </div>
        <img src={pic} alt="Amy" className="aboutPhotoEnd" />
      </div>
      <div className="leftText">
        <p>
          I entered Stanford with a background in writing and literature, but
          chose to pursue Computer Science because I wanted to push
          myself toward a type of intellectual challenge I hadn’t yet mastered.
        </p>

        <p>
          With no prior technical experience, I started from scratch: multivariable calculus, first-order logic, my first lines of code. I gained a new mental framework that rewired how I solve problems and build solutions.
        </p>

        <p>
          Today, I work at the intersection of software engineering and product design. I take pride in my work and continually strive to refine my craft. Drawn to patterns: visual, conceptual and structural, I have a gut feeling for how things align, when they work, and where they break.
        </p>

        <p>I also care deeply about aesthetics, and about the quiet magic that comes from things crafted with intention.</p>

        <p>
        I thrive at the intersection of disciplines. A poly-hyphenate, if you will. Ultimately though, I just want to understand as many jokes from as many fields as possible •ᴗ•
        </p>
      </div>
    </div>
  );
}

export default AboutPage;
