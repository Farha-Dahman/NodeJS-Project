import './__mocks__/setupTests';
import './__mocks__/mocks';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../../logger';
import {
  confirmEmail,
  forgotPassword,
  login,
  sendCode,
  signup,
} from '../controller/auth.controller';
import { User } from '../entity/User';
import { jwtMock, mockUserData, sendEmailSpy } from './__mocks__/mocks';
import { repoMock } from './__mocks__/setupTests';

let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
beforeEach(() => {
  mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
});

describe('signup endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      body: { fullName: 'fake_name', email: 'fake_email', password: 'fake_password' },
    };
  });
  it('should create a new user successfully and send confirmation email', async () => {
    (bcrypt.hashSync as jest.Mock).mockReturnValueOnce('hashedPassword');
    (jwt.sign as jest.Mock).mockReturnValueOnce('fakeToken');
    await signup(mockRequest as Request, mockResponse as Response);

    expect(repoMock.create).toHaveBeenCalledWith({
      fullName: 'fake_name',
      email: 'fake_email',
      password: 'hashedPassword',
    });
    expect(jwtMock).toHaveBeenCalledWith({ email: 'fake_email' }, process.env.EMAIL_TOKEN, {
      expiresIn: '1h',
    });
    expect(sendEmailSpy).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'success' });
  });

  it('should handle internal server error', async () => {
    const errorSpy = jest.spyOn(logger, 'error');
    (repoMock.findOne as jest.MockedFunction<typeof repoMock.findOne>).mockRejectedValue(
      new Error('Internal Server Error'),
    );
    await signup(mockRequest as Request, mockResponse as Response);
    expect(errorSpy).toHaveBeenCalledWith('Error in signup: Error: Internal Server Error');
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
    });
  });

  it('Email already exists', async () => {
    repoMock.findOne.mockResolvedValueOnce({
      email: 'fake_email',
      password: 'fake_password',
    } as User);

    await signup(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Email already exists',
    });
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { email: mockRequest.body.email },
    });
  });
});

describe('login endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      body: { email: 'fake_email', password: 'fake_password', isConfirmed: true },
    };
  });

  it('should user make login successfully with valid credentials', async () => {
    const mockUser = {
      id: 'fake_user_id',
      isConfirmed: true,
      password: 'fake_hashed_password',
    };
    (repoMock.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compareSync as jest.Mock).mockReturnValueOnce(true);
    (jwt.sign as jest.Mock).mockReturnValueOnce('fakeToken');
    await login(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'success',
      token: 'fakeToken',
      refreshToken: 'fakeToken',
    });
  });

  it('should return 404 if user does not exist', async () => {
    (repoMock.findOne as jest.MockedFunction<typeof repoMock.findOne>).mockResolvedValue(null);
    await login(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
  });

  it('should return 404 if password is incorrect', async () => {
    (bcrypt.compareSync as jest.Mock).mockReturnValueOnce(false);
    await login(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
  });

  it('should return 403 if email is not confirmed', async () => {
    repoMock.findOne.mockResolvedValue(mockUserData);
    mockUserData.isConfirmed = false;
    await login(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Plz confirm your email' });
  });

  it('should handle internal server error', async () => {
    const errorSpy = jest.spyOn(logger, 'error');
    (repoMock.findOne as jest.MockedFunction<typeof repoMock.findOne>).mockRejectedValue(
      new Error('Internal Server Error'),
    );
    await login(mockRequest as Request, mockResponse as Response);
    expect(errorSpy).toHaveBeenCalledWith('Error in login: Error: Internal Server Error');
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});

describe('confirm email endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      params: {
        token: 'fakeToken',
      },
    };
  });

  it('should confirm email successfully', async () => {
    (jwt.verify as jest.Mock).mockReturnValueOnce({ email: 'fake_email' });
    (repoMock.findOne as jest.Mock).mockResolvedValueOnce({
      email: 'fake_email',
      isConfirmed: false,
      save: jest.fn(),
    });

    await confirmEmail(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Your email is confirmed successfully!',
    });
  });

  it('should handle already verified email', async () => {
    (jwt.verify as jest.Mock).mockReturnValueOnce({ email: 'fake_email' });
    repoMock.findOne.mockResolvedValueOnce({
      email: 'fake_email',
      isConfirmed: true,
    });

    await confirmEmail(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Your Email already is verified!',
    });
  });

  it('should handle invalid token', async () => {
    const errorSpy = jest.spyOn(logger, 'error');
    (jwt.verify as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Invalid token');
    });
    await confirmEmail(mockRequest as Request, mockResponse as Response);
    expect(errorSpy).toHaveBeenCalledWith('Error in confirmEmail: Error: Invalid token');
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Invalid token',
      error: 'Invalid token',
    });
  });
});

describe('sendCode endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      body: {
        email: 'test@example.com',
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send a code successfully', async () => {
    (repoMock.findOne as jest.Mock).mockResolvedValueOnce(mockUserData);
    (repoMock.save as jest.Mock).mockResolvedValueOnce(mockUserData);

    await sendCode(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'success',
      Code: expect.any(String),
    });
    expect(mockUserData.codeSent).toEqual(expect.any(String));
    expect(sendEmailSpy).toHaveBeenCalled();
  });

  it('should handle user not found', async () => {
    (repoMock.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await sendCode(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'User not found',
    });
    expect(sendEmailSpy).not.toHaveBeenCalled();
  });

  it('should handle errors during the process', async () => {
    (repoMock.findOne as jest.Mock).mockRejectedValueOnce(new Error('Internal Server Error'));
    await sendCode(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
    });
    expect(logger.error).toHaveBeenCalledWith('Error in sendCode:', expect.any(Error));
    expect(sendEmailSpy).not.toHaveBeenCalled();
  });
});

describe('forgotPassword endpoint', () => {
  it('should reset password successfully', async () => {
    const code = 'fake_code';
    mockUserData.codeSent = code;
    (repoMock.findOne as jest.Mock).mockResolvedValueOnce(mockUserData);
    (bcrypt.compareSync as jest.Mock).mockReturnValueOnce(true);

    await forgotPassword(
      {
        body: {
          email: 'fake_email',
          password: 'fake_new_password',
          code: 'fake_code',
        },
      } as Request,
      mockResponse as Response,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'success' });
    expect(bcrypt.hashSync).toHaveBeenCalledWith('fake_new_password', 10);
  });

  it('should handle user not found', async () => {
    (repoMock.findOne as jest.Mock).mockResolvedValueOnce(undefined);

    await forgotPassword(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Not registered account!' });
  });

  it('should handle invalid code', async () => {
    const invalidCode = 'invalid_code';
    mockUserData.codeSent = invalidCode;
    (repoMock.findOne as jest.Mock).mockResolvedValueOnce(mockUserData);

    await forgotPassword(
      {
        body: {
          email: 'fake_email',
          password: 'fake_new_password',
          code: 'provided_code',
        },
      } as Request,
      mockResponse as Response,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid code!' });
  });

  it('should handle internal server error', async () => {
    (repoMock.findOne as jest.Mock).mockRejectedValueOnce(new Error('Internal Server Error'));

    await forgotPassword(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    expect(logger.error).toHaveBeenCalledWith('Error in forgetPassword:', expect.any(Error));
  });
});
