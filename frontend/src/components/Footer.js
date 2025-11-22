import React from "react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-4 mt-5">
      <p>© 2025 Askar Stone. All rights reserved.</p>

      <div className="d-flex justify-content-center gap-4 mt-3">
        <a
          href="https://wa.me/96171096407"
          target="_blank"
          rel="noopener noreferrer"
          className="text-success fs-4"
        >
          <FaWhatsapp />
        </a>
        <a
          href="https://www.instagram.com/askar_stone/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-danger fs-4"
        >
          <FaInstagram />
        </a>
      </div>
    </footer>
  );
}
