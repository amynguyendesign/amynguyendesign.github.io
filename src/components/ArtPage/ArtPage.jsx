import React, { useState } from 'react';
import './ArtPage.css';
import painting1 from '../../assets/cactus.jpg';
import painting2 from '../../assets/onions.JPG';
import painting3 from '../../assets/sf.jpg';
import painting4 from '../../assets/coffee.jpg';

function ArtPage() {
  const paintings = [painting1, painting2, painting3, painting4];
  const [lightboxImage, setLightboxImage] = useState(null);

  const openLightbox = (image) => setLightboxImage(image);
  const closeLightbox = () => setLightboxImage(null);

  return (
    <div className="art-page">
            <div className="bodyText art-title">I paint often and will post more pics here, so check back! ♡
      {/* <div className="bodyText">
      There’s no <span className="inlineCode">cmd + z </span>in watercolor painting, and it’s much less forgiving of mistakes than pushing pixels. I love it.<br/>*/}
 
      <div className="gallery-grid">
        {paintings.map((painting, index) => (
          <div key={index} className="gallery-item" onClick={() => openLightbox(painting)}>
            <img src={painting} alt={`Painting ${index + 1}`} className="painting-image" />
          </div>
        ))}
      </div>

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
