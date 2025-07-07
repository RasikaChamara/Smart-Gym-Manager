import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import Select from "react-select";
import toast from "react-hot-toast";

export default function ViewSchedules() {
  /* ───────── dropdowns ───────── */
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  /* ───────── data + state ───────── */
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ───────── fetch members once ───────── */
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("members")
        .select("id, member_id, first_name, last_name")
        .in("status", ["approved", "Approved (No Credentials)"]);

      if (error) toast.error("Failed to load members");
      else
        setMembers(
          data.map((m) => ({
            value: m.id,
            label: `[${m.member_id}] ${m.first_name} ${m.last_name}`,
          }))
        );
    })();
  }, []);

  /* ───────── fetch schedules when member changes ───────── */
  useEffect(() => {
    const fetchSchedules = async () => {
      if (!selectedMember) {
        setSchedules([]);
        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from("schedules")
        .select(
          `
          id,
          title,
          created_at,
          schedule_days (
            id,
            day_number,
            note,
            schedule_day_exercises (
              id,
              sets,
              reps,
              group_number,
              exercises (
                name,
                target_group
              )
            )
          )
        `
        )
        .eq("member_id", selectedMember.value);

      if (error) {
        toast.error("Failed to load schedules");
        setSchedules([]);
      } else {
        /* top‑level: newest first */
        const sortSchedules = [...data].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setSchedules(sortSchedules);
      }

      setLoading(false);
    };

    fetchSchedules();
  }, [selectedMember]);

  /* ───────── helpers ───────── */
  const groupExercises = (exs) => {
    if (!exs?.length) return [];

    /* sort by group_number then keep original order inside group */
    const sorted = [...exs].sort(
      (a, b) => (a.group_number ?? 999) - (b.group_number ?? 999)
    );

    const groups = {};
    for (const ex of sorted) {
      const g = ex.group_number ?? null;
      if (!groups[g]) groups[g] = [];
      groups[g].push(ex);
    }

    return Object.entries(groups).map(([g, items]) => ({
      group: g === "null" ? null : Number(g),
      items,
    }));
  };

  /* ───────── render ───────── */
  return (
    <div className="max-w-5xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-6 text-yellow-400">Workout Schedules</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="sm:col-span-2">
          <label className="text-sm block mb-1">Member</label>
          <Select
            options={members}
            value={selectedMember}
            onChange={setSelectedMember}
            placeholder="Search member"
            isClearable
            className="text-black"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={() => {
              setSelectedMember(null);
              setSchedules([]);
            }}
            className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded"
          >
            Reset
          </button>
        </div>
      </div>

      {loading && <p className="text-gray-400">Loading…</p>}
      {!loading && selectedMember && schedules.length === 0 && (
        <p className="text-gray-400">No schedules found for this member.</p>
      )}

      {/* Schedule cards */}
      <div className="space-y-6">
        {schedules.map((sch) => (
          <div
            key={sch.id}
            className="bg-gray-900 border border-gray-700 rounded-lg p-4"
          >
            <div className="text-lg font-bold text-yellow-400">{sch.title}</div>
            <div className="text-xs text-gray-400 mb-4">
              Created {new Date(sch.created_at).toLocaleDateString()}
            </div>

            {sch.schedule_days
              .sort((a, b) => a.day_number - b.day_number)
              .map((day) => (
                <div key={day.id} className="mb-6">
                  <div className="font-semibold">Day {day.day_number}</div>
                  {day.note && (
                    <div className="text-xs text-gray-400 mb-2">📝 {day.note}</div>
                  )}

                  {groupExercises(day.schedule_day_exercises).map(
                    (grp, idx) => (
                      <div
                        key={idx}
                        className={`p-3 mt-2 rounded-lg ${
                          grp.group !== null
                            ? "border border-yellow-500 bg-gray-800"
                            : "border border-gray-600 bg-gray-800"
                        }`}
                      >
                        <div className="text-xs text-gray-400 mb-1">
                          {grp.group !== null
                            ? `Group ${grp.group + 1}`
                            : "Individual"}
                        </div>
                        <ul className="space-y-1 text-sm">
                          {grp.items.map((it) => (
                            <li key={it.id} className="flex justify-between">
                              <span>
                                {it.exercises.name} ({it.exercises.target_group})
                              </span>
                              <span className="text-gray-400">
                                {it.sets} × {it.reps}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
