import "./AboutPage.css";
import { useEffect } from "react";
import pic from "../../assets/amy.jpg";

function AboutPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
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
          With no prior technical experience, I started from scratch: multivariable calculus, first-order logic, my first lines of code. I gained a new mental framework -- one that rewired how I solve problems and build solutions.
        </p>

        <p>
          Today, I work at the intersection of engineering and design. I care
          about clarity, structure, and intention -- whether in a line of code,
          a layout decision, or a spacing that’s off by 2px and now I can’t
          unsee it. Drawn to patterns -- visual, conceptual and structural, I have a gut feeling for how things align, when they work, and where they break. I care deeply about aesthetics, and about the quiet magic that comes from things crafted with intention.
        </p>

        <p>
        I’ve never fit neatly into any one box, and I’ve stopped trying to. A systems thinker, if you will. Ultimately though, I just want to know enough across fields to understand all the jokes and memes.
        </p>
      </div>
    </div>
  );
}

export default AboutPage;
