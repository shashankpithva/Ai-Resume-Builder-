import { GeneratedResume } from "../../types/resume";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

interface Props { resume: GeneratedResume; }

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-5">
    <div className="flex items-center gap-3 mb-2.5">
      <div className="w-1 h-4 bg-teal-400 rounded-full shrink-0" />
      <h2 className="text-[10px] font-bold tracking-[0.18em] uppercase text-teal-500 whitespace-nowrap">{title}</h2>
      <div className="flex-1 h-px bg-teal-100" />
    </div>
    {children}
  </section>
);

export default function MintTemplate({ resume }: Props) {
  const { personalInfo, summary, workExperience, education, skills, projects, researchProjects, presentations, publications, certificates, extraActivities } = resume;
  return (
    <div className="bg-white font-sans text-slate-800" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Header */}
      <div className="px-9 pt-9 pb-6" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)" }}>
        <h1 className="text-[26px] font-bold tracking-tight text-teal-900 leading-tight">{personalInfo.fullName}</h1>
        <p className="text-[11.5px] font-semibold text-teal-600 mt-1 tracking-wide">{personalInfo.jobTitle}</p>
        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-[10.5px] text-teal-500">
          <span className="flex items-center gap-1.5"><Mail className="w-2.5 h-2.5" />{personalInfo.email}</span>
          <span className="flex items-center gap-1.5"><Phone className="w-2.5 h-2.5" />{personalInfo.phone}</span>
          <span className="flex items-center gap-1.5"><MapPin className="w-2.5 h-2.5" />{personalInfo.location}</span>
          {personalInfo.linkedin && <span className="flex items-center gap-1.5"><Linkedin className="w-2.5 h-2.5" />{personalInfo.linkedin}</span>}
          {personalInfo.website && <span className="flex items-center gap-1.5"><Globe className="w-2.5 h-2.5" />{personalInfo.website}</span>}
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-teal-300 via-emerald-300 to-teal-200" />

      <div className="px-9 pt-6 pb-8">
        <Section title="About Me">
          <p className="text-[11.5px] text-slate-600 leading-[1.7]">{summary}</p>
        </Section>

        {workExperience.length > 0 && (
          <Section title="Experience">
            <div className="space-y-4">
              {workExperience.map((job) => (
                <div key={job.id}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="text-[13px] font-semibold text-slate-900">{job.title}</span>
                      <span className="text-[11.5px] text-teal-600 font-medium ml-2">· {job.company}</span>
                    </div>
                    <span className="text-[10.5px] text-slate-400 whitespace-nowrap ml-4 tabular-nums">{job.startDate} – {job.endDate || "Present"}</span>
                  </div>
                  <ul className="mt-1.5 space-y-1">
                    {job.bullets.map((b, i) => (
                      <li key={i} className="text-[11.5px] text-slate-600 leading-[1.6] flex gap-2">
                        <span className="text-teal-300 shrink-0 mt-[3px] text-[8px]">●</span><span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        )}

        {projects && projects.length > 0 && (
          <Section title="Projects">
            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="text-[13px] font-semibold text-slate-900">{p.name}</span>
                      <span className="text-[10.5px] text-teal-500 ml-2">{p.techStack}</span>
                    </div>
                    {(p.startDate || p.endDate) && <span className="text-[10.5px] text-slate-400 whitespace-nowrap ml-4 tabular-nums">{p.startDate}{p.endDate ? ` – ${p.endDate}` : ""}</span>}
                  </div>
                  {p.link && <p className="text-[10.5px] text-teal-500 mt-0.5">{p.link}</p>}
                  <p className="text-[11.5px] text-slate-600 leading-[1.6] mt-0.5">{p.description}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {researchProjects && researchProjects.length > 0 && (
          <Section title="Research">
            <div className="space-y-3">
              {researchProjects.map((r) => (
                <div key={r.id}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="text-[13px] font-semibold text-slate-900">{r.title}</span>
                      <span className="text-[11.5px] text-teal-600 ml-2">· {r.role}, {r.institution}</span>
                    </div>
                    {(r.startDate || r.endDate) && <span className="text-[10.5px] text-slate-400 whitespace-nowrap ml-4 tabular-nums">{r.startDate}{r.endDate ? ` – ${r.endDate}` : ""}</span>}
                  </div>
                  <p className="text-[11.5px] text-slate-600 leading-[1.6] mt-0.5">{r.description}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {publications && publications.length > 0 && (
          <Section title="Publications">
            <div className="space-y-2">
              {publications.map((pub) => (
                <div key={pub.id}>
                  <p className="text-[11.5px] font-medium text-slate-800">"{pub.title}"</p>
                  <p className="text-[11px] text-slate-500">{pub.authors} — <em>{pub.venue}</em>, {pub.year}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {presentations && presentations.length > 0 && (
          <Section title="Presentations">
            <div className="space-y-2">
              {presentations.map((p) => (
                <div key={p.id} className="flex justify-between items-baseline">
                  <div>
                    <span className="text-[11.5px] font-medium text-slate-800">{p.title}</span>
                    <span className="text-[11px] text-slate-500 ml-2">· {p.event} <span className="capitalize text-teal-500">({p.type})</span></span>
                  </div>
                  <span className="text-[10.5px] text-slate-400 ml-4 whitespace-nowrap tabular-nums">{p.date}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {education.length > 0 && (
          <Section title="Education">
            <div className="space-y-2">
              {education.map((e) => (
                <div key={e.id} className="flex justify-between items-baseline">
                  <div>
                    <span className="text-[13px] font-semibold text-slate-900">{e.school}</span>
                    <span className="text-[11.5px] text-slate-500 ml-2">· {e.degree} in {e.field}{e.gpa ? ` · GPA ${e.gpa}` : ""}</span>
                  </div>
                  {(e.startDate || e.endDate) && <span className="text-[10.5px] text-slate-400 whitespace-nowrap ml-4 tabular-nums">{e.startDate}{e.endDate ? ` – ${e.endDate}` : ""}</span>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {certificates && certificates.length > 0 && (
          <Section title="Certifications">
            <div className="space-y-1.5">
              {certificates.map((c) => (
                <div key={c.id} className="flex justify-between items-baseline">
                  <div>
                    <span className="text-[11.5px] font-medium text-slate-800">{c.name}</span>
                    <span className="text-[11px] text-slate-500 ml-2">· {c.issuer}</span>
                  </div>
                  <span className="text-[10.5px] text-slate-400 ml-4 whitespace-nowrap tabular-nums">{c.date}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {extraActivities && extraActivities.length > 0 && (
          <Section title="Activities">
            <div className="space-y-2">
              {extraActivities.map((a) => (
                <div key={a.id}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="text-[11.5px] font-medium text-slate-800">{a.name}</span>
                      {(a.role || a.organization) && <span className="text-[11px] text-slate-500 ml-2">· {[a.role, a.organization].filter(Boolean).join(", ")}</span>}
                    </div>
                    {(a.startDate || a.endDate) && <span className="text-[10.5px] text-slate-400 ml-4 whitespace-nowrap tabular-nums">{a.startDate}{a.endDate ? ` – ${a.endDate}` : ""}</span>}
                  </div>
                  {a.description && <p className="text-[11px] text-slate-500 mt-0.5">{a.description}</p>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {skills.length > 0 && (
          <Section title="Skills">
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span key={s} className="text-[11px] font-medium text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-0.5 rounded">{s}</span>
              ))}
            </div>
          </Section>
        )}

        {personalInfo.languages && (
          <Section title="Languages">
            <p className="text-[11.5px] text-slate-600">{personalInfo.languages}</p>
          </Section>
        )}

        {personalInfo.hobbies && (
          <Section title="Hobbies & Interests">
            <p className="text-[11.5px] text-slate-600">{personalInfo.hobbies}</p>
          </Section>
        )}
      </div>
    </div>
  );
}
