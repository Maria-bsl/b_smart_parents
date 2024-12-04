export interface FTimeTableForm {
  Facility_Reg_Sno: string | number;
  Admission_No: string | number;
  From_Date?: string | undefined;
  To_Date?: string | undefined;
}

export interface FBookForm {
  Facility_Reg_Sno: string | number;
  Admission_No: string | number;
  Academic_Sno: string | number;
}
