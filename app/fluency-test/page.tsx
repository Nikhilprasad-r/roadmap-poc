"use client";
import { useState, useRef, useEffect } from "react";
import { Mic, Square, AlertCircle, RefreshCcw } from "lucide-react";

interface Results {
  score: {
    accuracyScore: number;
    fluencyScore: number;
    completenessScore: number;
    pronunciationScore: number;
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
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorder.current = recorder;
      audioChunks.current = [];

      recorder.ondataavailable = (event: BlobEvent) => {
        audioChunks.current.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        await sendAudioToAPI(audioBlob);
      };

      recorder.start();
      setIsRecording(true);
      setError("");
    } catch (err) {
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
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string)?.split(",")[1];

        if (!base64Audio) {
          throw new Error("Failed to convert audio to base64");
        }

        const response = await fetch(
          " http://localhost:3001/dev/fluencyChecker",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              audio: base64Audio,
              language: "en",
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to analyze pronunciation"
          );
        }

        const data = (await response.json()) as Results;
        setResults(data);
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to analyze pronunciation";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setResults(null);
    setError("");
    setRecordingTime(0);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Pronunciation Checker</h2>

        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            {!isRecording ? (
              <button
                onClick={startRecording}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                <Mic className="w-4 h-4" />
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <Square className="w-4 h-4" />
                Stop Recording
              </button>
            )}

            {(results || error) && (
              <button
                onClick={resetAll}
                className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                <RefreshCcw className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>

          {isRecording && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
              <span className="text-sm font-medium">
                Recording: {formatTime(recordingTime)}
              </span>
            </div>
          )}
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">
              Analyzing pronunciation...
            </p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 text-red-800 bg-red-100 rounded-md">
            <AlertCircle className="w-4 h-4" />
            <p>{error}</p>
          </div>
        )}

        {results && (
          <div className="space-y-4 p-4 border rounded-md bg-gray-50">
            <h3 className="font-semibold">Results</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded-md shadow-sm">
                <div className="text-sm text-gray-600">Accuracy Score</div>
                <div className="text-2xl font-bold">
                  {results.score.accuracyScore}%
                </div>
              </div>

              <div className="p-3 bg-white rounded-md shadow-sm">
                <div className="text-sm text-gray-600">Fluency Score</div>
                <div className="text-2xl font-bold">
                  {results.score.fluencyScore}%
                </div>
              </div>

              <div className="p-3 bg-white rounded-md shadow-sm">
                <div className="text-sm text-gray-600">Completeness Score</div>
                <div className="text-2xl font-bold">
                  {results.score.completenessScore}%
                </div>
              </div>

              <div className="p-3 bg-white rounded-md shadow-sm">
                <div className="text-sm text-gray-600">
                  Overall Pronunciation
                </div>
                <div className="text-2xl font-bold">
                  {results.score.pronunciationScore}%
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-semibold">Transcribed Text:</div>
              <p className="p-3 bg-white rounded-md text-gray-700">
                {results.transcript}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FluencyRecorder;
