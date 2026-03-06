import { GeneratedResume } from "../../types/resume";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

interface Props { resume: GeneratedResume; }

const SideSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-5">
    <h2 className="text-[9.5px] font-bold tracking-[0.2em] uppercase text-emerald-400 mb-2.5 border-b border-slate-700 pb-1">{title}</h2>
    {children}
  </div>
);

const MainSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-5">
    <div className="flex items-center gap-3 mb-2.5">
      <h2 className="text-[10px] font-bold tracking-[0.18em] uppercase text-slate-500 whitespace-nowrap">{title}</h2>
      <div className="flex-1 h-[1.5px] bg-emerald-400/40" />
    </div>
    {children}
  </section>
);

export default function ModernTemplate({ resume }: Props) {
  const { personalInfo, summary, workExperience, education, skills, projects, researchProjects, presentations, publications, certificates, extraActivities } = resume;
  return (
    <div className="bg-white font-sans flex min-h-full" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Sidebar */}
      <div className="w-[200px] shrink-0 bg-slate-900 text-white px-5 py-8">
        <div className="mb-7">
          <h1 className="text-[15px] font-bold leading-tight text-white">{personalInfo.fullName}</h1>
          <p className="text-[10px] font-semibold text-emerald-400 mt-1.5 uppercase tracking-widest leading-tight">{personalInfo.jobTitle}</p>
        </div>

        <SideSection title="Contact">
          <div className="space-y-2">
            {[
              { icon: Mail, val: personalInfo.email },
              { icon: Phone, val: personalInfo.phone },
              { icon: MapPin, val: personalInfo.location },
              ...(personalInfo.linkedin ? [{ icon: Linkedin, val: personalInfo.linkedin }] : []),
              ...(personalInfo.website ? [{ icon: Globe, val: personalInfo.website }] : []),
            ].map(({ icon: Icon, val }) => (
              <div key={val} className="flex items-start gap-2">
                <Icon className="w-2.5 h-2.5 mt-0.5 shrink-0 text-emerald-400" />
                <span className="text-[10px] text-slate-300 leading-tight break-all">{val}</span>
              </div>
            ))}
          </div>
        </SideSection>

        {skills.length > 0 && (
          <SideSection title="Skills">
            <div className="flex flex-wrap gap-1">
              {skills.map((s) => (
                <span key={s} className="text-[9.5px] text-slate-300 bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded">{s}</span>
              ))}
            </div>
          </SideSection>
        )}

        {education.length > 0 && (
          <SideSection title="Education">
            <div className="space-y-3">
              {education.map((e) => (
                <div key={e.id}>
                  <p className="text-[10.5px] font-semibold text-white leading-snug">{e.school}</p>
                  <p className="text-[9.5px] text-slate-400 mt-0.5">{e.degree} in {e.field}</p>
                  {e.gpa && <p className="text-[9.5px] text-slate-500">GPA {e.gpa}</p>}
                  {(e.startDate || e.endDate) && <p className="text-[9.5px] text-slate-500 tabular-nums">{e.startDate}{e.endDate ? ` – ${e.endDate}` : ""}</p>}
                </div>
              ))}
            </div>
          </SideSection>
        )}

        {certificates && certificates.length > 0 && (
          <SideSection title="Certifications">
            <div className="space-y-2">
              {certificates.map((c) => (
                <div key={c.id}>
                  <p className="text-[10px] font-semibold text-white leading-snug">{c.name}</p>
                  <p className="text-[9.5px] text-slate-400">{c.issuer} · {c.date}</p>
                </div>
              ))}
            </div>
          </SideSection>
        )}

        {personalInfo.languages && (
          <SideSection title="Languages">
            <p className="text-[10px] text-slate-300 leading-[1.7]">{personalInfo.languages}</p>
          </SideSection>
        )}

        {personalInfo.hobbies && (
          <SideSection title="Hobbies & Interests">
            <p className="text-[10px] text-slate-300 leading-[1.7]">{personalInfo.hobbies}</p>
          </SideSection>
        )}
      </div>

      {/* Main */}
      <div className="flex-1 px-7 py-8">
        <MainSection title="Summary">
          <p className="text-[11.5px] text-slate-600 leading-[1.7]">{summary}</p>
        </MainSection>

        {workExperience.length > 0 && (
          <MainSection title="Experience">
            <div className="space-y-4">
              {workExperience.map((job) => (
                <div key={job.id}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="text-[13px] font-semibold text-slate-900">{job.title}</span>
                      <span className="text-[11.5px] text-emerald-600 font-medium ml-2">· {job.company}</span>
                    </div>
                    <span className="text-[10.5px] text-slate-400 whitespace-nowrap ml-4 tabular-nums">{job.startDate} – {job.endDate || "Present"}</span>
                  </div>
                  <ul className="mt-1.5 space-y-1">
                    {job.bullets.map((b, i) => (
                      <li key={i} className="text-[11.5px] text-slate-600 leading-[1.6] flex gap-2">
                        <span className="text-emerald-500 shrink-0 font-bold mt-[1px]">▸</span><span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </MainSection>
        )}

        {projects && projects.length > 0 && (
          <MainSection title="Projects">
            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="text-[13px] font-semibold text-slate-900">{p.name}</span>
                      <span className="text-[10.5px] text-slate-400 ml-2">{p.techStack}</span>
                    </div>
                    {(p.startDate || p.endDate) && <span className="text-[10.5px] text-slate-400 whitespace-nowrap ml-4 tabular-nums">{p.startDate}{p.endDate ? ` – ${p.endDate}` : ""}</span>}
                  </div>
                  {p.link && <p className="text-[10.5px] text-emerald-600 mt-0.5">{p.link}</p>}
                  <p className="text-[11.5px] text-slate-600 leading-[1.6] mt-0.5">{p.description}</p>
                </div>
              ))}
            </div>
          </MainSection>
        )}

        {researchProjects && researchProjects.length > 0 && (
          <MainSection title="Research">
            <div className="space-y-3">
              {researchProjects.map((r) => (
                <div key={r.id}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="text-[13px] font-semibold text-slate-900">{r.title}</span>
                      <span className="text-[11.5px] text-emerald-600 ml-2">· {r.role}, {r.institution}</span>
                    </div>
                    {(r.startDate || r.endDate) && <span className="text-[10.5px] text-slate-400 whitespace-nowrap ml-4 tabular-nums">{r.startDate}{r.endDate ? ` – ${r.endDate}` : ""}</span>}
                  </div>
                  <p className="text-[11.5px] text-slate-600 leading-[1.6] mt-0.5">{r.description}</p>
                </div>
              ))}
            </div>
          </MainSection>
        )}

        {publications && publications.length > 0 && (
          <MainSection title="Publications">
            <div className="space-y-2">
              {publications.map((pub) => (
                <div key={pub.id}>
                  <p className="text-[11.5px] font-medium text-slate-800 leading-snug">"{pub.title}"</p>
                  <p className="text-[11px] text-slate-500">{pub.authors} — <em>{pub.venue}</em>, {pub.year}</p>
                </div>
              ))}
            </div>
          </MainSection>
        )}

        {presentations && presentations.length > 0 && (
          <MainSection title="Presentations">
            <div className="space-y-2">
              {presentations.map((p) => (
                <div key={p.id} className="flex justify-between items-baseline">
                  <div>
                    <span className="text-[11.5px] font-medium text-slate-800">{p.title}</span>
                    <span className="text-[11px] text-slate-500 ml-2">· {p.event} <span className="capitalize text-emerald-600">({p.type})</span></span>
                  </div>
                  <span className="text-[10.5px] text-slate-400 ml-4 whitespace-nowrap tabular-nums">{p.date}</span>
                </div>
              ))}
            </div>
          </MainSection>
        )}

        {extraActivities && extraActivities.length > 0 && (
          <MainSection title="Activities">
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
          </MainSection>
        )}
      </div>
    </div>
  );
}
