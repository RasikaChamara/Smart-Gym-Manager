import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import StatCard from "../components/StatCard";
import QuickActions from "../components/QuickActions";

const icons = {
  members: "🏋️",
  payments: "💳",
  balance: "💰",
  checkins: "📅",
  expiries: "⏳",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null); // null = loading
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = today.getMonth() + 1; // 1‑12
      const isoToday = today.toISOString().slice(0, 10); // YYYY‑MM‑DD

      /* ---------- 1. Active members & expiring soon ---------- */
      const { data: members } = await supabase
        .from("members")
        .select("membership_end");

      const activeMembers = members.filter(
        (m) => !m.membership_end || new Date(m.membership_end) >= today
      ).length;

      const sevenDays = new Date(today);
      sevenDays.setDate(today.getDate() + 7);

      const expiringSoon = members.filter((m) => {
        if (!m.membership_end) return false;
        const d = new Date(m.membership_end);
        return d >= today && d <= sevenDays;
      }).length;

      /* ---------- 2. Today’s check‑ins ---------- */
      const { data: checkins } = await supabase
        .from("attendance")
        .select("id")
        .eq("date", isoToday);

      /* ---------- 3. Payments (current month) ---------- */
      const firstDayThisMonth = `${yyyy}-${String(mm).padStart(2, "0")}-01`;
      const firstDayNextMonth = new Date(yyyy, mm, 1) // JS month+1
        .toISOString()
        .slice(0, 10);

      const { data: payments } = await supabase
        .from("payments")
        .select("amount")
        .eq("status", "PAID")
        .gte("paid_at", firstDayThisMonth)
        .lt("paid_at", firstDayNextMonth);

      const monthlyIncome = payments.reduce(
        (sum, p) => sum + Number(p.amount || 0),
        0
      );

      /* ---------- 3b. Running balance (YTD) ---------- */
      const startOfYear = `${yyyy}-01-01`;

      const { data: yearPayments } = await supabase
        .from("payments")
        .select("amount")
        .eq("status", "PAID")
        .gte("paid_at", startOfYear);

      const runningBalance = yearPayments.reduce(
        (sum, p) => sum + Number(p.amount || 0),
        0
      );

      /* ---------- 4. Recent activity (last 5 check‑ins) ---------- */
      const { data: recentChecks } = await supabase
        .from("attendance")
        .select(
          `
          id,
          date,
          members ( first_name, last_name )
        `
        )
        .order("date", { ascending: false })
        .limit(5);

      const recentList = recentChecks.map((c) => {
        const name = c.members?.first_name
          ? `${c.members.first_name} ${c.members.last_name ?? ""}`.trim()
          : "Member";
        const formattedDate = new Date(c.date).toLocaleDateString();
        return { id: c.id, text: `${name} checked in on ${formattedDate}` };
      });

      /* ---------- Save to state ---------- */
      setStats({
        members: activeMembers,
        payments: monthlyIncome.toLocaleString("en-LK", {
          style: "currency",
          currency: "LKR",
          maximumFractionDigits: 0,
        }),
        runningBalance: runningBalance.toLocaleString("en-LK", {
          style: "currency",
          currency: "LKR",
          maximumFractionDigits: 0,
        }),
        checkins: checkins.length,
        expiries: expiringSoon,
      });
      setRecent(recentList);
    };

    fetchStats();
  }, []);

  /* ---------- Loading state ---------- */
  if (!stats) {
    return (
      <div className="text-gray-400 animate-pulse">Loading dashboard…</div>
    );
  }

  /* ---------- Render ---------- */
  return (
    <div className="space-y-8">
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={icons.members}
          label="Active Members"
          value={stats.members}
        />
        <StatCard
          icon={icons.payments}
          label="Payments (Month)"
          value={stats.payments}
        />
        <StatCard
          icon={icons.balance}
          label="Running Balance (YTD)"
          value={stats.runningBalance}
        />
        <StatCard
          icon={icons.checkins}
          label="Today’s Check‑ins"
          value={stats.checkins}
        />
        <StatCard
          icon={icons.expiries}
          label="Expiring Soon"
          value={stats.expiries}
        />
      </div>

      {/* Recent activity with Reset button */}
      <div className="bg-gray-900 rounded-xl p-6 shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Recent Activity</h3>
          <button
            onClick={() => setRecent([])}
            className="text-sm bg-yellow-400 text-black font-medium px-3 py-1 rounded hover:bg-yellow-500"
          >
            Reset
          </button>
        </div>
        <ul className="space-y-2 text-gray-300 text-sm">
          {recent.length === 0 ? (
            <li className="text-gray-500">No recent activity.</li>
          ) : (
            recent.map((item) => (
              <li
                key={item.id}
                className="border-b border-gray-800 pb-2 last:border-0"
              >
                {item.text}
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Navigation shortcuts section */}
      <QuickActions />

    </div>
  );
}
