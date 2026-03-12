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
  workModel?: {
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
    photoUrl?: string;
  };
  description: string;
  openPositions: number;
  applicationDeadline?: string;
  createdDate: string;
  isActive: boolean;
}

export interface JobAdvertisementAddDto {
  employerId: number;
  jobTitleId: number;
  cityId: number;
  workModelId?: number;
  typeOfWorkId?: number;
  description: string;
  openPositions: number;
  applicationDeadline?: string;
}
