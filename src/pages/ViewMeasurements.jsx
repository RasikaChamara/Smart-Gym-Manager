import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import Select from "react-select";
import toast from "react-hot-toast";

export default function ViewMeasurements() {
  const [members, setMembers] = useState([]);
  const [filterMember, setFilterMember] = useState(null);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ───── fetch members once ───── */
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

  /* ───── fetch measurements when member changes ───── */
  useEffect(() => {
    const fetchMeasurements = async () => {
      if (!filterMember) return setRows([]);

      setLoading(true);
      const { data, error } = await supabase
        .from("measurements")
        .select("*")
        .eq("member_id", filterMember.value)
        .order("measured_at", { ascending: false });

      if (error) {
        toast.error("Failed to fetch measurements");
        setRows([]);
      } else setRows(data);

      setLoading(false);
    };

    fetchMeasurements();
  }, [filterMember]);

  return (
    <div className="max-w-4xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-6 text-yellow-400">
        View Measurements
      </h2>

      {/* Member filter */}
      <div className="mb-8">
        <label className="text-sm block mb-1">Select Member</label>
        <Select
          options={members}
          value={filterMember}
          onChange={setFilterMember}
          placeholder="Search member"
          isClearable
          className="text-black"
        />
      </div>

      {loading && <p className="text-gray-400">Loading…</p>}
      {!loading && filterMember && rows.length === 0 && (
        <p className="text-gray-400">No measurements found.</p>
      )}

      {/* measurements list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rows.map((m) => (
          <div
            key={m.id}
            className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-1"
          >
            <div className="text-yellow-400 font-semibold">
              {m.measured_at}
            </div>
            <DataLine label="Weight" value={m.weight_kg} unit="kg" />
            <DataLine label="Height" value={m.height} unit="ft" />
            <DataLine label="Chest" value={m.chest_in} unit="in" />
            <DataLine label="Belly" value={m.belly_in} unit="in" />
            <DataLine label="Leg" value={m.leg_in} unit="in" />
            <DataLine label="Calf" value={m.calf_in} unit="in" />
            <DataLine label="Arm Relaxed" value={m.arm_relaxed_in} unit="in" />
            <DataLine label="Arm Flexed" value={m.arm_flexed_in} unit="in" />
            <DataLine label="Forearm" value={m.forearm_in} unit="in" />
            {m.abnormalities && (
              <div className="text-xs text-red-400">
                Notes: {m.abnormalities}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* --- tiny helper to render a line if value exists --- */
const DataLine = ({ label, value, unit }) =>
  value ? (
    <div className="text-xs text-gray-300 flex justify-between">
      <span>{label}</span>
      <span>
        {value} {unit}
      </span>
    </div>
  ) : null;
