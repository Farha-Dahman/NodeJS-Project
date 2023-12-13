import './__mocks__/setupTests';
import './__mocks__/mocks';
import { Request, Response } from 'express';
import {
  changeNotificationReadStatus,
  getNotifications,
} from '../controller/notification.controller';
import { Notification } from '../entity/Notification';
import { repoMock } from './__mocks__/setupTests';

let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe('Get notifications endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      params: { userId: '123' },
    };
  });

  it('should fetch notifications successfully', async () => {
    const mockNotifications = [{ id: 1, message: 'Notification 1' }];
    repoMock.find.mockResolvedValueOnce(mockNotifications);

    await getNotifications(mockRequest as Request, mockResponse as Response);

    expect(repoMock.find).toHaveBeenCalledWith({
      where: { receiver: { id: 123 } },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'success',
      notifications: mockNotifications,
    });
  });

  it('should handle errors when fetching notifications', async () => {
    const mockError = new Error('Mocked error');
    repoMock.find.mockRejectedValueOnce(mockError);

    await getNotifications(mockRequest as Request, mockResponse as Response);

    expect(repoMock.find).toHaveBeenCalledWith({
      where: { receiver: { id: 123 } },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: mockError.message || 'Internal Server Error',
    });
  });
});

describe('Change notification read status endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      params: { notificationId: '1' },
    };
  });

  it('should change notification read status successfully', async () => {
    const mockNotification = new Notification();
    mockNotification.id = 1;
    mockNotification.isRead = false;
    repoMock.findOne.mockResolvedValueOnce(mockNotification);

    await changeNotificationReadStatus(mockRequest as Request, mockResponse as Response);

    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(repoMock.save).toHaveBeenCalledWith(mockNotification);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'success', isRead: true });
  });

  it('should handle notification not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(null);

    await changeNotificationReadStatus(mockRequest as Request, mockResponse as Response);

    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Notification not found' });
  });

  it('should handle errors when changing notification read status', async () => {
    const mockError = new Error('Mocked error');
    repoMock.findOne.mockRejectedValueOnce(mockError);

    await changeNotificationReadStatus(mockRequest as Request, mockResponse as Response);

    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(repoMock.save).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: mockError.message || 'Internal Server Error',
    });
  });
});
