import { GeneratedResume } from "../../types/resume";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

interface Props { resume: GeneratedResume; }

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-5">
    <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-rose-700 mb-2">{title}</h2>
    <div className="h-px bg-rose-200 mb-2.5" />
    {children}
  </section>
);

export default function StudioTemplate({ resume }: Props) {
  const { personalInfo, summary, workExperience, education, skills, projects, researchProjects, presentations, publications, certificates, extraActivities } = resume;

  return (
    <div className="bg-rose-50 text-slate-800" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="px-9 pt-8 pb-6 bg-white border-b border-rose-200">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-black tracking-tight text-slate-900 leading-tight">{personalInfo.fullName}</h1>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-rose-700 mt-1">{personalInfo.jobTitle}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] text-slate-500">
            <span className="flex items-center gap-1"><Mail className="w-2.5 h-2.5 text-rose-600" />{personalInfo.email}</span>
            <span className="flex items-center gap-1"><Phone className="w-2.5 h-2.5 text-rose-600" />{personalInfo.phone}</span>
            <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5 text-rose-600" />{personalInfo.location}</span>
            {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-2.5 h-2.5 text-rose-600" />{personalInfo.linkedin}</span>}
            {personalInfo.website && <span className="flex items-center gap-1 col-span-2"><Globe className="w-2.5 h-2.5 text-rose-600" />{personalInfo.website}</span>}
          </div>
        </div>
      </div>

      <div className="px-9 pt-6 pb-8 bg-white m-5 mt-0 rounded-b-2xl shadow-sm border border-rose-100">
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
                      <span className="text-[11.5px] text-rose-700 ml-2">- {job.company}</span>
                    </div>
                    <span className="text-[10.5px] text-slate-400 whitespace-nowrap tabular-nums">{job.startDate} - {job.endDate || "Present"}</span>
                  </div>
                  <ul className="mt-1.5 space-y-1">
                    {job.bullets.map((b, i) => (
                      <li key={i} className="text-[11.5px] text-slate-600 leading-[1.6] flex gap-2">
                        <span className="text-rose-500 mt-[3px] text-[8px] shrink-0">●</span><span>{b}</span>
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
                  {p.link && <p className="text-[10.5px] text-rose-700 mt-0.5">{p.link}</p>}
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
                      <span className="text-[11.5px] text-rose-700 ml-2">- {r.role}, {r.institution}</span>
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

        {presentations && presentations.length > 0 && (
          <Section title="Presentations">
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
          </Section>
        )}

        <div className="grid grid-cols-2 gap-6">
          {education.length > 0 && (
            <Section title="Education">
              <div className="space-y-2">
                {education.map((e) => (
                  <div key={e.id}>
                    <p className="text-[11px] font-semibold text-slate-900">{e.school}</p>
                    <p className="text-[10.5px] text-slate-600">{e.degree} in {e.field}</p>
                    {(e.startDate || e.endDate) && <p className="text-[10px] text-slate-400">{e.startDate}{e.endDate ? ` - ${e.endDate}` : ""}</p>}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {skills.length > 0 && (
            <Section title="Skills">
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span key={s} className="text-[10px] font-medium text-rose-800 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded">{s}</span>
                ))}
              </div>
            </Section>
          )}
        </div>

        {certificates && certificates.length > 0 && (
          <Section title="Certifications">
            <div className="space-y-1.5">
              {certificates.map((c) => (
                <div key={c.id} className="flex justify-between items-baseline gap-3">
                  <p className="text-[11px] font-medium text-slate-800">{c.name} - <span className="text-slate-500 font-normal">{c.issuer}</span></p>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">{c.date}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {extraActivities && extraActivities.length > 0 && (
          <Section title="Activities">
            <div className="space-y-1.5">
              {extraActivities.map((a) => (
                <div key={a.id} className="text-[11px] text-slate-600">
                  <span className="font-medium text-slate-800">{a.name}</span>
                  {(a.role || a.organization) && <span className="ml-2">- {[a.role, a.organization].filter(Boolean).join(", ")}</span>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {(personalInfo.languages || personalInfo.hobbies) && (
          <div className="grid grid-cols-2 gap-6">
            {personalInfo.languages && (
              <Section title="Languages">
                <p className="text-[11px] text-slate-600">{personalInfo.languages}</p>
              </Section>
            )}
            {personalInfo.hobbies && (
              <Section title="Hobbies">
                <p className="text-[11px] text-slate-600">{personalInfo.hobbies}</p>
              </Section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
