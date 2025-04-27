export interface CompanyJson {
  success: boolean,
  count: number,
  data: CompanyItem[]
}
export interface OneCompanyJson {
  success: boolean,
  data: CompanyItem
}

export interface CompanyItem {
  _id: string;
  name: string;
  address: string;
  website: string;
  description: string;
  tel: string;
  tags: string[];
  logo: string;
  companySize: string;
  overview: string;
  foundedYear: string;
  __v: number;
  value: string;
}
export interface CreateCompanyItem {
  name: string;
  address: string;
  website: string;
  description: string;
  tel: string;
  tags: string[];
  logo: string;
  companySize: string;
  overview: string;
  foundedYear: string;
}

export interface InterviewJson {
  success: boolean,
  count: number,
  data: InterviewItem[]
}
export interface InterviewItem {
  _id: string;
  user: UserItem;
  company: CompanyItem;
  position: PositionItem;
  interviewDate: string;
  createdAt: string;
  
}

export interface CreateInterviewItem {
  position: string;
  interviewDate: string;
}

export interface PositionJson {
  success: boolean,
  count: number,
  data: PositionItem[]
}

export interface CreatePositionItem {
  title: string;
  company: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  workArrangement: string;
  location: string;
  interviewStart: string;
  interviewEnd: string;
  skills: string[];
  salary:any;
}

export interface PositionItem{
  _id: string;
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  workArrangement: string;
  location: string;
  company: CompanyItem;
  interviewStart: string;
  interviewEnd: string;
  createdAt: string;
  openingPosition: number;
  salary: any;
  skill: string[];
}

export interface OnePositionJson {
  success: boolean,
  data: PositionItem
}

export interface UserItem{
  _id: string;
  name: string;
  tel: string;
  email: string;
  role: string;
  password: string;
  createdAt: string;
  __v: number;
}