export interface JobAdvertisementResponse {
  id: number;
  jobTitle: {
    id: number;
    title: string;
  };
  city: {
    id: number;
    name: string;
  };
  typeOfWork?: {
    id: number;
    name: string;
  };
  employer: {
    id: number;
    companyName: string;
    webAddress?: string;
    profileImageUrl?: string;
  };
  description: string;
  applicationDeadline?: string;
  createdDate: string;
  isActive: boolean;
}

export interface JobAdvertisementAddDto {
  employerId: number;
  jobTitleId: number;
  cityId: number;
  typeOfWorkId?: number;
  description: string;
  applicationDeadline?: string;
}
