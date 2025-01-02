"use client";
import React, { useState } from "react";
import {
  ArrowRight,
  Book,
  Calendar,
  Star,
  Award,
  Target,
  AlertCircle,
  Clock,
  Brain,
  AlertTriangle,
  Users,
  ExternalLink,
  FileText,
  Briefcase,
  DollarSign,
  Link,
} from "lucide-react";
import axios from "axios";
import { CareerRoadmap } from "./schemas/roadmap";

const RoadmapGenerator = () => {
  const [role, setRole] = useState("");
  const [stack, setStack] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const api = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  interface RoadmapResponse {
    data: { message: CareerRoadmap };
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("api", api);
      const resp: RoadmapResponse = await axios.post(api, {
        role: role,
        stack: stack,
      });
      if (resp?.data) {
        setRoadmap(resp.data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-fixed bg-gradient-to-br from-neutral-900 to-neutral-800 py-12 px-4 sm:px-6 lg:px-8 flex flex-col gap-y-4 min-w-full">
      {/* Roadmap Display */}
      {roadmap && (
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Overview Section */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/10">
            <div className="flex flex-col items-center gap-4 mb-6">
              <Target className="text-indigo-400 h-12 w-12" />
              <h2 className="text-3xl font-bold text-white">{roadmap.role}</h2>
              <h3 className="text-xl font-bold text-white">Required Stack</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {roadmap.stack.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-white/10 px-3 py-1 rounded-lg text-sm text-gray-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <p className="text-gray-300">{roadmap.overview.description}</p>
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-white">
                    <Briefcase className="text-indigo-400" size={16} />
                    Career Prospects
                  </h4>
                  <ul className="list-disc list-inside text-gray-300">
                    {roadmap.overview.careerProspects.map((prospect, idx) => (
                      <li key={idx}>{prospect}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-white">
                    <Calendar className="text-indigo-400" size={16} />
                    Timeline
                  </h4>
                  <p className="text-gray-300">
                    {roadmap.overview.estimatedTimeToJob.minimumMonths}-
                    {roadmap.overview.estimatedTimeToJob.maximumMonths} months
                  </p>
                </div>

                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-white">
                    <Book className="text-indigo-400" size={16} />
                    Prerequisites
                  </h4>
                  <ul className="list-disc list-inside text-gray-300">
                    {roadmap.overview.prerequisites.map((prereq, idx) => (
                      <li key={idx}>{prereq}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Phases Section with Connected Graph Visual */}
          <div className="relative">
            {roadmap.phases.map((phase, index) => (
              <div key={index} className="relative mb-8">
                {/* Connection Line */}
                {index < roadmap.phases.length - 1 && (
                  <div className="absolute left-1/2 top-full h-8 w-px bg-indigo-400/50" />
                )}

                <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <Star className="text-indigo-400" />
                    <h3 className="text-xl font-bold text-white">
                      {phase.name}
                    </h3>
                    <span className="bg-indigo-500/20 text-indigo-200 text-xs px-3 py-1 rounded-lg">
                      {phase.level}
                    </span>
                    <span className="text-gray-400 text-sm">
                      ({phase.duration.minimumWeeks}-
                      {phase.duration.maximumWeeks} weeks)
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <p className="text-gray-300">{phase.description}</p>

                      <div>
                        <h4 className="font-semibold mb-2 text-white">
                          Core Concepts
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {phase.concepts.map((concept, i) => (
                            <span
                              key={i}
                              className="bg-white/10 px-3 py-1 rounded-lg text-sm text-gray-200"
                            >
                              {concept}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 text-white">
                          Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {phase.skills.map((skill, i) => (
                            <span
                              key={i}
                              className="bg-white/10 px-3 py-1 rounded-lg text-sm text-gray-200"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 text-white">Tools</h4>
                        <div className="flex flex-wrap gap-2">
                          {phase.tools.map((tool, i) => (
                            <span
                              key={i}
                              className="bg-white/10 px-3 py-1 rounded-lg text-sm text-gray-200"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <h4 className="font-semibold mb-2 text-white">
                          Practical Tips
                        </h4>
                        <ul className="list-disc list-inside text-gray-300">
                          {phase.practicalTips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Resources Section */}
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3 text-white">
                      Learning Resources
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {phase.resources.map((resource, i) => (
                        <div
                          key={i}
                          className="bg-white/5 p-4 rounded-lg border border-white/10"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-white">
                              {resource.name}
                            </h5>
                            <span className="text-xs bg-indigo-500/20 text-indigo-200 px-2 py-1 rounded">
                              {resource.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 mb-2">
                            {resource.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            {resource.isPaid && <DollarSign size={14} />}
                            {resource.estimatedHours && (
                              <div className="flex items-center gap-1">
                                <Clock size={14} />
                                {resource.estimatedHours}h
                              </div>
                            )}
                            <Link size={14} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Milestones Section */}
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3 text-white">
                      Milestones
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {phase.milestones.map((milestone, i) => (
                        <div
                          key={i}
                          className="bg-white/5 p-4 rounded-lg border border-white/10"
                        >
                          <h5 className="font-medium text-white mb-2">
                            {milestone.title}
                          </h5>
                          <p className="text-sm text-gray-300 mb-2">
                            {milestone.description}
                          </p>
                          <div className="space-y-2">
                            <h6 className="text-sm font-medium text-white">
                              Completion Criteria:
                            </h6>
                            <ul className="list-disc list-inside text-sm text-gray-300">
                              {milestone.completionCriteria.map(
                                (criteria, j) => (
                                  <li key={j}>{criteria}</li>
                                )
                              )}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Projects Section */}
                  {phase.projects.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3 text-white">
                        Projects
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {phase.projects.map((project, i) => (
                          <div
                            key={i}
                            className="bg-white/5 p-4 rounded-lg border border-white/10"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-white">
                                {project.name}
                              </h5>
                              <span className="text-xs bg-indigo-500/20 text-indigo-200 px-2 py-1 rounded">
                                {project.difficulty}
                              </span>
                            </div>
                            <p className="text-sm text-gray-300 mb-2">
                              {project.description}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                              <Clock size={14} />
                              {project.estimatedHours} hours
                            </div>
                            <div className="space-y-2">
                              <h6 className="text-sm font-medium text-white">
                                Key Learning Outcomes:
                              </h6>
                              <ul className="list-disc list-inside text-sm text-gray-300">
                                {project.keyLearningOutcomes.map(
                                  (outcome, j) => (
                                    <li key={j}>{outcome}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Additional Sections Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Soft Skills */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Award className="text-indigo-400" />
                <h3 className="text-xl font-bold text-white">Soft Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {roadmap.softSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-white/10 px-3 py-1 rounded-lg text-sm text-gray-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Industry Knowledge */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="text-indigo-400" />
                <h3 className="text-xl font-bold text-white">
                  Industry Knowledge
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {roadmap.industryKnowledge.map((knowledge, index) => (
                  <span
                    key={index}
                    className="bg-white/10 px-3 py-1 rounded-lg text-sm text-gray-200"
                  >
                    {knowledge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <Award className="text-indigo-400" />
              <h3 className="text-xl font-bold text-white">
                Recommended Certifications
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {roadmap.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="bg-white/5 p-4 rounded-lg border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{cert.name}</h4>
                    <span className="text-xs bg-indigo-500/20 text-indigo-200 px-2 py-1 rounded">
                      {cert.level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">
                    Provider: {cert.provider}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {cert.estimatedPreparationHours}h prep
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={14} />
                      {cert.recommendedPhase}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <Briefcase className="text-indigo-400" />
              <h3 className="text-xl font-bold text-white">
                Job Search Guidance
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Resume Tips */}
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="text-indigo-400" size={16} />
                  <h4 className="font-semibold text-white">Resume Tips</h4>
                </div>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  {roadmap.jobSearchGuidance.resumeTips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>

              {/* Portfolio Projects */}
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <Book className="text-indigo-400" size={16} />
                  <h4 className="font-semibold text-white">
                    Portfolio Projects
                  </h4>
                </div>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  {roadmap.jobSearchGuidance.portfolioProjects.map(
                    (project, index) => (
                      <li key={index}>{project}</li>
                    )
                  )}
                </ul>
              </div>

              {/* Interview Preparation */}
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="text-indigo-400" size={16} />
                  <h4 className="font-semibold text-white">
                    Interview Preparation
                  </h4>
                </div>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  {roadmap.jobSearchGuidance.interviewPreparation.map(
                    (prep, index) => (
                      <li key={index}>{prep}</li>
                    )
                  )}
                </ul>
              </div>

              {/* Job Platforms */}
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <ExternalLink className="text-indigo-400" size={16} />
                  <h4 className="font-semibold text-white">Job Platforms</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {roadmap.jobSearchGuidance.jobPlatforms.map(
                    (platform, index) => (
                      <span
                        key={index}
                        className="bg-white/10 px-3 py-1 rounded-lg text-sm text-gray-200"
                      >
                        {platform}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Networking Tips */}
              <div className="bg-white/5 p-4 rounded-lg border border-white/10 md:col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="text-indigo-400" size={16} />
                  <h4 className="font-semibold text-white">Networking Tips</h4>
                </div>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  {roadmap.jobSearchGuidance.networkingTips.map(
                    (tip, index) => (
                      <li key={index}>{tip}</li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Common Pitfalls Section */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="text-indigo-400" />
              <h3 className="text-xl font-bold text-white">
                Common Pitfalls to Avoid
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {roadmap.commonPitfalls.map((pitfall, index) => (
                <div
                  key={index}
                  className="bg-white/5 p-4 rounded-lg border border-white/10"
                >
                  <p className="text-gray-300">{pitfall}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Continuous Learning Section */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <Brain className="text-indigo-400" />
              <h3 className="text-xl font-bold text-white">
                Continuous Learning Path
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {roadmap.continuousLearning.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/5 p-4 rounded-lg border border-white/10"
                >
                  <h4 className="font-semibold text-white mb-3">
                    {item.topic}
                  </h4>
                  <p className="text-gray-300 mb-3">{item.reason}</p>
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-white">
                      Recommended Resources:
                    </h5>
                    <ul className="list-disc list-inside text-sm text-gray-300">
                      {item.resources.map((resource, idx) => (
                        <li key={idx}>{resource}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metadata Section */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="text-indigo-400" />
              <h3 className="text-xl font-bold text-white">Metadata</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="text-gray-300">
                <p className="mb-2">
                  Last Updated: {roadmap.metadata.lastUpdated}
                </p>
                <p>Version: {roadmap.metadata.version}</p>
              </div>
              {roadmap.metadata.contributors && (
                <div>
                  <h4 className="font-semibold text-white mb-2">
                    Contributors
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {roadmap.metadata.contributors.map((contributor, index) => (
                      <span
                        key={index}
                        className="bg-white/10 px-3 py-1 rounded-lg text-sm text-gray-200"
                      >
                        {contributor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Input Form */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-8 border border-white/10">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              Career Roadmap Generator
            </h1>
            <p className="text-gray-400">
              Generate your personalized career development path
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Target Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Frontend Developer"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white 
                       placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Technology Stack
              </label>
              <input
                type="text"
                value={stack}
                onChange={(e) => setStack(e.target.value)}
                placeholder="e.g., React, TypeScript, Next.js"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white 
                       placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg 
                     shadow-lg hover:shadow-xl transition duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  Generate Roadmap <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoadmapGenerator;
