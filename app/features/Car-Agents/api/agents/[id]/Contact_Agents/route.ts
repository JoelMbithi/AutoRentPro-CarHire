import { sendAgentEmail, sendCustomerConfirmation } from "@/lib/email";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const agentId = Number(params.id);

    if (isNaN(agentId)) {
      return NextResponse.json({ error: "Invalid agent ID" }, { status: 400 });
    }

    // Get request body
    const body = await request.json();
    const { name, email, phone, message, subject, rentalType } = body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, phone, message" },
        { status: 400 }
      );
    }

    // Get agent details
    const agent = await prisma.agent.findUnique({ where: { id: agentId } });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Save message in the database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        subject: subject || `Inquiry for ${agent.name}`,
        message,
        rentalType: rentalType || "General Inquiry",
        agentId: agent.id,
        status: "UNREAD",
      },
    });

    let emailSent = false;
    let emailError = null;

    // Send emails to agent and customer
    try {
      // Send email to the agent
      await sendAgentEmail({
        agentId: agent.id,  // Fixed: removed extra spaces
        agentName: agent.name,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        message,
        subject: subject || `New Inquiry from ${name}`,
      });

      // Send confirmation email to customer
      await sendCustomerConfirmation({
        to: email,
        customerName: name,
        agentName: agent.name,
        agentEmail: agent.email,
      });

      emailSent = true;
    } catch (err) {
      console.error("Email sending failed:", err);
      emailError = err instanceof Error ? err.message : "Unknown email error";
    }

    return NextResponse.json({
      success: true,
      message: "Message saved and emails sent successfully",
      emailSent,
      emailError,
      contactMessage,
    }, { status: 201 });

  } catch (err) {
    console.error("Error in agent contact:", err);
    return NextResponse.json(
      {
        error: "Failed to send message",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}