import './__mocks__/setupTests';
import './__mocks__/mocks';
import { Request, Response } from 'express';
import { Like } from 'typeorm';
import {
  createLabel,
  deleteLabel,
  getAllLabels,
  searchForLabel,
} from '../controller/label.controller';
import { repoMock } from './__mocks__/setupTests';

let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe('Create label endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      params: { boardId: '1' },
      body: { title: 'Test Label', color: '#ff0000' },
    };
  });

  it('should create a label successfully', async () => {
    repoMock.findOne.mockResolvedValueOnce({ id: 1 });
    repoMock.create.mockReturnValueOnce({ id: 1, title: 'Test Label', color: '#ff0000' });
    repoMock.save.mockResolvedValueOnce({ id: 1, title: 'Test Label', color: '#ff0000' });

    await createLabel(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(repoMock.create).toHaveBeenCalledWith({
      title: 'Test Label',
      color: '#ff0000',
      board: { id: 1 },
    });
    expect(repoMock.save).toHaveBeenCalledWith({ id: 1, title: 'Test Label', color: '#ff0000' });
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'success',
      label: { id: 1, title: 'Test Label', color: '#ff0000' },
    });
  });

  it('should handle board not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await createLabel(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Board not found!' });
  });

  it('should handle internal server error', async () => {
    repoMock.findOne.mockRejectedValueOnce(new Error('Test Error'));

    await createLabel(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Test Error' });
  });
});

describe('Delete label endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      params: { labelId: '1' },
    };
  });

  it('should delete a label successfully', async () => {
    repoMock.findOne.mockResolvedValueOnce({ id: 1, title: 'Test Label', color: '#ff0000' });
    repoMock.remove.mockResolvedValueOnce({});

    await deleteLabel(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(repoMock.remove).toHaveBeenCalledWith({ id: 1, title: 'Test Label', color: '#ff0000' });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'success' });
  });

  it('should handle label not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await deleteLabel(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Label not found!' });
  });

  it('should handle internal server error', async () => {
    repoMock.findOne.mockRejectedValueOnce(new Error('Test Error'));

    await deleteLabel(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Test Error' });
  });
});

describe('Search for label endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      query: { name: 'Test' },
    };
  });

  it('should search for labels successfully', async () => {
    const mockLabels = [
      { id: 1, title: 'Test Label 1', color: '#ff0000' },
      { id: 2, title: 'Test Label 2', color: '#00ff00' },
    ];
    repoMock.find.mockResolvedValueOnce(mockLabels);

    await searchForLabel(mockRequest as Request, mockResponse as Response);
    expect(repoMock.find).toHaveBeenCalledWith({
      where: {
        title: Like('%Test%'),
      },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'success', labels: mockLabels });
  });

  it('should handle invalid search query', async () => {
    await searchForLabel({ query: {} } as Request, mockResponse as Response);

    expect(repoMock.find).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid search query' });
  });

  it('should handle internal server error', async () => {
    repoMock.find.mockRejectedValueOnce(new Error('Test Error'));

    await searchForLabel(mockRequest as Request, mockResponse as Response);
    expect(repoMock.find).toHaveBeenCalledWith({
      where: {
        title: Like('%Test%'),
      },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Test Error' });
  });
});

describe('Get all labels endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      params: { boardId: '1' },
    };
  });

  it('should fetch all labels successfully', async () => {
    const mockLabels = [
      { id: 1, title: 'Test Label 1', color: '#ff0000' },
      { id: 2, title: 'Test Label 2', color: '#00ff00' },
    ];
    repoMock.find.mockResolvedValueOnce(mockLabels);

    await getAllLabels(mockRequest as Request, mockResponse as Response);
    expect(repoMock.find).toHaveBeenCalledWith({
      where: {
        board: { id: 1 },
      },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'success', labels: mockLabels });
  });

  it('should handle internal server error', async () => {
    repoMock.find.mockRejectedValueOnce(new Error('Test Error'));

    await getAllLabels(mockRequest as Request, mockResponse as Response);
    expect(repoMock.find).toHaveBeenCalledWith({
      where: {
        board: { id: 1 },
      },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Test Error' });
  });
});
