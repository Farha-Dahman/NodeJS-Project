import './__mocks__/setupTests';
import './__mocks__/mocks';
import { Request, Response } from 'express';
import {
  archiveState,
  createList,
  deleteList,
  getAllList,
  updateList,
} from '../controller/list.controller';
import { Board } from '../entity/Board';
import { List } from '../entity/List';
import { AuthenticatedRequest } from '../models/types';
import { repoMock } from './__mocks__/setupTests';

let mockRequest: Partial<AuthenticatedRequest>;
let mockResponse: Partial<Response>;
mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe('Create list endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      params: { boardId: '1' },
      body: { title: 'New List', position: 1 },
      user: { id: 123, fullName: 'fake_name' },
    };
  });

  it('should create a new list successfully', async () => {
    const existingBoard = new Board();
    existingBoard.id = 1;
    repoMock.findOne.mockResolvedValueOnce(existingBoard);

    const newList = new List();
    repoMock.create.mockReturnValueOnce(newList);
    repoMock.save.mockResolvedValueOnce(newList);

    await createList(mockRequest as Request, mockResponse as Response);

    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(repoMock.create).toHaveBeenCalledWith({
      title: 'New List',
      position: 1,
      board: existingBoard,
    });
    expect(repoMock.save).toHaveBeenCalledWith(newList);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'List created successfully',
      list: newList,
    });
  });

  it('should handle a missing user', async () => {
    mockRequest.user = undefined;

    await createList(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'User not found! Please log in.',
    });
  });

  it('should handle a missing board', async () => {
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await createList(mockRequest as Request, mockResponse as Response);

    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Board not found!',
    });
  });
});

describe('Update list endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      params: { id: '1' },
      body: { title: 'Updated List', position: 2 },
      user: { id: 123, fullName: 'fake_name' },
    };
  });

  it('should update list title and position successfully', async () => {
    const existingList = new List();
    existingList.id = 1;
    existingList.position = 1;
    repoMock.findOne.mockResolvedValueOnce(existingList);
    repoMock.save.mockResolvedValueOnce(existingList);

    await updateList(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(existingList.title).toBe('Updated List');
    expect(existingList.position).toBe(2);
    expect(repoMock.save).toHaveBeenCalledWith(existingList);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'success', list: existingList });
  });

  it('should handle list not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await updateList(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'List not found!' });
  });

  it('should handle same position', async () => {
    const existingList = new List();
    existingList.id = 1;
    existingList.position = 2;
    repoMock.findOne.mockResolvedValueOnce(existingList);

    await updateList(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(existingList.title).toBe('Updated List');
    expect(existingList.position).toBe(2);
    expect(repoMock.save).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'New position is the same as the current position!',
    });
  });
});

describe('Delete List endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      params: {
        id: '1',
      },
      user: {
        id: 123,
        fullName: 'fake_name',
      },
    };
    repoMock.findOne.mockReset();
    repoMock.find.mockReset();
    repoMock.save.mockReset();
    repoMock.remove.mockReset();
  });

  it('should delete the list successfully', async () => {
    const mockList = {
      id: 1,
      title: 'Test List',
      board: { id: 1 },
    };
    const mockBoardUser = {
      userId: mockRequest.user!.id,
      boardId: mockList.board.id,
      isAdmin: true,
    };

    repoMock.findOne.mockResolvedValueOnce(mockList);
    repoMock.findOne.mockResolvedValueOnce(mockBoardUser);
    await deleteList(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['board'],
    });

    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: {
        userId: mockRequest.user!.id,
        boardId: mockList.board.id,
        isAdmin: true,
      },
    });
    expect(repoMock.remove).toHaveBeenCalledWith(mockList);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'success' });
  });

  it('should handle case where list is not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await deleteList(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['board'],
    });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'List not found!' });
  });

  it('should handle internal server error', async () => {
    (repoMock.findOne as jest.Mock).mockRejectedValueOnce(new Error('Internal Server Error'));

    await deleteList(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['board'],
    });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});

describe('Get all list endpoint', () => {
  beforeEach(() => {
    mockRequest = { params: { boardId: '1' } };
    repoMock.findOne.mockReset();
    repoMock.find.mockReset();
  });

  it('should return lists successfully', async () => {
    repoMock.findOne.mockResolvedValueOnce({ id: 1 });
    repoMock.find.mockResolvedValueOnce([
      { id: 1, name: 'List 1' },
      { id: 2, name: 'List 2' },
    ]);

    await getAllList(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'success',
      lists: [
        { id: 1, name: 'List 1' },
        { id: 2, name: 'List 2' },
      ],
    });
  });

  it('should handle board not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await getAllList(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Board not found' });
  });

  it('should handle internal server error', async () => {
    repoMock.findOne.mockRejectedValueOnce(new Error('Internal Server Error'));

    await getAllList(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});

describe('Archive state endpoint', () => {
  beforeEach(() => {
    repoMock.findOne.mockReset();
    repoMock.save.mockReset();
    mockRequest = {
      params: { id: '123' },
    };
  });

  it('should handle list not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await archiveState(mockRequest as Request, mockResponse as Response, true);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'List not found!' });
    expect(repoMock.save).not.toHaveBeenCalled();
  });

  it('should successfully archive a list', async () => {
    const mockList = new List();
    repoMock.findOne.mockResolvedValueOnce(mockList);
    repoMock.save.mockResolvedValueOnce(mockList);

    await archiveState(mockRequest as Request, mockResponse as Response, true);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'success', list: mockList });
    expect(repoMock.save).toHaveBeenCalledWith(expect.objectContaining({ isArchived: true }));
  });

  it('should handle internal server error', async () => {
    repoMock.findOne.mockRejectedValueOnce(new Error('Internal Server Error'));

    await archiveState(mockRequest as Request, mockResponse as Response, true);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});
