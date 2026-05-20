import EditableText from "./EditableText";
import type { SiteData, Gate } from "@/types";

type SiteUpdater = (s: SiteData | ((prev: SiteData) => SiteData)) => void;

interface FooterStripProps {
  site: SiteData;
  setSite: SiteUpdater;
  isEditing: boolean;
}

export default function FooterStrip({ site, setSite, isEditing }: FooterStripProps) {
  const updGate = (idx: number, field: keyof Gate, value: string) =>
    setSite(prev => ({ ...prev, promotionGates: prev.promotionGates.map((g, i) => i === idx ? { ...g, [field]: value } : g) }));

  return (
    <div className="footer-strip">
      <div className="fs-card">
        <h3>The promotion test — one question per gate</h3>
        <div className="gate-row">
          {site.promotionGates.map((gate, i) => (
            <div key={i} className="gate-item" style={{ alignItems: "flex-start" }}>
              <span className="gate-lbl">
                <EditableText value={gate.label} onChange={v => updGate(i, "label", v)} isEditing={isEditing} />
              </span>
              <span className="gate-q">
                <EditableText value={gate.question} onChange={v => updGate(i, "question", v)} isEditing={isEditing} />
                {isEditing && (
                  <button className="edit-remove-btn" style={{ display: "inline-block", marginLeft: 4 }} onClick={() => setSite(prev => ({ ...prev, promotionGates: prev.promotionGates.filter((_, j) => j !== i) }))}>×</button>
                )}
              </span>
            </div>
          ))}
          {isEditing && (
            <button className="edit-add-btn" onClick={() => setSite(prev => ({ ...prev, promotionGates: [...prev.promotionGates, { label: "Level → Level", question: "\"Question?\"" }] }))}>+ Add gate</button>
          )}
        </div>
      </div>

      <div className="fs-card">
        <h3>The promotion timing rule</h3>
        {isEditing
          ? <textarea value={site.timingRule} onChange={e => setSite(prev => ({ ...prev, timingRule: e.target.value }))} className="editable-field" rows={4} />
          : <p dangerouslySetInnerHTML={{ __html: site.timingRule }} />
        }
      </div>

      <div className="fs-card">
        <h3>The one thing most frameworks miss</h3>
        {isEditing
          ? <textarea value={site.missedInsight} onChange={e => setSite(prev => ({ ...prev, missedInsight: e.target.value }))} className="editable-field" rows={4} />
          : <p dangerouslySetInnerHTML={{ __html: site.missedInsight }} />
        }
      </div>
    </div>
  );
}
