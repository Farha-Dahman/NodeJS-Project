import './__mocks__/setupTests';
import './__mocks__/mocks';
import { Request, Response } from 'express';
import {
  deleteAttachment,
  getAllAttachments,
  updateAttachment,
  uploadAttachment,
} from '../controller/attachment.controller';
import { repoMock } from './__mocks__/setupTests';

let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe('Upload attachment endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      params: { cardId: '1' },
    };
  });

  it('should handle card not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await uploadAttachment(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Card not found!' });
  });

  it('should handle internal server error', async () => {
    repoMock.findOne.mockRejectedValueOnce(new Error('Test Error'));

    await uploadAttachment(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Test Error' });
  });
});

describe('Delete attachment endpoint', () => {
  beforeEach(() => {
    mockRequest = { params: { attachmentId: '1' } };
  });

  it('should delete attachment successfully', async () => {
    const mockAttachment = { id: 1, location: { public_id: 'mock_public_id' } };
    repoMock.findOne.mockResolvedValueOnce(mockAttachment);

    await deleteAttachment(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(repoMock.remove).toHaveBeenCalledWith(mockAttachment);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'success' });
  });

  it('should handle case where attachment is not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(null);

    await deleteAttachment(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Attachment not found!' });
  });

  it('should handle internal server error', async () => {
    repoMock.findOne.mockRejectedValueOnce(new Error('Test Error'));

    await deleteAttachment(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Test Error' });
  });
});

describe('Update attachment endpoint', () => {
  beforeEach(() => {
    mockRequest = { params: { attachmentId: '1' }, body: { newName: 'newAttachmentName' } };
  });

  it('should update attachment name successfully', async () => {
    const mockAttachment = { id: 1, name: 'oldAttachmentName' };
    repoMock.findOne.mockResolvedValueOnce(mockAttachment);
    repoMock.save.mockResolvedValueOnce(mockAttachment);

    await updateAttachment(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(repoMock.save).toHaveBeenCalledWith({ ...mockAttachment, name: 'newAttachmentName' });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'success',
      attachment: mockAttachment,
    });
  });

  it('should handle case where attachment is not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(null);

    await updateAttachment(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Attachment not found!' });
  });

  it('should handle internal server error', async () => {
    repoMock.findOne.mockRejectedValueOnce(new Error('Test Error'));

    await updateAttachment(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Test Error' });
  });
});

describe('Get all attachments endpoint', () => {
  beforeEach(() => {
    mockRequest = { params: { cardId: '1' } };
  });

  it('should get attachments successfully', async () => {
    const mockAttachments = [
      { id: 1, name: 'Attachment 1' },
      { id: 2, name: 'Attachment 2' },
    ];

    repoMock.find.mockResolvedValueOnce(mockAttachments);

    await getAllAttachments(mockRequest as Request, mockResponse as Response);
    expect(repoMock.find).toHaveBeenCalledWith({ where: { card: { id: 1 } } });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'success',
      attachments: mockAttachments,
    });
  });

  it('should handle internal server error', async () => {
    repoMock.find.mockRejectedValueOnce(new Error('Test Error'));

    await getAllAttachments(mockRequest as Request, mockResponse as Response);
    expect(repoMock.find).toHaveBeenCalledWith({ where: { card: { id: 1 } } });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Test Error' });
  });
});
