import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/* GET Agent by ID */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // params is a Promise
) {
  try {
    const params = await context.params; 
    const agentId = Number(params.id);

    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    return NextResponse.json({ success: "Successfully retrieved agent", agent }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to get agent" }, { status: 500 });
  }
}

/* PUT - Update Agent */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const agentId = Number(params.id);
    const body = await request.json();

    const updatedAgent = await prisma.agent.update({
      where: { id: agentId },
      data: body,
    });

    return NextResponse.json(updatedAgent, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update agent" }, { status: 500 });
  }
}

/* DELETE - Delete Agent */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const agentId = Number(params.id);

    await prisma.agent.delete({
      where: { id: agentId },
    });

    return NextResponse.json({ message: "Agent deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete agent" }, { status: 500 });
  }
}
