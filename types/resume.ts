export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  jobTitle: string;
  languages?: string;
  hobbies?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string;
  link?: string;
  startDate?: string;
  endDate?: string;
}

export interface ResearchProject {
  id: string;
  title: string;
  role: string;
  institution: string;
  description: string;
  startDate?: string;
  endDate?: string;
}

export interface Presentation {
  id: string;
  title: string;
  event: string;
  date: string;
  type: "poster" | "paper" | "talk" | "other";
  description?: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: string;
  doi?: string;
  description?: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface ExtraActivity {
  id: string;
  name: string;
  role?: string;
  organization?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface ResumeFormData {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  projects: Project[];
  researchProjects: ResearchProject[];
  presentations: Presentation[];
  publications: Publication[];
  certificates: Certificate[];
  extraActivities: ExtraActivity[];
  skills: string;
  targetRole: string;
  additionalContext?: string;
}

export interface GeneratedResume {
  summary: string;
  workExperience: {
    id: string;
    company: string;
    title: string;
    startDate: string;
    endDate: string;
    bullets: string[];
  }[];
  skills: string[];
  education: Education[];
  projects: Project[];
  researchProjects: ResearchProject[];
  presentations: Presentation[];
  publications: Publication[];
  certificates: Certificate[];
  extraActivities: ExtraActivity[];
  personalInfo: PersonalInfo;
}
