export interface Service {
  id: string;
  companyId: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
