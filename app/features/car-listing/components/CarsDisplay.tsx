"use client";

import Image from "next/image";
import { FaGasPump, FaUserFriends, FaCog } from "react-icons/fa";
import { IoSpeedometer } from "react-icons/io5";
import React, { useEffect, useState } from "react";
import { CarProps } from "../types";
import CarRentPopUp from "@/app/features/Rent/components/CarRentPopUp";

const CarsDisplay = () => {
  const [cars, setCars]             = useState<CarProps[]>([]);
  const [displayedCars, setDisplayedCars] = useState<CarProps[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading]       = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showPopup, setShowPopup]   = useState(false);
  const [selectedCar, setSelectedCar] = useState<CarProps | null>(null);
  const [user, setUser]             = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res  = await fetch("/features/Profile/api/profile", { credentials: "include" });
        const data = await res.json();
        if (data.success && data.user) setUser(data.user);
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsCheckingAuth(false);
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
    // Simulate loading for smoother UX
    setTimeout(() => {
      const newVisibleCount = visibleCount + 6;
      setVisibleCount(newVisibleCount);
      setDisplayedCars(cars.slice(0, newVisibleCount));
      setLoadingMore(false);
    }, 500);
  };

  const handleShowLess = () => {
    setVisibleCount(6);
    setDisplayedCars(cars.slice(0, 6));
    // Smooth scroll back to top of section
    window.scrollTo({
      top: document.getElementById('cars-section')?.offsetTop,
      behavior: 'smooth'
    });
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
        <div className="w-8 h-8 border-2 border-gray-200 border-t-orange-600 rounded-full animate-spin" />
      </div>
    );
  }

  const hasMore = displayedCars.length < cars.length;
  const showingAll = displayedCars.length === cars.length && cars.length > 6;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        .cd-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          color: #fff;
          line-height: 1.05;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
        .cd-year {
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,.55);
        }
        .cd-price-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          color: #c8510a;
          line-height: 1;
        }
        .cd-price-label {
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #9c9085;
        }
        .cd-spec-text {
          font-family: 'DM Sans', sans-serif;
          color: #6b6560;
        }
        .cd-card { transition: box-shadow 0.3s ease; }
        .cd-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
        .cd-card:hover .cd-img { transform: scale(1.06); }
        .cd-img { transition: transform 0.55s ease; }
        .cd-btn {
          background: linear-gradient(135deg, #c8510a, #dc2626);
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(220,38,38,0.3);
          overflow: hidden;
          position: relative;
        }
        .cd-btn:hover {
          background: linear-gradient(135deg, #b04408, #b91c1c);
          transform: scale(1.02);
          box-shadow: 0 6px 16px rgba(220,38,38,0.4);
        }
        .cd-btn:active { transform: scale(0.98); }
        .btn-shine {
          position: absolute; top: 0; left: 0;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }
        .cd-btn:hover .btn-shine { transform: translateX(100%); }
        
        .show-more-btn {
          transition: all 0.3s ease;
        }
        .show-more-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(200, 81, 10, 0.3);
        }
      `}</style>

      <div id="cars-section" className="py-8 sm:py-10 bg-[#f9f7f4]">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-6">

          {/* Header with count */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Our Fleet</h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Showing {displayedCars.length} of {cars.length} vehicles
              </p>
            </div>
          </div>

          {/* ── Grid: 2-col on mobile, 2-col on md, 3-col on xl ── */}
          <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
            {displayedCars.map((car, index) => (
              <div key={index} className="cd-card bg-[#faf8f5] flex flex-col rounded-[4px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05)]">

                {/* ── Image area ── */}
                <div className="relative overflow-hidden bg-[#ede9e3] shrink-0" style={{ height: "clamp(140px, 30vw, 340px)" }}>
                  <Image
                    src={car.img}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1280px) 50vw, 33vw"
                    alt={car.name}
                    className="cd-img object-cover"
                    priority={index < 4}
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                  {/* Featured badge */}
                  {car.featured && (
                    <span className="absolute top-2 right-2 bg-[#c8510a] text-white text-[8px] sm:text-[9px] font-bold tracking-[0.16em] uppercase px-2 py-1 z-10">
                      Featured
                    </span>
                  )}

                  {/* Car name + year over image */}
                  <div className="absolute bottom-0 left-0 right-0 px-3 sm:px-5 pb-3 sm:pb-4 z-10">
                    <div className="cd-year text-[9px] sm:text-[11px] mb-0.5">{car.year}</div>
                    <div className="cd-name text-base sm:text-xl lg:text-2xl">{car.name}</div>
                  </div>
                </div>

                {/* ── Card body ── */}
                <div className="bg-[#faf8f5] px-3 sm:px-5 pt-3 pb-4 sm:pt-4 sm:pb-5 flex flex-col flex-1">

                  {/* Specs — 2×2 grid */}
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 sm:gap-x-5 sm:gap-y-2.5 mb-3 pb-3 border-b border-[#e5e0d8]">
                    <div className="flex items-center gap-1.5 sm:gap-2 cd-spec-text text-[10px] sm:text-xs">
                      <FaGasPump color="#c8510a" size={9} className="shrink-0 sm:hidden" />
                      <FaGasPump color="#c8510a" size={11} className="shrink-0 hidden sm:block" />
                      <span className="truncate">{car.fuelType}</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 cd-spec-text text-[10px] sm:text-xs">
                      <IoSpeedometer color="#c8510a" size={10} className="shrink-0 sm:hidden" />
                      <IoSpeedometer color="#c8510a" size={12} className="shrink-0 hidden sm:block" />
                      <span className="truncate">{car.gear}</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 cd-spec-text text-[10px] sm:text-xs">
                      <FaUserFriends color="#c8510a" size={10} className="shrink-0 sm:hidden" />
                      <FaUserFriends color="#c8510a" size={12} className="shrink-0 hidden sm:block" />
                      <span>{car.seats} seats</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 cd-spec-text text-[10px] sm:text-xs">
                      <FaCog color="#c8510a" size={9} className="shrink-0 sm:hidden" />
                      <FaCog color="#c8510a" size={11} className="shrink-0 hidden sm:block" />
                      <span className="truncate">{car.drive}</span>
                    </div>
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between gap-2 mt-auto">
                    <div>
                      <div className="cd-price-num text-xl sm:text-3xl">
                        Ksh {car.price?.toLocaleString()}
                      </div>
                      <div className="cd-price-label text-[9px] sm:text-[10px] mt-0.5">per day</div>
                    </div>
                    <button
                      className="cd-btn text-white border-none rounded-lg cursor-pointer text-[10px] sm:text-xs font-semibold tracking-[0.08em] sm:tracking-[0.1em] uppercase px-3 sm:px-6 py-2 sm:py-3 whitespace-nowrap shrink-0"
                      onClick={(e) => { e.stopPropagation(); handleCarRent(car); }}
                    >
                      <span className="relative z-10">Rent now</span>
                      <span className="btn-shine" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Show More / Show Less Button */}
          {cars.length > 6 && (
            <div className="flex justify-center mt-8 sm:mt-10">
              {hasMore ? (
                <button
                  onClick={handleShowMore}
                  disabled={loadingMore}
                  className="show-more-btn flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-sm sm:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Show More Vehicles
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
              ) : showingAll && (
                <button
                  onClick={handleShowLess}
                  className="show-more-btn flex items-center gap-2 border-2 border-orange-600 text-orange-600 hover:bg-orange-50 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-sm sm:text-base transition-colors"
                >
                  Show Less
                  <svg className="w-4 h-4 ml-1 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Footer stats */}
          {cars.length > 0 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 text-xs sm:text-sm text-gray-500">
              <span>
                Showing <span className="font-semibold text-gray-700">{displayedCars.length}</span> of{' '}
                <span className="font-semibold text-gray-700">{cars.length}</span> vehicles
              </span>
              {hasMore && (
                <span className="text-orange-600">
                  {cars.length - displayedCars.length} more available
                </span>
              )}
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