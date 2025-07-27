import { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Trash2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import supabase from "../lib/supabaseClient";

export default function ManageExercises() {
  const [exercises, setExercises] = useState([]);
  const [name, setName] = useState("");
  const [targetGroup, setTargetGroup] = useState("");
  const [equipment, setEquipment] = useState("");
  //const [loading, setLoading] = useState(false);

  const categories = ["back", "chest", "leg", "core", "biceps", "triceps"];

  useEffect(() => {
    fetchExercises();
  }, []);

  async function fetchExercises() {
    const { data, error } = await supabase.from("exercises").select("*");
    if (error) {
      toast.error("Failed to fetch exercises");
    } else {
      setExercises(data);
    }
  }

  const generateExId = (group) => {
    const filtered = exercises.filter((ex) => ex.ex_id.startsWith(group));
    const last = Math.max(
      ...filtered.map((ex) => parseInt(ex.ex_id.replace(group, "")) || 0),
      0
    );
    const nextId = String(last + 1).padStart(2, "0");
    return `${group}${nextId}`;
  };

  const handleAddExercise = async () => {
    if (!name || !targetGroup || !equipment) {
      toast.error("All fields are required");
      return;
    }

    const ex_id = generateExId(targetGroup);

    const { error } = await supabase.from("exercises").insert({
      ex_id,
      name,
      target_group: targetGroup,
      equipment,
    });

    if (error) {
      toast.error("Failed to add exercise");
    } else {
      toast.success("Exercise added");
      setName("");
      setTargetGroup("");
      setEquipment("");
      fetchExercises();
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("exercises").delete().eq("ex_id", id);
    if (error) {
      toast.error("Delete failed");
    } else {
      toast.success("Deleted");
      fetchExercises();
    }
  };

  return (
    <div className="p-4 md:p-8 bg-black min-h-screen text-white">
      <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Manage Exercises</h2>

      {categories.map((cat) => {
        const groupExercises = exercises.filter((e) => e.ex_id.startsWith(cat));
        if (groupExercises.length === 0) return null;

        return (
          <div key={cat} className="mb-6">
            <h3 className="text-xl font-semibold text-[#FFD700] capitalize mb-2">{cat}</h3>
            <div className="flex flex-wrap gap-3">
              {groupExercises.map((e) => (
                <Card
                  key={e.ex_id}
                  className="bg-white text-black flex items-center justify-between p-3 rounded-xl shadow-md w-full sm:w-64"
                >
                  <span className="font-medium">{e.name}</span>
                  <Trash2
                    className="text-red-600 hover:scale-110 cursor-pointer"
                    onClick={() => handleDelete(e.ex_id)}
                    size={20}
                  />
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {/* Add New */}
      <div className="mb-10 p-4 bg-[#1a1a1a] rounded-xl">
        <h3 className="text-lg text-[#FFD700] font-semibold mb-4">Add New Exercise</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            placeholder="Exercise Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white text-black"
          />

          <select
            value={targetGroup}
            onChange={(e) => setTargetGroup(e.target.value)}
            className="bg-white text-black px-3 py-2 rounded-md border"
          >
            <option value="">Select Target Group</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <Input
            placeholder="Equipment (e.g., dumbbell)"
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
            className="bg-white text-black"
          />
        </div>

        <Button
          onClick={handleAddExercise}
          className="mt-4 bg-[#FFD700] text-black hover:bg-yellow-400 font-semibold"
        >
          <Plus size={18} className="mr-2" />
          Add Exercise
        </Button>
      </div>
    </div>
  );
}
