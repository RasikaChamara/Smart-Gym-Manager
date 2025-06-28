import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

const ViewMembers = () => {
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error("Error fetching members:", error);
    else setMembers(data);
    setLoading(false);
  };

  const handleDelete = async (id, status) => {
    if (status === "approved") {
      alert("You cannot delete an approved member.");
      return;
    }
    const confirm = window.confirm(
      "Are you sure you want to delete this member?"
    );
    if (!confirm) return;

    const { error } = await supabase.from("members").delete().eq("id", id);
    if (error) console.error("Delete failed:", error);
    else fetchMembers();
  };

  const handleEditClick = (member) => {
    setEditingMember(member);
    setEditForm({ ...member });
  };

  const handleEditSave = async () => {
    const { id, ...updatedData } = editForm;
    const { error } = await supabase
      .from("members")
      .update(updatedData)
      .eq("id", id);
    if (error) {
      alert("Update failed");
      console.error(error);
    } else {
      setEditingMember(null);
      fetchMembers();
    }
  };

  const handleExportCSV = () => {
    const headers = Object.keys(members[0] || {}).join(",");
    const rows = members.map((m) => Object.values(m).join(",")).join("\n");
    const blob = new Blob([`${headers}\n${rows}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "members.csv";
    a.click();
  };

  const filteredMembers = members.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      m.email?.toLowerCase().includes(q) ||
      `${m.first_name} ${m.last_name}`.toLowerCase().includes(q) ||
      String(m.member_id || "").toLowerCase().includes(q)

    );
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-yellow-400">All Members</h2>
        <button
          onClick={handleExportCSV}
          className="bg-yellow-400 text-black px-4 py-1 rounded hover:bg-yellow-500"
        >
          Export CSV
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by name, email, or member ID"
        className="mb-4 px-3 py-2 w-full max-w-md bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-yellow-400"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {loading ? (
        <p>Loading members...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-gray-900 border border-gray-700 rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-yellow-400">
                {member.first_name} {member.last_name}
              </h3>
              <p className="text-sm text-gray-300">Email: {member.email}</p>
              <p className="text-sm text-gray-300">
                Member ID: {member.member_id}
              </p>
              <p className="text-sm text-gray-300">Phone Number: {member.phone}</p>
              <p className="text-sm text-gray-300">Status: {member.status}</p>
              <p className="text-sm text-gray-300">Target: {member.target}</p>
              <p className="text-sm text-gray-300">
                Coaching: {member.coaching_required === true ? "✅" : "❌"}
              </p>
              <p className="text-sm text-gray-300">
                Birthday: {member.birthday}
              </p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleEditClick(member)}
                  className="flex-1 bg-yellow-400 text-black py-1 rounded text-sm hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(member.id, member.status)}
                  className="flex-1 bg-red-600 py-1 rounded text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg w-full max-w-lg text-white max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-xl mb-4 text-yellow-400">Edit Member</h3>

            {Object.entries(editForm).map(
              ([key, value]) =>
                key !== "id" &&
                key !== "created_at" && (
                  <div key={key} className="mb-3">
                    <label className="block text-sm mb-1 capitalize">
                      {key}
                    </label>
                    <input
                      value={value ?? ""}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-1 rounded bg-gray-700 border border-gray-600 text-sm"
                    />
                  </div>
                )
            )}

            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setEditingMember(null)}
                className="px-3 py-1 rounded bg-gray-600 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-3 py-1 rounded bg-yellow-400 hover:bg-yellow-500 text-black"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewMembers;
