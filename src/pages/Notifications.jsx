import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import toast from "react-hot-toast";

export default function Notifications() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all notifications
  const fetchNotifications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) toast.error("Failed to fetch notifications");
    else setNotifications(data);

    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Create notification
  const handlePost = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Title and message are required");
      return;
    }

    const { error } = await supabase.from("notifications").insert([
      {
        title,
        message,
      },
    ]);

    if (error) {
      toast.error("Failed to post notification");
    } else {
      toast.success("Notification posted");
      setTitle("");
      setMessage("");
      fetchNotifications();
    }
  };

  // Delete notification
  const handleDelete = async (id) => {
    const { error } = await supabase.from("notifications").delete().eq("id", id);
    if (error) toast.error("Delete failed");
    else {
      toast.success("Notification deleted");
      fetchNotifications();
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-6 text-yellow-400">Post Notification</h2>

      {/* Notification Form */}
      <div className="space-y-4 bg-gray-900 p-4 rounded-lg border border-gray-700 mb-8">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2"
        />
        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
          className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2"
        />
        <button
          onClick={handlePost}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded"
        >
          Post Notification
        </button>
      </div>

      {/* Notification List */}
      <h3 className="text-lg font-semibold text-white mb-3">All Notifications</h3>
      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-400">No notifications posted yet.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="bg-gray-800 border border-gray-700 rounded p-4 relative"
            >
              <div className="text-yellow-400 font-bold text-lg">{n.title}</div>
              <div className="text-sm text-gray-300 mt-1 mb-2">{n.message}</div>
              <div className="text-xs text-gray-500">
                Posted on {new Date(n.created_at).toLocaleString()}
              </div>
              <button
                onClick={() => handleDelete(n.id)}
                className="absolute top-2 right-2 text-red-400 hover:text-red-300 text-sm"
                title="Delete"
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
