"use client";

import Image from "next/image";
import { FaGasPump, FaUserFriends, FaCog } from "react-icons/fa";
import { IoSpeedometer } from "react-icons/io5";
import React, { useEffect, useState } from "react";
import { CarProps } from "../types";
import CarRentPopUp from "@/app/features/Rent/components/CarRentPopUp";



const CarsDisplay = () => {

    const [ cars,setCars] = useState<CarProps[]>([])
    const [loading,setLoading] = useState(false)
    const [showPopup,setShowPopup] = useState(false)
    const [selectedCar,setSelectedCar] = useState<CarProps | null>(null)

 const fetchCars = async ()=>{
           try {
            setLoading(true)
            const response = await fetch('/features/car-listing/api/cars')
            const data = await response.json()

            const mappedCars =  data.data.map((car:any) => ({
              id:car.id,
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
            }))

            console.log(mappedCars)
            setCars(mappedCars)

           } catch (error) {
            console.log(error)
           }finally{
            setLoading(false)
           }
  }

  useEffect(() => {
    fetchCars()
  },[])

  const handleCarRent = (car: CarProps) => {
             setShowPopup(true)
             setSelectedCar(car)

  }

  const closePopup = () => {
    setShowPopup(false)
    setSelectedCar(null)
  }

  return (
    <div className="px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

      {cars.map((car, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all p-5 flex flex-col gap-4"
        >
          {/* Image */}
          <div className="rounded-lg overflow-hidden">
            <Image
              src={car.img}
              width={400}
              height={250}
              alt={car.name}
              className="object-cover w-full"
            />
          </div>

          {/* Car Details */}
          <div className="flex flex-col gap-2">
            <h1 className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-md w-fit">
              {car.year}
            </h1>

            <h2 className="font-bold text-xl">{car.name}</h2>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-4 text-gray-600 mt-1">
            <span className="flex items-center gap-2">
              <FaGasPump className="text-orange-600" /> {car.fuelType}
            </span>
            <span className="flex items-center gap-2">
              <IoSpeedometer className="text-orange-600" /> {car.gear}
            </span>
            <span className="flex items-center gap-2">
              <FaUserFriends className="text-orange-600" /> {car.seats}
            </span>
            <span className="flex items-center gap-2">
              <FaCog className="text-orange-600" /> {car.drive}
            </span>
          </div>

          {/* Price & Button */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <h4 className="text-2xl font-black text-orange-600">
                      Ksh {car.price}
                    </h4>
                    <p className="text-xs text-gray-500 font-medium">per day</p>
                  </div>
                  <button 
                    onClick={ () => handleCarRent(car)}   
                    className="group relative bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                  >
                    <span className="relative z-10">Rent Now</span>
                    <div className="absolute inset-0 bg-white bg-opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </button>
                </div>
                <CarRentPopUp
                    closePopup={closePopup}
                   showPopup={showPopup}
                    selectedCar={selectedCar}
                />
        </div>
      ))}

    </div>
  );
};

export default CarsDisplay;
