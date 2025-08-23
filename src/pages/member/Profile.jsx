import React, { useEffect, useState } from "react";
import supabase from "../../lib/supabaseClient";
import { Card } from "../../components/ui/card";

export default function Profile() {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const { data, error } = await supabase
          .from("members")
          .select(
            `member_id, first_name, last_name, phone, email, job, relative_contact, 
             prior_conditions, birthday, address, coaching_required, target, 
             membership_start, membership_end, status, created_at`
          )
          .eq("user_id", userId)
          .single();

        if (error) throw error;
        setMember(data);
      } catch (err) {
        console.error("Error fetching member:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, []);

  if (loading) {
    return <p className="text-yellow-400 text-center mt-6">Loading profile...</p>;
  }

  if (!member) {
    return <p className="text-red-500 text-center mt-6">Profile not found.</p>;
  }

  return (
    <div className="p-6 bg-black min-h-screen text-yellow-400 space-y-6">

      <h1 className="text-2xl font-bold text-yellow-500 mb-6">My Profile</h1>

      {/* Personal Info */}
      <Card className="bg-yellow-500 text-black p-6">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p><strong>Member ID:</strong> {member.member_id}</p>
          <p><strong>Name:</strong> {member.first_name} {member.last_name}</p>
          <p><strong>Email:</strong> {member.email}</p>
          <p><strong>Phone:</strong> {member.phone}</p>
          <p><strong>Job:</strong> {member.job || "N/A"}</p>
          <p><strong>Relative Contact:</strong> {member.relative_contact || "N/A"}</p>
          <p><strong>Birthday:</strong> {member.birthday ? new Date(member.birthday).toLocaleDateString() : "N/A"}</p>
          <p><strong>Address:</strong> {member.address || "N/A"}</p>
        </div>
      </Card>

      {/* Membership Info */}
      <Card className="bg-yellow-500 text-black p-6">
        <h2 className="text-xl font-semibold mb-4">Membership</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p><strong>Start Date:</strong> {new Date(member.membership_start).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> {new Date(member.membership_end).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {member.status}</p>
          <p><strong>Registered On:</strong> {new Date(member.created_at).toLocaleDateString()}</p>
        </div>
      </Card>

      {/* Health & Fitness Info */}
      <Card className="bg-yellow-500 text-black p-6">
        <h2 className="text-xl font-semibold mb-4">Health & Fitness</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p><strong>Prior Conditions:</strong> {member.prior_conditions || "None"}</p>
          <p><strong>Coaching Required:</strong> {member.coaching_required ? "Yes" : "No"}</p>
          <p><strong>Target:</strong> {member.target || "N/A"}</p>
        </div>
      </Card>

    </div>
  );
}
