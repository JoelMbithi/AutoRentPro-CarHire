import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";



export async function POST (request: NextRequest){
  try {
     const body = await request.json()
     const {name, email,phone,subject,message,rentalType} = body;

     //validate requeirements fields
     if(!name || !email || !subject || !message || !phone || !rentalType){
        return NextResponse.json(
            { error: "Please All fields are required"},
            {status: 400}
        )

     }

     //Checking if the email is valid
       const emailCheck = /\S+@\S+\.\S+/;
     if (!emailCheck.test(email)) {
  return NextResponse.json(
    { error: "Please enter a valid email" },
    { status: 400 }
  );
}


    //save to DB
    const newMessage = await prisma.contactMessage.create({
        data: {
            name,
            email,
            phone,
            subject,
            message,
            rentalType,
           
        }
    })
    return NextResponse.json(
        {success: true, 
            messgae: "Message received successfully",
             data: newMessage,
        },
        {status: 200}
    )
  } catch (error:any) {
     return NextResponse.json(
      { error: "Server error, please try again later." },
      { status: 500 }
    );
  }
}