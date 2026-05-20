import EditableText from "./EditableText";
import type { Competency } from "@/types";

type CompUpdater = (c: Competency[] | ((prev: Competency[]) => Competency[])) => void;

interface CompetencyTableProps {
  competencies: Competency[];
  setCompetencies: CompUpdater;
  isEditing: boolean;
}

const roleKeys: Array<{ key: "sa" | "sr" | "adv" | "pri"; label: string; thClass: string; qClass: string }> = [
  { key: "sa", label: "SA · L2", thClass: "th-sa", qClass: "q-sa" },
  { key: "sr", label: "Senior SA · L3", thClass: "th-sr", qClass: "q-sr" },
  { key: "adv", label: "Advisory SA · L4", thClass: "th-adv", qClass: "q-adv" },
  { key: "pri", label: "Principal SA · L5", thClass: "th-pri", qClass: "q-pri" },
];

export default function CompetencyTable({ competencies, setCompetencies, isEditing }: CompetencyTableProps) {
  const updateComp = (idx: number, updater: (c: Competency) => Competency) =>
    setCompetencies(prev => (prev as Competency[]).map((c, i) => i === idx ? updater(c) : c));

  const addCompetency = () => {
    const num = String(competencies.length + 1).padStart(2, "0");
    setCompetencies(prev => [...(prev as Competency[]), { name: "New Competency", num, sa: { desc: "", quant: "" }, sr: { desc: "", quant: "" }, adv: { desc: "", quant: "" }, pri: { desc: "", quant: "" } }]);
  };

  return (
    <div className="detail-area">
      <div className="detail-header">
        <div>
          <h2>7 competencies — what each role does, and what it needs to show</h2>
          <p>Each cell: one-line description of what great looks like at that level + the quantitative target that makes it measurable.</p>
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="comp-table">
          <thead>
            <tr>
              <th className="th-label">Competency</th>
              {roleKeys.map(r => <th key={r.key} className={r.thClass}>{r.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {competencies.map((comp, idx) => (
              <tr key={comp.num}>
                <td className="td-label" style={{ position: "relative" }}>
                  {isEditing && (
                    <button
                      className="edit-remove-btn"
                      style={{ position: "absolute", top: 4, right: 4, fontSize: "9px" }}
                      onClick={() => setCompetencies(prev => (prev as Competency[]).filter((_, i) => i !== idx))}
                    >× remove</button>
                  )}
                  <span className="num">
                    <EditableText value={comp.num} onChange={v => updateComp(idx, c => ({ ...c, num: v }))} isEditing={isEditing} />
                  </span>
                  <EditableText value={comp.name} onChange={v => updateComp(idx, c => ({ ...c, name: v }))} isEditing={isEditing} />
                </td>
                {roleKeys.map(r => (
                  <td key={r.key} style={{ borderLeft: "0.5px solid var(--color-border-tertiary)" }}>
                    <div className="desc">
                      <EditableText value={comp[r.key].desc} onChange={v => updateComp(idx, c => ({ ...c, [r.key]: { ...c[r.key], desc: v } }))} isEditing={isEditing} multiline={isEditing} />
                    </div>
                    <span className={`quant ${r.qClass}`}>
                      <EditableText value={comp[r.key].quant} onChange={v => updateComp(idx, c => ({ ...c, [r.key]: { ...c[r.key], quant: v } }))} isEditing={isEditing} />
                    </span>
                  </td>
                ))}
              </tr>
            ))}
            {isEditing && (
              <tr>
                <td colSpan={5} style={{ padding: "8px 10px", background: "var(--color-background-secondary)" }}>
                  <button className="edit-add-btn" onClick={addCompetency}>+ Add competency</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
