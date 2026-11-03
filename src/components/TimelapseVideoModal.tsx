import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Video, Download, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { HourlySnapshot } from '../data/electionData2026';
import { EQUAL_AREA_TILES } from '../data/usHighResMapPaths';
import { getPurpleGradientColor, calculateTwoPartyMargin } from '../utils/electionMath';

interface TimelapseVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  snapshots: HourlySnapshot[];
  currentHourIndex: number;
  onSetHourIndex: (idx: number) => void;
}

export const TimelapseVideoModal: React.FC<TimelapseVideoModalProps> = ({
  isOpen,
  onClose,
  snapshots,
  currentHourIndex,
  onSetHourIndex
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1000); // ms per step
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setIsRecording(false);
    }
  }, [isOpen]);

  // Playback timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      onSetHourIndex((currentHourIndex + 1) % snapshots.length);
    }, playbackSpeed);
    return () => clearInterval(interval);
  }, [isPlaying, currentHourIndex, snapshots.length, playbackSpeed, onSetHourIndex]);

  // Draw current frame to canvas
  const drawFrame = (snapIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const snap = snapshots[snapIndex];
    if (!snap) return;

    // Canvas dimensions: 1280 x 720 (HD 16:9)
    ctx.fillStyle = '#030712'; // Deep background
    ctx.fillRect(0, 0, 1280, 720);

    // Title & Time header
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('US Midterm Election 2026 — Live Replay', 60, 60);

    // CET & EST Time banner
    ctx.fillStyle = '#a855f7';
    ctx.font = 'bold 22px "JetBrains Mono", monospace';
    ctx.fillText(`TIME: ${snap.hourLabel} / ~${(19 + snapIndex + 6) % 24}:00 CET`, 60, 95);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`${snap.description} • National reporting: ${snap.nationalReportingPct}%`, 60, 125);

    // Draw Cartogram Tiles
    const tileSize = 64;
    const gap = 8;
    const startX = 60;
    const startY = 160;

    let totalDem = 0;
    let totalGop = 0;

    EQUAL_AREA_TILES.forEach(tile => {
      const stateProg = snap.stateProgress[tile.id];
      const repPct = stateProg ? stateProg.reportingPct : 0;
      const dVotes = stateProg ? stateProg.demVotes : 0;
      const gVotes = stateProg ? stateProg.gopVotes : 0;

      totalDem += dVotes;
      totalGop += gVotes;

      const { demPct, gopPct } = calculateTwoPartyMargin(dVotes, gVotes);
      const color = getPurpleGradientColor(demPct, gopPct, repPct);

      const x = startX + tile.col * (tileSize + gap);
      const y = startY + tile.row * (tileSize + gap);

      // Rounded box
      ctx.fillStyle = color;
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;

      // Draw rounded rect
      const r = 6;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + tileSize - r, y);
      ctx.quadraticCurveTo(x + tileSize, y, x + tileSize, y + r);
      ctx.lineTo(x + tileSize, y + tileSize - r);
      ctx.quadraticCurveTo(x + tileSize, y + tileSize, x + tileSize - r, y + tileSize);
      ctx.lineTo(x + r, y + tileSize);
      ctx.quadraticCurveTo(x, y + tileSize, x, y + tileSize - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // State label
      ctx.fillStyle = repPct > 0 ? '#ffffff' : '#64748b';
      ctx.font = 'bold 15px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(tile.id, x + tileSize / 2, y + 28);

      // Percentage / Status
      ctx.fillStyle = repPct > 0 ? '#e2e8f0' : '#475569';
      ctx.font = '11px "JetBrains Mono", monospace';
      if (repPct === 0) {
        ctx.fillText('0% in', x + tileSize / 2, y + 46);
      } else {
        const lead = demPct > gopPct ? `D+${(demPct - gopPct).toFixed(0)}` : `R+${(gopPct - demPct).toFixed(0)}`;
        ctx.fillText(lead, x + tileSize / 2, y + 46);
      }
    });

    // Summary Scorebar at Bottom
    ctx.textAlign = 'left';
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(60, 640, 1160, 48);

    const totalVotes = totalDem + totalGop;
    const nationalDemPct = totalVotes > 0 ? ((totalDem / totalVotes) * 100).toFixed(1) : '50.0';
    const nationalGopPct = totalVotes > 0 ? ((totalGop / totalVotes) * 100).toFixed(1) : '50.0';

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillText(`Democrats: ${nationalDemPct}% (${totalDem.toLocaleString('en-US')} votes)`, 80, 670);

    ctx.fillStyle = '#f87171';
    ctx.textAlign = 'right';
    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillText(`Republicans: ${nationalGopPct}% (${totalGop.toLocaleString('en-US')} votes)`, 1200, 670);
  };

  // Re-draw when index changes
  useEffect(() => {
    if (isOpen) {
      drawFrame(currentHourIndex);
    }
  }, [isOpen, currentHourIndex, snapshots]);

  // Video Recording Engine
  const startVideoGeneration = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsRecording(true);
    setRecordingProgress(0);
    setDownloadUrl(null);
    recordedChunksRef.current = [];

    // Capture 30fps canvas stream
    const stream = canvas.captureStream(30);
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm';

    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 3000000 });
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setIsRecording(false);
    };

    recorder.start();

    // Step through all frames at 1.2 seconds per hour for clean video viewing
    for (let i = 0; i < snapshots.length; i++) {
      onSetHourIndex(i);
      drawFrame(i);
      setRecordingProgress(Math.round(((i + 1) / snapshots.length) * 100));
      await new Promise(r => setTimeout(r, 1200));
    }

    // Stop recording after last frame has lingered
    setTimeout(() => {
      if (recorder.state !== 'inactive') {
        recorder.stop();
      }
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-purple-400" />
            <div>
              <h2 className="font-bold text-white text-base">Timelapse Video & Replay Studio</h2>
              <p className="text-xs text-slate-400">
                Speed up election night returns and capture a local WebM video directly in your browser
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-4 overflow-y-auto">
          
          {/* Canvas Preview */}
          <div className="relative w-full aspect-[16/9] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={1280}
              height={720}
              className="w-full h-full object-contain"
            />

            {isRecording && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center space-y-3">
                <div className="flex items-center gap-2 text-red-400 font-mono text-sm font-bold animate-pulse">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span>RECORDING TIMELAPSE VIDEO...</span>
                </div>
                <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full transition-all duration-300"
                    style={{ width: `${recordingProgress}%` }}
                  />
                </div>
                <span className="text-xs text-slate-300 font-mono">{recordingProgress}% complete</span>
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
            
            {/* Play/Pause & Step */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(prev => !prev)}
                disabled={isRecording}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause Replay' : 'Play Replay'}</span>
              </button>

              <button
                onClick={() => onSetHourIndex(0)}
                disabled={isRecording}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono flex items-center gap-1 transition-colors"
                title="Reset to initial poll close"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Start Over</span>
              </button>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
              <span>Speed:</span>
              {[
                { label: '0.5x', ms: 1600 },
                { label: '1x', ms: 1000 },
                { label: '2x', ms: 500 },
                { label: '4x', ms: 250 }
              ].map(sp => (
                <button
                  key={sp.label}
                  onClick={() => setPlaybackSpeed(sp.ms)}
                  className={`px-2 py-1 rounded transition-colors ${
                    playbackSpeed === sp.ms
                      ? 'bg-purple-900/60 text-purple-200 border border-purple-600'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>

            {/* Video Record / Download Actions */}
            <div className="flex items-center gap-2">
              {!downloadUrl ? (
                <button
                  onClick={startVideoGeneration}
                  disabled={isRecording}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Video className="w-4 h-4" />
                  <span>{isRecording ? 'Recording...' : 'Record & Export Video (WebM)'}</span>
                </button>
              ) : (
                <a
                  href={downloadUrl}
                  download={`us-midterm-2026-timelapse-${new Date().toISOString().slice(0, 10)}.webm`}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg animate-bounce"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Rendered Video</span>
                </a>
              )}
            </div>

          </div>

          {/* Explanation Banner */}
          <div className="p-3 bg-purple-950/30 border border-purple-800/40 rounded-xl text-xs text-purple-200/90 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Local Replay Technology:</strong> Election data is accumulated and preserved in memory hour by hour. Video frames are rendered 100% locally in your browser in HD 720p with zero server processing latency. The exported WebM can be shared or embedded anywhere.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
