export interface Permission {
  id: string;
  name: string;
  description: string;
  code: string;
}

export interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
} 