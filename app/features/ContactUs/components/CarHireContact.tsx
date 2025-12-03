
'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt,FaQuestionCircle, FaClock, FaCar, FaUser, FaPaperPlane, FaWhatsapp, FaTwitter, FaFacebook, FaInstagram, FaHeadset, FaArrowRight, FaStar, FaCheck } from 'react-icons/fa';
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
    
       try {
        const request = await fetch("/features/ContactUs/api/contacts",{
          method:"POST",
          headers:{  "Content-Type": "application/json"},
             body: JSON.stringify(formData)
        })

        const data = await request.json()

        if(!request.ok){
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
    });
       } catch (error) {
        console.log(error)
       }
    
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
      details: ['+(254) 743 264 773', '+1(254) 740 196 027'],
      description: '24/7 Customer Support',
      link: 'tel:+15551234567'
    },
    {
      icon: <FaEnvelope className="text-2xl text-orange-600" />,
      title: 'Email Us',
      details: ['autorentpro@gmail.com', 'support@autorentpro.com'],
      description: 'We respond within 2 hours',
      link: 'mailto:info@autorentpro.com'
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl text-orange-600" />,
      title: 'Visit Us',
      details: ['Nairobi, Downtown', 'City, Nairobi'],
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
    name: 'Nairobi CBD Office',
    address: 'Kenyatta Avenue, ICEA Building, 3rd Floor',
    phone: '+254 700 123 456',
    hours: 'Mon-Sun: 6:00 AM - 10:00 PM',
    features: ['Main Office', 'All Vehicle Types', 'On-site Support', 'Central Location']
  },
  {
    name: 'Jomo Kenyatta Airport (JKIA)',
    address: 'JKIA Terminal 1A, Arrivals Hall',
    phone: '+254 711 123 456',
    hours: '24/7 Operation',
    features: ['Airport Pickup', 'Express Service', 'International Clients', 'Free Shuttle']
  },
  {
    name: 'Westlands Branch',
    address: 'Westlands Road, The Mirage, 2nd Floor',
    phone: '+254 722 123 456',
    hours: 'Mon-Sun: 7:00 AM - 9:00 PM',
    features: ['Business District', 'Free Parking', 'Corporate Services', 'Quick Rentals']
  },
  {
    name: 'Mombasa Branch',
    address: 'Moi Avenue, Nyali, Mombasa',
    phone: '+254 733 123 456',
    hours: 'Mon-Sun: 6:00 AM - 9:00 PM',
    features: ['Coastal Services', '4WD Vehicles', 'Beach Ready', 'Tour Packages']
  },
  {
    name: 'Kisumu Branch',
    address: 'Oginga Odinga Road, Mega City Mall',
    phone: '+254 744 123 456',
    hours: 'Mon-Sat: 7:00 AM - 8:00 PM, Sun: 8:00 AM - 6:00 PM',
    features: ['Lake Region', 'Affordable Rates', 'Tourist Vehicles', 'Local Guides']
  },
  {
    name: 'Nakuru Branch',
    address: 'Kenyatta Avenue, North Tower Building',
    phone: '+254 755 123 456',
    hours: 'Mon-Sat: 7:00 AM - 8:00 PM, Sun: 8:00 AM - 6:00 PM',
    features: ['Rift Valley Tours', 'Safari Vehicles', 'Group Discounts', 'Park Access']
  },
  {
    name: 'Thika Branch',
    address: 'General Kago Road, Thika Town',
    phone: '+254 766 123 456',
    hours: 'Mon-Sat: 7:00 AM - 7:00 PM, Sun: 9:00 AM - 5:00 PM',
    features: ['Industrial Area', 'Truck Rental', 'Commercial Vehicles', 'Bulk Discounts']
  },
  {
    name: 'Eldoret Branch',
    address: 'Uganda Road, Rupa Mall',
    phone: '+254 777 123 456',
    hours: 'Mon-Sat: 7:00 AM - 8:00 PM, Sun: 8:00 AM - 6:00 PM',
    features: ['North Rift Region', 'Agricultural Vehicles', 'Long Term Rental', 'Farm Equipment']
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
    <section className="relative text-white py-24 overflow-hidden bg-cover bg-center" 
  style={{ backgroundImage: "url('/Contact.png')" }}>
  {/* Enhanced Background Elements */}
  <div className="absolute inset-0 bg-black/30"></div>
  
  {/* Animated Background Shapes */}
  <div className="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full mix-blend-overlay animate-pulse"></div>
  <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/3 rounded-full mix-blend-overlay animate-pulse delay-1000"></div>
  <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-400/10 rounded-full mix-blend-overlay animate-pulse delay-500"></div>
  
  {/* Grid Pattern Overlay */}
  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

  <div className="container mx-auto px-4 relative z-10">
    <div className="max-w-5xl mx-auto text-center">
      
      {/* Badge/Status Indicator */}
      <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20 shadow-lg">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
        <span className="text-sm font-semibold tracking-wide">AVAILABLE 24/7 • INSTANT RESPONSE</span>
      </div>

      {/* Main Heading with Enhanced Typography */}
      <h1 className="text-6xl lg:text-7xl font-bold mb-6 leading-tight">
        Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-yellow-200">AutoRentPro</span>
      </h1>
      
      {/* Subheading with Better Hierarchy */}
      <div className="space-y-4 mb-8 max-w-3xl mx-auto">
        <p className="text-2xl lg:text-3xl font-light opacity-95 leading-relaxed">
            AutoRent Pro Car Rental Solutions Tailored to Your Journey
        </p>
        <p className="text-lg lg:text-xl opacity-80 font-normal leading-relaxed">
          Expert support for reservations, fleet inquiries, and personalized travel planning
        </p>
      </div>

      {/* Trust Indicators */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-12 pt-8 border-t border-white/20">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="w-8 h-8 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full border-2 border-white shadow-lg"></div>
            ))}
          </div>
          <div className="text-left">
            <div className="font-semibold">5,000+ Customers</div>
            <div className="text-sm opacity-80">Trust Our Service</div>
          </div>
        </div>
        
        <div className="hidden sm:block w-px h-12 bg-white/30"></div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar key={star} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
          </div>
          <div className="text-left">
            <div className="font-semibold">4.9/5 Rating</div>
            <div className="text-sm opacity-80">Excellent Service</div>
          </div>
        </div>
        
        <div className="hidden sm:block w-px h-12 bg-white/30"></div>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <FaCheck className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <div className="font-semibold">Instant Support</div>
            <div className="text-sm opacity-80">Response in 2 Hours</div>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
        <button className="group bg-white text-orange-600 hover:bg-gray-50 font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl flex items-center gap-3">
          <FaPhone className="w-5 h-5" />
          Call Now: +254 743 861 565
          <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
        
        <button className="group border-2 border-white text-white hover:bg-white hover:text-orange-600 font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm flex items-center gap-3">
          <FaEnvelope className="w-5 h-5" />
          Email Support
          <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </div>
  </div>

  {/* Bottom Wave Decoration */}
  <div className="absolute bottom-0 left-0 right-0">
    <svg 
      className="w-full h-16 text-gray-50" 
      viewBox="0 0 1200 120" 
      preserveAspectRatio="none"
    >
      <path 
        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
        opacity=".25" 
        className="fill-current"
      ></path>
      <path 
        d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
        opacity=".5" 
        className="fill-current"
      ></path>
      <path 
        d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
        className="fill-current"
      ></path>
    </svg>
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
     <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
      {/* Contact Form - Enhanced */}
      <div className="relative">
        {/* Floating background elements */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-2xl shadow-orange-500/10 border border-white/20 relative z-10 hover:shadow-orange-500/20 transition-all duration-500">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                <FaHeadset className="text-2xl text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white animate-ping"></div>
            </div>
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-orange-600 bg-clip-text text-transparent">
                Send us a Message
              </h2>
              <p className="text-gray-500 mt-1">We usually respond within 30 minutes</p>
            </div>
          </div>
          
          {isSubmitted ? (
            <div className="text-center py-16">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/25">
                  <FaPaperPlane className="text-3xl text-white transform -rotate-45" />
                </div>
                <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20"></div>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-3">Message Sent Successfully!</h3>
              <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                Thank you for contacting AutoRentPro Kenya. Our team will get back to you within 2 hours.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name & Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-gray-700 font-semibold mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center group-focus-within:bg-orange-500 group-focus-within:text-white transition-colors duration-300">
                      <FaUser className="text-orange-600 group-focus-within:text-white text-sm" />
                    </div>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="group">
                  <label className="block text-gray-700 font-semibold mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center group-focus-within:bg-orange-500 group-focus-within:text-white transition-colors duration-300">
                      <IoMdMail className="text-orange-600 group-focus-within:text-white text-sm" />
                    </div>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Phone & Rental Type Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-gray-700 font-semibold mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center group-focus-within:bg-orange-500 group-focus-within:text-white transition-colors duration-300">
                      <FaPhone className="text-orange-600 group-focus-within:text-white text-sm" />
                    </div>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder="+254 700 000 000"
                  />
                </div>
                <div className="group">
                  <label className="block text-gray-700 font-semibold mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center group-focus-within:bg-orange-500 group-focus-within:text-white transition-colors duration-300">
                      <FaCar className="text-orange-600 group-focus-within:text-white text-sm" />
                    </div>
                    Rental Type
                  </label>
                  <select
                    name="rentalType"
                    value={formData.rentalType}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer"
                  >
                    <option value="">Select rental type</option>
                    <option value="economy">Economy Car</option>
                    <option value="compact">Compact Car</option>
                    <option value="suv">SUV & 4x4</option>
                    <option value="luxury">Luxury Vehicle</option>
                    <option value="commercial">Commercial Vehicle</option>
                    <option value="long-term">Long-term Rental</option>
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div className="group">
                <label className="block text-gray-700 font-semibold mb-3">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  placeholder="What is this regarding?"
                />
              </div>

              {/* Message */}
              <div className="group">
                <label className="block text-gray-700 font-semibold mb-3">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 bg-white/50 backdrop-blur-sm resize-none"
                  placeholder="Tell us about your rental needs, travel plans, or any special requirements..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-5 rounded-2xl font-semibold text-white transition-all duration-500 transform hover:scale-105 shadow-2xl ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed shadow-gray-400/20'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-500/25 hover:shadow-orange-500/40'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Sending Message...
                  </span>
                ) : (
                  <span className="flex items-center justify-center text-lg">
                    <FaPaperPlane className="mr-3 transform -rotate-45" />
                    Send Message Now
                  </span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Contact Information - Enhanced */}
      <div className="space-y-8">
        {/* Emergency Support - Enhanced */}
        <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white rounded-3xl p-10 shadow-2xl shadow-orange-500/25 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <FaHeadset className="text-2xl text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold">24/7 Emergency Roadside Assistance</h3>
              <p className="text-orange-100 mt-1">Across Kenya - Always Here to Help</p>
            </div>
          </div>
          <p className="mb-8 text-orange-100 text-lg relative z-10">
            Need immediate help on the road? Our emergency support team is available 24/7 across Kenya for any issues during your rental period.
          </p>
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FaPhone className="text-white text-lg" />
              </div>
              <div>
                <p className="text-orange-200 text-sm">Emergency Hotline</p>
                <span className="text-xl font-bold">+254 743 861 565</span>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FaWhatsapp className="text-white text-xl" />
              </div>
              <div>
                <p className="text-orange-200 text-sm">WhatsApp Support</p>
                <span className="text-lg font-semibold">+254 743 861 565</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section - Enhanced */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-2xl shadow-gray-500/10 border border-white/20 hover:shadow-gray-500/20 transition-all duration-500">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
              <FaQuestionCircle className="text-2xl text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800">Frequently Asked Questions</h3>
              <p className="text-gray-500 mt-1">Quick answers to common questions</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="group p-6 rounded-2xl bg-gray-50/50 hover:bg-orange-50/50 border border-gray-100 hover:border-orange-200 transition-all duration-300 cursor-pointer"
              >
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-3 group-hover:text-orange-600 transition-colors duration-300">
                  <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  {faq.question}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed pl-9">{faq.answer}</p>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-8 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-gray-500/10">
            View All FAQs
          </button>
        </div>

        {/* Social Media - Enhanced */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-3xl p-10 shadow-2xl shadow-gray-900/25">
          <h3 className="text-3xl font-bold mb-8 text-center">Connect With Us</h3>
          <div className="flex justify-center gap-6">
            {[
              { icon: FaFacebook, color: 'bg-blue-600 hover:bg-blue-700', label: 'Facebook' },
              { icon: FaTwitter, color: 'bg-blue-400 hover:bg-blue-500', label: 'Twitter' },
              { icon: FaInstagram, color: 'bg-pink-600 hover:bg-pink-700', label: 'Instagram' },
              { icon: FaWhatsapp, color: 'bg-green-500 hover:bg-green-600', label: 'WhatsApp' },
            ].map((social, index) => (
              <a 
                key={index}
                href="#" 
                className={`${social.color} w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:rotate-12 shadow-lg backdrop-blur-sm`}
                aria-label={social.label}
              >
                <social.icon className="text-2xl text-white" />
              </a>
            ))}
          </div>
          <p className="text-center text-gray-300 mt-6">
            Follow us for updates and exclusive offers
          </p>
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

     
    </div>
  );
};

export default CarHireContact;