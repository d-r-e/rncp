export interface CursusUser{
  cursus_id: number;
  level: number;
}

export interface Block {
  id: number;
  name: string;
  projects: Project[];
  min_xp: number;
  min_projects: number;
}

export interface Project {
  id: number;
  name: string;
  slug: string;
  xp: number;
}

export interface ProjectUser {
  id: number;
  occurrence: number;
  final_mark: number;
  status: string;
  "validated?": boolean;
  current_team_id: number;
  project: Project;
  cursus_ids: number[];
}


export interface CursusEvent  {
  id: number;
}

export interface Me {
  id: number;
  email: string;
  login: string;
  first_name: string;
  last_name: string;
  url: string;
  phone: string;
  displayname: string;
  image_url: string;
  groups: any[];
  cursus_users: CursusUser[];
  projects_users: ProjectUser[];
  languages_users: any[];
  achievements: any[];
  titles: any[];
  titles_users: any[];
  partnerships: any[];
  patroned: any[];
  patroning: any[];
  expertises_users: any[];
  user_cursus: any[];
  projects: any[];
  collaborations: any[];
  invited: any[];
  memberships: any[];
  invited_members: any[];
  start_at: string;
  end_at: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  active: boolean;
  email_secondary: string;
  phone_secondary: string;
  skype: string;
  slack: string;
  staff?: boolean;
  correction_point?: number;
  pool_month?: string;
  pool_year?: string;
  location?: string;
  wallet?: number;
  anonymize_date?: string;
  created_at: string;
  updated_at: string;
  language: any[];
  addresses: any[];
  campus_users: any[];
  campus_partnerships: any[];
  invited_by: any[];
  campus: any[];
}
