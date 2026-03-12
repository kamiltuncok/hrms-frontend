export interface ResumeResponse {
  id: number;
  jobSeekerId: number;
  githubAccount?: string;
  linkedinAccount?: string;
  description?: string;
  photoUrl?: string;
  cvUrl?: string;
  schools: School[];
  languages: Language[];
  skills: Skill[];
  jobExperiences: JobExperience[];
}

export interface School {
  id: number;
  schoolName: string;
  departmentName: string;
  startDate: string;
  graduationDate?: string;
}

export interface Language {
  id: number;
  languageName: string;
  level: number; // 1-5
}

export interface Skill {
  id: number;
  skillName: string;
}

export interface JobExperience {
  id: number;
  workplaceName: string;
  positionName: string;
  startDate: string;
  leaveDate?: string;
}

export interface ProfileResponse extends ResumeResponse {
  firstName: string;
  lastName: string;
  email: string;
  birthYear: number;
}
