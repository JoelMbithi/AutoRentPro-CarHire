"use client";

import Image from "next/image";
import { FaGasPump, FaUserFriends, FaCog } from "react-icons/fa";
import { IoSpeedometer } from "react-icons/io5";
import React, { useEffect, useState } from "react";
import { CarProps } from "../types";
import CarRentPopUp from "@/app/features/Rent/components/CarRentPopUp";

const CarsDisplay = () => {
  const [cars, setCars] = useState<CarProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCar, setSelectedCar] = useState<CarProps | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Fetch user on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/features/Profile/api/profile", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
        }
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
        category: car.category.toLowerCase(),
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

  const handleCarRent = (car: CarProps) => {
    if (!user) {
      // If not logged in, redirect to signin
      window.location.href = '/auth/signin?redirect=' + encodeURIComponent('/vehicles');
      return;
    }
    setShowPopup(true);
    setSelectedCar(car);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedCar(null);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "96px 0" }}>
        <style>{`@keyframes cdspin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ width: 32, height: 32, border: "2px solid #e5e0d8", borderTopColor: "#c8510a", borderRadius: "50%", animation: "cdspin .7s linear infinite" }} />
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        .cd-wrap { 
          padding: 40px 0; 
          background: #f9f7f4; 
        }

        .cd-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }
        @media (max-width: 1024px) { 
          .cd-grid { 
            grid-template-columns: repeat(2, 1fr); 
            gap: 20px;
            padding: 0 20px;
          } 
        }
        @media (max-width: 600px) { 
          .cd-grid { 
            grid-template-columns: 1fr; 
            gap: 16px;
            padding: 0 16px;
          } 
        }

        .cd-card {
          background: #faf8f5;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: box-shadow 0.3s ease;
        }
        .cd-card:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }

        .cd-img-wrap {
          position: relative;
          height: 340px;
          overflow: hidden;
          background: #ede9e3;
          flex-shrink: 0;
        }
        .cd-img {
          width: 100%; 
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.55s ease;
        }
        .cd-card:hover .cd-img { transform: scale(1.06); }

        .cd-gradient {
          position: absolute; 
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,.75) 0%, rgba(0,0,0,.15) 55%, transparent 100%);
        }

        .cd-featured {
          position: absolute; 
          top: 12px;
          right: 12px;
          background: #c8510a; 
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 9px; 
          font-weight: 700; 
          letter-spacing: 0.16em;
          text-transform: uppercase; 
          padding: 5px 12px;
          z-index: 3;
        }

        .cd-hint {
          position: absolute; 
          bottom: 80px;
          right: 14px;
          display: flex; 
          align-items: center; 
          gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; 
          font-weight: 500; 
          letter-spacing: 0.1em;
          text-transform: uppercase; 
          color: rgba(255,255,255,.5);
          pointer-events: none; 
          z-index: 3;
          transition: opacity 0.25s;
        }
        .cd-hint-line { 
          display: inline-block; 
          width: 18px; 
          height: 1px; 
          background: rgba(255,255,255,.35); 
        }
        .cd-card:hover .cd-hint { opacity: 0; }

        .cd-img-footer {
          position: absolute; 
          bottom: 0; 
          left: 0; 
          right: 0;
          padding: 16px 20px 14px;
          z-index: 2;
        }
        .cd-year {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 600; 
          letter-spacing: 0.18em;
          text-transform: uppercase; 
          color: rgba(255,255,255,.55);
          margin-bottom: 4px;
        }
        .cd-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 26px;
          font-weight: 800; 
          color: #fff;
          line-height: 1.05; 
          text-transform: uppercase; 
          letter-spacing: 0.02em;
        }

        .cd-reveal {
          background: #faf8f5;
          padding: 20px 20px 24px;
        }

        .cd-specs {
          display: grid; 
          grid-template-columns: 1fr 1fr;
          gap: 10px 20px;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e0d8;
        }
        .cd-spec {
          display: flex; 
          align-items: center; 
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: #6b6560;
        }

        .cd-footer { 
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
        }

        .cd-price-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 30px;
          font-weight: 800; 
          color: #c8510a; 
          line-height: 1;
        }
        .cd-price-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 600; 
          letter-spacing: 0.14em;
          text-transform: uppercase; 
          color: #9c9085; 
          margin-top: 3px;
        }

        .cd-btn {
          background: linear-gradient(135deg, #c8510a, #dc2626);
          color: #fff; 
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 600; 
          letter-spacing: 0.1em; 
          text-transform: uppercase;
          padding: 12px 28px;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
          position: relative;
          overflow: hidden;
        }
        .cd-btn:hover { 
          background: linear-gradient(135deg, #b04408, #b91c1c);
          transform: scale(1.02);
          box-shadow: 0 6px 16px rgba(220, 38, 38, 0.4);
        }
        .cd-btn:active { 
          transform: scale(0.98); 
        }

        .btn-shine {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }
        .cd-btn:hover .btn-shine {
          transform: translateX(100%);
        }
      `}</style>

      <div className="cd-wrap">
        <div className="cd-grid">
          {cars.map((car, index) => (
            <div key={index} className="cd-card">
              <div className="cd-img-wrap">
                <Image
                  src={car.img}
                  width={600}
                  height={340}
                  alt={car.name}
                  className="cd-img"
                  priority={index < 3}
                />
                <div className="cd-gradient" />
                {car.featured && <span className="cd-featured">Featured</span>}
                <div className="cd-hint">
                  <span className="cd-hint-line" /> Hover for details
                </div>
                <div className="cd-img-footer">
                  <div className="cd-year">{car.year}</div>
                  <div className="cd-name">{car.name}</div>
                </div>
              </div>

              <div className="cd-reveal">
                <div className="cd-specs">
                  <div className="cd-spec">
                    <FaGasPump color="#c8510a" size={11} />
                    {car.fuelType}
                  </div>
                  <div className="cd-spec">
                    <IoSpeedometer color="#c8510a" size={12} />
                    {car.gear}
                  </div>
                  <div className="cd-spec">
                    <FaUserFriends color="#c8510a" size={12} />
                    {car.seats} seats
                  </div>
                  <div className="cd-spec">
                    <FaCog color="#c8510a" size={11} />
                    {car.drive}
                  </div>
                </div>
                <div className="cd-footer">
                  <div>
                    <div className="cd-price-num">
                      Ksh {car.price}
                    </div>
                    <div className="cd-price-label">per day</div>
                  </div>
                  <button
                    className="cd-btn"
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleCarRent(car); 
                    }}
                  >
                    <span className="relative z-10">Rent now</span>
                    <span className="btn-shine" />
                  </button>
                </div>
              </div>
            </div>
          ))}
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