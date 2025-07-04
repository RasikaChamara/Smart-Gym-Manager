import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import Select from "react-select";
import toast from "react-hot-toast";

export default function AddMeasurement() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [measuredAt, setMeasuredAt] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    weight_kg: "",
    height: "",
    chest_in: "",
    belly_in: "",
    leg_in: "",
    calf_in: "",
    arm_relaxed_in: "",
    arm_flexed_in: "",
    forearm_in: "",
    abnormalities: "",
  });

  /* fetch members */
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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMember) return toast.error("Select member");
    setLoading(true);

    const { error } = await supabase.from("measurements").insert([
      {
        member_id: selectedMember.value,
        measured_at: measuredAt,
        ...Object.fromEntries(
          Object.entries(form).map(([k, v]) => [k, v || null])
        ),
      },
    ]);

    if (error) toast.error("Failed to save");
    else {
      toast.success("Measurements saved");
      setSelectedMember(null);
      setForm({
        weight_kg: "",
        height: "",
        chest_in: "",
        belly_in: "",
        leg_in: "",
        calf_in: "",
        arm_relaxed_in: "",
        arm_flexed_in: "",
        forearm_in: "",
        abnormalities: "",
      });
    }
    setLoading(false);
  };
  const handleReset = () => {
    setSelectedMember(null);
    setMeasuredAt(new Date().toISOString().slice(0, 10));
    setForm({
      weight_kg: "",
      height: "",
      chest_in: "",
      belly_in: "",
      leg_in: "",
      calf_in: "",
      arm_relaxed_in: "",
      arm_flexed_in: "",
      forearm_in: "",
      abnormalities: "",
    });
  };

  return (
    <div className="max-w-3xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-6 text-yellow-400">
        Add Measurements
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Input
            name="weight_kg"
            label="Weight (kg)"
            value={form.weight_kg}
            onChange={handleChange}
          />
          <Input
            name="height"
            label="Height (ft)"
            value={form.height}
            onChange={handleChange}
          />
          <Input
            name="chest_in"
            label="Chest (in)"
            value={form.chest_in}
            onChange={handleChange}
          />
          <Input
            name="belly_in"
            label="Belly (in)"
            value={form.belly_in}
            onChange={handleChange}
          />
          <Input
            name="leg_in"
            label="Leg (in)"
            value={form.leg_in}
            onChange={handleChange}
          />
          <Input
            name="calf_in"
            label="Calf (in)"
            value={form.calf_in}
            onChange={handleChange}
          />
          <Input
            name="arm_relaxed_in"
            label="Arm Relaxed (in)"
            value={form.arm_relaxed_in}
            onChange={handleChange}
          />
          <Input
            name="arm_flexed_in"
            label="Arm Flexed (in)"
            value={form.arm_flexed_in}
            onChange={handleChange}
          />
          <Input
            name="forearm_in"
            label="Forearm (in)"
            value={form.forearm_in}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="text-sm block mb-1">Abnormalities / Notes</label>
          <textarea
            name="abnormalities"
            value={form.abnormalities}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm block mb-1">Measured Date</label>
            <input
              type="date"
              value={measuredAt}
              onChange={(e) => setMeasuredAt(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded font-semibold"
        >
          {loading ? "Saving…" : "Save Measurements"}
        </button>
        <br></br>
        <button
          type="button"
          onClick={handleReset}
          className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded font-semibold"
        >
          Reset
        </button>
      </form>
    </div>
  );
}

/* Reusable small input component */
const Input = ({ name, label, value, onChange }) => (
  <div>
    <label className="text-xs block mb-1">{label}</label>
    <input
      type="number"
      step="0.01"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2"
    />
  </div>
);
