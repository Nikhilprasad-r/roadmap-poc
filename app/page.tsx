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
      console.log("api",api)
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 py-12 px-4 sm:px-6 lg:px-8">
      {/* Input Form */}
      <div className="max-w-2xl mx-auto mb-12">
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

      {/* Roadmap Display */}
      {roadmap && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Overview Section */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/10">
            <div className="flex flex-col items-center gap-2 mb-4">
              <Target className="text-indigo-400" />
              <h2 className="text-2xl font-bold text-white">{roadmap.role}</h2>
              <h3 className="text-xl font-bold text-white">Required Stack</h3>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(roadmap.stack)
                  ? roadmap.stack.map((tech, index) => (
                      <span
                        key={index}
                        className={`bg-white/10 px-3 py-1 rounded-lg text-sm text-gray-200`}
                      >
                        {tech}
                      </span>
                    ))
                  : null}
              </div>
            </div>
            <p className="text-gray-300 mb-4">{roadmap.overview.description}</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <h3 className="font-semibold mb-2 flex items-center gap-2 text-white">
                  <Calendar className="text-indigo-400" size={16} />
                  Estimated Timeline
                </h3>
                <p className="text-gray-300">
                  {roadmap.overview.estimatedTimeToJob.minimumMonths}-
                  {roadmap.overview.estimatedTimeToJob.maximumMonths} months
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <h3 className="font-semibold mb-2 flex items-center gap-2 text-white">
                  <Book className="text-indigo-400" size={16} />
                  Prerequisites
                </h3>
                <ul className="list-disc list-inside text-gray-300">
                  {roadmap.overview.prerequisites.map((prereq, index) => (
                    <li key={index}>{prereq}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {/* Phase Example */}
          <div className="space-y-6">
            {roadmap.phases.map((phase, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/10"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Star className="text-indigo-400" />
                  <h3 className="text-xl font-bold text-white">
                    {" "}
                    {phase.name}
                  </h3>
                  <span className="bg-indigo-500/20 text-indigo-200 text-xs px-3 py-1 rounded-lg">
                    {phase.level}
                  </span>
                </div>
                <p className="text-gray-300 mb-4">{phase.description}</p>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-white">
                      Skills to Master
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
                </div>

                {/* Project Example */}
                {phase.projects.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2 text-white">
                      Recommended Projects
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {phase.projects.map((project, i) => (
                        <div
                          key={i}
                          className="bg-white/5 p-4 rounded-lg border border-white/10"
                        >
                          <h5 className="font-medium mb-1 text-white">
                            {project.name}
                          </h5>
                          <p className="text-sm text-gray-300 mb-2">
                            {project.description}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Clock size={14} />
                            {project.estimatedHours} hours
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Additional Sections */}
          <div className="grid md:grid-cols-2 gap-6">
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
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="text-indigo-400" />
                <h3 className="text-xl font-bold text-white">Metadata</h3>
              </div>
              <div className="text-sm text-gray-300">
                <p>Last Updated: December 2024</p>
                <p>Version: 1.0.0</p>
              </div>
            </div>
          </div>
          <footer className="mt-8 text-center">
            <span className="text-sm text-gray-400">
              © {new Date().getFullYear()} Career Roadmap Generator. All Rights
              Reserved.
            </span>
          </footer>
        </div>
      )}
    </div>
  );
};

export default RoadmapGenerator;
