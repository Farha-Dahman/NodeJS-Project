import jwt from 'jsonwebtoken';
import { User } from '../../entity/User';
import * as emailSenderModule from '../../services/sendEmail';

jest.mock('../../services/sendEmail');
export const sendEmailSpy = jest.spyOn(emailSenderModule, 'default');

export const mockUserData: User = {
  id: 1,
  fullName: 'fake_user',
  email: 'fake_email',
  password: 'hashedPassword',
  isConfirmed: true,
  codeSent: null,
} as User;

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'fakeToken'),
  verify: jest.fn(),
}));
export const jwtMock = jest.spyOn(jwt, 'sign');

jest.mock('bcrypt', () => ({
  compareSync: jest.fn(),
  hashSync: jest.fn(),
}));

