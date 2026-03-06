"use client";
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, ChevronRight, ChevronLeft, Sparkles, Briefcase, GraduationCap, User, Wrench, FolderGit2, FlaskConical, Presentation, BookOpen, Award, Save, CheckCircle } from "lucide-react";
import { ResumeFormData } from "../types/resume";

const genId = () => Math.random().toString(36).substring(2, 11);

const DEFAULT_DRAFT_KEY = "resumeai_form_draft";

interface Props {
  onSubmit: (data: ResumeFormData) => void;
  isLoading: boolean;
  draftKey?: string;
}

const steps = [
  { label: "Personal", icon: User },
  { label: "Experience", icon: Briefcase },
  { label: "Education", icon: GraduationCap },
  { label: "Projects", icon: FolderGit2 },
  { label: "Research", icon: FlaskConical },
  { label: "Presentations", icon: Presentation },
  { label: "Publications", icon: BookOpen },
  { label: "Certs & More", icon: Award },
  { label: "Skills", icon: Wrench },
];

export default function ResumeForm({ onSubmit, isLoading, draftKey }: Props) {
  const [step, setStep] = useState(0);
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");
  const storageKey = draftKey ?? DEFAULT_DRAFT_KEY;

  const { register, handleSubmit, control, watch, reset, getValues } = useForm<ResumeFormData>({
    defaultValues: {
      personalInfo: { fullName: "", email: "", phone: "", location: "", linkedin: "", website: "", jobTitle: "", languages: "", hobbies: "" },
      workExperience: [{ id: genId(), company: "", title: "", startDate: "", endDate: "", current: false, description: "" }],
      education: [{ id: genId(), school: "", degree: "", field: "", startDate: "", endDate: "", gpa: "" }],
      projects: [],
      researchProjects: [],
      presentations: [],
      publications: [],
      certificates: [],
      extraActivities: [],
      skills: "",
      targetRole: "",
      additionalContext: "",
    },
  });

  // Load saved draft on mount — validate shape before resetting
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Basic sanity check: must be an object with expected top-level keys
        if (parsed && typeof parsed === "object" && parsed.personalInfo && parsed.workExperience) {
          reset(parsed);
        }
      }
    } catch { /* ignore corrupt/missing draft */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const handleSaveDraft = () => {
    localStorage.setItem(storageKey, JSON.stringify(getValues()));
    setSaveState("saved");
    setTimeout(() => setSaveState("idle"), 2000);
  };

  const { fields: workFields, append: appendWork, remove: removeWork } = useFieldArray({ control, name: "workExperience" });
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: "education" });
  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({ control, name: "projects" });
  const { fields: researchFields, append: appendResearch, remove: removeResearch } = useFieldArray({ control, name: "researchProjects" });
  const { fields: presentationFields, append: appendPresentation, remove: removePresentation } = useFieldArray({ control, name: "presentations" });
  const { fields: publicationFields, append: appendPublication, remove: removePublication } = useFieldArray({ control, name: "publications" });
  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({ control, name: "certificates" });
  const { fields: extraFields, append: appendExtra, remove: removeExtra } = useFieldArray({ control, name: "extraActivities" });

  const inputClass = "w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow hover:border-slate-300";
  const labelClass = "block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide";

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center gap-1 shrink-0">
              <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                i === step ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200" :
                i < step ? "bg-emerald-100 text-emerald-700" :
                "bg-slate-100 text-slate-400"
              }`}>
                <s.icon className="w-3 h-3" />
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className={`h-0.5 w-3 shrink-0 rounded-full ${i < step ? "bg-emerald-400" : "bg-slate-200"}`} />}
            </div>
          ))}
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 0: Personal */}
        {step === 0 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-black text-slate-900 tracking-tight mb-4">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelClass}>Full Name *</label>
                <input {...register("personalInfo.fullName", { required: true })} className={inputClass} placeholder="John Smith" />
              </div>
              <div>
                <label className={labelClass}>Target Job Title *</label>
                <input {...register("personalInfo.jobTitle", { required: true })} className={inputClass} placeholder="Senior Software Engineer" />
              </div>
              <div>
                <label className={labelClass}>Email *</label>
                <input {...register("personalInfo.email", { required: true })} type="email" className={inputClass} placeholder="john@example.com" />
              </div>
              <div>
                <label className={labelClass}>Phone *</label>
                <input {...register("personalInfo.phone", { required: true })} className={inputClass} placeholder="+1 (555) 000-0000" />
              </div>
              <div>
                <label className={labelClass}>Location *</label>
                <input {...register("personalInfo.location", { required: true })} className={inputClass} placeholder="San Francisco, CA" />
              </div>
              <div>
                <label className={labelClass}>LinkedIn URL</label>
                <input {...register("personalInfo.linkedin")} className={inputClass} placeholder="linkedin.com/in/johnsmith" />
              </div>
              <div>
                <label className={labelClass}>Website / Portfolio</label>
                <input {...register("personalInfo.website")} className={inputClass} placeholder="johnsmith.dev" />
              </div>
              <div>
                <label className={labelClass}>Languages</label>
                <input {...register("personalInfo.languages")} className={inputClass} placeholder="English (Native), Spanish (Fluent), French (Basic)" />
                <p className="text-xs text-slate-400 mt-1">Comma-separated with proficiency level</p>
              </div>
              <div>
                <label className={labelClass}>Hobbies & Interests</label>
                <input {...register("personalInfo.hobbies")} className={inputClass} placeholder="Photography, Open-source, Rock climbing" />
                <p className="text-xs text-slate-400 mt-1">Optional — helps personalize your resume</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Experience */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Work Experience</h2>
            {workFields.map((field, i) => (
              <div key={field.id} className="border border-slate-200 rounded-xl p-5 space-y-4 relative bg-slate-50/50">
                {workFields.length > 1 && (
                  <button type="button" onClick={() => removeWork(i)} className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Company *</label>
                    <input {...register(`workExperience.${i}.company`, { required: true })} className={inputClass} placeholder="Acme Corp" />
                  </div>
                  <div>
                    <label className={labelClass}>Job Title *</label>
                    <input {...register(`workExperience.${i}.title`, { required: true })} className={inputClass} placeholder="Software Engineer" />
                  </div>
                  <div>
                    <label className={labelClass}>Start Date *</label>
                    <input {...register(`workExperience.${i}.startDate`, { required: true })} className={inputClass} placeholder="Jan 2022" />
                  </div>
                  <div>
                    <label className={labelClass}>End Date</label>
                    <input {...register(`workExperience.${i}.endDate`)} className={inputClass} placeholder="Present" disabled={watch(`workExperience.${i}.current`)} />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" {...register(`workExperience.${i}.current`)} className="rounded" />
                  I currently work here
                </label>
                <div>
                  <label className={labelClass}>What did you do? (raw notes are fine)</label>
                  <textarea {...register(`workExperience.${i}.description`, { required: true })} className={inputClass + " min-h-24 resize-none"} placeholder="Built microservices, led team of 4 engineers, reduced load time by 40%..." />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => appendWork({ id: genId(), company: "", title: "", startDate: "", endDate: "", current: false, description: "" })} className="flex items-center gap-2 text-indigo-600 text-sm font-semibold hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors -mx-3">
              <Plus className="w-4 h-4" /> Add Another Position
            </button>
          </div>
        )}

        {/* Step 2: Education */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Education</h2>
            {eduFields.map((field, i) => (
              <div key={field.id} className="border border-slate-200 rounded-xl p-5 space-y-4 relative bg-slate-50/50">
                {eduFields.length > 1 && (
                  <button type="button" onClick={() => removeEdu(i)} className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className={labelClass}>School / University *</label>
                    <input {...register(`education.${i}.school`, { required: true })} className={inputClass} placeholder="University of California, Berkeley" />
                  </div>
                  <div>
                    <label className={labelClass}>Degree *</label>
                    <input {...register(`education.${i}.degree`, { required: true })} className={inputClass} placeholder="Bachelor of Science" />
                  </div>
                  <div>
                    <label className={labelClass}>Field of Study *</label>
                    <input {...register(`education.${i}.field`, { required: true })} className={inputClass} placeholder="Computer Science" />
                  </div>
                  <div>
                    <label className={labelClass}>Start Year</label>
                    <input {...register(`education.${i}.startDate`)} className={inputClass} placeholder="2018" />
                  </div>
                  <div>
                    <label className={labelClass}>End Year</label>
                    <input {...register(`education.${i}.endDate`)} className={inputClass} placeholder="2022" />
                  </div>
                  <div>
                    <label className={labelClass}>GPA (optional)</label>
                    <input {...register(`education.${i}.gpa`)} className={inputClass} placeholder="3.8" />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => appendEdu({ id: genId(), school: "", degree: "", field: "", startDate: "", endDate: "", gpa: "" })} className="flex items-center gap-2 text-indigo-600 text-sm font-semibold hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors -mx-3">
              <Plus className="w-4 h-4" /> Add Another Degree
            </button>
          </div>
        )}

        {/* Step 3: Projects */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Projects</h2>
              <p className="text-sm text-gray-500 mt-1">Personal, academic, or open-source projects. Skip if none.</p>
            </div>
            {projectFields.map((field, i) => (
              <div key={field.id} className="border border-slate-200 rounded-xl p-5 space-y-4 relative bg-slate-50/50">
                <button type="button" onClick={() => removeProject(i)} className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className={labelClass}>Project Name *</label>
                    <input {...register(`projects.${i}.name`, { required: true })} className={inputClass} placeholder="AI Resume Builder" />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Tech Stack *</label>
                    <input {...register(`projects.${i}.techStack`, { required: true })} className={inputClass} placeholder="React, Node.js, PostgreSQL" />
                  </div>
                  <div>
                    <label className={labelClass}>Start Date</label>
                    <input {...register(`projects.${i}.startDate`)} className={inputClass} placeholder="Jan 2023" />
                  </div>
                  <div>
                    <label className={labelClass}>End Date</label>
                    <input {...register(`projects.${i}.endDate`)} className={inputClass} placeholder="Mar 2023 or Ongoing" />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Link (GitHub / Live URL)</label>
                    <input {...register(`projects.${i}.link`)} className={inputClass} placeholder="github.com/user/project" />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Description *</label>
                    <textarea {...register(`projects.${i}.description`, { required: true })} className={inputClass + " min-h-20 resize-none"} placeholder="What did you build, what problem did it solve, key features..." />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => appendProject({ id: genId(), name: "", description: "", techStack: "", link: "", startDate: "", endDate: "" })} className="flex items-center gap-2 text-indigo-600 text-sm font-semibold hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors -mx-3">
              <Plus className="w-4 h-4" /> Add Project
            </button>
          </div>
        )}

        {/* Step 4: Research Projects */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Research Projects</h2>
              <p className="text-sm text-gray-500 mt-1">Academic or industry research work. Skip if none.</p>
            </div>
            {researchFields.map((field, i) => (
              <div key={field.id} className="border border-slate-200 rounded-xl p-5 space-y-4 relative bg-slate-50/50">
                <button type="button" onClick={() => removeResearch(i)} className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className={labelClass}>Research Title *</label>
                    <input {...register(`researchProjects.${i}.title`, { required: true })} className={inputClass} placeholder="Deep Learning for Medical Image Segmentation" />
                  </div>
                  <div>
                    <label className={labelClass}>Your Role *</label>
                    <input {...register(`researchProjects.${i}.role`, { required: true })} className={inputClass} placeholder="Research Assistant" />
                  </div>
                  <div>
                    <label className={labelClass}>Institution *</label>
                    <input {...register(`researchProjects.${i}.institution`, { required: true })} className={inputClass} placeholder="MIT CSAIL" />
                  </div>
                  <div>
                    <label className={labelClass}>Start Date</label>
                    <input {...register(`researchProjects.${i}.startDate`)} className={inputClass} placeholder="Sep 2022" />
                  </div>
                  <div>
                    <label className={labelClass}>End Date</label>
                    <input {...register(`researchProjects.${i}.endDate`)} className={inputClass} placeholder="May 2023 or Ongoing" />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Description *</label>
                    <textarea {...register(`researchProjects.${i}.description`, { required: true })} className={inputClass + " min-h-20 resize-none"} placeholder="What was the research about, your contributions, methods used, outcomes..." />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => appendResearch({ id: genId(), title: "", role: "", institution: "", description: "", startDate: "", endDate: "" })} className="flex items-center gap-2 text-indigo-600 text-sm font-semibold hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors -mx-3">
              <Plus className="w-4 h-4" /> Add Research Project
            </button>
          </div>
        )}

        {/* Step 5: Presentations */}
        {step === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Poster & Paper Presentations</h2>
              <p className="text-sm text-gray-500 mt-1">Conference posters, paper presentations, or talks. Skip if none.</p>
            </div>
            {presentationFields.map((field, i) => (
              <div key={field.id} className="border border-slate-200 rounded-xl p-5 space-y-4 relative bg-slate-50/50">
                <button type="button" onClick={() => removePresentation(i)} className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className={labelClass}>Title *</label>
                    <input {...register(`presentations.${i}.title`, { required: true })} className={inputClass} placeholder="Novel Approach to Neural Architecture Search" />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Conference / Event *</label>
                    <input {...register(`presentations.${i}.event`, { required: true })} className={inputClass} placeholder="NeurIPS 2023" />
                  </div>
                  <div>
                    <label className={labelClass}>Date *</label>
                    <input {...register(`presentations.${i}.date`, { required: true })} className={inputClass} placeholder="Dec 2023" />
                  </div>
                  <div>
                    <label className={labelClass}>Type *</label>
                    <select {...register(`presentations.${i}.type`, { required: true })} className={inputClass}>
                      <option value="poster">Poster</option>
                      <option value="paper">Paper Presentation</option>
                      <option value="talk">Talk / Keynote</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Description (optional)</label>
                    <textarea {...register(`presentations.${i}.description`)} className={inputClass + " min-h-16 resize-none"} placeholder="Brief summary of the work presented..." />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => appendPresentation({ id: genId(), title: "", event: "", date: "", type: "poster", description: "" })} className="flex items-center gap-2 text-indigo-600 text-sm font-semibold hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors -mx-3">
              <Plus className="w-4 h-4" /> Add Presentation
            </button>
          </div>
        )}

        {/* Step 6: Publications */}
        {step === 6 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Published Papers</h2>
              <p className="text-sm text-gray-500 mt-1">Journal articles, conference papers, preprints. Skip if none.</p>
            </div>
            {publicationFields.map((field, i) => (
              <div key={field.id} className="border border-slate-200 rounded-xl p-5 space-y-4 relative bg-slate-50/50">
                <button type="button" onClick={() => removePublication(i)} className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className={labelClass}>Paper Title *</label>
                    <input {...register(`publications.${i}.title`, { required: true })} className={inputClass} placeholder="Attention Is All You Need" />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Authors *</label>
                    <input {...register(`publications.${i}.authors`, { required: true })} className={inputClass} placeholder="Smith, J., Doe, A., et al." />
                  </div>
                  <div>
                    <label className={labelClass}>Journal / Conference *</label>
                    <input {...register(`publications.${i}.venue`, { required: true })} className={inputClass} placeholder="Nature Machine Intelligence" />
                  </div>
                  <div>
                    <label className={labelClass}>Year *</label>
                    <input {...register(`publications.${i}.year`, { required: true })} className={inputClass} placeholder="2023" />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>DOI / URL (optional)</label>
                    <input {...register(`publications.${i}.doi`)} className={inputClass} placeholder="10.1038/s42256-023-00000-0" />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Short Description (optional)</label>
                    <textarea {...register(`publications.${i}.description`)} className={inputClass + " min-h-16 resize-none"} placeholder="Key findings or contribution..." />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => appendPublication({ id: genId(), title: "", authors: "", venue: "", year: "", doi: "", description: "" })} className="flex items-center gap-2 text-indigo-600 text-sm font-semibold hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors -mx-3">
              <Plus className="w-4 h-4" /> Add Publication
            </button>
          </div>
        )}

        {/* Step 7: Certificates & Extracurriculars */}
        {step === 7 && (
          <div className="space-y-8 animate-fade-in">
            {/* Certificates */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Certificates</h2>
                <p className="text-sm text-gray-500 mt-1">Professional certifications, online courses, licenses. Skip if none.</p>
              </div>
              {certFields.map((field, i) => (
                <div key={field.id} className="border border-slate-200 rounded-xl p-5 space-y-4 relative bg-slate-50/50">
                  <button type="button" onClick={() => removeCert(i)} className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className={labelClass}>Certificate Name *</label>
                      <input {...register(`certificates.${i}.name`, { required: true })} className={inputClass} placeholder="AWS Certified Solutions Architect" />
                    </div>
                    <div>
                      <label className={labelClass}>Issuing Organization *</label>
                      <input {...register(`certificates.${i}.issuer`, { required: true })} className={inputClass} placeholder="Amazon Web Services" />
                    </div>
                    <div>
                      <label className={labelClass}>Date Earned *</label>
                      <input {...register(`certificates.${i}.date`, { required: true })} className={inputClass} placeholder="Mar 2023" />
                    </div>
                    <div>
                      <label className={labelClass}>Expiry Date (optional)</label>
                      <input {...register(`certificates.${i}.expiryDate`)} className={inputClass} placeholder="Mar 2026" />
                    </div>
                    <div>
                      <label className={labelClass}>Credential ID (optional)</label>
                      <input {...register(`certificates.${i}.credentialId`)} className={inputClass} placeholder="ABC123XYZ" />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => appendCert({ id: genId(), name: "", issuer: "", date: "", expiryDate: "", credentialId: "" })} className="flex items-center gap-2 text-indigo-600 text-sm font-semibold hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors -mx-3">
                <Plus className="w-4 h-4" /> Add Certificate
              </button>
            </div>

            <hr className="border-gray-200" />

            {/* Extracurriculars */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Extracurricular Activities</h2>
                <p className="text-sm text-gray-500 mt-1">Clubs, volunteering, sports, leadership roles. Skip if none.</p>
              </div>
              {extraFields.map((field, i) => (
                <div key={field.id} className="border border-slate-200 rounded-xl p-5 space-y-4 relative bg-slate-50/50">
                  <button type="button" onClick={() => removeExtra(i)} className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className={labelClass}>Activity / Club Name *</label>
                      <input {...register(`extraActivities.${i}.name`, { required: true })} className={inputClass} placeholder="Robotics Club" />
                    </div>
                    <div>
                      <label className={labelClass}>Your Role</label>
                      <input {...register(`extraActivities.${i}.role`)} className={inputClass} placeholder="President" />
                    </div>
                    <div>
                      <label className={labelClass}>Organization</label>
                      <input {...register(`extraActivities.${i}.organization`)} className={inputClass} placeholder="Stanford University" />
                    </div>
                    <div>
                      <label className={labelClass}>Start Date</label>
                      <input {...register(`extraActivities.${i}.startDate`)} className={inputClass} placeholder="Sep 2021" />
                    </div>
                    <div>
                      <label className={labelClass}>End Date</label>
                      <input {...register(`extraActivities.${i}.endDate`)} className={inputClass} placeholder="May 2023 or Present" />
                    </div>
                    <div className="col-span-2">
                      <label className={labelClass}>Description (optional)</label>
                      <textarea {...register(`extraActivities.${i}.description`)} className={inputClass + " min-h-16 resize-none"} placeholder="Key achievements, responsibilities..." />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => appendExtra({ id: genId(), name: "", role: "", organization: "", startDate: "", endDate: "", description: "" })} className="flex items-center gap-2 text-indigo-600 text-sm font-semibold hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors -mx-3">
                <Plus className="w-4 h-4" /> Add Activity
              </button>
            </div>
          </div>
        )}

        {/* Step 8: Skills */}
        {step === 8 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Skills & Target Role</h2>
            <div>
              <label className={labelClass}>Target Role / Job Title *</label>
              <input {...register("targetRole", { required: true })} className={inputClass} placeholder="Senior Software Engineer at a fintech startup" />
              <p className="text-xs text-gray-500 mt-1">Be specific - this helps the AI tailor your resume</p>
            </div>
            <div>
              <label className={labelClass}>Skills *</label>
              <textarea {...register("skills", { required: true })} className={inputClass + " min-h-24 resize-none"} placeholder="Python, React, TypeScript, AWS, PostgreSQL, Docker..." />
              <p className="text-xs text-gray-500 mt-1">List all your skills, comma-separated</p>
            </div>
            <div>
              <label className={labelClass}>Additional Context (optional)</label>
              <textarea {...register("additionalContext")} className={inputClass + " min-h-20 resize-none"} placeholder="Any achievements, awards, or other details you want highlighted..." />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-8 gap-3">
          {/* Back button */}
          {step > 0 ? (
            <button type="button" onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-semibold text-sm transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}

          {/* Right side: Save + Next/Generate */}
          <div className="flex items-center gap-2">
            {/* Save Draft button — shown on every step */}
            <button
              type="button"
              onClick={handleSaveDraft}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                saveState === "saved"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                  : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {saveState === "saved" ? (
                <><CheckCircle className="w-4 h-4" /> Saved!</>
              ) : (
                <><Save className="w-4 h-4" /> Save</>
              )}
            </button>

            {step < steps.length - 1 ? (
              <button type="button" onClick={() => setStep(s => s + 1)} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="submit" disabled={isLoading} className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-indigo-200">
                <Sparkles className="w-4 h-4" />
                Generate Resume with AI
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
