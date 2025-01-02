"use client";
import { useState, useRef, useEffect } from "react";
import { Mic, Square, RefreshCcw, AlertCircle } from "lucide-react";
import type { FFmpeg } from "@ffmpeg/ffmpeg";
const AudioVisualizer = () => {
  return (
    <div className="flex items-center gap-1 h-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-1 bg-white rounded-full animate-pulse"
          style={{
            height: `${Math.random() * 16 + 4}px`,
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
};

const MicButton = ({ isRecording, onClick, disabled }: { isRecording: boolean; onClick: () => void; disabled: boolean }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50"
    >
      {isRecording ? (
        <AudioVisualizer />
      ) : (
        <Mic className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
      )}
      <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-200" />
    </button>
  );
};
export interface WordWiseScoreType {
  word: string;
  score: number;
}

interface Results {
  score: {
    accuracyScore: number;
    fluencyScore: number;
    completenessScore: number;
    pronunciationScore: number;
    wordWiseScore: WordWiseScoreType[];
  };
  transcript: string;
}

const FluencyRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Results | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [ffmpegLoaded, setFFmpegLoaded] = useState(false);

  const loadFFMPEG = async () => {
    try {
      // Only load FFmpeg in browser environment
      if (typeof window === "undefined") return;

      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const { toBlobURL } = await import("@ffmpeg/util");

      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
      const ffmpeg = new FFmpeg();
      ffmpegRef.current = ffmpeg;

      ffmpeg.on("log", ({ message }) => {
        console.info(message);
      });

      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
      });

      setFFmpegLoaded(true);
      console.log("FFMPEG Loaded");
    } catch (error) {
      console.error("Error loading FFmpeg:", error);
      setError("Failed to load audio processing capabilities");
    }
  };

  useEffect(() => {
    loadFFMPEG();
  }, []);

  // Rest of the component remains the same until convertToWav

  const convertToWav = async (audioBlob: Blob): Promise<Blob> => {
    const ffmpeg = ffmpegRef.current;
    if (!ffmpeg) {
      throw new Error("FFmpeg not initialized");
    }

    try {
      const { fetchFile } = await import("@ffmpeg/util");

      // Write the input webm file to FFmpeg's virtual filesystem
      const inputFileName = "input.webm";
      const outputFileName = "output.wav";
      const inputData = await fetchFile(audioBlob);
      await ffmpeg.writeFile(inputFileName, inputData);

      // Convert webm to wav with specific parameters
      await ffmpeg.exec([
        "-i",
        inputFileName,
        "-ac",
        "1", // Mono audio channel
        "-ar",
        "16000", // 16 kHz sample rate
        "-c:a",
        "pcm_s16le", // PCM 16-bit signed little-endian
        "-f",
        "wav", // WAV format
        outputFileName,
      ]);

      // Read the output file
      const outputData = await ffmpeg.readFile(outputFileName);

      // Clean up files
      await ffmpeg.deleteFile(inputFileName);
      await ffmpeg.deleteFile(outputFileName);

      // Convert the output data to a Blob
      return new Blob([outputData], { type: "audio/wav" });
    } catch (error) {
      console.error("Error converting audio:", error);
      throw new Error("Failed to convert audio format");
    }
  };
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setRecordingTime(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const startRecording = async () => {
    if (!ffmpegLoaded) {
      setError("Audio processing is not ready yet. Please try again.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      mediaRecorder.current = recorder;
      audioChunks.current = [];

      recorder.ondataavailable = (event: BlobEvent) => {
        audioChunks.current.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        await sendAudioToAPI(audioBlob);
      };

      recorder.start();
      setIsRecording(true);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Please allow microphone access to use this feature.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
    }
  };
  const sendAudioToAPI = async (audioBlob: Blob) => {
    setLoading(true);
    try {
      // Convert webm to wav using FFmpeg
      const wavBlob = await convertToWav(audioBlob);

      // Convert wav blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(wavBlob);

      reader.onloadend = async () => {
        const base64Audio = (reader.result as string)?.split(",")[1];

        if (!base64Audio) {
          throw new Error("Failed to convert audio to base64");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL_FLUENCY}/dev/fluencyChecker`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              wavAudio: base64Audio, // Changed from webmAudio to wavAudio
              language: "en",
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          setError(
            errorData?.error
              ? errorData?.error
              : "Failed to analyze pronunciation"
          );
          throw new Error(
            errorData.message || "Failed to analyze pronunciation"
          );
        }

        const data = (await response.json()) as Results;
        setResults(data);
        setLoading(false);
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to analyze pronunciation";
      setError( errorMessage);
      setLoading(false);
    }
  };

  const resetAll = () => {
    setResults(null);
    setError("");
    setRecordingTime(0);
  };

  return (
    <div className="min-h-dvh bg-fixed bg-gradient-to-br from-neutral-900 to-neutral-800 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center  gap-y-4 min-w-full">
      <div className="max-w-2xl mx-auto w-full">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-8 border border-white/10">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              Pronunciation Checker
            </h1>
            <p className="text-gray-400">
              Analyze and improve your pronunciation
            </p>
          </div>

          <div className="flex flex-col gap-4 items-center space-y-6">
            <div className="flex flex-col gap-4 items-center justify-center">
              {!isRecording ? (
                <div className="flex flex-col items-center gap-2">
                  <MicButton
                    isRecording={false}
                    onClick={startRecording}
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-400">Start Recording</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={stopRecording}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 transition-all duration-300"
                  >
                    <Square className="w-5 h-5 text-white" />
                  </button>
                  <span className="text-sm text-gray-400">Stop Recording</span>
                </div>
              )}

              {(results || error) && (
                <button
                  onClick={resetAll}
                  className="flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg border border-white/20 transition duration-200"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Reset
                </button>
              )}
            </div>

            {isRecording && (
              <div className="flex items-center justify-center gap-2 text-white">
                <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
                <span className="text-sm font-medium">
                  Recording: {formatTime(recordingTime)}
                </span>
              </div>
            )}
          </div>

          {!results ||
            (loading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto"></div>
                <p className="mt-2 text-sm text-gray-400">
                  Analyzing pronunciation...
                </p>
              </div>
            ))}

          {error && (
            <div className="flex items-center gap-2 p-4 text-red-400 bg-red-900/50 rounded-lg border border-red-700">
              <AlertCircle className="w-4 h-4" />
              <p>{error}</p>
            </div>
          )}

          {results && (
            <div className="space-y-6 p-6 rounded-lg bg-white/10 border border-white/20">
              <h3 className="font-semibold text-white">Results</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-sm text-gray-400">Accuracy Score</div>
                  <div className="text-2xl font-bold text-white">
                    {results.score.accuracyScore}%
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-sm text-gray-400">Fluency Score</div>
                  <div className="text-2xl font-bold text-white">
                    {results.score.fluencyScore}%
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-sm text-gray-400">
                    Completeness Score
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {results.score.completenessScore}%
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-sm text-gray-400">
                    Overall Pronunciation
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {results.score.pronunciationScore}%
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {results.score.wordWiseScore.map((item, index) => (
                  <span key={index} className="relative group">
                    <span
                      className={`text-lg cursor-pointer ${
                        item.score < 40
                          ? "text-red-400"
                          : item.score < 75
                          ? "text-orange-400"
                          : "text-green-400"
                      }`}
                    >
                      {item.word}
                    </span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1">
                      PronunciationScore: {item.score}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                    </div>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FluencyRecorder;
