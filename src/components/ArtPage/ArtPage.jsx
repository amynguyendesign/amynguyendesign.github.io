import React, { useState, useEffect, useRef } from "react";
import "./ArtPage.css";
import painting1 from "../../assets/cactus.jpg";
import painting2 from "../../assets/onions.JPG";
import painting3 from "../../assets/sf.jpg";
import painting4 from "../../assets/coffee.jpg";
import painting5 from "../../assets/spatula.JPG";
import painting6 from "../../assets/bird.jpg";
import crochet1 from "../../assets/crochet-red.jpg"
import crochet2 from "../../assets/crochet-blue.jpg"
import crochet3 from "../../assets/crochet-pink.jpg"
import crochet4 from "../../assets/crochet-purple.jpeg"
import crochet5 from "../../assets/crochet-beige.jpg"


// Intersection Observer Hook
function useInView(threshold = 0.3) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}

function ArtPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const paintings = [painting1, painting2, painting3, painting4, painting5, painting6];
  const crochet = [crochet1, crochet2, crochet3, crochet5, crochet4];
 // const books = [painting4, painting3, painting2, painting1, painting5, painting6];

  const [lightboxImage, setLightboxImage] = useState(null);
  const openLightbox = (image) => setLightboxImage(image);
  const closeLightbox = () => setLightboxImage(null);

  // Section observers
  const [paintRef, paintVisible] = useInView();
  const [crochetRef, crochetVisible] = useInView();
  const [booksRef, booksVisible] = useInView();

  return (
    <div className="play-page">
      {/* Hero */}
      <div className="playHero fadeSlideIn">
        <div className="headline1">
          Play<span className="accent">.</span>
        </div>
        <p>My favorite rabbit holes live here: painting, crocheting, writing book reviews. Play is how I train my eye, test my instincts, and practice noticing patterns.</p>
        <p>It’s not about outcomes. Or at least, I try really hard for it not to be. (Not hard enough apparently, since I still felt the need to say that.)</p>
      </div>

      {/* Paintings */}
      <div ref={paintRef} className={`section paintings-section ${paintVisible ? 'visible' : ''}`}>
        <h2>Brushwork</h2>
        <p className="subtitleContainer">I dabbled in a bunch of mediums: oil, acrylic, digital, ... but eventually settled on watercolor. I like its softness and transparency.</p>
        <div className="gallery-grid">
          {paintings.map((painting, index) => (
            <div key={index} className="gallery-item" onClick={() => openLightbox(painting)}>
              <img src={painting} alt={`Painting ${index + 1}`} className="painting-image" />
            </div>
          ))}
        </div>
      </div>

      {/* Crochet */}
      <div ref={crochetRef} className={`section crochet-section ${crochetVisible ? 'visible' : ''}`}>
        <h2>Threadwork</h2>
        <p className="subtitleContainer">Crocheting comes really easily to me for some reason. The way it builds just makes sense to my brain.</p>
        <div className="crochet-grid">
          {crochet.map((item, index) => (
            <div key={index} className="gallery-item" onClick={() => openLightbox(item)}>
              <img src={item} alt={`Crochet ${index + 1}`} className="painting-image" />
            </div>
          ))}
        </div>
      </div>

      {/* Book Reviews */}
      <div ref={booksRef} className={`section books-section ${booksVisible ? 'visible' : ''}`}>
        <h2>Wordwork</h2>
        <p className="subtitleContainer">I grew up on books. As an adult though, I see more of the life inside the words -- the kind of things that only make sense once you’ve lived a little yourself.</p>
        <p> Coming soon. </p>
        {/* <div className="book-grid">
          {books.map((book, index) => (
            <div key={index} className="book-item">
              <img src={book} alt={`Book ${index + 1}`} className="book-image" />
            </div>
          ))}
        </div> */}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <img src={lightboxImage} alt="Enlarged work" />
        </div>
      )}
    </div>
  );
}

export default ArtPage;