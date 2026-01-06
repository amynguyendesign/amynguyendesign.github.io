import React, { useState, useEffect, useRef } from "react";
import "./ArtPage.css";
import cactus from "../../assets/cactus.jpg";
import onions from "../../assets/onions.JPG";
import sf from "../../assets/sf.jpg";
import coffee from "../../assets/coffee.jpg";
import spatula from "../../assets/spatula.JPG";
import bird from "../../assets/bird.jpg";
import graphite from "../../assets/graphite.jpg";
import chocolate from "../../assets/chocolate.JPG"
import metal from "../../assets/metal.jpg"
import surreal from "../../assets/surreal.jpg"
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

function PlayPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    const smoothScrollToHero = () => {
      const heroSection = document.querySelector(".playHero");
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

  const paintings = [onions, graphite, cactus, sf, metal, spatula, bird, chocolate, coffee, surreal];
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
          Art<span className="accent">.</span>

        </div>
          <p>A collection of works and studies across oil, watercolor, acrylic, and graphite.</p>
                <div
        className="scroll-down-arrow"
        onClick={() => {
          const nextSection = document.querySelector(".paintings-section");
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: "smooth" });
          }
        }}
      >
        ↓
      </div>
      </div>



      {/* Paintings */}
      <div ref={paintRef} className={`section paintings-section ${paintVisible ? 'visible' : ''}`}>
        <div className="gallery-grid">
          {paintings.map((painting, index) => (
            <div key={index} className="gallery-item" onClick={() => openLightbox(painting)}>
              <img src={painting} alt={`Painting ${index + 1}`} className="painting-image" />
            </div>
          ))}
        </div>
      </div>

      {/* <div ref={crochetRef} className={`section crochet-section ${crochetVisible ? 'visible' : ''}`}>
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

      <div ref={booksRef} className={`section books-section ${booksVisible ? 'visible' : ''}`}>
        <h2>Wordwork</h2>
        <p className="subtitleContainer">I grew up on books. A few of them have really stuck with me over time.</p>
        <p> Coming soon. </p> */}
        {/* <div className="book-grid">
          {books.map((book, index) => (
            <div key={index} className="book-item">
              <img src={book} alt={`Book ${index + 1}`} className="book-image" />
            </div>
          ))}
        </div> */}
      {/* </div> */}

      {lightboxImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <img src={lightboxImage} alt="Enlarged work" />
        </div>
      )}
     </div>
  );
}

export default PlayPage;