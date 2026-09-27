"use client";

import { useState } from "react";
import { users as initialUsers } from "@/lib/mock-data";
import Badge from "@/components/ui/Badge";
import type { User } from "@/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);

  function setStatus(id: string, status: User["status"]) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Users ({users.length})
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted">
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3 font-medium">Created</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="px-6 py-3 font-medium text-foreground">{u.name}</td>
                <td className="px-6 py-3 text-muted">{u.email}</td>
                <td className="px-6 py-3 capitalize text-muted">{u.role}</td>
                <td className="px-6 py-3 text-muted">{u.createdAt}</td>
                <td className="px-6 py-3">
                  <Badge status={u.status} />
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-2">
                    {u.status !== "approved" && (
                      <button
                        type="button"
                        onClick={() => setStatus(u.id, "approved")}
                        className="rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-teal-100"
                      >
                        Approve
                      </button>
                    )}
                    {u.status !== "disabled" && (
                      <button
                        type="button"
                        onClick={() => setStatus(u.id, "disabled")}
                        className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100"
                      >
                        Disable
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
