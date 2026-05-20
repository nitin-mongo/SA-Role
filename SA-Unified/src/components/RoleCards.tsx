import EditableText from "./EditableText";
import type { Role } from "@/types";

type RoleUpdater = (roles: Role[] | ((prev: Role[]) => Role[])) => void;

interface RoleCardsProps {
  roles: Role[];
  setRoles: RoleUpdater;
  selectedRole: string | null;
  onSelect: (roleId: string) => void;
  isEditing: boolean;
}

export default function RoleCards({ roles, setRoles, selectedRole, onSelect, isEditing }: RoleCardsProps) {
  const updateRole = (id: string, updater: (r: Role) => Role) =>
    setRoles(prev => (prev as Role[]).map(r => r.id === id ? updater(r) : r));

  return (
    <div className="role-cards-row">
      {roles.map((role) => (
        <div
          key={role.id}
          className={`role-card ${!isEditing && selectedRole === role.id ? `selected-${role.colorClass}` : ""}`}
          onClick={() => !isEditing && onSelect(role.id)}
        >
          <div className="rc-header">
            <div className={`rc-badge b-${role.colorClass}`}>
              <EditableText value={role.badge} onChange={v => updateRole(role.id, r => ({ ...r, badge: v }))} isEditing={isEditing} />
            </div>
            <div className="rc-title">
              <EditableText value={role.title} onChange={v => updateRole(role.id, r => ({ ...r, title: v }))} isEditing={isEditing} />
            </div>
            <div className="rc-identity">
              <EditableText value={role.identity} onChange={v => updateRole(role.id, r => ({ ...r, identity: v }))} isEditing={isEditing} />
            </div>
          </div>

          <div className="rc-stats">
            {role.stats.map((stat, i) => (
              <div key={i} className="stat" style={{ position: "relative" }}>
                {isEditing && (
                  <button
                    className="edit-remove-btn"
                    style={{ position: "absolute", top: 2, right: 2, padding: "1px 5px", fontSize: "10px" }}
                    onClick={e => { e.stopPropagation(); updateRole(role.id, r => ({ ...r, stats: r.stats.filter((_, j) => j !== i) })); }}
                  >×</button>
                )}
                <div className="stat-val">
                  <EditableText value={stat.value} onChange={v => updateRole(role.id, r => ({ ...r, stats: r.stats.map((s, j) => j === i ? { ...s, value: v } : s) }))} isEditing={isEditing} />
                </div>
                <div className="stat-lbl">
                  <EditableText value={stat.label} onChange={v => updateRole(role.id, r => ({ ...r, stats: r.stats.map((s, j) => j === i ? { ...s, label: v } : s) }))} isEditing={isEditing} />
                  <br />
                  <EditableText value={stat.sublabel} onChange={v => updateRole(role.id, r => ({ ...r, stats: r.stats.map((s, j) => j === i ? { ...s, sublabel: v } : s) }))} isEditing={isEditing} />
                </div>
              </div>
            ))}
            {isEditing && (
              <div className="stat" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <button
                  className="edit-add-btn"
                  onClick={e => { e.stopPropagation(); updateRole(role.id, r => ({ ...r, stats: [...r.stats, { value: "—", label: "New stat", sublabel: "" }] })); }}
                >+ stat</button>
              </div>
            )}
          </div>

          {(isEditing || (!isEditing && selectedRole === role.id)) && (
            <div className="rc-unlock">
              <strong>
                <EditableText value={role.unlock.heading} onChange={v => updateRole(role.id, r => ({ ...r, unlock: { ...r.unlock, heading: v } }))} isEditing={isEditing} />
              </strong>
              <br />
              {isEditing
                ? <EditableText value={role.unlock.text} onChange={v => updateRole(role.id, r => ({ ...r, unlock: { ...r.unlock, text: v } }))} isEditing multiline />
                : role.unlock.text
              }
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
