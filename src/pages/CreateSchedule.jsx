import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import Select from "react-select";
import toast from "react-hot-toast";

export default function CreateSchedule() {
  /* ── dropdown data ── */
  const [members, setMembers] = useState([]);
  const [exercises, setExercises] = useState([]);

  /* ── form state ── */
  const [selectedMember, setSelectedMember] = useState(null);
  const [days, setDays] = useState(1);
  const [planTitle, setPlanTitle] = useState("");

  // daysData = [{ note:'', exercises:[ {exercise_id, sets, reps, group} ] }, ... ]
  const [daysData, setDaysData] = useState([{ note: "", exercises: [] }]);

  const [saving, setSaving] = useState(false);

  /* ── fetch member & exercise lists ── */
  useEffect(() => {
    (async () => {
      const { data: mem, error: memErr } = await supabase
        .from("members")
        .select("id, member_id, first_name, last_name")
        .in("status", ["approved", "Approved (No Credentials)"]);
      if (memErr) toast.error("Load members failed");
      else
        setMembers(
          mem.map((m) => ({
            value: m.id,
            label: `[${m.member_id}] ${m.first_name} ${m.last_name}`,
          }))
        );

      const { data: ex, error: exErr } = await supabase
        .from("exercises")
        .select("ex_id, name, target_group");
      if (exErr) toast.error("Load exercises failed");
      else
        setExercises(
          ex.map((e) => ({
            value: e.ex_id,
            label: `${e.name} (${e.target_group})`,
          }))
        );
    })();
  }, []);

  /* ── handle days change ── */
  const handleDaysChange = (n) => {
    setDays(n);
    setDaysData((prev) => {
      let next = [...prev];
      if (next.length < n) {
        while (next.length < n) next.push({ note: "", exercises: [] });
      } else {
        next = next.slice(0, n);
      }
      return next;
    });
  };

  /* ── add exercise entry to a day ── */
  const addExerciseRow = (dayIdx) => {
    setDaysData((prev) => {
      const copy = [...prev];
      copy[dayIdx].exercises.push({
        exercise: null,
        sets: "",
        reps: "",
        group: "",
      });
      return copy;
    });
  };

  /* ── update nested fields ── */
  const updateExerciseField = (dayIdx, exIdx, field, value) => {
    setDaysData((prev) => {
      const copy = [...prev];
      copy[dayIdx].exercises[exIdx][field] = value;
      return copy;
    });
  };

  const updateDayNote = (dayIdx, value) => {
    setDaysData((prev) => {
      const copy = [...prev];
      copy[dayIdx].note = value;
      return copy;
    });
  };

  /* ── save schedule ── */
  const handleSave = async () => {
    if (!selectedMember) return toast.error("Select member");
    if (!planTitle.trim()) return toast.error("Enter plan title");
    setSaving(true);

    try {
      // 1. insert schedule
      const { data: scheduleRes, error: schedErr } = await supabase
        .from("schedules")
        .insert([{ title: planTitle, days }])
        .select("id")
        .single();
      if (schedErr) throw schedErr;
      const scheduleId = scheduleRes.id;

      // 2. insert schedule_days
      const dayRows = daysData.map((d, i) => ({
        schedule_id: scheduleId,
        day_number: i + 1,
        note: d.note || null,
      }));
      const { data: daysRes, error: dayErr } = await supabase
        .from("schedule_days")
        .insert(dayRows)
        .select("id, day_number");
      if (dayErr) throw dayErr;

      // map day_number -> new id
      const dayIdMap = Object.fromEntries(
        daysRes.map((d) => [d.day_number, d.id])
      );

      // 3. insert exercises
      const exRows = [];
      daysData.forEach((d, dayIdx) => {
        d.exercises.forEach((e, exIdx) => {
          if (!e.exercise) return; // skip empty rows
          exRows.push({
            schedule_day_id: dayIdMap[dayIdx + 1],
            exercise_id: e.exercise.value,
            sets: e.sets ? Number(e.sets) : null,
            reps: e.reps || null,
            group_number: e.group || null,
            order: exIdx + 1,
          });
        });
      });

      if (exRows.length) {
        const { error: exErr } = await supabase
          .from("schedule_day_exercises")
          .insert(exRows);
        if (exErr) throw exErr;
      }

      toast.success("Schedule saved ✅");
      // optional: reset
      setSelectedMember(null);
      setPlanTitle("");
      handleDaysChange(1);
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    }
    setSaving(false);
  };

  /* ── UI ── */
  return (
    <div className="text-white max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-yellow-400">
        Create Workout Schedule
      </h2>

      {/* Top settings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="text-sm block mb-1">Member</label>
          <Select
            options={members}
            value={selectedMember}
            onChange={setSelectedMember}
            placeholder="Search member"
            className="text-black"
          />
        </div>

        <div>
          <label className="text-sm block mb-1">Plan Title</label>
          <input
            type="text"
            value={planTitle}
            onChange={(e) => setPlanTitle(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm block mb-1">Days</label>
          <select
            value={days}
            onChange={(e) => handleDaysChange(Number(e.target.value))}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2"
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Day forms */}
      {daysData.map((day, dayIdx) => (
        <div
          key={dayIdx}
          className="mb-8 bg-gray-900 border border-gray-700 rounded-lg p-4"
        >
          <h3 className="font-semibold text-yellow-400 mb-3">
            Day {dayIdx + 1}
          </h3>

          {/* Day note */}
          <textarea
            placeholder="Day note / focus (optional)"
            value={day.note}
            onChange={(e) => updateDayNote(dayIdx, e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 mb-4 text-sm"
          />

          {/* Exercise entries */}
          {day.exercises.map((ex, exIdx) => (
            <div
              key={exIdx}
              className="grid grid-cols-1 sm:grid-cols-6 gap-3 mb-3"
            >
              <div className="sm:col-span-3">
                <Select
                  options={exercises}
                  value={ex.exercise}
                  onChange={(opt) =>
                    updateExerciseField(dayIdx, exIdx, "exercise", opt)
                  }
                  placeholder="Exercise"
                  className="text-black"
                />
              </div>
              <input
                type="number"
                placeholder="Sets"
                value={ex.sets}
                onChange={(e) =>
                  updateExerciseField(dayIdx, exIdx, "sets", e.target.value)
                }
                className="bg-gray-800 border border-gray-600 rounded px-2 py-1"
              />
              <input
                type="text"
                placeholder="Reps"
                value={ex.reps}
                onChange={(e) =>
                  updateExerciseField(dayIdx, exIdx, "reps", e.target.value)
                }
                className="bg-gray-800 border border-gray-600 rounded px-2 py-1"
              />
              <input
                type="number"
                placeholder="Group #"
                value={ex.group}
                onChange={(e) =>
                  updateExerciseField(dayIdx, exIdx, "group", e.target.value)
                }
                className="bg-gray-800 border border-gray-600 rounded px-2 py-1"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() => addExerciseRow(dayIdx)}
            className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded"
          >
            ➕ Add exercise
          </button>
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded"
      >
        {saving ? "Saving…" : "Save Schedule"}
      </button>

      <button
        type="button"
        onClick={() => {
          setSelectedMember(null);
          setDays(1);
          setPlanTitle("");
          setDaysData([{ note: "", exercises: [] }]);
        }}
        className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded font-semibold ml-4"
      >
        Reset All
      </button>
    </div>
  );
}
