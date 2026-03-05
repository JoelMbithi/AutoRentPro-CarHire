'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaQuestionCircle, FaClock, FaCar, FaUser, FaPaperPlane, FaWhatsapp, FaTwitter, FaFacebook, FaInstagram, FaHeadset, FaArrowRight, FaCheck } from 'react-icons/fa';

// Define types for form data
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

// Define types for contact info
interface ContactInfo {
  icon: React.ReactElement;
  title: string;
  details: string[];
  description: string;
  link: string | null;
}

// Define types for location
interface Location {
  name: string;
  address: string;
  phone: string;
  hours: string;
  features: string[];
}

// Define types for FAQ
interface FAQ {
  question: string;
  answer: string;
}

const CarHireContact: React.FC = () => {
  const searchParams = useSearchParams();
  const agentId = searchParams.get('agent');
  const agentName = searchParams.get('name');
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    rentalType: '',
    agentId: agentId || '', 
    agentName: agentName || '',
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (agentId || agentName) {
      setFormData(prev => ({
        ...prev,
        agentId: agentId || prev.agentId,
        agentName: agentName || prev.agentName
      }));
    }
  }, [agentId, agentName]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = formData.agentId 
        ? `/features/Car-Agents/api/agents/${formData.agentId}/Contact_Agents`
        : "/features/ContactUs/api/contacts";
      
      const request = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await request.json();
      if (!request.ok) {
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
        agentName: agentName || ""
      });
    } catch (error) {
      console.error(error);
      alert("Failed to send message. Please try again.");
    }
    setIsSubmitting(false);
  };

  const contactInfo: ContactInfo[] = [
    {
      icon: <FaPhone className="text-orange-500" size={16} />,
      title: 'Call us',
      details: ['+(254) 743 264 773', '+1(254) 740 196 027'],
      description: '24/7 customer support',
      link: 'tel:+254743264773'
    },
    {
      icon: <FaEnvelope className="text-orange-500" size={16} />,
      title: 'Email us',
      details: ['autorentpro@gmail.com', 'support@autorentpro.com'],
      description: 'We respond within 2 hours',
      link: 'mailto:autorentpro@gmail.com'
    },
    {
      icon: <FaMapMarkerAlt className="text-orange-500" size={16} />,
      title: 'Visit us',
      details: ['Nairobi, Downtown', 'City, Nairobi'],
      description: 'Main office location',
      link: 'https://maps.google.com'
    },
    {
      icon: <FaClock className="text-orange-500" size={16} />,
      title: 'Business hours',
      details: ['Mon–Sun: 6:00 AM – 11:00 PM', '24/7 emergency support'],
      description: 'Extended hours for your convenience',
      link: null
    }
  ];

  const locations: Location[] = [
    { name: 'Nairobi CBD',    address: 'Kenyatta Avenue, ICEA Building, 3rd Floor', phone: '+254 700 123 456', hours: 'Mon–Sun: 6 AM – 10 PM',  features: ['Main Office', 'All Vehicles'] },
    { name: 'JKIA Airport',   address: 'JKIA Terminal 1A, Arrivals Hall',            phone: '+254 711 123 456', hours: '24/7 Operation',            features: ['Airport Pickup', 'Express'] },
    { name: 'Westlands',      address: 'Westlands Road, The Mirage, 2nd Floor',      phone: '+254 722 123 456', hours: 'Mon–Sun: 7 AM – 9 PM',   features: ['Corporate', 'Free Parking'] },
    { name: 'Mombasa',        address: 'Moi Avenue, Nyali, Mombasa',                 phone: '+254 733 123 456', hours: 'Mon–Sun: 6 AM – 9 PM',   features: ['4WD', 'Tour Packages'] },
    { name: 'Kisumu',         address: 'Oginga Odinga Road, Mega City Mall',         phone: '+254 744 123 456', hours: 'Mon–Sat: 7 AM – 8 PM',   features: ['Tourist Vehicles'] },
    { name: 'Nakuru',         address: 'Kenyatta Avenue, North Tower Building',      phone: '+254 755 123 456', hours: 'Mon–Sat: 7 AM – 8 PM',   features: ['Safari Vehicles'] },
    { name: 'Thika',          address: 'General Kago Road, Thika Town',              phone: '+254 766 123 456', hours: 'Mon–Sat: 7 AM – 7 PM',   features: ['Trucks', 'Commercial'] },
    { name: 'Eldoret',        address: 'Uganda Road, Rupa Mall',                     phone: '+254 777 123 456', hours: 'Mon–Sat: 7 AM – 8 PM',   features: ['Long-term', 'Agricultural'] },
  ];

  const faqs: FAQ[] = [
    { question: 'What documents do I need to rent a car?',  answer: "A valid driver's license, credit card, and proof of insurance. International renters may need a passport and international driving permit." },
    { question: 'What is your cancellation policy?',        answer: 'You can cancel free of charge up to 24 hours before your rental. Cancellations within 24 hours may incur a small fee.' },
    { question: 'Do you offer one-way rentals?',            answer: 'Yes, between most of our locations. Additional fees may apply depending on the drop-off location.' },
    { question: 'What is the minimum age to rent a car?',   answer: 'The minimum age is 21 years. Renters under 25 may be subject to a young driver surcharge.' },
  ];

  const inputClass = "w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section
        className="relative text-white bg-cover bg-center"
        style={{ backgroundImage: "url('/Contact.png')" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-24 lg:py-36">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">

            {/* Left */}
            <div>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <span className="h-px w-8 bg-orange-500" />
                <p className="text-xs font-semibold uppercase tracking-widest text-white">AutoRentPro Support</p>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 sm:mb-4 leading-tight">
                Get in <span className="text-orange-500">touch</span>
              </h1>
              <p className="text-gray-300 text-sm leading-relaxed mb-6 sm:mb-8 max-w-md">
                Reach our team for reservations, fleet inquiries, or any help — available 24/7.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-white/10">
                {[
                  { val: '24/7', label: 'Support' },
                  { val: '5min', label: 'Avg. response' },
                  { val: '8+', label: 'Locations' },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-xl sm:text-2xl font-black">{s.val}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-5 sm:mb-6">
                <a href="tel:+254743861565" className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 sm:px-5 py-2.5 rounded-xl text-sm transition-colors">
                  <FaPhone size={11} /> Call now
                </a>
                <a href="mailto:autorentpro@gmail.com" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-4 sm:px-5 py-2.5 rounded-xl text-sm transition-colors">
                  <FaEnvelope size={11} /> Email us
                </a>
                <a href="https://wa.me/254743861565" className="inline-flex items-center gap-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-white font-semibold px-4 sm:px-5 py-2.5 rounded-xl text-sm transition-colors">
                  <FaWhatsapp size={12} /> WhatsApp
                </a>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4">
                {['24/7 Customer Support', 'Multi-language Support', 'Instant Quotes', 'No Hidden Fees'].map((b) => (
                  <div key={b} className="flex items-center gap-1.5">
                    <FaCheck className="text-orange-400 shrink-0" size={10} />
                    <span className="text-xs text-gray-300">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — quick contact card (hidden on mobile) */}
            <div className="hidden lg:block bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <p className="text-sm font-semibold mb-5 flex items-center gap-2">
                <FaClock className="text-orange-400" size={13} /> Quick contact
              </p>
              <div className="space-y-4">
                {[
                  { icon: <FaPhone size={11} />, label: 'Phone', lines: ['+254 743 861 565', 'Toll-free: 0800 123 456'] },
                  { icon: <FaEnvelope size={11} />, label: 'Email', lines: ['autorentpro@gmail.com', 'support@autorentpro.com'] },
                  { icon: <FaMapMarkerAlt size={11} />, label: 'Head Office', lines: ['Nairobi, Kenya', 'ICEA Building, 3rd Floor'] },
                  { icon: <FaClock size={11} />, label: 'Business Hours', lines: ['Mon–Sun: 6:00 AM – 11:00 PM', 'Emergency: 24/7'] },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center shrink-0 text-orange-400">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                      {item.lines.map((l, i) => (
                        <p key={i} className={`text-sm ${i === 0 ? 'font-semibold text-white' : 'text-gray-400'}`}>{l}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-white/10">
                <span className="text-xs text-gray-400 ml-1">4.9/5 · 2,500+ reviews</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Contact methods ── */}
      <section className="py-8 sm:py-10 px-4 sm:px-6 border-b border-gray-200">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {contactInfo.map((item, i) => (
            <div key={i} className="p-3 sm:p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                {item.icon}
                <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
              </div>
              <div className="mb-1 space-y-0.5">
                {item.details.map((d, j) => (
                  <p key={j} className="text-gray-700 text-xs sm:text-sm break-words">{d}</p>
                ))}
              </div>
              <p className="text-gray-400 text-xs mb-2 sm:mb-3 hidden sm:block">{item.description}</p>
              {item.link && (
                <a href={item.link} className="text-xs font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors">
                  Contact <FaArrowRight size={9} />
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Form + sidebar ── */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 border-b border-gray-200">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">

          {/* Form */}
          <div>
            <div className="mb-5 sm:mb-6">
              <h2 className="text-xl font-bold text-gray-900">Send us a message</h2>
              <p className="text-gray-400 text-sm mt-1">We usually respond within 30 minutes.</p>
            </div>

            {/* Agent indicator */}
            {formData.agentName && (
              <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-lg px-3 py-2.5 mb-5">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full shrink-0" />
                <p className="text-sm text-gray-600">
                  Contacting <span className="text-gray-900 font-semibold">{formData.agentName}</span>
                </p>
              </div>
            )}

            {isSubmitted ? (
              <div className="py-12 text-center border border-gray-200 rounded-xl">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaCheck className="text-green-600" size={13} />
                </div>
                <p className="font-semibold text-gray-900 mb-1">Message sent!</p>
                <p className="text-gray-400 text-sm mb-5">We'll get back to you within 2 hours.</p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="hidden" name="agentId" value={formData.agentId} />
                <input type="hidden" name="agentName" value={formData.agentName} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Full name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your full name" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Enter your email" className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+254 700 000 000" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Rental type</label>
                    <select name="rentalType" value={formData.rentalType} onChange={handleChange} className={inputClass}>
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
                    placeholder={formData.agentName ? `Inquiry for ${formData.agentName}` : "What is this regarding?"}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Message *</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} placeholder="Tell us about your rental needs or any questions..." className={`${inputClass} resize-none`} />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <FaPaperPlane size={12} />
                      {formData.agentName ? `Send to ${formData.agentName}` : "Send message"}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">

            {/* Emergency support */}
            <div className="bg-gray-900 text-white rounded-xl p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-3">
                <FaHeadset className="text-orange-400 shrink-0" size={16} />
                <p className="font-semibold text-sm">24/7 Roadside Assistance</p>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Need help on the road? Our emergency team is available around the clock across Kenya.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <FaPhone className="text-gray-400 shrink-0" size={11} />
                  <div>
                    <p className="text-gray-500 text-xs">Emergency hotline</p>
                    <p className="text-white text-sm font-semibold">+254 743 861 565</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <FaWhatsapp className="text-gray-400 shrink-0" size={12} />
                  <div>
                    <p className="text-gray-500 text-xs">WhatsApp</p>
                    <p className="text-white text-sm font-semibold">+254 743 861 565</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="border border-gray-200 rounded-xl p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <FaQuestionCircle className="text-gray-400" size={15} />
                <p className="font-semibold text-gray-900 text-sm">Common questions</p>
              </div>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                    <p className="font-medium text-gray-800 text-sm mb-1">{faq.question}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div className="border border-gray-200 rounded-xl p-4">
              <p className="font-semibold text-gray-900 text-sm mb-3">Follow us</p>
              <div className="flex gap-2">
                {[
                  { icon: FaFacebook,  label: 'Facebook',  href: '#' },
                  { icon: FaTwitter,   label: 'Twitter',   href: '#' },
                  { icon: FaInstagram, label: 'Instagram', href: '#' },
                  { icon: FaWhatsapp,  label: 'WhatsApp',  href: '#' },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-10 h-10 bg-gray-100 hover:bg-orange-50 hover:text-orange-600 text-gray-500 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <s.icon size={15} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Locations ── */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl font-bold text-gray-900">Our locations</h2>
            <p className="text-gray-400 text-sm mt-1">Visit us at any of our branches across Kenya.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {locations.map((loc, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors flex flex-col">
                <div className="flex items-start gap-2 mb-3">
                  <FaMapMarkerAlt className="text-orange-500 mt-0.5 shrink-0" size={12} />
                  <p className="font-semibold text-gray-900 text-sm leading-tight">{loc.name}</p>
                </div>
                <div className="space-y-1.5 text-xs text-gray-500 mb-3">
                  <p className="leading-relaxed">{loc.address}</p>
                  <div className="flex items-center gap-1.5">
                    <FaPhone className="text-gray-300 shrink-0" size={10} />
                    <span>{loc.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FaClock className="text-gray-300 shrink-0" size={10} />
                    <span>{loc.hours}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-3 mt-auto">
                  {loc.features.map((f, j) => (
                    <span key={j} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{f}</span>
                  ))}
                </div>
                <button className="text-xs font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors">
                  Get directions <FaArrowRight size={9} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default CarHireContact;