import React from 'react';

const Contact = () => {
  const whatsappNumber = '1234567890'; // Replace with actual number
  const instagramHandle = 'tuusuario'; // Replace with actual handle

  return (
    <section className="contact" id="contact" data-testid="contact-section">
      <div className="contact-container">
        <h2 data-testid="contact-title">Contáctanos</h2>
        <p data-testid="contact-subtitle">
          ¿Listo para tu próximo dispositivo Apple? Estamos aquí para ayudarte.
        </p>
        <div className="contact-buttons">
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-btn whatsapp"
            data-testid="contact-whatsapp-btn"
          >
            💬 WhatsApp
          </a>
          <a
            href={`https://instagram.com/${instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-btn instagram"
            data-testid="contact-instagram-btn"
          >
            📸 Instagram
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;