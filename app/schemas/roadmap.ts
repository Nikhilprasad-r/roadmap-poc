import { z } from "zod";

// Define sub-schemas
const ResourceSchema = z.object({
  name: z.string(),
  type: z.enum(["course", "documentation", "tutorial", "book", "video", "other"]),
  link: z.string(), // Changed from url with format
  isPaid: z.boolean(),
  estimatedHours: z.number().optional(),
  description: z.string(),
});

const ProjectSchema = z.object({
  name: z.string(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  description: z.string(),
  skills: z.array(z.string()),
  estimatedHours: z.number(),
  keyLearningOutcomes: z.array(z.string()),
});

const MilestoneSchema = z.object({
  title: z.string(),
  description: z.string(),
  completionCriteria: z.array(z.string()),
  suggestedProjects: z.array(z.string()),
});

const PhaseSchema = z.object({
  name: z.string(),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  description: z.string(),
  duration: z.object({
    minimumWeeks: z.number(),
    maximumWeeks: z.number(),
  }),
  skills: z.array(z.string()),
  concepts: z.array(z.string()),
  tools: z.array(z.string()),
  resources: z.array(ResourceSchema),
  projects: z.array(ProjectSchema),
  milestones: z.array(MilestoneSchema),
  practicalTips: z.array(z.string()),
});

export const CareerRoadmapSchema = z.object({
  role: z.string(),
  stack: z.array(z.string()),
  overview: z.object({
    description: z.string(),
    careerProspects: z.array(z.string()),
    prerequisites: z.array(z.string()),
    estimatedTimeToJob: z.object({
      minimumMonths: z.number(),
      maximumMonths: z.number(),
    }),
  }),
  phases: z.array(PhaseSchema),
  softSkills: z.array(z.string()),
  industryKnowledge: z.array(z.string()),
  certifications: z.array(z.object({
    name: z.string(),
    provider: z.string(),
    level: z.enum(["beginner", "intermediate", "advanced"]),
    estimatedPreparationHours: z.number(),
    recommendedPhase: z.string(),
    link: z.string(), // Changed from url with format
  })),
  portfolioTips: z.array(z.string()),
  jobSearchGuidance: z.object({
    resumeTips: z.array(z.string()),
    portfolioProjects: z.array(z.string()),
    interviewPreparation: z.array(z.string()),
    jobPlatforms: z.array(z.string()),
    networkingTips: z.array(z.string()),
  }),
  commonPitfalls: z.array(z.string()),
  continuousLearning: z.array(z.object({
    topic: z.string(),
    resources: z.array(z.string()),
    reason: z.string(),
  })),
  metadata: z.object({
    lastUpdated: z.string(),
    version: z.string(),
    contributors: z.array(z.string()).optional(),
  }),
});

export type CareerRoadmap = z.infer<typeof CareerRoadmapSchema>;