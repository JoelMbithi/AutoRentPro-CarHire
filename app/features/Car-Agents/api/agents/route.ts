import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";



export async function POST(request:NextRequest) {
    try {
        const data = await request.json()


        /* create a new agent */
        const newAgent = await prisma.agent.create({
            data: {
                name: data.name,
                role: data.role,
                rating: data.rating,
                reviews: data.reviews,
                image: data.image,
                phone: data.phone,
                email: data.email,
                location: data.location,
                bio: data.bio,
                specialties: data.specialties,
                languages: data.languages,
                responseTime: data.responseTime,
                joined: data.joined,
            }
        })

        return NextResponse.json(
            {message: "Agent created Successfully", agent: newAgent},
            {status: 201}
        )
    } catch (error) {
        console.error(error);
    return NextResponse.json(
      { error: "Failed to create agent", details: `${error}` },
      { status: 500 }
    )
        
    }
}

/* Get All Agents */

export async function GET (request:NextRequest){
    try {
        const agents = await prisma.agent.findMany()
        return NextResponse.json(agents, { status: 200})
    } catch (error) {
         return NextResponse.json(
      { error: "Failed to fetch agents", details: `${error}` },
      { status: 500 }
    );
    }
}