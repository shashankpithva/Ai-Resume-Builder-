import { GeneratedResume } from "../../types/resume";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

interface Props { resume: GeneratedResume; }

const MainSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-5">
    <div className="flex items-center gap-2 mb-2.5">
      <div className="w-1.5 h-5 rounded bg-amber-500" />
      <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-600">{title}</h2>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
    {children}
  </section>
);

const SideSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-5">
    <h2 className="text-[9.5px] font-bold tracking-[0.18em] uppercase text-amber-300 mb-2">{title}</h2>
    {children}
  </section>
);

export default function GraphiteTemplate({ resume }: Props) {
  const { personalInfo, summary, workExperience, education, skills, projects, researchProjects, presentations, publications, certificates, extraActivities } = resume;

  return (
    <div className="bg-white text-slate-800 flex" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="flex-1 px-8 py-8">
        <h1 className="text-[26px] font-black tracking-tight text-slate-900 leading-tight">{personalInfo.fullName}</h1>
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-amber-600 mt-1">{personalInfo.jobTitle}</p>

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
                      <span className="text-[11.5px] text-amber-600 ml-2">- {job.company}</span>
                    </div>
                    <span className="text-[10.5px] text-slate-400 ml-4 whitespace-nowrap tabular-nums">{job.startDate} - {job.endDate || "Present"}</span>
                  </div>
                  <ul className="mt-1.5 space-y-1">
                    {job.bullets.map((b, i) => (
                      <li key={i} className="text-[11.5px] text-slate-600 leading-[1.6] flex gap-2">
                        <span className="text-amber-500 mt-[3px] text-[8px] shrink-0">●</span><span>{b}</span>
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
                      <span className="text-[10.5px] text-slate-500 ml-2">{p.techStack}</span>
                    </div>
                    {(p.startDate || p.endDate) && <span className="text-[10.5px] text-slate-400 ml-4 whitespace-nowrap tabular-nums">{p.startDate}{p.endDate ? ` - ${p.endDate}` : ""}</span>}
                  </div>
                  {p.link && <p className="text-[10.5px] text-amber-700 mt-0.5">{p.link}</p>}
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
                      <span className="text-[11.5px] text-amber-600 ml-2">- {r.role}, {r.institution}</span>
                    </div>
                    {(r.startDate || r.endDate) && <span className="text-[10.5px] text-slate-400 ml-4 whitespace-nowrap tabular-nums">{r.startDate}{r.endDate ? ` - ${r.endDate}` : ""}</span>}
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
                  <p className="text-[11.5px] font-medium text-slate-800">&quot;{pub.title}&quot;</p>
                  <p className="text-[11px] text-slate-500">{pub.authors} - <em>{pub.venue}</em>, {pub.year}</p>
                </div>
              ))}
            </div>
          </MainSection>
        )}

        {presentations && presentations.length > 0 && (
          <MainSection title="Presentations">
            <div className="space-y-2">
              {presentations.map((p) => (
                <div key={p.id} className="flex justify-between items-baseline gap-3">
                  <div>
                    <span className="text-[11.5px] font-medium text-slate-800">{p.title}</span>
                    <span className="text-[11px] text-slate-500 ml-2">- {p.event}</span>
                  </div>
                  <span className="text-[10.5px] text-slate-400 whitespace-nowrap tabular-nums">{p.date}</span>
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
                  <div className="flex justify-between items-baseline gap-3">
                    <div>
                      <span className="text-[11.5px] font-medium text-slate-800">{a.name}</span>
                      {(a.role || a.organization) && <span className="text-[11px] text-slate-500 ml-2">- {[a.role, a.organization].filter(Boolean).join(", ")}</span>}
                    </div>
                    {(a.startDate || a.endDate) && <span className="text-[10.5px] text-slate-400 whitespace-nowrap tabular-nums">{a.startDate}{a.endDate ? ` - ${a.endDate}` : ""}</span>}
                  </div>
                  {a.description && <p className="text-[11px] text-slate-500 mt-0.5">{a.description}</p>}
                </div>
              ))}
            </div>
          </MainSection>
        )}
      </div>

      <aside className="w-[215px] shrink-0 bg-slate-800 text-slate-100 px-5 py-8 border-l border-slate-700">
        <SideSection title="Contact">
          <div className="space-y-2">
            {[
              { icon: Mail, value: personalInfo.email },
              { icon: Phone, value: personalInfo.phone },
              { icon: MapPin, value: personalInfo.location },
              ...(personalInfo.linkedin ? [{ icon: Linkedin, value: personalInfo.linkedin }] : []),
              ...(personalInfo.website ? [{ icon: Globe, value: personalInfo.website }] : []),
            ].map(({ icon: Icon, value }) => (
              <div key={value} className="flex items-start gap-2">
                <Icon className="w-2.5 h-2.5 mt-0.5 shrink-0 text-amber-300" />
                <span className="text-[10px] text-slate-200 leading-tight break-all">{value}</span>
              </div>
            ))}
          </div>
        </SideSection>

        {skills.length > 0 && (
          <SideSection title="Skills">
            <div className="flex flex-wrap gap-1">
              {skills.map((s) => (
                <span key={s} className="text-[9.5px] bg-slate-700 border border-slate-600 text-slate-100 px-1.5 py-0.5 rounded">{s}</span>
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
                  <p className="text-[9.5px] text-slate-300 mt-0.5">{e.degree} in {e.field}</p>
                  {e.gpa && <p className="text-[9.5px] text-slate-400">GPA {e.gpa}</p>}
                  {(e.startDate || e.endDate) && <p className="text-[9.5px] text-slate-400 tabular-nums">{e.startDate}{e.endDate ? ` - ${e.endDate}` : ""}</p>}
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
                  <p className="text-[9.5px] text-slate-300">{c.issuer} - {c.date}</p>
                </div>
              ))}
            </div>
          </SideSection>
        )}

        {personalInfo.languages && (
          <SideSection title="Languages">
            <p className="text-[10px] text-slate-200 leading-[1.7]">{personalInfo.languages}</p>
          </SideSection>
        )}

        {personalInfo.hobbies && (
          <SideSection title="Hobbies">
            <p className="text-[10px] text-slate-200 leading-[1.7]">{personalInfo.hobbies}</p>
          </SideSection>
        )}
      </aside>
    </div>
  );
}

