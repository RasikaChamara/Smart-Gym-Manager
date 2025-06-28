import { useState } from "react";
import supabase from "../lib/supabaseClient";
import toast from "react-hot-toast";

const AddMemberNoEmail = () => {
  const [formData, setFormData] = useState({
    member_id: "",
    first_name: "",
    last_name: "",
    phone: "",
    job: "",
    birthday: "",
    address: "",
    relative_contact: "",
    prior_conditions: "",
    coaching_required: "No",
    target: "",
    membership_start: "",
    status: "Approved (No Credentials)",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("members").insert([formData]);

    if (error) {
      setError(error.message);
      toast.error("Failed to add member");
    } else {
      toast.success("Member added successfully!");
      setError("");
      setFormData({
        member_id: "",
        first_name: "",
        last_name: "",
        phone: "",
        job: "",
        birthday: "",
        address: "",
        relative_contact: "",
        prior_conditions: "",
        coaching_required: "No",
        target: "",
        membership_start: "",
        status: "Approved (No Credentials)",
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-gray-900 p-6 rounded-lg text-white shadow-md">
      <h2 className="text-xl font-bold mb-4 text-yellow-400">
        Add Member (No Email)
      </h2>

      {error && <p className="text-red-400 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
            type="number"
            name="member_id"
            placeholder="Member ID"
            value={formData.member_id}
            onChange={handleChange}
            required
            className="p-2 bg-gray-800 border border-gray-700 rounded"
          />
        <div className="grid grid-cols-2 gap-4">
          
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            required
            className="p-2 bg-gray-800 border border-gray-700 rounded"
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            required
            className="p-2 bg-gray-800 border border-gray-700 rounded"
          />
        </div>

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
        />

        <input
          type="text"
          name="job"
          placeholder="Job"
          value={formData.job}
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
        />

        <p>Birth Day</p>
        <input
          type="date"
          name="birthday"
          value={formData.birthday}
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
        />

        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
        />

        <input
          type="text"
          name="relative_contact"
          placeholder="Close Relative Phone No"
          value={formData.relative_contact}
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
        />

        <input
          type="text"
          name="prior_conditions"
          placeholder="Prior Diseases or Injuries (if any)"
          value={formData.prior_conditions}
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
        />

        <select
          name="need_coaching"
          value={formData.need_coaching}
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
        >
          <option value="No">Need Coaching? No</option>
          <option value="Yes">Need Coaching? Yes</option>
        </select>

        <input
          type="text"
          name="target"
          placeholder="Target (e.g., Muscle Building, Endurance)"
          value={formData.target}
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
        />


        <p>Membership Started date</p>
        <input
          type="date"
          name="membership_start"
          value={formData.membership_start}
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
        />

        <button
          type="submit"
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded"
        >
          Add Member
        </button>
      </form>
    </div>
  );
};

export default AddMemberNoEmail;
