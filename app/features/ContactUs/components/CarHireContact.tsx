// app/contact/components/CarHireContact.tsx
'use client';

import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaCar, FaUser, FaPaperPlane, FaWhatsapp, FaTwitter, FaFacebook, FaInstagram, FaHeadset } from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io';

const CarHireContact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    rentalType: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      rentalType: ''
    });
  };

  const contactInfo = [
    {
      icon: <FaPhone className="text-2xl text-orange-600" />,
      title: 'Call Us',
      details: ['+1 (555) 123-4567', '+1 (555) 123-4568'],
      description: '24/7 Customer Support',
      link: 'tel:+15551234567'
    },
    {
      icon: <FaEnvelope className="text-2xl text-orange-600" />,
      title: 'Email Us',
      details: ['info@autorentpro.com', 'support@autorentpro.com'],
      description: 'We respond within 2 hours',
      link: 'mailto:info@autorentpro.com'
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl text-orange-600" />,
      title: 'Visit Us',
      details: ['123 Main Street, Downtown', 'City, State 12345'],
      description: 'Main Office Location',
      link: 'https://maps.google.com'
    },
    {
      icon: <FaClock className="text-2xl text-orange-600" />,
      title: 'Business Hours',
      details: ['Mon-Sun: 6:00 AM - 11:00 PM', '24/7 Emergency Support'],
      description: 'Extended hours for your convenience',
      link: null
    }
  ];

  const locations = [
    {
      name: 'Downtown Office',
      address: '123 Main Street, Downtown',
      phone: '+1 (555) 123-4567',
      hours: 'Mon-Sun: 6:00 AM - 11:00 PM',
      features: ['Main Office', 'All Vehicle Types', 'On-site Support']
    },
    {
      name: 'Airport Terminal',
      address: 'Airport Boulevard, Terminal 2',
      phone: '+1 (555) 123-4568',
      hours: '24/7 Operation',
      features: ['Airport Pickup', 'Express Service', 'International Clients']
    },
    {
      name: 'City Center',
      address: '456 Central Avenue',
      phone: '+1 (555) 123-4569',
      hours: 'Mon-Sun: 7:00 AM - 10:00 PM',
      features: ['City Location', 'Business District', 'Quick Rentals']
    },
    {
      name: 'Business District',
      address: '789 Corporate Drive',
      phone: '+1 (555) 123-4570',
      hours: 'Mon-Fri: 6:00 AM - 9:00 PM',
      features: ['Corporate Accounts', 'Fleet Services', 'Business Travel']
    }
  ];

  const faqs = [
    {
      question: 'What documents do I need to rent a car?',
      answer: 'You need a valid driver\'s license, credit card, and proof of insurance. International renters may need a passport and international driving permit.'
    },
    {
      question: 'What is your cancellation policy?',
      answer: 'You can cancel free of charge up to 24 hours before your rental. Cancellations within 24 hours may incur a small fee.'
    },
    {
      question: 'Do you offer one-way rentals?',
      answer: 'Yes, we offer one-way rentals between most of our locations. Additional fees may apply depending on the drop-off location.'
    },
    {
      question: 'What is the minimum age to rent a car?',
      answer: 'The minimum age is 21 years. Renters under 25 may be subject to a young driver surcharge.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 to-purple-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Contact AutoRentPro</h1>
            <p className="text-xl mb-4 opacity-90">
              Get in touch with our team for any questions about car rentals, reservations, or support.
            </p>
            <p className="text-lg opacity-80">
              We're here to help you find the perfect vehicle for your journey.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Multiple ways to reach us. Choose what works best for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((item, index) => (
              <div key={index} className="text-center p-8 rounded-2xl bg-gray-50 hover:shadow-lg transition duration-300 border border-gray-100">
                <div className="flex justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{item.title}</h3>
                <div className="space-y-2 mb-4">
                  {item.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600 font-medium">{detail}</p>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mb-4">{item.description}</p>
                {item.link && (
                  <a
                    href={item.link}
                    className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-300"
                  >
                    Contact Now
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <FaHeadset className="text-3xl text-orange-600" />
                <h2 className="text-3xl font-bold text-gray-800">Send us a Message</h2>
              </div>
              
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaPaperPlane className="text-green-600 text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Message Sent!</h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for contacting us. We'll get back to you within 2 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-300"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        <FaUser className="inline mr-2 text-orange-600" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        <IoMdMail className="inline mr-2 text-orange-600" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        <FaPhone className="inline mr-2 text-orange-600" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        <FaCar className="inline mr-2 text-orange-600" />
                        Rental Type
                      </label>
                      <select
                        name="rentalType"
                        value={formData.rentalType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">Select rental type</option>
                        <option value="economy">Economy Car</option>
                        <option value="compact">Compact Car</option>
                        <option value="suv">SUV</option>
                        <option value="luxury">Luxury Vehicle</option>
                        <option value="commercial">Commercial Vehicle</option>
                        <option value="long-term">Long-term Rental</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="What is this regarding?"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      placeholder="Tell us about your rental needs..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-lg font-semibold text-white transition duration-300 ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-orange-600 hover:bg-orange-700 transform hover:scale-105'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                        Sending Message...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <FaPaperPlane className="mr-2" />
                        Send Message
                      </span>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Emergency Support */}
              <div className="bg-orange-600 text-white rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <FaHeadset className="text-2xl" />
                  <h3 className="text-2xl font-bold">24/7 Emergency Roadside Assistance</h3>
                </div>
                <p className="mb-4 text-orange-100">
                  Need immediate help on the road? Our emergency support team is available 24/7 for any issues during your rental period.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <FaPhone className="text-orange-200" />
                    <span className="text-xl font-bold">+1 (555) 123-HELP</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaWhatsapp className="text-orange-200 text-xl" />
                    <span className="text-lg">+1 (555) 123-WHATSAPP</span>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <h4 className="font-semibold text-gray-800 mb-2">{faq.question}</h4>
                      <p className="text-gray-600 text-sm">{faq.answer}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold transition duration-300">
                  View All FAQs
                </button>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Connect With Us</h3>
                <div className="flex justify-center gap-6">
                  <a href="#" className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300">
                    <FaFacebook className="text-xl" />
                  </a>
                  <a href="#" className="p-3 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition duration-300">
                    <FaTwitter className="text-xl" />
                  </a>
                  <a href="#" className="p-3 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition duration-300">
                    <FaInstagram className="text-xl" />
                  </a>
                  <a href="#" className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300">
                    <FaWhatsapp className="text-xl" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Locations</h2>
            <p className="text-xl text-gray-600">Visit us at any of our convenient locations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.map((location, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition duration-300 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <FaMapMarkerAlt className="text-orange-600 text-xl" />
                  <h3 className="text-lg font-semibold text-gray-800">{location.name}</h3>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-2 text-gray-600">
                    <FaMapMarkerAlt className="text-orange-500 mt-1 flex-shrink-0" />
                    <span className="text-sm">{location.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaPhone className="text-orange-500" />
                    <span className="text-sm">{location.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaClock className="text-orange-500" />
                    <span className="text-sm">{location.hours}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {location.features.map((feature, idx) => (
                    <span key={idx} className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                      {feature}
                    </span>
                  ))}
                </div>

                <button className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-semibold transition duration-300">
                  Get Directions
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-purple-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Book Your Rental?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact us now and let our experts help you find the perfect vehicle for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg">
              Book Now Online
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-orange-600 font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105">
              Call Us Now
            </button>
          </div>
          <div className="mt-8 text-orange-100">
            <p>📞 Emergency roadside assistance: <strong>+1 (555) 123-HELP</strong> (Available 24/7)</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CarHireContact;