import { GeneratedResume } from "../../types/resume";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

interface Props { resume: GeneratedResume; }

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-5">
    <div className="flex items-center gap-2 mb-2.5">
      <div className="w-4 h-4 border-2 border-cyan-500 rounded-sm rotate-45" />
      <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-700">{title}</h2>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
    {children}
  </section>
);

export default function NeoGridTemplate({ resume }: Props) {
  const { personalInfo, summary, workExperience, education, skills, projects, researchProjects, presentations, publications, certificates, extraActivities } = resume;

  return (
    <div className="bg-white text-slate-800" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="px-9 pt-8 pb-6 border-b-4 border-cyan-500" style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #f8fafc 55%, #ecfeff 100%)" }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[27px] font-black tracking-tight text-slate-900 leading-tight">{personalInfo.fullName}</h1>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-cyan-700 mt-1">{personalInfo.jobTitle}</p>
          </div>
          <div className="text-right text-[10.5px] text-slate-500 leading-relaxed">
            <div className="flex items-center gap-1.5 justify-end"><Mail className="w-3 h-3 text-cyan-600" />{personalInfo.email}</div>
            <div className="flex items-center gap-1.5 justify-end"><Phone className="w-3 h-3 text-cyan-600" />{personalInfo.phone}</div>
            <div className="flex items-center gap-1.5 justify-end"><MapPin className="w-3 h-3 text-cyan-600" />{personalInfo.location}</div>
            {personalInfo.linkedin && <div className="flex items-center gap-1.5 justify-end"><Linkedin className="w-3 h-3 text-cyan-600" />{personalInfo.linkedin}</div>}
            {personalInfo.website && <div className="flex items-center gap-1.5 justify-end"><Globe className="w-3 h-3 text-cyan-600" />{personalInfo.website}</div>}
          </div>
        </div>
      </div>

      <div className="px-9 pt-6 pb-8 grid grid-cols-3 gap-6">
        <main className="col-span-2">
          <Section title="Summary">
            <p className="text-[11.5px] text-slate-600 leading-[1.7]">{summary}</p>
          </Section>

          {workExperience.length > 0 && (
            <Section title="Experience">
              <div className="space-y-4">
                {workExperience.map((job) => (
                  <div key={job.id}>
                    <div className="flex justify-between items-baseline gap-3">
                      <div>
                        <span className="text-[13px] font-semibold text-slate-900">{job.title}</span>
                        <span className="text-[11.5px] text-cyan-700 ml-2">- {job.company}</span>
                      </div>
                      <span className="text-[10.5px] text-slate-400 whitespace-nowrap tabular-nums">{job.startDate} - {job.endDate || "Present"}</span>
                    </div>
                    <ul className="mt-1.5 space-y-1">
                      {job.bullets.map((b, i) => (
                        <li key={i} className="text-[11.5px] text-slate-600 leading-[1.6] flex gap-2">
                          <span className="text-cyan-500 mt-[3px] text-[8px] shrink-0">●</span><span>{b}</span>
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
                    <div className="flex justify-between items-baseline gap-3">
                      <div>
                        <span className="text-[13px] font-semibold text-slate-900">{p.name}</span>
                        <span className="text-[10.5px] text-slate-500 ml-2">{p.techStack}</span>
                      </div>
                      {(p.startDate || p.endDate) && <span className="text-[10.5px] text-slate-400 whitespace-nowrap tabular-nums">{p.startDate}{p.endDate ? ` - ${p.endDate}` : ""}</span>}
                    </div>
                    {p.link && <p className="text-[10.5px] text-cyan-700 mt-0.5">{p.link}</p>}
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
                    <div className="flex justify-between items-baseline gap-3">
                      <div>
                        <span className="text-[13px] font-semibold text-slate-900">{r.title}</span>
                        <span className="text-[11.5px] text-cyan-700 ml-2">- {r.role}, {r.institution}</span>
                      </div>
                      {(r.startDate || r.endDate) && <span className="text-[10.5px] text-slate-400 whitespace-nowrap tabular-nums">{r.startDate}{r.endDate ? ` - ${r.endDate}` : ""}</span>}
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
                    <p className="text-[11.5px] font-medium text-slate-800">&quot;{pub.title}&quot;</p>
                    <p className="text-[11px] text-slate-500">{pub.authors} - <em>{pub.venue}</em>, {pub.year}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </main>

        <aside className="col-span-1">
          {education.length > 0 && (
            <Section title="Education">
              <div className="space-y-2.5">
                {education.map((e) => (
                  <div key={e.id} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5">
                    <p className="text-[10.5px] font-semibold text-slate-900 leading-snug">{e.school}</p>
                    <p className="text-[9.8px] text-slate-600 mt-0.5">{e.degree} in {e.field}</p>
                    {e.gpa && <p className="text-[9.8px] text-slate-500">GPA {e.gpa}</p>}
                    {(e.startDate || e.endDate) && <p className="text-[9.8px] text-slate-400 tabular-nums">{e.startDate}{e.endDate ? ` - ${e.endDate}` : ""}</p>}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {skills.length > 0 && (
            <Section title="Skills">
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span key={s} className="text-[10px] font-medium text-cyan-800 bg-cyan-50 border border-cyan-100 px-2 py-0.5 rounded">{s}</span>
                ))}
              </div>
            </Section>
          )}

          {certificates && certificates.length > 0 && (
            <Section title="Certifications">
              <div className="space-y-2">
                {certificates.map((c) => (
                  <div key={c.id} className="text-[10px] text-slate-600 leading-snug">
                    <p className="font-semibold text-slate-800">{c.name}</p>
                    <p>{c.issuer} - {c.date}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {presentations && presentations.length > 0 && (
            <Section title="Presentations">
              <div className="space-y-2">
                {presentations.map((p) => (
                  <div key={p.id} className="text-[10.5px] text-slate-600 leading-snug">
                    <p className="font-medium text-slate-800">{p.title}</p>
                    <p>{p.event} - {p.date}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {extraActivities && extraActivities.length > 0 && (
            <Section title="Activities">
              <div className="space-y-2">
                {extraActivities.map((a) => (
                  <div key={a.id} className="text-[10.5px] text-slate-600 leading-snug">
                    <p className="font-medium text-slate-800">{a.name}</p>
                    {(a.role || a.organization) && <p>{[a.role, a.organization].filter(Boolean).join(", ")}</p>}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {personalInfo.languages && (
            <Section title="Languages">
              <p className="text-[10.5px] text-slate-600">{personalInfo.languages}</p>
            </Section>
          )}

          {personalInfo.hobbies && (
            <Section title="Hobbies">
              <p className="text-[10.5px] text-slate-600">{personalInfo.hobbies}</p>
            </Section>
          )}
        </aside>
      </div>
    </div>
  );
}
