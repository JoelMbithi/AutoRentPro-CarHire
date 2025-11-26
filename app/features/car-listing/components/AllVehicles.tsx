"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaGasPump, FaUserFriends, FaCog, FaStar, FaHeart, FaTimes } from "react-icons/fa";
import { IoSpeedometer, IoFlash } from "react-icons/io5";
import { CarProps } from "../types";
import CarRentPopUp from "@/app/features/Rent/components/CarRentPopUp";

const AllVehicles = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [cars, setCars] = useState<CarProps[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCar, setSelectedCar] = useState<CarProps | null>(null);
  
  const categories = [
    { id: "all", name: "All Cars", count: 12 },
    { id: "suv", name: "SUV", count: 4 },
    { id: "luxury", name: "Luxury", count: 3 },
    { id: "sports", name: "Sports", count: 2 },
    { id: "economy", name: "Economy", count: 3 },
  ];

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await fetch('/features/car-listing/api/cars');
      const data = await response.json();

      const mappedCars = data.data.map((car: any) => ({
        id: car.id,
        name: `${car.make} ${car.model}`,
        img: car.image,
        fuelType: car.fuelType,
        seats: car.seats,
        gear: car.transmission,
        drive: car.drive,
        price: car.price,
        power: car.power,
        year: car.year,
        featured: car.rating > 4.5,
        category: car.category.toLowerCase()
      }));

      console.log(mappedCars);
      setCars(mappedCars);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const filteredCars = selectedCategory === "all" 
    ? cars 
    : cars.filter(car => car.category === selectedCategory);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  const handleRentNow = (car: CarProps) => {
    setSelectedCar(car);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedCar(null);
  };

  return (
    <div className="w-full px-6 py-16 bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <IoFlash className="text-orange-500" />
            AutoRentPro Fleet Collection
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4">
            Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Latest</span> Fleet
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Discover the perfect vehicle for your journey. From luxury SUVs to economic sedans, 
            find your ideal ride with unbeatable prices and premium service.
          </p>
        </div>

        {/* Enhanced Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                group relative flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold 
                transition-all duration-500 ease-out min-w-[140px] overflow-hidden
                ${selectedCategory === category.id
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-2xl shadow-orange-200 transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-xl border border-gray-100'
                }
              `}
            >
              {/* Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
              
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold">{category.name}</span>
                <span className={`text-xs ${selectedCategory === category.id ? 'text-orange-100' : 'text-gray-400'}`}>
                  {category.count} cars
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {filteredCars.map((car) => (
            <div
              key={car.id}
              className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-orange-200"
            >
              {/* Image Header */}
              <div className="relative h-48 w-full">
                <Image
                  src={car.img}
                  alt={car.name}
                  fill
                  className="object-scale-down rounded-t-xl"
                  priority
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {car.featured && (
                    <span className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      FEATURED
                    </span>
                  )}
                  <span className="bg-black/60 text-white px-3 py-1 rounded-full text-xs">
                    {car.year}
                  </span>
                </div>

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(car.id)}
                  className={`absolute top-3 right-3 p-2 rounded-full transition ${
                    favorites.includes(car.id)
                      ? "bg-red-500 text-white scale-110"
                      : "bg-white/90 text-gray-500 hover:bg-white hover:text-red-500"
                  }`}
                >
                  <FaHeart className="text-sm" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Car Name and Power */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-black text-gray-900 group-hover:text-orange-600 transition-colors">
                    {car.name}
                  </h3>
                  <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                    <IoFlash className="text-orange-500 text-sm" />
                    <span className="text-xs font-bold text-gray-700">{car.power}</span>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaGasPump className="text-orange-500" />
                    <span className="text-sm font-medium">{car.fuelType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <IoSpeedometer className="text-orange-500" />
                    <span className="text-sm font-medium">{car.gear}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaUserFriends className="text-orange-500" />
                    <span className="text-sm font-medium">{car.seats} Seats</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaCog className="text-orange-500" />
                    <span className="text-sm font-medium">{car.drive}</span>
                  </div>
                </div>

                {/* Price and Button - FIXED: This should always be visible */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <h4 className="text-2xl font-black text-orange-600">
                      Ksh {car.price}
                    </h4>
                    <p className="text-xs text-gray-500 font-medium">per day</p>
                  </div>
                  <button 
                    onClick={() => handleRentNow(car)} 
                    className="group relative bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                  >
                    <span className="relative z-10">Rent Now</span>
                    <div className="absolute inset-0 bg-white bg-opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Stats Section */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-8 text-white shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl md:text-5xl font-black mb-2 group-hover:scale-110 transition-transform duration-300">5000+</div>
              <div className="text-orange-100 font-semibold">Vehicles</div>
              <div className="text-orange-200 text-sm mt-1">Premium Fleet</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-black mb-2 group-hover:scale-110 transition-transform duration-300">50+</div>
              <div className="text-orange-100 font-semibold">Brands</div>
              <div className="text-orange-200 text-sm mt-1">World Class</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-black mb-2 group-hover:scale-110 transition-transform duration-300">100+</div>
              <div className="text-orange-100 font-semibold">Locations</div>
              <div className="text-orange-200 text-sm mt-1">Nationwide</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-black mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
              <div className="text-orange-100 font-semibold">Support</div>
              <div className="text-orange-200 text-sm mt-1">Always Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Component - ADDED: This should be outside the main grid */}
     <CarRentPopUp
          showPopup={showPopup} 
        selectedCar={selectedCar} 
        closePopup={closePopup} 
     />
    </div>
  );
};

export default AllVehicles;