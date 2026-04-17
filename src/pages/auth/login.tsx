import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePost } from "../../hooks/usePost";
import { API_URL } from "../../hooks/http";
import { useAuth } from "../../context/auth";
import { Loader2 } from "lucide-react";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const loginHandler = usePost({
    url: `${API_URL}/v1/auth/login`,
    title: "Login successful",
    queryKey: "",
    onSuccess: (data) => {
      login(data?.data?.user, data?.token);
      navigate("/");
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = { email, password };
    loginHandler.mutate(payload);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden border-t-[6px] border-[#013A81]">
        <div className="p-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-[#013A81] tracking-tighter">
              Multipli<span className="text-[#008B44]">Church</span>
            </h1>
            <p className="text-slate-500 mt-3 text-sm font-medium">
              Multi-Tenant Member Management System
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#013A81] uppercase tracking-wider ml-1">
                Email Address
              </label>
              <input
                disabled={loginHandler.isPending}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#008B44] focus:border-transparent outline-none transition-all placeholder:text-slate-300"
                placeholder="pastor@church.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#013A81] uppercase tracking-wider ml-1">
                Password
              </label>
              <input
                disabled={loginHandler.isPending}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#008B44] focus:border-transparent outline-none transition-all placeholder:text-slate-300"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  disabled={loginHandler.isPending}
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-[#008B44] border-gray-300 rounded focus:ring-[#008B44]"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-slate-600"
                >
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="text-sm font-semibold text-[#013A81] hover:text-[#008B44] transition-colors"
              >
                Forgot?
              </button>
            </div>

            <button
              disabled={loginHandler.isPending}
              type="submit"
              className="w-full flex items-center justify-center bg-[#013A81] hover:bg-[#012d64] text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transform transition-all active:scale-[0.98]"
            >
              Sign In to Dashboard{" "}
              {loginHandler.isPending && <Loader2 className="animate-spin" />}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Not registered?{" "}
              <Link
                to="/register"
                className="text-[#008B44] font-bold hover:text-[#013A81] underline decoration-2 underline-offset-4 transition-all"
              >
                Create Church Tenant
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
