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
          chose to pursue Computer Science because it stretched me in the
          opposite direction. I wanted to round out my thinking -- to push
          myself toward a type of intellectual challenge I hadn’t yet mastered.
        </p>

        <p>
          With no prior technical experience, I started from scratch: multivariable calculus, first-order logic, my first lines of code. I gained a new mental framework -- one that rewired how I solve problems and how I build solutions.
        </p>

        <p>
          Today, I work at the intersection of engineering and design. I care
          about clarity, structure, and intention -- whether in a line of code,
          a layout decision, or a spacing that’s off by 2px and now I can’t
          unsee it. I’m drawn to patterns -- not just visual ones, but
          conceptual ones. I have a gut feeling for how things align, when they
          work, and where they break. I have a deep love for aesthetics and for
          the quiet magic of things crafted with intention.
        </p>

        <p>
          I’ve never fit neatly into a single category and I’ve stopped trying
          to. The common thread across my work is care: for visuals, for
          usability, and for the people on the other end. Mostly, I just want to
          understand jokes from as many fields as possible.
        </p>
      </div>
    </div>
  );
}

export default AboutPage;
