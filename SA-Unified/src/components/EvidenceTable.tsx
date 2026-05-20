import React from "react";
import EditableText from "./EditableText";
import type { EvidenceGroup, Metric, MetricLevel } from "@/types";

type GroupUpdater = (g: EvidenceGroup[] | ((prev: EvidenceGroup[]) => EvidenceGroup[])) => void;
type RoleKey = "sa" | "sr" | "adv" | "pri";

interface EvidenceTableProps {
  groups: EvidenceGroup[];
  setGroups: GroupUpdater;
  isEditing: boolean;
}

const roleKeys: Array<{ key: RoleKey; pillClass: string; hClass: string }> = [
  { key: "sa", pillClass: "b-sa", hClass: "h-sa" },
  { key: "sr", pillClass: "b-sr", hClass: "h-sr" },
  { key: "adv", pillClass: "b-adv", hClass: "h-adv" },
  { key: "pri", pillClass: "b-pri", hClass: "h-pri" },
];

const EMPTY_METRIC = (): Metric => ({
  label: "New metric", sublabel: "sub-label",
  sa: { pill: null, note: null }, sr: { pill: null, note: null },
  adv: { pill: null, note: null }, pri: { pill: null, note: null },
});

export default function EvidenceTable({ groups, setGroups, isEditing }: EvidenceTableProps) {
  const updGroups = (fn: (prev: EvidenceGroup[]) => EvidenceGroup[]) => setGroups(fn);

  const updGroup = (gIdx: number, fn: (g: EvidenceGroup) => EvidenceGroup) =>
    updGroups(prev => prev.map((g, i) => i === gIdx ? fn(g) : g));

  const updMetric = (gIdx: number, mIdx: number, fn: (m: Metric) => Metric) =>
    updGroup(gIdx, g => ({ ...g, metrics: g.metrics.map((m, i) => i === mIdx ? fn(m) : m) }));

  const updLevel = (gIdx: number, mIdx: number, rKey: RoleKey, field: keyof MetricLevel, value: string) =>
    updMetric(gIdx, mIdx, m => ({ ...m, [rKey]: { ...m[rKey], [field]: value || null } }));

  return (
    <div style={{ borderRadius: "var(--border-radius-lg)", border: "0.5px solid var(--color-border-tertiary)", overflowX: "auto" }}>
      <table className="evidence-table" style={{ minWidth: 700 }}>
        <thead>
          <tr>
            <th style={{ width: "17%" }}>Evidence metric</th>
            <th className="h-sa">SA · L2</th>
            <th className="h-sr">Senior SA · L3</th>
            <th className="h-adv">Advisory SA · L4</th>
            <th className="h-pri">Principal SA · L5</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group, gIdx) => (
            <React.Fragment key={gIdx}>
              <tr className="grp-hd">
                <td colSpan={5} style={{ position: "relative" }}>
                  <EditableText value={group.group} onChange={v => updGroup(gIdx, g => ({ ...g, group: v }))} isEditing={isEditing} />
                  {isEditing && (
                    <button className="edit-remove-btn" style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)" }} onClick={() => updGroups(prev => prev.filter((_, i) => i !== gIdx))}>
                      × Remove group
                    </button>
                  )}
                </td>
              </tr>
              {group.metrics.map((metric, mIdx) => (
                <tr key={mIdx}>
                  <td className="row-label" style={{ position: "relative" }}>
                    <EditableText value={metric.label} onChange={v => updMetric(gIdx, mIdx, m => ({ ...m, label: v }))} isEditing={isEditing} />
                    <span className="row-sub">
                      <EditableText value={metric.sublabel} onChange={v => updMetric(gIdx, mIdx, m => ({ ...m, sublabel: v }))} isEditing={isEditing} />
                    </span>
                    {isEditing && (
                      <button className="edit-remove-btn" style={{ marginTop: 4, display: "block" }} onClick={() => updGroup(gIdx, g => ({ ...g, metrics: g.metrics.filter((_, i) => i !== mIdx) }))}>
                        × row
                      </button>
                    )}
                  </td>
                  {roleKeys.map(r => {
                    const level = metric[r.key];
                    const pillCls = level.pillType === "na" ? "q-na" : r.pillClass;
                    return (
                      <td key={r.key}>
                        {isEditing ? (
                          <>
                            <input type="text" value={level.pill || ""} onChange={e => updLevel(gIdx, mIdx, r.key, "pill", e.target.value)} className="editable-field" placeholder="Pill text (blank = none)" style={{ marginBottom: 4 }} />
                            <textarea value={level.note || ""} onChange={e => updLevel(gIdx, mIdx, r.key, "note", e.target.value)} className="editable-field" placeholder="Note (blank = none)" rows={2} />
                          </>
                        ) : (
                          <>
                            {level.pill && <span className={`num-pill ${pillCls}`}>{level.pill}</span>}
                            {level.note && <div className="note-box">{level.note}</div>}
                          </>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {isEditing && (
                <tr>
                  <td colSpan={5} style={{ padding: "6px 12px", background: "var(--color-background-secondary)" }}>
                    <button className="edit-add-btn" onClick={() => updGroup(gIdx, g => ({ ...g, metrics: [...g.metrics, EMPTY_METRIC()] }))}>+ Add row</button>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
          {isEditing && (
            <tr>
              <td colSpan={5} style={{ padding: "8px 12px" }}>
                <button className="edit-add-btn" onClick={() => updGroups(prev => [...prev, { group: "New Group", metrics: [EMPTY_METRIC()] }])}>+ Add group</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
