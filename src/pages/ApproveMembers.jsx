import { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';

export default function ApproveMembers() {
  const [pendingMembers, setPendingMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvingId, setApprovingId] = useState(null);

  useEffect(() => {
    fetchPendingMembers();
  }, []);

  async function fetchPendingMembers() {
    setLoading(true);
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) setError(error.message);
    else setPendingMembers(data);
    setLoading(false);
  }

  async function approveMember(member) {
    setApprovingId(member.id);
    setError(null);

    try {
      // 1. Update member status to 'approved'
      let { error: updateError } = await supabase
        .from('members')
        .update({ status: 'approved' })
        .eq('id', member.id);

      if (updateError) throw updateError;

      // 2. Add role to role_claims
      const { error: roleError } = await supabase.from('role_claims').insert([
        {
          user_id: member.user_id,
          role: 'member',
        },
      ]);

      if (roleError) throw roleError;

      // 3. Refresh list
      fetchPendingMembers();
    } catch (err) {
      setError(err.message || 'Failed to approve member');
    }

    setApprovingId(null);
  }

  if (loading) return <p className="text-yellow-400">Loading pending members...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Approve New Members</h2>
      {pendingMembers.length === 0 ? (
        <p>No pending members for approval.</p>
      ) : (
        <table className="w-full text-left border-collapse border border-gray-700">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-2">Member ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Birthday</th>
              <th className="p-2">Target</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingMembers.map((m) => (
              <tr key={m.id} className="border-b border-gray-700 hover:bg-gray-800">
                <td className="p-2">{m.member_id}</td>
                <td className="p-2">{m.first_name} {m.last_name}</td>
                <td className="p-2">{m.email}</td>
                <td className="p-2">{m.birthday}</td>
                <td className="p-2">{m.target}</td>
                <td className="p-2">
                  <button
                    disabled={approvingId === m.id}
                    onClick={() => approveMember(m)}
                    className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 transition disabled:opacity-50"
                  >
                    {approvingId === m.id ? 'Approving...' : 'Approve'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
