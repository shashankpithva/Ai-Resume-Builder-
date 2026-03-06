import { GeneratedResume } from "../../types/resume";

interface Props { resume: GeneratedResume; }

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-5">
    <h2 className="text-[9.5px] font-bold tracking-[0.22em] uppercase text-stone-400 mb-2 pb-1.5 border-b border-stone-200">{title}</h2>
    {children}
  </section>
);

export default function MinimalTemplate({ resume }: Props) {
  const { personalInfo, summary, workExperience, education, skills, projects, researchProjects, presentations, publications, certificates, extraActivities } = resume;
  return (
    <div className="bg-white text-stone-800" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>

      {/* Header — centered, elegant */}
      <div className="text-center px-10 pt-10 pb-7 border-b border-stone-200">
        <h1 className="text-[28px] font-bold tracking-tight text-stone-900 leading-tight">{personalInfo.fullName}</h1>
        <p className="text-[11.5px] font-semibold text-stone-500 mt-1.5 tracking-[0.1em] uppercase" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>{personalInfo.jobTitle}</p>
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 mt-3 text-[10.5px] text-stone-400" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
          <span>{personalInfo.email}</span>
          <span className="text-stone-300">·</span>
          <span>{personalInfo.phone}</span>
          <span className="text-stone-300">·</span>
          <span>{personalInfo.location}</span>
          {personalInfo.linkedin && <><span className="text-stone-300">·</span><span>{personalInfo.linkedin}</span></>}
          {personalInfo.website && <><span className="text-stone-300">·</span><span>{personalInfo.website}</span></>}
        </div>
      </div>

      <div className="px-10 pt-6 pb-8">
        <Section title="Profile">
          <p className="text-[11.5px] text-stone-600 leading-[1.75]">{summary}</p>
        </Section>

        {workExperience.length > 0 && (
          <Section title="Experience">
            <div className="space-y-4">
              {workExperience.map((job) => (
                <div key={job.id}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="text-[13px] font-bold text-stone-900">{job.title}</span>
                      <span className="text-[11.5px] text-stone-500 ml-2 italic">{job.company}</span>
                    </div>
                    <span className="text-[10.5px] text-stone-400 whitespace-nowrap ml-4 tabular-nums" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>{job.startDate} – {job.endDate || "Present"}</span>
                  </div>
                  <ul className="mt-1.5 space-y-1">
                    {job.bullets.map((b, i) => (
                      <li key={i} className="text-[11.5px] text-stone-600 leading-[1.65] flex gap-2.5">
                        <span className="shrink-0 mt-[2px] text-stone-400">–</span><span>{b}</span>
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
                      <span className="text-[13px] font-bold text-stone-900">{p.name}</span>
                      <span className="text-[11px] text-stone-400 italic ml-2">{p.techStack}</span>
                    </div>
                    {(p.startDate || p.endDate) && <span className="text-[10.5px] text-stone-400 whitespace-nowrap ml-4 tabular-nums" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>{p.startDate}{p.endDate ? ` – ${p.endDate}` : ""}</span>}
                  </div>
                  {p.link && <p className="text-[10.5px] text-stone-400 mt-0.5" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>{p.link}</p>}
                  <p className="text-[11.5px] text-stone-600 leading-[1.65] mt-0.5">{p.description}</p>
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
                      <span className="text-[13px] font-bold text-stone-900">{r.title}</span>
                      <span className="text-[11.5px] text-stone-500 italic ml-2">{r.role}, {r.institution}</span>
                    </div>
                    {(r.startDate || r.endDate) && <span className="text-[10.5px] text-stone-400 whitespace-nowrap ml-4 tabular-nums" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>{r.startDate}{r.endDate ? ` – ${r.endDate}` : ""}</span>}
                  </div>
                  <p className="text-[11.5px] text-stone-600 leading-[1.65] mt-0.5">{r.description}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {publications && publications.length > 0 && (
          <Section title="Publications">
            <div className="space-y-2">
              {publications.map((pub) => (
                <p key={pub.id} className="text-[11.5px] text-stone-600 leading-[1.65]">
                  <span className="font-medium text-stone-800">{pub.authors}</span> "{pub.title}." <em>{pub.venue}</em>, {pub.year}.{pub.doi && <span className="text-stone-400 ml-1" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>{pub.doi}</span>}
                </p>
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
                    <span className="text-[11.5px] font-medium text-stone-800">"{p.title}"</span>
                    <span className="text-[11px] text-stone-400 ml-2">{p.event} <span className="italic capitalize">({p.type})</span></span>
                  </div>
                  <span className="text-[10.5px] text-stone-400 ml-4 whitespace-nowrap tabular-nums" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>{p.date}</span>
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
                    <span className="text-[13px] font-bold text-stone-900">{e.school}</span>
                    <span className="text-[11.5px] text-stone-500 italic ml-2">{e.degree} in {e.field}{e.gpa ? ` · GPA ${e.gpa}` : ""}</span>
                  </div>
                  {(e.startDate || e.endDate) && <span className="text-[10.5px] text-stone-400 whitespace-nowrap ml-4 tabular-nums" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>{e.startDate}{e.endDate ? ` – ${e.endDate}` : ""}</span>}
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
                  <span className="text-[11.5px] font-medium text-stone-800">{c.name} <span className="font-normal italic text-stone-500">— {c.issuer}</span></span>
                  <span className="text-[10.5px] text-stone-400 ml-4 whitespace-nowrap tabular-nums" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>{c.date}</span>
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
                    <span className="text-[11.5px] font-medium text-stone-800">{a.name}{(a.role || a.organization) && <span className="font-normal italic text-stone-500 ml-1.5">— {[a.role, a.organization].filter(Boolean).join(", ")}</span>}</span>
                    {(a.startDate || a.endDate) && <span className="text-[10.5px] text-stone-400 ml-4 whitespace-nowrap tabular-nums" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>{a.startDate}{a.endDate ? ` – ${a.endDate}` : ""}</span>}
                  </div>
                  {a.description && <p className="text-[11px] text-stone-500 mt-0.5">{a.description}</p>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {skills.length > 0 && (
          <Section title="Skills">
            <p className="text-[11.5px] text-stone-600 leading-[1.8]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
              {skills.join("  ·  ")}
            </p>
          </Section>
        )}

        {personalInfo.languages && (
          <Section title="Languages">
            <p className="text-[11.5px] text-stone-600">{personalInfo.languages}</p>
          </Section>
        )}

        {personalInfo.hobbies && (
          <Section title="Hobbies & Interests">
            <p className="text-[11.5px] text-stone-600">{personalInfo.hobbies}</p>
          </Section>
        )}
      </div>
    </div>
  );
}
