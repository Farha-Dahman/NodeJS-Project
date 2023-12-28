import { Request } from 'express';

export interface AttachmentResponse {
  public_id: string;
  secure_url: string;
}

export interface Photo {
  public_id: string;
  secure_url: string;
}

export interface AuthenticatedRequest extends Request {
  user: { id: number; fullName: string; };
}
