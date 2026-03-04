import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { sendAgentEmail, sendCustomerConfirmation } from "@/lib/email"; // Adjust the import path as needed

export async function POST (request: NextRequest){
  try {
     const body = await request.json()
     const {name, email, phone, subject, message, rentalType} = body;

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
    });

    // ===== SEND EMAILS =====
    try {
      // Send email to agent (using a default agent ID - adjust as needed)
      await sendAgentEmail({
        agentId: 7, // Make sure this agent exists in your AGENT_EMAILS map
        agentName: 'Support Team',
        customerName: name,
        customerEmail: email,
        customerPhone: phone || 'Not provided',
        message: message,
        subject: subject || 'New contact form submission'
      });

      // Send confirmation email to customer
      await sendCustomerConfirmation({
        to: email,
        customerName: name,
        agentName: 'Support Team',
        agentEmail: 'support@autorentpro.com' // Update with your support email
      });
      
      console.log('Emails sent successfully');
    } catch (emailError) {
      // Log email error but Didn&apos;t fail the request - the message is still saved in DB
      console.error('Failed to send emails:', emailError);
      // You might want to store that emails failed in your database
      await prisma.contactMessage.update({
        where: { id: newMessage.id },
        data: { emailStatus: 'failed' } // You'll need to add this field to your schema
      });
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Message received successfully. We'll get back to you soon!",
        data: newMessage,
      },
      { status: 200 }
    );
    
  } catch (error: any) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: "Server error, please try again later." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}