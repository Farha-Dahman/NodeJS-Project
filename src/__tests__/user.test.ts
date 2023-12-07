import './__mocks__/setupTests';
import './__mocks__/mocks';
import { Request, Response } from 'express';
import {
  changePassword,
  profile,
  profilePicture,
  updateProfile,
} from '../controller/user.controller';
import { User } from '../entity/User';
import { AuthenticatedRequest } from '../models/types';
import cloudinary from '../services/cloudinary';
import { repoMock } from './__mocks__/setupTests';

let mockResponse: Partial<Response>;
let mockRequest: Partial<AuthenticatedRequest>;

describe('Profile Controller', () => {
  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockRequest = {
      user: { id: 123, fullName: 'fake_name' },
    };
  });

  it('should return user data when user is authenticated', async () => {
    const userData = { id: 123, fullName: 'fake_name' };
    mockRequest.user = userData;

    await profile(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'success',
      user: userData,
    });
  });

  it('should return 404 status when user data not found', async () => {
    (mockRequest as any).user = null;
    await profile(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'User data not found' });
  });
});

describe('updateProfile', () => {
  beforeEach(() => {
    mockRequest = {
      body: {},
    };
  });

  it('should update user profile successfully', async () => {
    const userMock = new User();
    userMock.id = 123;
    (repoMock.save as jest.Mock).mockReturnValue(userMock);

    mockRequest.user = userMock;

    mockRequest.body = {
      fullName: 'new_name',
      email: 'new_email',
      phone: 'new_phone',
      jobTitle: 'new_job',
    };

    await updateProfile(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'success',
      user: expect.objectContaining({
        id: 123,
        fullName: 'new_name',
        email: 'new_email',
        phone: 'new_phone',
        jobTitle: 'new_job',
      }),
    });
  });

  it('should handle user not found', async () => {
    mockRequest.user = undefined;

    await updateProfile(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('should handle internal server error', async () => {
    (repoMock.save as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

    const userMock = new User();
    userMock.id = 123;
    mockRequest.user = userMock;

    await updateProfile(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});

describe('changePassword', () => {
  it('should handle mismatched new password and confirm password', async () => {
    mockRequest.body = {
      currentPassword: 'old_password',
      newPassword: 'new_password',
      confirmNewPassword: 'different_password',
    };

    await changePassword(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'New password and confirm password do not match!',
    });
  });

  it('should handle incorrect current password', async () => {
    const userMock = new User();
    userMock.id = 123;
    userMock.email = 'fake_email';
    userMock.password = 'old_password';

    (repoMock.findOne as jest.Mock).mockReturnValueOnce(
      Promise.resolve({ password: userMock.password }),
    );

    mockRequest.user = userMock;
    mockRequest.body = {
      currentPassword: 'incorrect_password',
      newPassword: 'new_password',
      confirmNewPassword: 'new_password',
    };

    await changePassword(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Current password is incorrect!',
    });
  });

  it('should handle user not found', async () => {
    (repoMock.findOne as jest.Mock).mockResolvedValue(null);

    await changePassword(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found!' });
  });

  it('should handle internal server error', async () => {
    (repoMock.findOne as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

    await changePassword(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});

describe('profilePicture endpoint', () => {
  beforeAll(() => {
    (cloudinary.config as jest.Mock).mockReturnValue({
      parsed: { CLOUD_NAME: 'mockCloudName', API_KEY: 'mockApiKey', API_SECRET: 'mockApiSecret' },
    });
  });
  const mockRequest = {
    user: {
      id: 1,
    },
    file: {
      path: 'mockFilePath',
    },
  } as unknown as Request;

  it('should upload profile picture successfully', async () => {
    const cloudinaryResponse = {
      public_id: 'mockPublicId',
      secure_url: 'mockSecureUrl',
    };
    (cloudinary.uploader.upload as jest.Mock).mockResolvedValueOnce(cloudinaryResponse);
    (repoMock.save as jest.Mock).mockReturnValueOnce({});

    await profilePicture(mockRequest, mockResponse as Response);

    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'success',
      user: expect.any(Object),
    });

    expect(repoMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        photo: {
          public_id: 'mockPublicId',
          secure_url: 'mockSecureUrl',
        },
      }),
    );
  });

  it('should handle missing file', async () => {
    await profilePicture({ ...mockRequest, file: undefined } as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith('Please provide a file!');
  });

  it('should handle internal server error', async () => {
    (cloudinary.uploader.upload as jest.Mock).mockRejectedValueOnce(
      new Error('Internal server error'),
    );

    await profilePicture(mockRequest, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});
