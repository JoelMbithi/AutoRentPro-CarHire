import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const WhatsAppChat = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Pulse ring effect */}
     {/*  <div className="absolute -inset-4">
        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>
        <div className="absolute inset-1 rounded-full bg-green-500 animate-ping opacity-10 animation-delay-1000"></div>
      </div> */}
      
      <a
        href="https://wa.me/254743861565?text=Hello%2C%20I%27m%20interested%20in%20your%20car%20hire%20services%20at%20AutoRentPro.%20Kindly%20assist%20with%20availability%20and%20pricing."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative flex items-center justify-center w-10 h-10 rounded-full b-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-green-200 animate-float"
      >
        <FontAwesomeIcon
          icon={faWhatsapp}
          className="text-3xl text-green-500"
        />
      </a>
    </div>
  );
};

export default WhatsAppChat;