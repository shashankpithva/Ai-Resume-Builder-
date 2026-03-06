import { NextRequest, NextResponse } from "next/server";
import { ResumeFormData } from "../../../types/resume";

export async function POST(req: NextRequest) {
  try {
    const data: ResumeFormData = await req.json();
    const { personalInfo, workExperience, education, skills, targetRole, additionalContext, projects, researchProjects, presentations, publications, certificates, extraActivities } = data;

    const userPrompt = `Generate a professional resume for the following person targeting: "${targetRole}"

PERSONAL INFO:
Name: ${personalInfo.fullName}
Current Title: ${personalInfo.jobTitle}
Email: ${personalInfo.email}
Phone: ${personalInfo.phone}
Location: ${personalInfo.location}
${personalInfo.linkedin ? `LinkedIn: ${personalInfo.linkedin}` : ""}
${personalInfo.website ? `Website: ${personalInfo.website}` : ""}
${personalInfo.languages ? `Languages: ${personalInfo.languages}` : ""}
${personalInfo.hobbies ? `Hobbies & Interests: ${personalInfo.hobbies}` : ""}

WORK EXPERIENCE:
${workExperience.map((w) => `
Company: ${w.company}
Title: ${w.title}
Dates: ${w.startDate} - ${w.current ? "Present" : w.endDate}
Notes: ${w.description}
`).join("\n---\n")}

EDUCATION:
${education.map((e) => `${e.degree} in ${e.field} from ${e.school} (${e.startDate}-${e.endDate})${e.gpa ? `, GPA: ${e.gpa}` : ""}`).join("\n")}

SKILLS: ${skills}

${projects && projects.length > 0 ? `PROJECTS:
${projects.map((p) => `Name: ${p.name}\nTech: ${p.techStack}\nDates: ${p.startDate || ""}${p.endDate ? ` - ${p.endDate}` : ""}\nLink: ${p.link || "N/A"}\nDescription: ${p.description}`).join("\n---\n")}` : ""}

${researchProjects && researchProjects.length > 0 ? `RESEARCH PROJECTS:
${researchProjects.map((r) => `Title: ${r.title}\nRole: ${r.role} at ${r.institution}\nDates: ${r.startDate || ""}${r.endDate ? ` - ${r.endDate}` : ""}\nDescription: ${r.description}`).join("\n---\n")}` : ""}

${presentations && presentations.length > 0 ? `PRESENTATIONS:
${presentations.map((p) => `Title: ${p.title}\nEvent: ${p.event}\nDate: ${p.date}\nType: ${p.type}${p.description ? `\nDescription: ${p.description}` : ""}`).join("\n---\n")}` : ""}

${publications && publications.length > 0 ? `PUBLICATIONS:
${publications.map((p) => `Title: ${p.title}\nAuthors: ${p.authors}\nVenue: ${p.venue}, ${p.year}${p.doi ? `\nDOI: ${p.doi}` : ""}${p.description ? `\nDescription: ${p.description}` : ""}`).join("\n---\n")}` : ""}

${certificates && certificates.length > 0 ? `CERTIFICATES:
${certificates.map((c) => `${c.name} — ${c.issuer} (${c.date}${c.expiryDate ? ` - ${c.expiryDate}` : ""})`).join("\n")}` : ""}

${extraActivities && extraActivities.length > 0 ? `EXTRACURRICULAR ACTIVITIES:
${extraActivities.map((a) => `${a.name}${a.role ? ` — ${a.role}` : ""}${a.organization ? ` at ${a.organization}` : ""}${a.startDate ? ` (${a.startDate}${a.endDate ? ` - ${a.endDate}` : ""})` : ""}${a.description ? `\n${a.description}` : ""}`).join("\n---\n")}` : ""}

${additionalContext ? `ADDITIONAL CONTEXT: ${additionalContext}` : ""}

Return ONLY this JSON structure, no markdown, no code blocks, no explanation:
{
  "summary": "3-4 sentence compelling professional summary targeting the role",
  "workExperience": [
    {
      "id": "use same id as input or generate one",
      "company": "company name",
      "title": "job title",
      "startDate": "start date",
      "endDate": "end date or Present",
      "bullets": ["Strong action verb + achievement + quantified impact", "3-5 bullets per role"]
    }
  ],
  "skills": ["skill1", "skill2"],
  "education": ${JSON.stringify(education)},
  "projects": ${JSON.stringify(projects || [])},
  "researchProjects": ${JSON.stringify(researchProjects || [])},
  "presentations": ${JSON.stringify(presentations || [])},
  "publications": ${JSON.stringify(publications || [])},
  "certificates": ${JSON.stringify(certificates || [])},
  "extraActivities": ${JSON.stringify(extraActivities || [])},
  "personalInfo": ${JSON.stringify(personalInfo)}
}`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 4096,
        messages: [
          {
            role: "system",
            content: "You are an expert resume writer. Return ONLY raw valid JSON with no markdown, no code fences, no backticks, no explanation. Start your response with { and end with }.",
          },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      const errMsg = result?.error?.message ?? JSON.stringify(result);
      throw new Error(`Groq API error: ${errMsg}`);
    }

    let text: string = result.choices?.[0]?.message?.content;
    if (!text) throw new Error("No content in response from AI");

    // Robustly strip markdown code fences (handle multiple layers)
    let prev = "";
    while (prev !== text) {
      prev = text;
      text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();
    }

    // Ensure we start at the first { and end at the last }
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("AI response did not contain valid JSON");
    text = text.slice(start, end + 1);

    let resume;
    try {
      resume = JSON.parse(text);
    } catch {
      throw new Error("AI returned malformed JSON — please try again");
    }

    return NextResponse.json(resume);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate resume";
    console.error("Generate error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
