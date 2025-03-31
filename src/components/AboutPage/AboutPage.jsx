import "./AboutPage.css";
import pic from "../../assets/amy.jpg";

function AboutPage() {
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
          opposite direction. I wanted to round out my thinking — to push myself
          toward a type of intellectual challenge I hadn’t yet mastered.
        </p>

        <p>
          With no prior technical experience, I started from scratch — Calculus
          I, Physics I, my first lines of code. It was difficult by design, and
          it taught me adaptability, rigor, and how to build entirely new mental
          frameworks from the ground up.
        </p>

        <p>
          Today, I work at the intersection of design and engineering. I care
          about clarity, structure, and intention — whether in a line of code, a
          UI interaction, or the way a system fits together. I’m drawn to
          patterns — not just visual ones, but conceptual ones. I have a gut
          feeling for how things align, how they echo, and where they break. I
          have a deep love for aesthetics, systems that make sense, and
          decisions that feel deliberate.
        </p>

        <p>
          I’ve never fit neatly into a single category — and I’ve stopped trying
          to. The common thread across my work is care: for visuals, for
          usability, and for the people on the other end.
        </p>

        <p>
          Ultimately, I just want to understand jokes from as many fields as
          possible.
        </p>
      </div>
    </div>
  );
}

export default AboutPage;
