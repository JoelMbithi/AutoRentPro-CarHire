"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaWhatsapp,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaCheck,
} from "react-icons/fa";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  rentalType: string;
  agentId: string;
  agentName: string;
}

interface Location {
  name: string;
  address: string;
  phone: string;
  hours: string;
  features: string[];
}

const CarHireContact: React.FC = () => {
  const searchParams = useSearchParams();
  const agentId = searchParams.get("agent");
  const agentName = searchParams.get("name");

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    rentalType: "",
    agentId: agentId || "",
    agentName: agentName || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (agentId || agentName) {
      setFormData((prev) => ({
        ...prev,
        agentId: agentId || prev.agentId,
        agentName: agentName || prev.agentName,
      }));
    }
  }, [agentId, agentName]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = formData.agentId
        ? `/features/Car-Agents/api/agents/${formData.agentId}/Contact_Agents`
        : "/features/ContactUs/api/contacts";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong");
        setIsSubmitting(false);
        return;
      }

      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        rentalType: "",
        agentId: agentId || "",
        agentName: agentName || "",
      });
    } catch {
      alert("Failed to send message. Please try again.");
    }
    setIsSubmitting(false);
  };

  const locations: Location[] = [
    {
      name: "Nairobi CBD",
      address: "Kenyatta Avenue, ICEA Building, 3rd Floor",
      phone: "+254 700 123 456",
      hours: "Mon–Sun: 6 AM – 10 PM",
      features: ["Main Office", "All Vehicles"],
    },
    {
      name: "JKIA Airport",
      address: "JKIA Terminal 1A, Arrivals Hall",
      phone: "+254 711 123 456",
      hours: "24/7 Operation",
      features: ["Airport Pickup", "Express"],
    },
    {
      name: "Westlands",
      address: "Westlands Road, The Mirage, 2nd Floor",
      phone: "+254 722 123 456",
      hours: "Mon–Sun: 7 AM – 9 PM",
      features: ["Corporate", "Free Parking"],
    },
    {
      name: "Mombasa",
      address: "Moi Avenue, Nyali, Mombasa",
      phone: "+254 733 123 456",
      hours: "Mon–Sun: 6 AM – 9 PM",
      features: ["4WD", "Tour Packages"],
    },
    {
      name: "Kisumu",
      address: "Oginga Odinga Road, Mega City Mall",
      phone: "+254 744 123 456",
      hours: "Mon–Sat: 7 AM – 8 PM",
      features: ["Tourist Vehicles"],
    },
    {
      name: "Nakuru",
      address: "Kenyatta Avenue, North Tower Building",
      phone: "+254 755 123 456",
      hours: "Mon–Sat: 7 AM – 8 PM",
      features: ["Safari Vehicles"],
    },
    {
      name: "Thika",
      address: "General Kago Road, Thika Town",
      phone: "+254 766 123 456",
      hours: "Mon–Sat: 7 AM – 7 PM",
      features: ["Trucks", "Commercial"],
    },
    {
      name: "Eldoret",
      address: "Uganda Road, Rupa Mall",
      phone: "+254 777 123 456",
      hours: "Mon–Sat: 7 AM – 8 PM",
      features: ["Long-term", "Agricultural"],
    },
  ];

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:border-orange-500 transition";
  const labelClass = "block text-sm text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ── */}
     <section
  className="relative text-white bg-cover bg-center"
  style={{ backgroundImage: "url('/Contact.png')" }}
>
  <div className="absolute inset-0 bg-black/55" />
  <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 py-24 sm:py-36">
    <p className="text-xs uppercase tracking-[0.2em] text-orange-400 mb-5">AutoRentPro</p>
    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-4">
      Talk to us
    </h1>
    <p className="text-white/60 text-base max-w-sm leading-relaxed">
      Monday to Sunday, 6 AM – 11 PM. Our team is available across all branches
      in Kenya, with a 24/7 emergency line for urgent matters.
    </p>
  </div>
