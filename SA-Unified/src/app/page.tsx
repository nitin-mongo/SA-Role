"use client";

import { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";
import ViewToggle from "@/components/ViewToggle";
import RoleCards from "@/components/RoleCards";
import CompetencyTable from "@/components/CompetencyTable";
import EvidenceTable from "@/components/EvidenceTable";
import FooterStrip from "@/components/FooterStrip";
import AdminToolbar from "@/components/AdminToolbar";

import initialSite from "@/data/site.json";
import initialRoles from "@/data/roles.json";
import initialCompetencies from "@/data/competencies.json";
import initialEvidence from "@/data/evidence.json";

import type { SiteData, Role, Competency, EvidenceGroup } from "@/types";

type View = "overview" | "deep";

export default function Home() {
  const [activeView, setActiveView] = useState<View>("overview");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from local JSON — MongoDB data overwrites on mount
  const [site, setSite] = useState<SiteData>(initialSite as SiteData);
  const [roles, setRoles] = useState<Role[]>(initialRoles as unknown as Role[]);
  const [competencies, setCompetencies] = useState<Competency[]>(initialCompetencies as Competency[]);
  const [evidence, setEvidence] = useState<EvidenceGroup[]>(initialEvidence as unknown as EvidenceGroup[]);

  // Snapshot for cancel
  const [backup, setBackup] = useState({ site, roles, competencies, evidence });

  // Load latest data from MongoDB on mount
  useEffect(() => {
    fetch("/api/data")
      .then(r => r.json())
      .then(data => {
        if (data.site) setSite(data.site as SiteData);
        if (data.roles) setRoles(data.roles as Role[]);
        if (data.competencies) setCompetencies(data.competencies as Competency[]);
        if (data.evidence) setEvidence(data.evidence as EvidenceGroup[]);
      })
      .catch(err => console.error("Failed to load from MongoDB:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const startEditing = () => {
    setBackup({ site, roles, competencies, evidence });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setSite(backup.site);
    setRoles(backup.roles);
    setCompetencies(backup.competencies);
    setEvidence(backup.evidence);
    setIsEditing(false);
  };

  const saveEditing = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        fetch("/api/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ file: "site", data: site }) }),
        fetch("/api/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ file: "roles", data: roles }) }),
        fetch("/api/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ file: "competencies", data: competencies }) }),
        fetch("/api/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ file: "evidence", data: evidence }) }),
      ]);
      setIsEditing(false);
    } catch {
      alert("Save failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="fw">
      {isLoading && (
        <div style={{ position: "fixed", top: 12, right: 16, fontSize: 11, color: "var(--color-text-tertiary)", zIndex: 999 }}>
          ⏳ Loading…
        </div>
      )}

      <TopBar
        title={site.title}
        subtitle={site.subtitle}
        tag={site.tag}
        isEditing={isEditing}
        onChange={(field, value) => setSite(prev => ({ ...prev, [field]: value }))}
      />

      <ViewToggle activeView={activeView} onSwitch={setActiveView} />

      {activeView === "overview" && (
        <>
          <p className="hint">ℹ️ Click any role card to see what the unlock to the next level looks like.</p>

          <RoleCards
            roles={roles}
            setRoles={setRoles as (v: Role[] | ((p: Role[]) => Role[])) => void}
            selectedRole={selectedRole}
            onSelect={id => setSelectedRole(selectedRole === id ? null : id)}
            isEditing={isEditing}
          />

          <CompetencyTable
            competencies={competencies}
            setCompetencies={setCompetencies as (v: Competency[] | ((p: Competency[]) => Competency[])) => void}
            isEditing={isEditing}
          />

          <FooterStrip site={site} setSite={setSite} isEditing={isEditing} />
        </>
      )}

      {activeView === "deep" && (
        <>
          <p className="hint">ℹ️ Detailed evidence expectations for promotion conversations and annual review calibration.</p>

          <EvidenceTable
            groups={evidence}
            setGroups={setEvidence as (v: EvidenceGroup[] | ((p: EvidenceGroup[]) => EvidenceGroup[])) => void}
            isEditing={isEditing}
          />

          <p className="hint" style={{ marginTop: "10px" }}>
            ℹ️ Ranges are annual expectations for someone performing solidly at level. Promotion cases must show the upper end of the current level and consistent operation at the next level for ≥2 quarters.
          </p>

          <FooterStrip site={site} setSite={setSite} isEditing={isEditing} />
        </>
      )}

      <AdminToolbar
        isEditing={isEditing}
        isSaving={isSaving}
        onEdit={startEditing}
        onSave={saveEditing}
        onCancel={cancelEditing}
      />
    </main>
  );
}
