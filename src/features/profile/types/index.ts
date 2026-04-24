export interface ResumeResponse {
  id: number;
  jobSeekerId: number;
  githubAccount?: string;
  linkedinAccount?: string;
  summary?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
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
  educationDegree: string;
  startDate: string;
  graduateDate?: string;
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
  companyName: string;
  startDate: string;
  leaveDate?: string;
}

export interface ProfileResponse extends ResumeResponse {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
}

export interface JobSeekerResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  phoneNumber?: string;
}

export interface EmployerProfileResponse {
  id: number;
  companyName: string;
  webAddress: string;
  phoneNumber: string;
  email: string;
}
