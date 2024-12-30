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
  const api = "api/generate-roadmap";
  interface RoadmapResponse {
    data: { message: CareerRoadmap };
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
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
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Input Form */}
      <div className="max-w-2xl mx-auto mb-12 bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Career Roadmap Generator
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Frontend Developer"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Technology Stack
            </label>
            <input
              type="text"
              value={stack}
              onChange={(e) => setStack(e.target.value)}
              placeholder="e.g., React, TypeScript, Next.js"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 
                     disabled:bg-blue-300 transition-colors flex items-center justify-center gap-2"
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

      {/* Roadmap Display */}
      {roadmap && (
        <div className="max-w-4xl mx-auto">
          {/* Overview Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex flex-col items-center gap-2 mb-4">
              <Target className="text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                {roadmap.role}
              </h2>
              <h3 className="text-xl font-bold text-gray-800">
                Required Stack
              </h3>
              <div className="flex flex-wrap gap-2">
              {Array.isArray(roadmap.stack)
                ? roadmap.stack.map((tech, index) => (
                    <span
                      key={index}
                      className={`bg-gray-100 px-2 py-1 rounded text-sm`}
                    >
                      {tech}
                    </span>
                  ))
                : null}</div>
            </div>
            <p className="text-gray-600 mb-4">{roadmap.overview.description}</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="text-blue-600" size={16} />
                  Estimated Timeline
                </h3>
                <p>
                  {roadmap.overview.estimatedTimeToJob.minimumMonths}-
                  {roadmap.overview.estimatedTimeToJob.maximumMonths} months
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Book className="text-blue-600" size={16} />
                  Prerequisites
                </h3>
                <ul className="list-disc list-inside">
                  {roadmap.overview.prerequisites.map((prereq, index) => (
                    <li key={index}>{prereq}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Phases */}
          <div className="space-y-6">
            {roadmap.phases.map((phase, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-800">
                    {phase.name}
                  </h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {phase.level}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{phase.description}</p>

                {/* Skills and Tools */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold mb-2">Skills to Master</h4>
                    <div className="flex flex-wrap gap-2">
                      {phase.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 px-2 py-1 rounded text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Tools</h4>
                    <div className="flex flex-wrap gap-2">
                      {phase.tools.map((tool, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 px-2 py-1 rounded text-sm"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Projects */}
                {phase.projects.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Recommended Projects</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {phase.projects.map((project, i) => (
                        <div key={i} className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-medium mb-1">{project.name}</h5>
                          <p className="text-sm text-gray-600 mb-2">
                            {project.description}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
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
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">Soft Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {roadmap.softSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 px-2 py-1 rounded text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">Metadata</h3>
              </div>
              <div className="text-sm text-gray-600">
                <p>Last Updated: {roadmap.metadata.lastUpdated}</p>
                <p>Version: {roadmap.metadata.version}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapGenerator;
