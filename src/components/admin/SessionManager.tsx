import React, { useEffect, useState } from "react";
import { createSession, getSessionsByDate } from "@/lib/api/calls/session";
import { Session } from "@/lib/types/session";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const today = new Date().toISOString().slice(0, 10);

export default function SessionManager() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    start_date: today,
    end_date: today,
    status: "closed",
    is_active: false,
    semesters: [
      { name: "First Semester", start_date: today, end_date: today },
      { name: "Second Semester", start_date: today, end_date: today },
    ],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchSessions();
  }, []);

  async function fetchSessions() {
    setLoading(true);
    const from = "2020-01-01";
    const to = "2030-01-01";
    const { data, error } = await getSessionsByDate(from, to);
    if (data) setSessions(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const { data, status, error } = await createSession(form);
    if (status && data) {
      setSuccess("Session created successfully");
      setForm({
        name: "",
        start_date: today,
        end_date: today,
        status: "closed",
        is_active: false,
        semesters: [
          { name: "First Semester", start_date: today, end_date: today },
          { name: "Second Semester", start_date: today, end_date: today },
        ],
      });
      fetchSessions();
    } else if (error) {
      setError(error.message);
    }
    setLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value,
    }));
  }

  function handleSemesterChange(idx: number, e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => {
      const semesters = [...prev.semesters];
      semesters[idx] = { ...semesters[idx], [name]: value };
      return { ...prev, semesters };
    });
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Session Management</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="flex gap-4">
            <div>
              <Label>Start Date</Label>
              <Input type="date" name="start_date" value={form.start_date} onChange={handleChange} required />
            </div>
            <div>
              <Label>End Date</Label>
              <Input type="date" name="end_date" value={form.end_date} onChange={handleChange} required />
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className={"flex max-h-9 items-center gap-2"}>
              <h1>status</h1>
              <select name="status" value={form.status} onChange={handleChange} className="border rounded px-2 py-1">
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <h1>active</h1>
              <Input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
            </div>
          </div>
          <Separator />
          <div>
            <Label>Semesters</Label>
            {form.semesters.map((sem, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <Input
                  name="name"
                  value={sem.name}
                  onChange={(e) => handleSemesterChange(idx, e)}
                  placeholder="Semester Name"
                  className="w-40"
                  required
                />
                <Input
                  type="date"
                  name="start_date"
                  value={sem.start_date}
                  onChange={(e) => handleSemesterChange(idx, e)}
                  required
                />
                <Input
                  type="date"
                  name="end_date"
                  value={sem.end_date}
                  onChange={(e) => handleSemesterChange(idx, e)}
                  required
                />
              </div>
            ))}
          </div>
          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-600">{success}</div>}
          <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Create Session"}</Button>
        </form>
        <Separator className="my-6" />
        <h3 className="font-semibold mb-2">Existing Sessions</h3>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Name</th>
                  <th className="border px-2 py-1">Start</th>
                  <th className="border px-2 py-1">End</th>
                  <th className="border px-2 py-1">Status</th>
                  <th className="border px-2 py-1">Active</th>
                  <th className="border px-2 py-1">Semesters</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id}>
                    <td className="border px-2 py-1">{s.name}</td>
                    <td className="border px-2 py-1">{s.start_date}</td>
                    <td className="border px-2 py-1">{s.end_date}</td>
                    <td className="border px-2 py-1">{s.status}</td>
                    <td className="border px-2 py-1">{s.is_active ? "Yes" : "No"}</td>
                    <td className="border px-2 py-1">
                      {s.semesters.map((sem) => (
                        <div key={sem.id || sem.name}>
                          {sem.name}: {sem.start_date} - {sem.end_date}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
