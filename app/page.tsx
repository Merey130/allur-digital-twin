"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Line = {
  name: string;
  plan: number;
  actual: number;
  load: number;
  defectRate: number;
  status: string;
  equipment: string;
  problem: string;
  recommendation: string;
};

type Incident = {
  id: number;
  area: string;
  equipment: string;
  title: string;
  details: string;
  severity: "Critical" | "Warning";
  status: "Active" | "Resolved";
};

const initialLines: Line[] = [
  {
    name: "Welding",
    plan: 120,
    actual: 111,
    load: 91,
    defectRate: 2.7,
    status: "Attention",
    equipment: "ABB-04",
    problem: "Scheduled maintenance — 30 min",
    recommendation:
      "Check maintenance progress and monitor welding output.",
  },
  {
    name: "Painting",
    plan: 120,
    actual: 116,
    load: 96,
    defectRate: 5.2,
    status: "Critical",
    equipment: "Camera-02",
    problem: "High defect rate and 40 min equipment downtime",
    recommendation:
      "Inspect painting quality parameters and Camera-02 maintenance status.",
  },
  {
    name: "Assembly",
    plan: 120,
    actual: 119,
    load: 99,
    defectRate: 1.7,
    status: "Attention",
    equipment: "Conveyor-03",
    problem: "Chain break — 55 min downtime",
    recommendation:
      "Inspect conveyor chain condition and prepare preventive maintenance.",
  },
];

const initialIncidents: Incident[] = [
  {
    id: 1,
    area: "Painting",
    equipment: "Camera-02",
    title: "High defect rate",
    details: "Defect rate reached 5.2%.",
    severity: "Critical",
    status: "Active",
  },
  {
    id: 2,
    area: "Assembly",
    equipment: "Conveyor-03",
    title: "Chain break",
    details: "Production downtime: 55 minutes.",
    severity: "Warning",
    status: "Active",
  },
  {
    id: 3,
    area: "Welding",
    equipment: "ABB-04",
    title: "Scheduled maintenance",
    details: "Maintenance duration: 30 minutes.",
    severity: "Warning",
    status: "Active",
  },
];

