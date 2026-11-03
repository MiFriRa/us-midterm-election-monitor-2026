import React from 'react';
import { X, Clock, Calendar, AlertCircle, CheckCircle2, MapPin } from 'lucide-react';

interface ElectionScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ElectionScheduleModal: React.FC<ElectionScheduleModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-purple-400" />
            <div>
              <h2 className="font-bold text-white text-base">Election Timetable & Counting Phases (CET / European Time)</h2>
              <p className="text-xs text-slate-400">
                Poll opening and closing schedules, reporting milestones, and counting durations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs text-slate-300 leading-relaxed">
          
          {/* Key Timetable Section */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>Poll Opening & Closing Times (CET / Central European Time)</span>
            </h3>

            <div className="space-y-2.5">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
                <div className="font-mono font-bold text-emerald-400 w-28 shrink-0 text-sm">
                  Tuesday 12:00 CET
                </div>
                <div>
                  <div className="font-bold text-slate-200">East Coast Polls Open</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    (06:00 – 07:00 EST). In-person voting commences across Vermont, New York, Virginia, Georgia, and Florida.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
                <div className="font-mono font-bold text-purple-400 w-28 shrink-0 text-sm">
                  Wednesday 00:00 CET
                </div>
                <div>
                  <div className="font-bold text-slate-200">First Polls Close (Midnight CET)</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    (18:00 EST). Portions of Indiana and Kentucky. Earliest rural precinct returns begin arriving at election desks.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
                <div className="font-mono font-bold text-purple-400 w-28 shrink-0 text-sm">
                  Wednesday 01:00 CET
                </div>
                <div>
                  <div className="font-bold text-slate-200">Major East Coast Closures</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    (19:00 EST). Georgia, Virginia, South Carolina, Vermont, and remainder of Indiana and Kentucky.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
                <div className="font-mono font-bold text-purple-400 w-28 shrink-0 text-sm">
                  Wednesday 01:30 – 02:00 CET
                </div>
                <div>
                  <div className="font-bold text-slate-200">The Keystone Wave: PA, MI, TX, FL, NC</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    (19:30 – 20:00 EST). North Carolina and Ohio (01:30), followed by Pennsylvania, Michigan, Texas, Florida, and New Hampshire (02:00).
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
                <div className="font-mono font-bold text-purple-400 w-28 shrink-0 text-sm">
                  Wednesday 03:00 – 04:00 CET
                </div>
                <div>
                  <div className="font-bold text-slate-200">Upper Midwest & Desert Southwest</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    (21:00 – 22:00 EST). Wisconsin, Arizona, Colorado, Minnesota, New Mexico (03:00); Nevada, Utah, Montana (04:00).
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
                <div className="font-mono font-bold text-purple-400 w-28 shrink-0 text-sm">
                  Wednesday 05:00 – 07:00 CET
                </div>
                <div>
                  <div className="font-bold text-slate-200">Pacific Coast, Alaska & Hawaii</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    (23:00 – 01:00 EST). California, Washington, Oregon (05:00); Alaska and Hawaii (06:00 – 07:00).
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How long will counting take? */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>How Long Will the Count Take?</span>
            </h3>

            <div className="space-y-2 text-slate-300 text-xs">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-100">Safe states and early calls:</strong> Many uncompetitive states (e.g. Alabama, Massachusetts, California, Texas) are projected by Decision Desks on Wednesday night between 01:00 and 06:00 CET.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-100">Battleground swing states (PA, GA, MI, WI):</strong> Tabulation typically continues through Wednesday afternoon and evening CET, as mail-in and drop-box batches in Philadelphia, Detroit, and Atlanta are scanned in bulk.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-100">Western postmarked ballot states (Arizona, Nevada, California):</strong> These states legally permit ballots postmarked by election day to arrive days later. Final counting routinely spans <strong>3 to 7 days</strong> before all close House seats are mathematically decided.
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition-colors"
          >
            Understood
          </button>
        </div>

      </div>
    </div>
  );
};
