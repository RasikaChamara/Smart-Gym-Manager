import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import toast from "react-hot-toast";
import Select from "react-select";

const Attendance = () => {
  /* ---------- Mark‑attendance state ---------- */
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);

  /* ---------- View‑attendance state ---------- */
  const [filterMember, setFilterMember] = useState(null);
  const [filterDay, setFilterDay] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [viewRows, setViewRows] = useState([]);
  const [viewLoading, setViewLoading] = useState(false);

  /* ---------- Fetch members on mount ---------- */
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("members")
        .select("id, member_id, first_name, last_name, status")
        .in("status", ["approved", "Approved (No Credentials)"]);

      if (error) toast.error("Failed to load members");
      else {
        const formatted = data.map((m) => ({
          value: m.id,
          label: `[${m.member_id}] ${m.first_name} ${m.last_name}`,
        }));
        setMembers(formatted);
      }
    })();
  }, []);

  /* ---------- Insert Attendance with duplicate check ---------- */
  const handleSubmit = async () => {
    if (!selectedMember) return toast.error("Please select a member");
    setLoading(true);

    try {
      const { data: existing, error: fetchError } = await supabase
        .from("attendance")
        .select("id", { count: "exact" })
        .eq("member_id", selectedMember.value)
        .eq("date", date)
        .limit(1);

      if (fetchError) throw fetchError;
      if (existing.length) {
        toast.error("Already marked for this date");
      } else {
        const { error: insertErr } = await supabase
          .from("attendance")
          .insert([
            { member_id: selectedMember.value, date, status: "Present" },
          ]);
        if (insertErr) throw insertErr;
        toast.success("Attendance marked");
        setSelectedMember(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error");
    }
    setLoading(false);
  };

  /* ---------- Fetch attendance list when filters change ---------- */
  useEffect(() => {
    const fetchAttendance = async () => {
      if (!filterDay && !filterMonth && !filterMember) return; // nothing selected yet
      setViewLoading(true);

      let query = supabase
        .from("attendance")
        .select(`id, date, members ( member_id, first_name, last_name )`)
        .order("date", { ascending: false });

      if (filterMember) query = query.eq("member_id", filterMember.value);
      if (filterDay) query = query.eq("date", filterDay);
      if (filterMonth) {
        const [year, month] = filterMonth.split("-");
        const start = `${year}-${month}-01`;
        const endDate = new Date(year, month, 0).getDate(); // last day of month
        const end = `${year}-${month}-${String(endDate).padStart(2, "0")}`;

        query = query.gte("date", start).lte("date", end);
      }

      const { data, error } = await query;
      if (error) toast.error("Failed to load attendance");
      else setViewRows(data ?? []);

      setViewLoading(false);
    };

    fetchAttendance();
  }, [filterDay, filterMonth, filterMember]);

  /* ---------- JSX ---------- */
  return (
    <div className="max-w-2xl mx-auto text-white">
      {/* ------------ Mark Attendance ------------- */}
      <h2 className="text-2xl font-bold mb-6 text-yellow-400">
        Mark Attendance
      </h2>

      <div className="mb-4">
        <label className="text-sm block mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-gray-800 border border-gray-600 rounded px-3 py-2 w-full"
        />
      </div>

      <div className="mb-6">
        <label className="text-sm block mb-1">Select Member</label>
        <Select
          options={members}
          value={selectedMember}
          onChange={setSelectedMember}
          placeholder="Search or select member"
          className="text-black"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded"
        disabled={loading}
      >
        {loading ? "Saving…" : "Save Attendance"}
      </button>

      {/* ------------ Divider ------------- */}
      <hr className="my-10 border-gray-700" />

      {/* ------------ View Attendance ------------- */}
      <h3 className="text-xl font-bold mb-4 text-yellow-400">
        View Attendance
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
        <div>
          <label className="text-sm block mb-1">Filter by Day</label>
          <input
            type="date"
            value={filterDay}
            onChange={(e) => {
              setFilterDay(e.target.value);
              setFilterMonth("");
            }}
            className="bg-gray-800 border border-gray-600 rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="text-sm block mb-1">Filter by Month</label>
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => {
              setFilterMonth(e.target.value);
              setFilterDay("");
            }}
            className="bg-gray-800 border border-gray-600 rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="text-sm block mb-1">Filter by Member</label>
          <Select
            options={members}
            value={filterMember}
            onChange={setFilterMember}
            isClearable
            placeholder="All members"
            className="text-black"
          />
        </div>
      </div>

      <div className="mb-6">
        <button
          onClick={() => {
            setFilterDay("");
            setFilterMonth("");
            setFilterMember(null);
            setViewRows([]);
          }}
          className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
        >
          Reset Filters
        </button>
      </div>

      {viewLoading ? (
        <p className="text-gray-400">Loading…</p>
      ) : viewRows.length === 0 ? (
        <p className="text-gray-400">No attendance records found.</p>
      ) : (
        <ul className="space-y-2">
          {viewRows.map((row) => (
            <li
              key={row.id}
              className="bg-gray-900 p-3 rounded-lg flex justify-between items-center"
            >
              <span>
                <span className="font-semibold text-yellow-400">
                  {row.members.member_id}
                </span>{" "}
                {row.members.first_name} {row.members.last_name}
              </span>
              <span className="text-sm text-gray-300">{row.date}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Attendance;
