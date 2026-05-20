interface Props {
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function AdminToolbar({ isEditing, isSaving, onEdit, onSave, onCancel }: Props) {
  if (!isEditing) {
    return (
      <button
        className="btn-edit"
        onClick={onEdit}
        style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 1000, boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }}
      >
        ✏️ Edit content
      </button>
    );
  }

  return (
    <div className="edit-toolbar">
      <span className="edit-mode-indicator">✏️ Editing mode</span>
      <button className="btn-cancel" onClick={onCancel} disabled={isSaving}>Discard</button>
      <button className="btn-save" onClick={onSave} disabled={isSaving}>
        {isSaving ? "Saving..." : "Save changes"}
      </button>
    </div>
  );
}
