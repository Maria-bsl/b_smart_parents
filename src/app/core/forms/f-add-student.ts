export interface SDetails {
  Admission_No: string;
  Facility_Reg_Sno: string;
}

export interface AddStudent {
  User_Name: string;
  SDetails: SDetails[];
}
