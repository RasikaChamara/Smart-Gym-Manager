import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import toast from "react-hot-toast";
import Select from "react-select";
import { addMonths, startOfMonth, endOfMonth } from "date-fns";

export default function AddPayment() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [amount, setAmount] = useState("");
  const [paidAt, setPaidAt] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [paymentType, setPaymentType] = useState("monthly"); // daily | monthly | package
  const [durationMonths, setDurationMonths] = useState(1); // 1, 3, 6…
  const [method, setMethod] = useState("Cash");
  const [loading, setLoading] = useState(false);

  /* fetch members once */
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

  /* compute period_end */
  const calcPeriodRange = () => {
    const paidDate = new Date(paidAt);

    if (paymentType === "daily") {
      const d = paidDate.toISOString().slice(0, 10);
      return { period_start: d, period_end: d };
    }

    const start = startOfMonth(paidDate);
    const months = paymentType === "monthly" ? 1 : durationMonths;
    const end = endOfMonth(addMonths(start, months - 1)); // ends at end of Nth month

    return {
      period_start: start.toISOString().slice(0, 10),
      period_end: end.toISOString().slice(0, 10),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMember) return toast.error("Choose member");
    if (!amount) return toast.error("Enter amount");

    setLoading(true);

    const { period_start, period_end } = calcPeriodRange();

    const { error } = await supabase.from("payments").insert([
      {
        member_id: selectedMember.value,
        amount: parseFloat(amount),
        paid_at: paidAt,
        period_start,
        period_end,
        duration_months:
          paymentType === "daily"
            ? 0
            : paymentType === "monthly"
            ? 1
            : durationMonths,
        payment_type: paymentType,
        method,
        status: "PAID",
      },
    ]);

    if (error) toast.error("Failed to record payment");
    else {
      toast.success("Payment recorded");
      // reset
      setSelectedMember(null);
      setAmount("");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto text-white">
      <h2 className="text-2xl font-bold mb-6 text-yellow-400">Add Payment</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm block mb-1">Paid Date</label>
            <input
              type="date"
              value={paidAt}
              onChange={(e) => setPaidAt(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="text-sm block mb-1">Amount (LKR)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded px-3 py-2 w-full"
            />
          </div>
        </div>

        <div>
          <label className="text-sm block mb-1">Payment Type</label>
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded px-3 py-2 w-full"
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="package">Package (multi‑month)</option>
          </select>
        </div>

        {paymentType === "package" && (
          <div>
            <label className="text-sm block mb-1">Duration (months)</label>
            <input
              type="number"
              min={2}
              value={durationMonths}
              onChange={(e) => setDurationMonths(parseInt(e.target.value))}
              className="bg-gray-800 border border-gray-600 rounded px-3 py-2 w-full"
            />
          </div>
        )}

        <div>
          <label className="text-sm block mb-1">Method</label>
          <input
            type="text"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded px-3 py-2 w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded w-full"
        >
          {loading ? "Saving…" : "Save Payment"}
        </button>
      </form>
    </div>
  );
}
