"use client";
import { GeneratedResume } from "../types/resume";
import { renderTemplate } from "./TemplatePicker";
import type { TemplateId } from "./TemplatePicker";

interface Props {
  resume: GeneratedResume;
  templateId?: TemplateId;
}

export default function ResumePreview({ resume, templateId = "classic" }: Props) {
  return (
    <div className="w-full overflow-x-auto">
      <div id="resume-print-area" className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-lg min-w-[640px] sm:min-w-0">
        {renderTemplate(resume, templateId)}
      </div>
    </div>
  );
}
