import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePost } from "../../hooks/usePost";
import { API_URL } from "../../hooks/http";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../context/auth";

const Signup: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    churchName: "",
    adminName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const signupHandler = usePost({
    url: `${API_URL}/v1/auth/signup`,
    title: "Signup successful",
    queryKey: "",
    onSuccess: (data) => {
      login(data?.data?.user, data?.token);
      navigate("/");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    signupHandler.mutate({
      ...formData,
      passwordConfirm: formData.confirmPassword,
      fullName: formData.adminName,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 py-12 font-sans">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-2xl overflow-hidden border-t-[6px] border-[#013A81]">
        <div className="p-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-[#013A81] tracking-tighter">
              Multipli<span className="text-[#008B44]">Church</span>
            </h1>
            <p className="text-slate-500 mt-3 text-sm font-medium">
              Create a new church tenant and administrator account
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="md:col-span-2 space-y-2">
              <label className="text-[11px] font-bold text-[#013A81] uppercase tracking-wider ml-1">
                Church Name (Tenant)
              </label>
              <input
                disabled={signupHandler.isPending}
                type="text"
                name="churchName"
                value={formData.churchName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#008B44] focus:border-transparent outline-none transition-all"
                placeholder="RCCG Victory Chapel"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#013A81] uppercase tracking-wider ml-1">
                Admin Full Name
              </label>
              <input
                disabled={signupHandler.isPending}
                type="text"
                name="adminName"
                value={formData.adminName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#008B44] focus:border-transparent outline-none transition-all"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#013A81] uppercase tracking-wider ml-1">
                Admin Email
              </label>
              <input
                disabled={signupHandler.isPending}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#008B44] focus:border-transparent outline-none transition-all"
                placeholder="admin@church.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#013A81] uppercase tracking-wider ml-1">
                Password
              </label>
              <input
                disabled={signupHandler.isPending}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#008B44] focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#013A81] uppercase tracking-wider ml-1">
                Confirm Password
              </label>
              <input
                disabled={signupHandler.isPending}
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#008B44] focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <div className="md:col-span-2 pt-4">
              <button
                disabled={signupHandler.isPending}
                type="submit"
                className="w-full bg-[#008B44] flex items-center gap-4 justify-center hover:bg-[#007037] text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transform transition-all active:scale-[0.98]"
              >
                Register Church & Admin{" "}
                {signupHandler.isPending && (
                  <Loader2 className="animate-spin" />
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Already have a tenant account?{" "}
              <Link
                to="/login"
                className="text-[#013A81] font-bold hover:text-[#008B44] underline decoration-2 underline-offset-4 transition-all"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
