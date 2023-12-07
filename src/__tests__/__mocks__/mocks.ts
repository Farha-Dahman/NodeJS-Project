import jwt from 'jsonwebtoken';
import { User } from '../../entity/User';
import * as emailSenderModule from '../../services/sendEmail';

jest.mock('../../services/sendEmail');
export const sendEmailSpy = jest.spyOn(emailSenderModule, 'default');
jest.mock('dotenv');
jest.mock('../../services/cloudinary');

export const mockUserData: Partial<User> = {
  id: 1,
  fullName: 'fake_user',
  email: 'fake_email',
  password: 'hashedPassword',
  isConfirmed: true,
  codeSent: null,
  photo: { public_id: 'mockPublicId', secure_url: 'mockSecureUrl' },
  phone: '1234567890',
  jobTitle: 'Software Developer',
  createdAt: new Date(),
  updatedAt: new Date(),
};

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'fakeToken'),
  verify: jest.fn(),
}));
export const jwtMock = jest.spyOn(jwt, 'sign');

jest.mock('bcrypt', () => ({
  compareSync: jest.fn(),
  hashSync: jest.fn(),
  hash: jest.fn(),
}));

jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn(),
    },
  },
}));
