import React, { useState, useEffect } from "react";
import "./ArtPage.css";
import painting1 from "../../assets/cactus.jpg";
import painting2 from "../../assets/onions.JPG";
import painting3 from "../../assets/sf.jpg";
import painting4 from "../../assets/coffee.jpg";
import painting5 from "../../assets/spatula.JPG";

function ArtPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);
  const paintings = [painting1, painting2, painting3, painting4, painting5];
  const [lightboxImage, setLightboxImage] = useState(null);

  const openLightbox = (image) => setLightboxImage(image);
  const closeLightbox = () => setLightboxImage(null);

  return (
    <div className="play-page homeContainer">
      <div className="headline1 fadeSlideIn">
        Play<span className="accent">.</span>
      </div>
      <div className="leftText">
        This is where the side quests live. Painting, crocheting, customizing my
        VSCode — more photos to come. Play is how I train my eye, test my
        instincts, and stay curious. It’s how I practice noticing patterns.{" "}
        <br />
        Every new thing feels new… until you hit critical mass. Then the
        patterns click, and everything starts to make sense... fast — that’s the
        moment I chase. <br />
        It’s not about outcomes. Or at least, I try really hard for it not to
        be. (Not hard enough, clearly, since I still felt the need to say that.)
      </div>
      <div className="gallery-grid">
        {paintings.map((painting, index) => (
          <div
            key={index}
            className="gallery-item"
            onClick={() => openLightbox(painting)}
          >
            <img
              src={painting}
              alt={`Painting ${index + 1}`}
              className="painting-image"
            />
          </div>
        ))}
      </div>

      {lightboxImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <img src={lightboxImage} alt="Enlarged painting" />
        </div>
      )}
    </div>
  );
}

export default ArtPage;
