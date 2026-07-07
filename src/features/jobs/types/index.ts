export interface JobAdvertisementResponse {
  id: number;
  jobTitle: {
    id: number;
    title: string;
    categoryName: string;
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
  // TODO: the backend does not currently expose salary; these stay optional
  // so the (already null-guarded) salary UI compiles until the API adds them.
  minSalary?: number;
  maxSalary?: number;
}

export interface JobTitle {
  id: number;
  title: string;
  categoryName: string;
}

export interface JobAdvertisementAddDto {
  employerId: number;
  jobTitleId: number;
  cityId: number;
  typeOfWorkId?: number;
  description: string;
  applicationDeadline?: string;
}
