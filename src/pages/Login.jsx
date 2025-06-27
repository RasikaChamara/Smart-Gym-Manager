import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../lib/supabaseClient";
import logo from "../assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setErrorMsg(error.message);
    } else {
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-sm px-6">
        {/* Logo + Gym name */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={logo}
            alt="Eagles Fitness Logo"
            className="h-24 w-24 object-contain mb-4 drop-shadow-lg"
          />
          <h1 className="text-3xl font-extrabold tracking-wider uppercase text-center">
            Eagles Fitness <span className="text-yellow-400">Centre</span>
          </h1>
        </div>

        {/* Login form card */}
        <form
          onSubmit={handleLogin}
          className="bg-gray-900 bg-opacity-70 rounded-xl shadow-xl p-8 space-y-6"
        >
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-md px-3 py-2 bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-md px-3 py-2 bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

          <button
            type="submit"
            className="w-full py-2 rounded-md font-semibold bg-yellow-400 text-black hover:bg-yellow-500 transition"
          >
            Log In
          </button>
        </form>
        {/* Register Link */}
        <p
          className="mt-4 text-center text-yellow-400 hover:underline cursor-pointer"
          onClick={() => navigate("/register")}
        >
          Don't have an account? Register here
        </p>
      </div>
    </div>
  );
};

export default Login;
