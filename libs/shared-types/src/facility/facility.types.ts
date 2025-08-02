export interface FacilityType {
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetFacilityTypesResponse {
  status: string;
  message: string;
  statusCode: number;
  error: string | null;
  data: FacilityType[];
}

export interface GetFacilityTypesData {
  getFacilityTypes: GetFacilityTypesResponse;
}