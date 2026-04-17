import React, { useState } from "react";
import { usePost } from "../../hooks/usePost";
import { API_URL } from "../../hooks/http";
import { Loader2 } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddMember: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    category: "Full Member",
    password: "",
  });

  const memberHandler = usePost({
    url: `${API_URL}/v1/church/add`,
    title: "Member added",
    queryKey: "members",
    onSuccess: () => {
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    memberHandler.mutate({ ...formData, name: formData.fullName });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-[#013A81] px-6 py-4 flex justify-between items-center">
          <h3 className="text-white font-bold text-lg">
            Add New Parish Member
          </h3>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Full Name
              </label>
              <input
                readOnly={memberHandler.isPending}
                type="text"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#008B44] outline-none transition-all text-sm"
                placeholder="Ayo"
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                value={formData.fullName}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              Email Address
            </label>
            <input
              readOnly={memberHandler.isPending}
              type="email"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#008B44] outline-none transition-all text-sm"
              placeholder="member@example.com"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              Phone Number
            </label>
            <input
              readOnly={memberHandler.isPending}
              type="tel"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#008B44] outline-none transition-all text-sm"
              placeholder="+234..."
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#013A81] uppercase tracking-wider ml-1">
              Password
            </label>
            <input
              readOnly={memberHandler.isPending}
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              className="w-full px-4 py-3.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#008B44] focus:border-transparent outline-none transition-all placeholder:text-slate-300"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              Membership Category
            </label>
            <select
              disabled={memberHandler.isPending}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#008B44] outline-none transition-all text-sm appearance-none bg-white"
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option>Full Member</option>
              <option>Worker</option>
              <option>Minister</option>
              <option>Visitor</option>
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              disabled={memberHandler.isPending}
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={memberHandler.isPending}
              type="submit"
              className="flex-1 flex items-center justify-center px-4 py-3 rounded-lg bg-[#008B44] text-white font-bold text-sm hover:bg-[#007037] shadow-lg shadow-green-900/20 transition-all"
            >
              Save Member{" "}
              {memberHandler.isPending && <Loader2 className="animate-spin" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMember;
