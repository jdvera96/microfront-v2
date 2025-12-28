export interface Customer {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Editor' | 'Viewer';
  status: 'Active' | 'Inactive' | 'Pending';
  company: string;
  lastActive: string;
  avatarUrl: string;
  revenue: number;
}