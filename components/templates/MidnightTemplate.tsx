import { GeneratedResume } from "../../types/resume";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

interface Props { resume: GeneratedResume; }

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-5">
    <div className="mb-2.5 flex items-center gap-2">
      <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-200">{title}</h2>
      <div className="h-px flex-1 bg-indigo-400/30" />
    </div>
    {children}
  </section>
);

export default function MidnightTemplate({ resume }: Props) {
  const { personalInfo, summary, workExperience, education, skills, projects, researchProjects, presentations, publications, certificates, extraActivities } = resume;

  return (
    <div className="bg-slate-950 text-slate-100" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-cyan-900 px-8 py-7 text-white">
        <h1 className="text-[28px] font-black tracking-tight">{personalInfo.fullName}</h1>
        <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-cyan-200">{personalInfo.jobTitle}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-100">
          <span className="inline-flex items-center gap-1.5"><Mail className="h-3 w-3" />{personalInfo.email}</span>
          <span className="inline-flex items-center gap-1.5"><Phone className="h-3 w-3" />{personalInfo.phone}</span>
          <span className="inline-flex items-center gap-1.5"><MapPin className="h-3 w-3" />{personalInfo.location}</span>
          {personalInfo.linkedin && <span className="inline-flex items-center gap-1.5"><Linkedin className="h-3 w-3" />{personalInfo.linkedin}</span>}
          {personalInfo.website && <span className="inline-flex items-center gap-1.5"><Globe className="h-3 w-3" />{personalInfo.website}</span>}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_220px] gap-0">
        <main className="px-8 py-7">
          <Section title="Summary">
            <p className="text-[11.5px] leading-[1.7] text-slate-300">{summary}</p>
          </Section>

          {workExperience.length > 0 && (
            <Section title="Experience">
              <div className="space-y-4">
                {workExperience.map((job) => (
                  <div key={job.id}>
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[13px] font-semibold text-white">{job.title}</span>
                        <span className="ml-2 text-[11.5px] text-cyan-300">- {job.company}</span>
                      </div>
                      <span className="ml-4 whitespace-nowrap text-[10.5px] tabular-nums text-slate-400">{job.startDate} - {job.endDate || "Present"}</span>
                    </div>
                    <ul className="mt-1.5 space-y-1">
                      {job.bullets.map((b, i) => (
                        <li key={i} className="flex gap-2 text-[11.5px] leading-[1.6] text-slate-300">
                          <span className="mt-[2px] shrink-0 text-cyan-300">▸</span><span>{b}</span>
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
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[13px] font-semibold text-white">{p.name}</span>
                        <span className="ml-2 text-[10.5px] text-slate-400">{p.techStack}</span>
                      </div>
                      {(p.startDate || p.endDate) && <span className="ml-4 whitespace-nowrap text-[10.5px] tabular-nums text-slate-500">{p.startDate}{p.endDate ? ` - ${p.endDate}` : ""}</span>}
                    </div>
                    {p.link && <p className="mt-0.5 text-[10.5px] text-cyan-300">{p.link}</p>}
                    <p className="mt-0.5 text-[11.5px] leading-[1.6] text-slate-300">{p.description}</p>
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
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[13px] font-semibold text-white">{r.title}</span>
                        <span className="ml-2 text-[11.5px] text-cyan-300">- {r.role}, {r.institution}</span>
                      </div>
                      {(r.startDate || r.endDate) && <span className="ml-4 whitespace-nowrap text-[10.5px] tabular-nums text-slate-500">{r.startDate}{r.endDate ? ` - ${r.endDate}` : ""}</span>}
                    </div>
                    <p className="mt-0.5 text-[11.5px] leading-[1.6] text-slate-300">{r.description}</p>
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
                    <p className="text-[11.5px] font-medium text-slate-100">&quot;{pub.title}&quot;</p>
                    <p className="text-[11px] text-slate-400">{pub.authors} - <em>{pub.venue}</em>, {pub.year}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {presentations && presentations.length > 0 && (
            <Section title="Presentations">
              <div className="space-y-2">
                {presentations.map((p) => (
                  <div key={p.id} className="flex items-baseline justify-between gap-3">
                    <div>
                      <span className="text-[11.5px] font-medium text-slate-100">{p.title}</span>
                      <span className="ml-2 text-[11px] text-slate-400">- {p.event}</span>
                    </div>
                    <span className="whitespace-nowrap text-[10.5px] tabular-nums text-slate-500">{p.date}</span>
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
                    <div className="flex items-baseline justify-between gap-3">
                      <div>
                        <span className="text-[11.5px] font-medium text-slate-100">{a.name}</span>
                        {(a.role || a.organization) && <span className="ml-2 text-[11px] text-slate-400">- {[a.role, a.organization].filter(Boolean).join(", ")}</span>}
                      </div>
                      {(a.startDate || a.endDate) && <span className="whitespace-nowrap text-[10.5px] tabular-nums text-slate-500">{a.startDate}{a.endDate ? ` - ${a.endDate}` : ""}</span>}
                    </div>
                    {a.description && <p className="mt-0.5 text-[11px] text-slate-400">{a.description}</p>}
                  </div>
                ))}
              </div>
            </Section>
          )}
        </main>

        <aside className="border-l border-slate-800 bg-slate-900/90 px-5 py-7">
          {skills.length > 0 && (
            <Section title="Skills">
              <div className="flex flex-wrap gap-1">
                {skills.map((s) => (
                  <span key={s} className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[9.5px] text-slate-200">{s}</span>
                ))}
              </div>
            </Section>
          )}

          {education.length > 0 && (
            <Section title="Education">
              <div className="space-y-3">
                {education.map((e) => (
                  <div key={e.id}>
                    <p className="text-[10.5px] font-semibold leading-snug text-white">{e.school}</p>
                    <p className="mt-0.5 text-[9.5px] text-slate-300">{e.degree} in {e.field}</p>
                    {e.gpa && <p className="text-[9.5px] text-slate-400">GPA {e.gpa}</p>}
                    {(e.startDate || e.endDate) && <p className="text-[9.5px] tabular-nums text-slate-400">{e.startDate}{e.endDate ? ` - ${e.endDate}` : ""}</p>}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {certificates && certificates.length > 0 && (
            <Section title="Certifications">
              <div className="space-y-2">
                {certificates.map((c) => (
                  <div key={c.id}>
                    <p className="text-[10px] font-semibold leading-snug text-white">{c.name}</p>
                    <p className="text-[9.5px] text-slate-300">{c.issuer} - {c.date}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {personalInfo.languages && (
            <Section title="Languages">
              <p className="text-[10px] leading-[1.7] text-slate-200">{personalInfo.languages}</p>
            </Section>
          )}

          {personalInfo.hobbies && (
            <Section title="Hobbies">
              <p className="text-[10px] leading-[1.7] text-slate-200">{personalInfo.hobbies}</p>
            </Section>
          )}
        </aside>
      </div>
    </div>
  );
}