export default function Home() {
  const [lines, setLines] = useState(initialLines);
  const [selectedLine, setSelectedLine] = useState<Line | null>(null);
  const [incidents, setIncidents] = useState(initialIncidents);

  const [isLive, setIsLive] = useState(false);
  const [paintingDowntime, setPaintingDowntime] = useState(40);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setLines((current) =>
        current.map((line) => {
          const actualChange = Math.floor(Math.random() * 3) - 1;
          const loadChange = Math.floor(Math.random() * 3) - 1;
          const defectChange = Math.random() * 0.4 - 0.2;

          return {
            ...line,
            actual: Math.max(
              0,
              Math.min(line.plan, line.actual + actualChange)
            ),
            load: Math.max(0, Math.min(100, line.load + loadChange)),
            defectRate: Math.max(
              0,
              Number((line.defectRate + defectChange).toFixed(1))
            ),
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const activeIncidents = incidents.filter(
    (incident) => incident.status === "Active"
  );

  const resolvedIncidents = incidents.filter(
    (incident) => incident.status === "Resolved"
  );

  function resolveIncident(id: number) {
    setIncidents((current) =>
      current.map((incident) =>
        incident.id === id
          ? { ...incident, status: "Resolved" }
          : incident
      )
    );
  }

  function restoreIncidents() {
    setIncidents(initialIncidents);
  }

  const productionData = lines.map((line) => ({
    name: line.name,
    plan: line.plan,
    actual: line.actual,
  }));

  const defectData = lines.map((line) => ({
    name: line.name,
    defect: line.defectRate,
  }));

  const downtimeData = [
    { name: "ABB-01", minutes: 25 },
    { name: "Camera-02", minutes: paintingDowntime },
    { name: "Conveyor-03", minutes: 55 },
    { name: "ABB-04", minutes: 30 },
  ];

  const totalPlan = lines.reduce((sum, line) => sum + line.plan, 0);

  const totalActual = lines.reduce(
    (sum, line) => sum + line.actual,
    0
  );

  const averageDefect = (
    lines.reduce((sum, line) => sum + line.defectRate, 0) /
    lines.length
  ).toFixed(1);

  const whatIfProduction = useMemo(() => {
    const savedMinutes = 40 - paintingDowntime;
    const extraProduction = Math.round(savedMinutes * 0.2);

    return totalActual + extraProduction;
  }, [paintingDowntime, totalActual]);

  const risk =
    paintingDowntime <= 20
      ? "Medium"
      : paintingDowntime <= 30
      ? "High"
      : "Critical";

  function statusStyle(status: string) {
    if (status === "Critical") {
      return "border-red-500 bg-red-500/10 text-red-400";
    }

    if (status === "Attention") {
      return "border-yellow-500 bg-yellow-500/10 text-yellow-400";
    }

    return "border-green-500 bg-green-500/10 text-green-400";
  }

  function incidentStyle(severity: string) {
    if (severity === "Critical") {
      return "border-red-500 bg-red-500/10";
    }

    return "border-yellow-500 bg-yellow-500/10";
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">

        <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10">
          <div>
            <p className="text-sm tracking-[0.25em] text-slate-400">
              ALLUR
            </p>

            <h1 className="text-4xl font-bold mt-1">
              Digital Twin
            </h1>

            <p className="text-slate-400 mt-2">
              Automotive Plant Monitoring System
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setIsLive(!isLive)}
              className={`px-5 py-3 rounded-xl font-semibold transition cursor-pointer ${
                isLive
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isLive
                ? "■ Stop Simulation"
                : "▶ Start Live Simulation"}
            </button>

            <div className="bg-yellow-500/10 border border-yellow-500 rounded-xl px-4 py-2">
              <p className="text-yellow-400 font-semibold">
                ⚠ Plant Status: Attention
              </p>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-10">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">OEE</p>
            <p className="text-3xl font-bold mt-2">87%</p>
            <p className="text-green-400 text-sm mt-2">
              Target ≥ 85%
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">
              Production
            </p>

            <p className="text-3xl font-bold mt-2">
              {totalActual} / {totalPlan}
            </p>

            <p className="text-slate-400 text-sm mt-2">
              Plan vs Actual
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">
              Painting Downtime
            </p>

            <p className="text-3xl font-bold mt-2">
              {paintingDowntime} min
            </p>

            <p className="text-yellow-400 text-sm mt-2">
              Camera-02
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">
              Average Defect
            </p>

            <p className="text-3xl font-bold mt-2">
              {averageDefect}%
            </p>

            <p className="text-red-400 text-sm mt-2">
              Target ≤ 2%
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">
              Active Incidents
            </p>

            <p className="text-3xl font-bold mt-2">
              {activeIncidents.length}
            </p>

            <p className="text-red-400 text-sm mt-2">
              Requires review
            </p>
          </div>
        </section>

        {isLive && (
          <div className="mb-8 bg-green-500/10 border border-green-500 rounded-xl p-4">
            <p className="text-green-400 font-semibold">
              ● LIVE MODE ACTIVE
            </p>

            <p className="text-slate-400 text-sm mt-1">
              Production data updates every 3 seconds.
            </p>
          </div>
        )}

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-5">
            Factory Process
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

            <div className="bg-slate-900 rounded-xl p-5 text-center border border-slate-700">
              <p className="text-3xl mb-3">📦</p>
              <p className="font-semibold">Warehouse</p>
              <p className="text-green-400 text-sm mt-2">
                ● Stable
              </p>
            </div>

            {lines.map((line, index) => {
              const icons = ["🤖", "🎨", "🚗"];

              const border =
                line.status === "Critical"
                  ? "border-red-500 bg-red-500/10"
                  : "border-yellow-500 bg-yellow-500/10";

              const color =
                line.status === "Critical"
                  ? "text-red-400"
                  : "text-yellow-400";

              return (
                <button
                  key={line.name}
                  onClick={() => setSelectedLine(line)}
                  className={`${border} hover:opacity-80 rounded-xl p-5 text-center border transition cursor-pointer`}
                >
                  <p className="text-3xl mb-3">
                    {icons[index]}
                  </p>

                  <p className="font-semibold">
                    {line.name}
                  </p>

                  <p className={`${color} text-sm mt-2`}>
                    ● {line.status}
                  </p>

                  <p className="text-xs text-slate-500 mt-3">
                    Click for details
                  </p>
                </button>
              );
            })}

            <div className="bg-slate-900 rounded-xl p-5 text-center border border-slate-700">
              <p className="text-3xl mb-3">✅</p>
              <p className="font-semibold">
                Quality Control
              </p>
              <p className="text-green-400 text-sm mt-2">
                ● Stable
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-5">
            Production Analytics
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-5">
                Plan vs Actual
              </h3>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productionData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#334155"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#94a3b8"
                    />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Bar
                      dataKey="plan"
                      fill="#64748b"
                    />
                    <Bar
                      dataKey="actual"
                      fill="#38bdf8"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-5">
                Defect Rate
              </h3>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={defectData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#334155"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#94a3b8"
                    />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Bar
                      dataKey="defect"
                      fill="#ef4444"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-5">
                Downtime by Equipment
              </h3>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={downtimeData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#334155"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#94a3b8"
                    />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Bar
                      dataKey="minutes"
                      fill="#f59e0b"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </section>

        <section className="mb-10 grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-red-400 text-sm">
                  INCIDENT MANAGEMENT
                </p>

                <h2 className="text-2xl font-semibold mt-1">
                  Active Incidents
                </h2>
              </div>

              <span className="bg-red-500/10 border border-red-500 text-red-400 rounded-full px-3 py-1">
                {activeIncidents.length} Active
              </span>
            </div>

            <div className="space-y-4 mt-6">
              {activeIncidents.length === 0 && (
                <div className="border border-green-500 bg-green-500/10 rounded-xl p-5">
                  <p className="text-green-400 font-semibold">
                    ✓ No active incidents
                  </p>

                  <p className="text-slate-400 text-sm mt-2">
                    All current incidents have been resolved.
                  </p>
                </div>
              )}

              {activeIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className={`border rounded-xl p-5 ${incidentStyle(
                    incident.severity
                  )}`}
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <p
                        className={`font-semibold ${
                          incident.severity === "Critical"
                            ? "text-red-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {incident.area}
                      </p>

                      <h3 className="text-lg font-semibold mt-1">
                        {incident.title}
                      </h3>

                      <p className="text-slate-400 text-sm mt-2">
                        {incident.equipment}
                      </p>

                      <p className="text-slate-300 mt-2">
                        {incident.details}
                      </p>
                    </div>

                    <span className="text-xs text-slate-500">
                      #{incident.id}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      resolveIncident(incident.id)
                    }
                    className="mt-5 bg-white text-slate-950 px-4 py-2 rounded-lg font-semibold hover:bg-slate-200 cursor-pointer"
                  >
                    ✓ Resolve Incident
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={restoreIncidents}
              className="mt-5 text-sm text-slate-400 hover:text-white cursor-pointer"
            >
              Reset demo incidents
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-green-400 text-sm">
              EVENT HISTORY
            </p>

            <h2 className="text-2xl font-semibold mt-1">
              Resolved Incidents
            </h2>

            <div className="space-y-4 mt-6">
              {resolvedIncidents.length === 0 && (
                <div className="bg-slate-950 rounded-xl p-5">
                  <p className="text-slate-500">
                    No resolved incidents yet.
                  </p>
                </div>
              )}

              {resolvedIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-5"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">
                        {incident.area}
                      </p>

                      <p className="text-slate-400 mt-1">
                        {incident.title}
                      </p>

                      <p className="text-slate-500 text-sm mt-2">
                        {incident.equipment}
                      </p>
                    </div>

                    <span className="text-green-400 text-sm">
                      ✓ Resolved
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

        <section className="mb-10 bg-slate-900 border border-slate-800 rounded-2xl p-7">

          <p className="text-sky-400 text-sm">
            WHAT-IF SIMULATION
          </p>

          <h2 className="text-2xl font-semibold mt-2">
            Reduce Painting Downtime
          </h2>

          <p className="text-slate-400 mt-2">
            Simulate how reducing Camera-02 downtime may affect production.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

            <div>
              <div className="flex justify-between">
                <p className="text-sm text-slate-400">
                  Camera-02 downtime
                </p>

                <p className="font-semibold">
                  {paintingDowntime} min
                </p>
              </div>

              <input
                type="range"
                min="10"
                max="40"
                value={paintingDowntime}
                onChange={(e) =>
                  setPaintingDowntime(
                    Number(e.target.value)
                  )
                }
                className="w-full mt-4"
              />

              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>10 min</span>
                <span>40 min</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">

              <div className="bg-slate-950 rounded-xl p-5">
                <p className="text-slate-500 text-sm">
                  Current Production
                </p>

                <p className="text-3xl font-bold mt-2">
                  {totalActual}
                </p>
              </div>

              <div className="bg-green-500/10 border border-green-500 rounded-xl p-5">
                <p className="text-slate-400 text-sm">
                  Predicted Production
                </p>

                <p className="text-3xl font-bold mt-2 text-green-400">
                  {whatIfProduction}
                </p>
              </div>

              <div className="bg-slate-950 rounded-xl p-5">
                <p className="text-slate-500 text-sm">
                  Current Downtime
                </p>

                <p className="text-3xl font-bold mt-2">
                  40 min
                </p>
              </div>

              <div className="bg-slate-950 rounded-xl p-5">
                <p className="text-slate-500 text-sm">
                  Predicted Risk
                </p>

                <p
                  className={`text-3xl font-bold mt-2 ${
                    risk === "Medium"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {risk}
                </p>
              </div>

            </div>
          </div>

          <div className="mt-6 bg-purple-500/10 border border-purple-500 rounded-xl p-5">

            <p className="text-purple-400 text-sm">
              AI SIMULATION RESULT
            </p>

            <p className="mt-2">
              Reducing Camera-02 downtime from 40 minutes to{" "}
              <strong>
                {paintingDowntime} minutes
              </strong>{" "}
              could increase predicted output from{" "}
              <strong>{totalActual}</strong> to{" "}
              <strong>{whatIfProduction}</strong> units.
            </p>

          </div>
        </section>

        <section className="bg-purple-500/10 border border-purple-500 rounded-2xl p-6">

          <p className="text-purple-400 text-sm">
            AI PREDICTION
          </p>

          <div className="flex flex-col md:flex-row md:justify-between gap-6 mt-2">

            <div>
              <h2 className="text-2xl font-semibold">
                Bottleneck risk detected: Painting
              </h2>

              <p className="text-slate-300 mt-3">
                High defect rate and equipment downtime may create a production bottleneck.
              </p>

              <p className="text-slate-400 text-sm mt-5">
                Recommended action
              </p>

              <p className="mt-1">
                Inspect Camera-02 and painting quality parameters before the next production shift.
              </p>
            </div>

            <div className="bg-red-500/10 border border-red-500 rounded-xl px-6 py-4 h-fit">
              <p className="text-xs text-slate-400">
                RISK SCORE
              </p>

              <p className="text-4xl text-red-400 font-bold mt-1">
                86%
              </p>
            </div>

          </div>
        </section>
      </div>

      {selectedLine && (
        <div
          className="fixed inset-0 bg-black/70 flex justify-end z-50"
          onClick={() => setSelectedLine(null)}
        >
          <div
            className="w-full max-w-md bg-slate-900 min-h-screen p-7 border-l border-slate-700 overflow-y-auto"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="flex justify-between">

              <div>
                <p className="text-slate-500 text-sm">
                  PRODUCTION AREA
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  {selectedLine.name}
                </h2>
              </div>

              <button
                onClick={() =>
                  setSelectedLine(null)
                }
                className="text-3xl text-slate-400 cursor-pointer"
              >
                ×
              </button>

            </div>

            <div
              className={`inline-block border rounded-full px-3 py-1 text-sm mt-5 ${statusStyle(
                selectedLine.status
              )}`}
            >
              ● {selectedLine.status}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">

              <div className="bg-slate-950 rounded-xl p-4">
                <p className="text-slate-500 text-sm">
                  Plan
                </p>

                <p className="text-2xl font-bold mt-1">
                  {selectedLine.plan}
                </p>
              </div>

              <div className="bg-slate-950 rounded-xl p-4">
                <p className="text-slate-500 text-sm">
                  Actual
                </p>

                <p className="text-2xl font-bold mt-1">
                  {selectedLine.actual}
                </p>
              </div>

              <div className="bg-slate-950 rounded-xl p-4">
                <p className="text-slate-500 text-sm">
                  Load
                </p>

                <p className="text-2xl font-bold mt-1">
                  {selectedLine.load}%
                </p>
              </div>

              <div className="bg-slate-950 rounded-xl p-4">
                <p className="text-slate-500 text-sm">
                  Defect Rate
                </p>

                <p className="text-2xl font-bold mt-1">
                  {selectedLine.defectRate}%
                </p>
              </div>

            </div>

            <div className="mt-8">
              <p className="text-slate-500 text-sm">
                Equipment
              </p>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mt-2">

                <p className="font-semibold">
                  {selectedLine.equipment}
                </p>

                <p className="text-slate-400 mt-2 text-sm">
                  {selectedLine.problem}
                </p>

              </div>
            </div>

            <div className="mt-8 bg-purple-500/10 border border-purple-500 rounded-xl p-5">

              <p className="text-purple-400 text-sm">
                AI RECOMMENDATION
              </p>

              <p className="mt-3">
                {selectedLine.recommendation}
              </p>

            </div>

          </div>
        </div>
      )}
    </main>
  );
}