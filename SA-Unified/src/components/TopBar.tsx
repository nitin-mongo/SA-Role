import EditableText from "./EditableText";

interface TopBarProps {
  title: string;
  subtitle: string;
  tag: string;
  isEditing: boolean;
  onChange: (field: "title" | "subtitle" | "tag", value: string) => void;
}

export default function TopBar({ title, subtitle, tag, isEditing, onChange }: TopBarProps) {
  return (
    <div className="top-bar">
      <div>
        <h1>
          <EditableText value={title} onChange={v => onChange("title", v)} isEditing={isEditing} />
        </h1>
        <p>
          <EditableText value={subtitle} onChange={v => onChange("subtitle", v)} isEditing={isEditing} />
        </p>
      </div>
      <span className="tag">
        <EditableText value={tag} onChange={v => onChange("tag", v)} isEditing={isEditing} />
      </span>
    </div>
  );
}
