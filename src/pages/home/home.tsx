import React, { useState } from "react";
import AddMember from "./create-member";
import { useAuth } from "../../context/auth";
import useGet from "../../hooks/useGet";
import { API_URL } from "../../hooks/http";
import { useNavigate } from "react-router-dom";

interface Member {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive";
  address?: string;
  gender?: string;
}

const Dashboard: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { data, isPending, isError, refetch } = useGet({
    url: `${API_URL}/v1/church/members`,
    queryKey: "members",
  });

  const members: Member[] = data?.data || [];

  return (
    <>
      {visible && (
        <AddMember isOpen={visible} onClose={() => setVisible(false)} />
      )}

      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#013A81]">
                Member Details
              </h3>
              <button
                onClick={() => setSelectedMember(null)}
                className="text-slate-400 hover:text-red-500 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Name:</span>{" "}
                <span className="font-bold capitalize">
                  {selectedMember.fullName}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Email:</span>{" "}
                <span>{selectedMember.email}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Phone:</span>{" "}
                <span>{selectedMember.phone}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Category:</span>{" "}
                <span>{selectedMember.category}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Status:</span>
                <span
                  className={`font-bold uppercase ${selectedMember.status?.toLowerCase() === "active" ? "text-[#008B44]" : "text-slate-500"}`}
                >
                  {selectedMember.status}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedMember(null)}
              className="w-full mt-6 bg-[#013A81] text-white py-2 rounded-lg font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-slate-50 font-sans">
        <nav className="bg-[#013A81] text-white px-8 py-4 flex justify-between items-center shadow-md">
          <div>
            <h1 className="text-xl font-black tracking-tighter">
              Multipli<span className="text-[#008B44]">Church</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest opacity-80 font-bold">
              {user?.church?.name}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold capitalize leading-none">
                {user?.user?.fullName || "User Account"}
              </p>
              <span className="text-[10px] bg-[#008B44] px-2 py-0.5 rounded-full uppercase font-bold">
                {user?.user?.role}
              </span>
            </div>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors border border-white/20"
              title="Logout"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl capitalize font-bold text-slate-800">
                {user?.user?.role} Directory
              </h2>
              <p className="text-slate-500 text-sm">
                Manage and view all registered members for this parish.
              </p>
            </div>

            {user?.user?.role?.toLowerCase() === "admin" && (
              <button
                onClick={() => setVisible(true)}
                className="flex items-center justify-center gap-2 bg-[#008B44] hover:bg-[#007037] text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add New Member
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              {isPending ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 border-4 border-[#013A81]/20 border-t-[#013A81] rounded-full animate-spin"></div>
                  <p className="text-slate-500 font-medium">
                    Fetching member records...
                  </p>
                </div>
              ) : isError ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4 px-4 text-center">
                  <div className="bg-red-50 p-4 rounded-full text-red-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Connection Error
                  </h3>
                  <p className="text-slate-500 max-w-xs">
                    We couldn't load the members. Please check your internet or
                    permissions.
                  </p>
                  <button
                    onClick={() => refetch()}
                    className="text-[#013A81] font-bold underline"
                  >
                    Try Again
                  </button>
                </div>
              ) : members.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="bg-slate-50 p-6 rounded-full text-slate-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">
                    No Members Found
                  </h3>
                  <p className="text-slate-500">
                    Start building your community by adding your first member.
                  </p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-bottom border-slate-200">
                      <th className="px-6 py-4 text-[11px] font-bold text-[#013A81] uppercase tracking-wider">
                        Member Name
                      </th>
                      <th className="px-6 py-4 text-[11px] font-bold text-[#013A81] uppercase tracking-wider">
                        Contact Info
                      </th>
                      <th className="px-6 py-4 text-[11px] font-bold text-[#013A81] uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-[11px] font-bold text-[#013A81] uppercase tracking-wider text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {members.map((member) => (
                      <tr
                        key={member.id}
                        className="hover:bg-slate-50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <p className="font-bold capitalize text-slate-800">
                            {member.fullName}
                          </p>
                          <p className="text-xs text-slate-400">
                            ID: {member.id.slice(0, 8)}...
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <p className="text-slate-600 font-medium">
                            {member.email}
                          </p>
                          <p className="text-slate-400">{member.phone}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex uppercase items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              member.status?.toLowerCase() === "active"
                                ? "bg-green-100 text-[#008B44]"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {member.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedMember(member)}
                            className="text-[#013A81] font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity underline decoration-2 underline-offset-4"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <p className="text-xs font-medium text-slate-500">
                {members.length > 0
                  ? `Showing ${members.length} members in ${user?.church?.name}`
                  : "No records to display"}
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
