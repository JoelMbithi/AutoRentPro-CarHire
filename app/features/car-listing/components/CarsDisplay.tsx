"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { CarProps } from "../types";
import CarRentPopUp from "@/app/features/Rent/components/CarRentPopUp";

const CarsDisplay = () => {
  const [cars, setCars]                   = useState<CarProps[]>([]);
  const [displayedCars, setDisplayedCars] = useState<CarProps[]>([]);
  const [visibleCount, setVisibleCount]   = useState(6);
  const [loading, setLoading]             = useState(false);
  const [loadingMore, setLoadingMore]     = useState(false);
  const [showPopup, setShowPopup]         = useState(false);
  const [selectedCar, setSelectedCar]     = useState<CarProps | null>(null);
  const [user, setUser]                   = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res  = await fetch("/features/Profile/api/profile", { credentials: "include" });
        const data = await res.json();
        if (data.success && data.user) setUser(data.user);
      } catch (error) {
        console.error("Auth check error:", error);
      }
    };
    checkAuth();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await fetch("/features/car-listing/api/cars");
      const data     = await response.json();
      const mappedCars = data.data.map((car: any) => ({
        id:       car.id,
        name:     `${car.make} ${car.model}`,
        img:      car.image,
        fuelType: car.fuelType,
        seats:    car.seats,
        gear:     car.transmission,
        drive:    car.drive,
        price:    car.price,
        power:    car.power,
        year:     car.year,
        featured: car.rating > 4.5,
        category: car.category.toLowerCase(),
      }));
      setCars(mappedCars);
      setDisplayedCars(mappedCars.slice(0, 6));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCars(); }, []);

  const handleShowMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      const newCount = visibleCount + 6;
      setVisibleCount(newCount);
      setDisplayedCars(cars.slice(0, newCount));
      setLoadingMore(false);
    }, 500);
  };

  const handleShowLess = () => {
    setVisibleCount(6);
    setDisplayedCars(cars.slice(0, 6));
    window.scrollTo({ top: document.getElementById("cars-section")?.offsetTop, behavior: "smooth" });
  };

  const handleCarRent = (car: CarProps) => {
    if (!user) {
      window.location.href = "/auth/signin?redirect=" + encodeURIComponent("/vehicles");
      return;
    }
    setShowPopup(true);
    setSelectedCar(car);
  };

  const closePopup = () => { setShowPopup(false); setSelectedCar(null); };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-orange-600 rounded-full animate-spin" />
      </div>
    );
  }

  const hasMore    = displayedCars.length < cars.length;
  const showingAll = displayedCars.length === cars.length && cars.length > 6;

  return (
    <>
      <div id="cars-section" className="py-10 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Our Fleet</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Showing {displayedCars.length} of {cars.length} vehicles
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {displayedCars.map((car, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded overflow-hidden flex flex-col">

                {/* Image */}
                <div className="relative overflow-hidden bg-gray-100 shrink-0" style={{ height: "clamp(140px, 28vw, 300px)" }}>
                  <Image
                    src={car.img}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1280px) 50vw, 33vw"
                    alt={car.name}
                    className="object-cover"
                    priority={index < 4}
                  />
                  {car.featured && (
                    <span className="absolute top-2 right-2 bg-orange-600 text-white text-[9px] font-medium px-2 py-0.5 rounded">
                      Featured
                    </span>
                  )}
                  {/* Name overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
                    <p className="text-white/60 text-[10px] mb-0.5">{car.year}</p>
                    <p className="text-white font-semibold text-sm sm:text-base leading-tight">{car.name}</p>
                  </div>
                </div>

                {/* Card body */}
                <div className="px-3 sm:px-4 pt-3 pb-4 flex flex-col flex-1">

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mb-3 pb-3 border-b border-gray-100 text-xs text-gray-500">
                    <span>{car.fuelType}</span>
                    <span>{car.gear}</span>
                    <span>{car.seats} seats</span>
                    <span>{car.drive}</span>
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between gap-2 mt-auto">
                    <div>
                      <p className="text-base sm:text-lg font-bold text-gray-900">
                        Ksh {car.price?.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">per day</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCarRent(car); }}
                      className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium px-4 py-2 rounded transition-colors whitespace-nowrap shrink-0"
                    >
                      Rent now
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Show more / less */}
          {cars.length > 6 && (
            <div className="flex justify-center mt-8">
              {hasMore ? (
                <button
                  onClick={handleShowMore}
                  disabled={loadingMore}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-2.5 rounded text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loadingMore ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Loading…</>
                  ) : "Show more"}
                </button>
              ) : showingAll && (
                <button
                  onClick={handleShowLess}
                  className="border border-gray-300 hover:border-gray-400 text-gray-600 font-medium px-6 py-2.5 rounded text-sm transition-colors"
                >
                  Show less
                </button>
              )}
            </div>
          )}

          {/* Footer count */}
          {cars.length > 0 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 text-xs text-gray-400">
              <span>{displayedCars.length} of {cars.length} vehicles</span>
              {hasMore && <span>{cars.length - displayedCars.length} more available</span>}
            </div>
          )}

        </div>
      </div>

      <CarRentPopUp
        closePopup={closePopup}
        showPopup={showPopup}
        selectedCar={selectedCar}
        user={user}
      />
    </>
  );
};

export default CarsDisplay;