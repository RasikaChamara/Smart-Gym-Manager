import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../lib/supabaseClient';
import logo from '../assets/logo.png';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    memberId: '',
    firstName: '',
    lastName: '',
    birthday: '',
    job: '',
    relativePhone: '',
    priorConditions: '',
    address: '',
    coachingRequired: 'No',
    target: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    // 1. Sign up user with email + password
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const user = data.user;
    if (!user) {
      setError('Unexpected error: No user created');
      setLoading(false);
      return;
    }

    // 2. Insert profile into members table with status 'pending'
    const { error: insertError } = await supabase.from('members').insert([
      {
        user_id: user.id,
        member_id: parseInt(form.memberId),
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        job: form.job,
        relative_contact: form.relativePhone,
        prior_conditions: form.priorConditions,
        birthday: form.birthday,
        address: form.address,
        coaching_required: form.coachingRequired,
        target: form.target,
        status: 'pending',
      },
    ]);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">
        <img src={logo} alt="Eagles Fitness Logo" className="h-24 w-24 mb-4 drop-shadow-lg" />
        <h2 className="text-3xl font-extrabold mb-4 text-center">
          Registration Successful!
        </h2>
        <p className="mb-6 text-center max-w-md">
          Your account is created and is pending approval by an admin. You will be notified once approved.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-yellow-400 text-black px-6 py-2 rounded font-semibold hover:bg-yellow-500 transition"
        >
          Back to Login
        </button>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Eagles Fitness Logo" className="h-24 w-24 object-contain mb-4 drop-shadow-lg" />
          <h1 className="text-3xl font-extrabold tracking-wider uppercase text-center">
            Eagles Fitness <span className="text-yellow-400">Centre</span>
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 bg-opacity-70 rounded-xl shadow-xl p-8 space-y-6"
        >
          {/* Email */}
          <div>
            <label className="block mb-1 text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-md px-3 py-2 bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm">Password (NIC or custom)</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-md px-3 py-2 bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 text-sm">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full rounded-md px-3 py-2 bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:outline-none"
            />
          </div>

          {/* Member ID */}
          <div>
            <label className="block mb-1 text-sm">Member ID (numeric)</label>
            <input
              type="number"
              name="memberId"
              value={form.memberId}
              onChange={handleChange}
              required
              min={1}
              className="w-full rounded-md px-3 py-2 bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:outline-none"
            />
          </div>

          {/* First Name */}
          <div>
            <label className="block mb-1 text-sm">First Name</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              className="w-full rounded-md px-3 py-2 bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:outline-none"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block mb-1 text-sm">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              className="w-full rounded-md px-3 py-2 bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:outline-none"
            />
          </div>

          {/* Birthday */}
          <div>
            <label className="block mb-1 text-sm">Birthday</label>
            <input
              type="date"
              name="birthday"
              value={form.birthday}
              onChange={handleChange}
              required
              className="w-full rounded-md px-3 py-2 bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:outline-none"
            />
          </div>

          {/* Job */}
          <div>
            <label className="block mb-1 text-sm">Job</label>
            <input
              type="text"
              name="job"
              value={form.job}
              onChange={handleChange}
              className="w-full rounded-md px-3 py-2 bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:outline-none"
            />
          </div>

          {/* Relative Phone */}
          <div>
            <label className="block mb-1 text-sm">Close Relative Phone</label>
            <input
              type="tel"
              name="relativePhone"
              value={form.relativePhone}
              onChange={handleChange}
              className="w-full rounded-md px-3 py-2 bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:outline-none"
            />
          </div>

          {/* Prior Diseases / Injuries */}
          <div>
            <label className="block mb-1 text-sm">Prior Diseases or Injuries</label>
            <textarea
              name="priorConditions"
              value={form.priorConditions}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-md px-3 py-2 bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:outline-none resize-none"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block mb-1 text-sm">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-md px-3 py-2 bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:outline-none resize-none"
            />
          </div>

          {/* Coaching Required */}
          <div>
            <label className="block mb-1 text-sm">Need Coaching?</label>
            <select
              name="coachingRequired"
              value={form.coachingRequired}
              onChange={handleChange}
              className="w-full rounded-md px-3 py-2 bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:outline-none"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          {/* Target */}
          <div>
            <label className="block mb-1 text-sm">Target (e.g. Muscle Building, Weight Gain)</label>
            <input
              type="text"
              name="target"
              value={form.target}
              onChange={handleChange}
              className="w-full rounded-md px-3 py-2 bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:outline-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md font-semibold bg-yellow-400 text-black hover:bg-yellow-500 transition disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full mt-2 py-2 rounded-md font-semibold bg-gray-700 text-yellow-400 hover:bg-gray-600 transition"
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}
