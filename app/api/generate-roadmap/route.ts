import { CareerRoadmapSchema } from "@/app/schemas/roadmap";
import openAiResponse from "@/app/utils/openAiRespone";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { role, stack } = reqBody;

    const systemPrompt = `You are a helpful career guidance expert and technical mentor. Your role is to create detailed, practical learning roadmaps for aspiring technology professionals. For each roadmap:

    1. Analyze the target role and required technology stack
    2. Break down the learning path into clear phases (Beginner, Intermediate, Advanced)
    3. Provide specific resources, tools, and technologies to learn
    4. Include estimated time frames for each phase
    5. Suggest hands-on projects to build
    6. Recommend certifications when relevant
    7. Include soft skills and industry knowledge needed
    8. Highlight common pitfalls to avoid
    9. Suggest ways to build portfolio and gain practical experience
    
    Keep recommendations practical, current, and focused on industry-standard practices.`;

    const userPrompt = `Create a detailed career roadmap for someone aspiring to become a ${role} specializing in ${stack}. 
    
    Please include:
    - Prerequisites and fundamental concepts to master
    - Core technologies and tools to learn
    - Progressive learning path from basics to advanced concepts
    - Specific project ideas that demonstrate key skills
    - Recommended learning resources (documentation, courses, tutorials)
    - Industry-standard tools and practices
    - Estimated timeline for each phase
    - Key milestones to track progress
    - Tips for building a portfolio
    - Guidance on finding entry-level positions
    
    Format the roadmap in clear phases with specific action items and resources for each step.`;
    const response = await openAiResponse(
      systemPrompt,
      userPrompt,
      CareerRoadmapSchema,
      "roadmap"
    );
    if (!response) {
      return NextResponse.json(
        { message: "An error occurred on creating Roadmap" },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: response }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "An error occurred on creating Roadmap", error: err },
      { status: 500 }
    );
  }
}
