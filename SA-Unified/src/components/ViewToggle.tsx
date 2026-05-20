interface ViewToggleProps {
  activeView: "overview" | "deep";
  onSwitch: (view: "overview" | "deep") => void;
}

export default function ViewToggle({ activeView, onSwitch }: ViewToggleProps) {
  return (
    <div className="view-toggle">
      <div
        className={`vtab ${activeView === "overview" ? "active" : ""}`}
        onClick={() => onSwitch("overview")}
      >
        📊 Role overview
      </div>
      <div
        className={`vtab ${activeView === "deep" ? "active" : ""}`}
        onClick={() => onSwitch("deep")}
      >
        📋 Competency + evidence deep-dive
      </div>
    </div>
  );
}
