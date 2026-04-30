export interface JobApplicationResponse {
  id: number;
  jobAdvertisementId: number;
  jobSeekerId: number;
  jobSeekerFirstName: string;
  jobSeekerLastName: string;
  jobSeekerEmail: string;
  jobTitle: string;
  jobDescription: string;
  companyName: string;
  applicationDate: string;
  status: string;
}