</section>

      {/* ── Contact info strip ── */}
      <section className="border-b border-gray-200 bg-orange-50">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-200">
          {[
            {
              icon: FaPhone,
              label: "Phone",
              lines: ["+254 743 264 773", "+254 740 196 027"],
              href: "tel:+254743264773",
              action: "Call now",
            },
            {
              icon: FaEnvelope,
              label: "Email",
              lines: ["autorentpro@gmail.com", "support@autorentpro.com"],
              href: "mailto:autorentpro@gmail.com",
              action: "Send email",
            },
            {
              icon: FaMapMarkerAlt,
              label: "Head Office",
              lines: ["ICEA Building, 3rd Floor", "Kenyatta Avenue, Nairobi"],
              href: "https://maps.google.com",
              action: "Get directions",
            },
            {
              icon: FaClock,
              label: "Business Hours",
              lines: ["Mon–Sun: 6:00 AM – 11:00 PM", "Emergency: 24/7"],
              href: null,
              action: null,
            },
          ].map((item, i) => (
            <div key={i} className="py-5 px-4 lg:px-6">
              <div className="flex items-center gap-2 mb-2">
                <item.icon className="text-orange-500" size={14} />
                <p className="text-xs text-gray-500">{item.label}</p>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {item.lines[0]}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{item.lines[1]}</p>
              {item.href && item.action && (
                <a
                  href={item.href}
                  className="text-xs text-orange-600 hover:underline mt-1.5 inline-block"
                >
                  {item.action} →
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
      {/* ── Form + sidebar ── */}
      <section className="py-12 px-6 border-b border-gray-200">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Send us a message
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              We usually respond within 30 minutes.
            </p>

            {formData.agentName && (
              <p className="text-sm text-gray-600  mb-5">
                <span className="animate-pulse "> Contacting...</span>{" "}
                <strong>{formData.agentName}</strong>
              </p>
            )}

            {isSubmitted ? (
              <div className="py-12 text-center border border-gray-200 rounded">
                <FaCheck className="text-green-600 mx-auto mb-3" size={18} />
                <p className="font-medium text-gray-900 mb-1">Message sent</p>
                <p className="text-gray-500 text-sm mb-5">
                  We'll get back to you within 2 hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-sm text-orange-600 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="hidden" name="agentId" value={formData.agentId} />
                <input
                  type="hidden"
                  name="agentName"
                  value={formData.agentName}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Full name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phonenumber"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Rental type</label>
                    <select
                      name="rentalType"
                      value={formData.rentalType}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select type</option>
                      <option value="economy">Economy</option>
                      <option value="compact">Compact</option>
                      <option value="suv">SUV & 4x4</option>
                      <option value="luxury">Luxury</option>
                      <option value="commercial">Commercial</option>
                      <option value="long-term">Long-term</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder={
                      formData.agentName
                        ? `Inquiry for ${formData.agentName}`
                        : "What is this regarding?"
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us about your rental needs or any questions…"
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium py-2.5 px-6 rounded text-sm transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                      Sending…
                    </>
                  ) : (
                    <>
                      {formData.agentName
                        ? `Send to ${formData.agentName}`
                        : "Send message"}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Emergency */}
            <div className="bg-gray-900 text-white rounded p-5">
              <p className="font-medium text-sm mb-2">
                24/7 Roadside Assistance
              </p>
              <p className="text-gray-400 text-sm mb-4">
                Emergency support available around the clock across Kenya.
              </p>
              <div className="space-y-2 text-sm">
                <p className="text-gray-400 text-xs">Emergency hotline</p>
                <p className="font-medium">+254 743 861 565</p>
                <p className="text-gray-400 text-xs mt-2">WhatsApp</p>
                <p className="font-medium">+254 743 861 565</p>
              </div>
            </div>

            {/* Social */}
            <div>
              <p className="text-sm text-gray-600 mb-3">Follow us</p>
              <div className="flex gap-2">
                {[
                  { icon: FaFacebook, label: "Facebook", href: "#" },
                  { icon: FaTwitter, label: "Twitter", href: "#" },
                  { icon: FaInstagram, label: "Instagram", href: "#" },
                  {
                    icon: FaWhatsapp,
                    label: "WhatsApp",
                    href: "https://wa.me/254743861565",
                  },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-9 h-9 border border-gray-200 hover:border-orange-400 hover:text-orange-600 text-gray-500 rounded flex items-center justify-center transition-colors"
                  >
                    <s.icon size={14} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Locations ── */}
      <section className="py-12 px-6 bg-orange-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Our locations
          </h2>
          <p className="text-sm text-gray-500 mb-7">
            Visit us at any of our branches across Kenya.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {locations.map((loc, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded p-4 flex flex-col"
              >
                <p className="font-semibold text-gray-900 text-sm mb-2">
                  {loc.name}
                </p>
                <div className="text-xs text-gray-500 space-y-1 mb-3">
                  <p>{loc.address}</p>
                  <p>{loc.phone}</p>
                  <p>{loc.hours}</p>
                </div>
                <div className="flex flex-wrap gap-1 mb-3 mt-auto">
                  {loc.features.map((f, j) => (
                    <span
                      key={j}
                      className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded"
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <a
                  href="https://maps.google.com"
                  className="text-xs text-orange-600 hover:underline"
                >
                  Get directions →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CarHireContact;
