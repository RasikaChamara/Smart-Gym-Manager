import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import toast from "react-hot-toast";
import Select from "react-select";

const Attendance = () => {
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
    const [loading, setLoading] = useState(false);

    // Fetch members
    useEffect(() => {
        const fetchMembers = async () => {
            const { data, error } = await supabase
                .from("members")
                .select("id,member_id, first_name, last_name, status")
                .in("status", ["approved", "Approved (No Credentials)"]);

            if (error) toast.error("Failed to load members");
            else {
                const formatted = data.map((m) => ({
                    value: m.id,
                    label: `${m.member_id} ${m.first_name} ${m.last_name} (${m.status})`,
                }));
                setMembers(formatted);
            }
        };

        fetchMembers();
    }, []);

    const handleSubmit = async () => {
        if (!selectedMember) return toast.error("Please select a member");

        setLoading(true);

        try {
            // Check if attendance already exists for this member on that date
            const { data: existing, error: fetchError } = await supabase
                .from("attendance")
                .select("id")
                .eq("member_id", selectedMember.value)
                .eq("date", date) // exact match on date string (YYYY-MM-DD)
                .limit(1);

            if (fetchError) {
                toast.error("Error checking attendance");
                setLoading(false);
                return;
            }

            if (existing.length > 0) {
                toast.error("Attendance already marked for this member on this date");
                setLoading(false);
                return;
            }

            // Insert attendance if no existing record found
            const { error: insertError } = await supabase.from("attendance").insert([
                {
                    member_id: selectedMember.value,
                    date,  // use the date string from the state
                    status: "Present",
                },
            ]);

            if (insertError) {
                toast.error("Failed to record attendance");
            } else {
                toast.success("Attendance marked");
                setSelectedMember(null);
            }
        } catch (err) {
            console.error(err);
            toast.error("Unexpected error");
        }

        setLoading(false);
    };


    return (
        <div className="max-w-xl mx-auto text-white">
            <h2 className="text-2xl font-bold mb-6 text-yellow-400">Mark Attendance</h2>

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
                {loading ? "Saving..." : "Save Attendance"}
            </button>
        </div>
    );
};

export default Attendance;
