import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import toast from "react-hot-toast";
import Select from "react-select";
import { startOfMonth, endOfMonth, format } from "date-fns";

const exportToCSV = (payments) => {
  if (!payments.length) return;

  const headers = [
    "Member ID",
    "Name",
    "Amount",
    "Payment Type",
    "Paid At",
    "Period Start",
    "Period End",
  ];

  const rows = payments.map((p) => [
    p.members.member_id,
    `${p.members.first_name} ${p.members.last_name}`,
    p.amount,
    p.payment_type,
    p.paid_at,
    p.period_start,
    p.period_end,
  ]);

  const csvContent = [headers, ...rows]
    .map((e) => e.map((v) => `"${v}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "payments.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function ViewPayments() {
  const today = new Date();
  const [filterMonth, setFilterMonth] = useState(format(today, "yyyy-MM"));
  const [members, setMembers] = useState([]);
  const [filterMember, setFilterMember] = useState(null);
  const [viewAll, setViewAll] = useState(false);

  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("members")
        .select("id, member_id, first_name, last_name")
        .in("status", ["approved", "Approved (No Credentials)"]);

      if (error) toast.error("Failed to load members");
      else {
        setMembers(
          data.map((m) => ({
            value: m.id,
            label: `[${m.member_id}] ${m.first_name} ${m.last_name}`,
          }))
        );
      }
    })();
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      setSummary(null);

      let query = supabase
        .from("payments")
        .select(
          `
          id,
          amount,
          payment_type,
          paid_at,
          period_start,
          period_end,
          members ( member_id, first_name, last_name )
        `
        )
        .eq("status", "PAID")
        .order("paid_at", { ascending: false });

      if (!viewAll) {
        const [year, month] = filterMonth.split("-");
        const monthStart = startOfMonth(new Date(year, month - 1));
        const monthEnd = endOfMonth(monthStart);

        query = query
          .gte("paid_at", format(monthStart, "yyyy-MM-dd"))
          .lte("paid_at", format(monthEnd, "yyyy-MM-dd"));

        if (filterMember) query = query.eq("member_id", filterMember.value);
      }

      const { data, error } = await query;

      if (error) {
        toast.error("Failed to load payments");
        setRows([]);
        setSummary({
          totalAmount: 0,
          totalCount: 0,
          daily: 0,
          monthly: 0,
          package: 0,
          activeSum: 0,
        });
        return;
      }

      setRows(data);

      const totalAmount = data.reduce((s, p) => s + Number(p.amount || 0), 0);
      const totalCount = data.length;
      const daily = data.filter((p) => p.payment_type === "daily").length;
      const monthly = data.filter((p) => p.payment_type === "monthly").length;
      const pkg = data.filter((p) => p.payment_type === "package").length;
      const activeSum = data
        .filter((p) => new Date(p.period_end) >= today)
        .reduce((s, p) => s + Number(p.amount || 0), 0);

      setSummary({
        totalAmount,
        totalCount,
        daily,
        monthly,
        package: pkg,
        activeSum,
      });
    };

    fetchPayments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterMonth, filterMember, viewAll]);

  const money = (n) =>
    Number(n).toLocaleString("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    });

  return (
    <div className="max-w-5xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-6 text-yellow-400">Payments</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="col-span-2">
          <label className="text-sm block mb-1">Member</label>
          <Select
            options={members}
            value={filterMember}
            onChange={setFilterMember}
            isClearable
            placeholder="All members"
            className="text-black"
            isDisabled={viewAll}
          />
        </div>

        <div>
          <label className="text-sm block mb-1">Month</label>
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded px-3 py-2 w-full"
            disabled={viewAll}
          />
        </div>

        <div className="flex flex-col justify-end">
          <label className="text-sm block mb-1 invisible">Toggle</label>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={viewAll}
              onChange={() => setViewAll(!viewAll)}
              id="viewAll"
              className="w-4 h-4"
            />
            <label htmlFor="viewAll" className="text-sm">
              View All
            </label>
          </div>
        </div>
      </div>

      {/* Summary */}
      {summary ? (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          <Card label="Total" value={money(summary.totalAmount)} />
          <Card label="Payments" value={summary.totalCount} />
          <Card label="Daily" value={summary.daily} />
          <Card label="Monthly" value={summary.monthly} />
          <Card label="Active Sum" value={money(summary.activeSum)} />
        </div>
      ) : (
        <div className="h-20 mb-8 animate-pulse bg-gray-800 rounded" />
      )}

      {/* Export CSV Button */}
      {rows.length > 0 && (
        <div className="mb-6 text-right">
          <button
            onClick={() => exportToCSV(rows)}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded"
          >
            ⬇ Export CSV
          </button>
        </div>
      )}

      {/* Payment list */}
      {summary && rows.length === 0 && (
        <p className="text-gray-400">No payments found.</p>
      )}

      <div className="space-y-4">
        {rows.map((p) => (
          <div
            key={p.id}
            className="bg-gray-900 border border-gray-700 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex-1">
              <div className="text-yellow-400 text-sm font-semibold">
                [{p.members.member_id}] {p.members.first_name}{" "}
                {p.members.last_name}
              </div>
              <div className="text-xs text-gray-400">
                {p.payment_type.toUpperCase()} • Paid: {p.paid_at}
              </div>
            </div>

            <div className="flex flex-col sm:items-end mt-3 sm:mt-0">
              <span className="font-bold">{money(p.amount)}</span>
              <span className="text-xs text-gray-400">
                {p.period_start} → {p.period_end}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const Card = ({ label, value }) => (
  <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-center">
    <div className="text-yellow-400 font-semibold">{value}</div>
    <div className="text-xs text-gray-400 mt-1">{label}</div>
  </div>
);
