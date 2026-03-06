"use client";
import { GeneratedResume } from "../types/resume";
import ClassicTemplate from "./templates/ClassicTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import BoldTemplate from "./templates/BoldTemplate";
import RosePinkTemplate from "./templates/RosePinkTemplate";
import LavenderTemplate from "./templates/LavenderTemplate";
import PeachTemplate from "./templates/PeachTemplate";
import MintTemplate from "./templates/MintTemplate";
import SkyTemplate from "./templates/SkyTemplate";
import GraphiteTemplate from "./templates/GraphiteTemplate";
import NeoGridTemplate from "./templates/NeoGridTemplate";
import StudioTemplate from "./templates/StudioTemplate";
import ObsidianTemplate from "./templates/ObsidianTemplate";
import MidnightTemplate from "./templates/MidnightTemplate";

export type TemplateId = "classic" | "modern" | "minimal" | "bold" | "rose" | "lavender" | "peach" | "mint" | "sky" | "graphite" | "neogrid" | "studio" | "obsidian" | "midnight";

export const TEMPLATES: { id: TemplateId; name: string; description: string }[] = [
  { id: "classic", name: "Classic", description: "Blue gradient header, clean & professional" },
  { id: "modern", name: "Modern", description: "Dark sidebar with green accents" },
  { id: "minimal", name: "Minimal", description: "Serif typography, academic elegance" },
  { id: "bold", name: "Bold", description: "Strong violet accents, high impact" },
  { id: "rose", name: "Rose Pink", description: "Cute pink cards with heart accents" },
  { id: "lavender", name: "Lavender", description: "Soft purple pastels, dreamy style" },
  { id: "peach", name: "Peach", description: "Warm peach tones, cozy & bright" },
  { id: "mint", name: "Mint", description: "Fresh teal two-column layout" },
  { id: "sky", name: "Sky", description: "Airy light blue, clean & open" },
  { id: "graphite", name: "Graphite", description: "Charcoal side rail with amber accents" },
  { id: "neogrid", name: "Neo Grid", description: "Editorial grid with cyan geometric accents" },
  { id: "studio", name: "Studio", description: "Soft rose editorial style with framed layout" },
  { id: "obsidian", name: "Obsidian", description: "Full dark slate with cyan accents" },
  { id: "midnight", name: "Midnight", description: "Dark gradient banner with neon details" },
];

interface Props {
  resume: GeneratedResume;
  selected: TemplateId;
  onSelect: (id: TemplateId) => void;
}

export function renderTemplate(resume: GeneratedResume, templateId: TemplateId) {
  switch (templateId) {
    case "modern": return <ModernTemplate resume={resume} />;
    case "minimal": return <MinimalTemplate resume={resume} />;
    case "bold": return <BoldTemplate resume={resume} />;
    case "rose": return <RosePinkTemplate resume={resume} />;
    case "lavender": return <LavenderTemplate resume={resume} />;
    case "peach": return <PeachTemplate resume={resume} />;
    case "mint": return <MintTemplate resume={resume} />;
    case "sky": return <SkyTemplate resume={resume} />;
    case "graphite": return <GraphiteTemplate resume={resume} />;
    case "neogrid": return <NeoGridTemplate resume={resume} />;
    case "studio": return <StudioTemplate resume={resume} />;
    case "obsidian": return <ObsidianTemplate resume={resume} />;
    case "midnight": return <MidnightTemplate resume={resume} />;
    default: return <ClassicTemplate resume={resume} />;
  }
}

export default function TemplatePicker({ resume, selected, onSelect }: Props) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-black text-slate-900 tracking-tight">Choose a Template</h2>
        <p className="text-slate-500 text-sm mt-1">Click any template to see a live preview. Switch anytime before downloading.</p>
      </div>

      {/* Template cards with scaled live previews */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={`rounded-xl border-2 overflow-hidden text-left transition-all focus:outline-none ${selected === t.id ? "border-blue-600 shadow-md ring-2 ring-blue-200" : "border-gray-200 hover:border-gray-300 hover:shadow-sm"}`}
          >
            {/* Scaled resume preview thumbnail */}
            <div className="relative w-full overflow-hidden bg-white" style={{ height: "180px" }}>
              <div
                className="absolute top-0 left-0 origin-top-left pointer-events-none"
                style={{ width: "800px", transform: "scale(0.245)", transformOrigin: "top left" }}
              >
                {renderTemplate(resume, t.id)}
              </div>
            </div>
            {/* Label */}
            <div className={`px-2.5 py-2 border-t ${selected === t.id ? "bg-blue-600 border-blue-600" : "bg-white border-gray-100"}`}>
              <p className={`text-xs font-bold ${selected === t.id ? "text-white" : "text-gray-900"}`}>{t.name}</p>
              <p className={`text-xs mt-0.5 leading-tight ${selected === t.id ? "text-blue-100" : "text-gray-400"}`}>{t.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Live preview */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
        {renderTemplate(resume, selected)}
      </div>
    </div>
  );
}
