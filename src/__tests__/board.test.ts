import './__mocks__/setupTests';
import './__mocks__/mocks';
import { Request, Response } from 'express';
import {
  addMemberToBoard,
  closeBoard,
  createBoard,
  deleteBoard,
  getActivities,
  getAllMembers,
  getAllOpenBoards,
  removeMemberFromBoard,
  reopenBoard,
} from '../controller/board.controller';
import { Board } from '../entity/Board';
import { BoardUser } from '../entity/BoardUser';
import { User } from '../entity/User';
import { Workspace } from '../entity/Workspace';
import { AuthenticatedRequest } from '../types/types';
import { repoMock } from './__mocks__/setupTests';

let mockRequest: Partial<AuthenticatedRequest>;
let mockResponse: Partial<Response>;
mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
repoMock.findOne.mockReset();
repoMock.find.mockReset();
repoMock.create.mockReset();
repoMock.save.mockReset();

describe('Create board endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      user: { id: 123, fullName: 'fake_name' },
      body: {
        name: 'TestBoard',
        WorkspaceName: 'TestWorkspace',
        isPublic: true,
      },
    };
  });

  it('should create a new board successfully', async () => {
    const mockWorkspace = new Workspace();
    mockWorkspace.name = 'TestWorkspace';

    const mockBoard = new Board();
    mockBoard.name = 'TestBoard';
    mockBoard.isPublic = true;

    repoMock.findOne.mockResolvedValueOnce(mockWorkspace);
    repoMock.findOne.mockResolvedValueOnce(null);
    repoMock.create.mockReturnValueOnce(mockBoard);
    repoMock.save.mockResolvedValueOnce(mockBoard);

    const mockBoardUser = new BoardUser();
    repoMock.create.mockReturnValueOnce(mockBoardUser);
    repoMock.save.mockResolvedValueOnce(mockBoardUser);

    mockRequest.body = {
      name: 'TestBoard',
      WorkspaceName: 'TestWorkspace',
      isPublic: true,
    };

    await createBoard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { name: 'TestWorkspace' },
    });
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { name: 'TestBoard' },
    });
    expect(repoMock.create).toHaveBeenCalledWith({
      name: 'TestBoard',
      createdDate: expect.any(Date),
      workspace: mockWorkspace,
      isPublic: true,
    });
    expect(repoMock.save).toHaveBeenCalledWith(mockBoard);
    expect(repoMock.create).toHaveBeenCalledWith({
      userId: mockRequest.user?.id,
      boardId: mockBoard.id,
      isAdmin: true,
    });
    expect(repoMock.save).toHaveBeenCalledWith(mockBoardUser);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
  });

  it('should handle case where user is not found', async () => {
    mockRequest.user = undefined;

    await createBoard(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found! Please log in.' });
  });

  it('should handle case where workspace is not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(null);

    await createBoard(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Workspace not found' });
  });

  it('should handle case where board name already exists', async () => {
    const existingBoard = new Board();
    existingBoard.name = 'TestBoard';
    repoMock.findOne.mockResolvedValueOnce(new Workspace());
    repoMock.findOne.mockResolvedValueOnce(existingBoard);

    await createBoard(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Board name already exists!' });
  });
});

describe('Close board endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      params: { id: '1' },
    };
  });

  it('should close the board successfully', async () => {
    const existingBoard = new Board();
    existingBoard.id = 1;
    repoMock.findOne.mockResolvedValueOnce(existingBoard);

    await closeBoard(mockRequest as Request, mockResponse as Response);

    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(existingBoard.isClosed).toBe(true);
    expect(repoMock.save).toHaveBeenCalledWith(existingBoard);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Board closed successfully' });
  });

  it('should handle case where board is not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await closeBoard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Board not found!' });
  });

  it('should handle internal server error', async () => {
    repoMock.findOne.mockRejectedValueOnce(new Error('Internal Server Error'));

    await closeBoard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});

describe('Reopen board endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      params: { id: '1' },
    };
  });

  it('should reopen the board successfully', async () => {
    const existingBoard = new Board();
    existingBoard.id = 1;
    existingBoard.isClosed = true;
    repoMock.findOne.mockResolvedValueOnce(existingBoard);

    await reopenBoard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(existingBoard.isClosed).toBe(false);
    expect(repoMock.save).toHaveBeenCalledWith(existingBoard);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Board opened successfully' });
  });

  it('should handle case where board is not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await reopenBoard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Board not found!' });
  });

  it('should handle internal server error', async () => {
    repoMock.findOne.mockRejectedValueOnce(new Error('Internal Server Error'));

    await reopenBoard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});

describe('Get all open boards endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      params: { workspaceId: '1' },
    };
  });

  it('should fetch open boards successfully', async () => {
    const existingWorkspace = new Workspace();
    existingWorkspace.id = 1;
    repoMock.findOne.mockResolvedValueOnce(existingWorkspace);

    const openBoards = [
      { id: 1, name: 'Board1', isClosed: false },
      { id: 2, name: 'Board2', isClosed: false },
    ];
    repoMock.find.mockResolvedValueOnce(openBoards);

    await getAllOpenBoards(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(repoMock.find).toHaveBeenCalledWith({
      where: { workspace: { id: 1 }, isClosed: false },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'success', boards: openBoards });
  });

  it('should handle case where workspace is not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await getAllOpenBoards(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Workspace not found' });
  });

  it('should handle internal server error', async () => {
    repoMock.findOne.mockRejectedValueOnce(new Error('Database error'));

    await getAllOpenBoards(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});

describe('Get all members of board endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      params: { id: '1' },
    };
  });

  it('should return members successfully', async () => {
    const numericId = 1;
    const mockBoard = new Board();
    mockBoard.id = numericId;
    const mockUser1 = new User();
    mockUser1.id = 1;
    const mockUser2 = new User();
    mockUser2.id = 2;
    const mockBoardMembers = [
      { id: 1, boardId: numericId, user: mockUser1 },
      { id: 2, boardId: numericId, user: mockUser2 },
    ];

    repoMock.findOne.mockResolvedValueOnce(mockBoard);
    repoMock.find.mockResolvedValueOnce(mockBoardMembers);

    await getAllMembers(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: numericId },
    });
    expect(repoMock.find).toHaveBeenCalledWith({
      where: { boardId: numericId },
      relations: ['user'],
    });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'success',
      members: [mockUser1, mockUser2],
    });
  });

  it('should handle case where board is not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await getAllMembers(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Board not found!' });
  });

  it('should handle internal server error', async () => {
    repoMock.findOne.mockRejectedValueOnce(new Error('Internal Server Error'));

    await getAllMembers(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});

describe('Delete board endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      params: { id: '1' },
      user: { id: 1, fullName: 'fake_name' },
    };
  });
  it('should delete the board successfully', async () => {
    const numericBoardId = 1;
    const mockBoard = { id: numericBoardId };
    const mockBoardUser = { userId: 1, boardId: numericBoardId, isAdmin: true };

    repoMock.findOne.mockResolvedValueOnce(mockBoard);
    repoMock.findOne.mockResolvedValueOnce(mockBoardUser);

    await deleteBoard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: numericBoardId },
    });
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { userId: 1, boardId: numericBoardId },
    });
    expect(repoMock.remove).toHaveBeenCalledWith(mockBoard);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'success' });
  });

  it('should handle board not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await deleteBoard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Board not found!' });
  });

  it('should handle user not having permission', async () => {
    const numericBoardId = 1;
    const mockBoard = { id: numericBoardId };
    const mockBoardUser = { userId: 1, boardId: numericBoardId, isAdmin: false };

    repoMock.findOne.mockResolvedValueOnce(mockBoard);
    repoMock.findOne.mockResolvedValueOnce(mockBoardUser);
    await deleteBoard(mockRequest as Request, mockResponse as Response);

    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: numericBoardId },
    });
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { userId: 1, boardId: numericBoardId },
    });
    expect(repoMock.remove).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'You do not have permission to delete this board!',
    });
  });

  it('should handle internal server error', async () => {
    repoMock.findOne.mockRejectedValueOnce(new Error('Internal Server Error'));

    await deleteBoard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});

describe('Remove member from board endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      params: { id: '1', userId: '101' },
      user: { id: 1, fullName: 'fake_name' },
    };
  });

  it('should remove the member from the board successfully', async () => {
    const numericBoardId = 1;
    const numericUserId = 101;
    const mockBoard = { id: numericBoardId, name: 'Test Board' };
    const mockMember = { userId: numericUserId, boardId: numericBoardId };

    repoMock.findOne.mockResolvedValueOnce(mockBoard);
    repoMock.findOne.mockResolvedValueOnce(mockMember);
    repoMock.remove.mockResolvedValueOnce({});

    await removeMemberFromBoard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: numericBoardId },
    });
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { userId: numericUserId, boardId: numericBoardId },
    });
    expect(repoMock.remove).toHaveBeenCalledWith(mockMember);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'success' });
  });

  it('should handle board not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await removeMemberFromBoard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Board not found!' });
  });

  it('should handle member not found', async () => {
    const numericBoardId = 1;
    const numericUserId = 101;
    const mockBoard = { id: numericBoardId, name: 'Test Board' };

    repoMock.findOne.mockResolvedValueOnce(mockBoard);
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await removeMemberFromBoard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: numericBoardId },
    });
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { userId: numericUserId, boardId: numericBoardId },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'User is not a member of this board!',
    });
  });

  it('should handle internal server error', async () => {
    repoMock.findOne.mockRejectedValueOnce(new Error('Internal Server Error'));

    await removeMemberFromBoard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});

describe('Add member to board endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      params: { id: '1' },
      body: { email: 'fake_email' },
    };
  });

  it('should handle board not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await addMemberToBoard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Board not found!' });
  });

  it('should handle user not found', async () => {
    repoMock.findOne.mockResolvedValueOnce({});

    await addMemberToBoard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { email: 'fake_email' },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found!' });
  });

  it('should handle user already a member of the board', async () => {
    const numericBoardId = 1;
    const mockBoard = { id: numericBoardId, name: 'Test Board' };
    const mockUser = { id: 101, email: 'fake_email' };

    repoMock.findOne.mockResolvedValueOnce(mockBoard);
    repoMock.findOne.mockResolvedValueOnce(mockUser);
    repoMock.findOne.mockResolvedValueOnce({});

    await addMemberToBoard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: numericBoardId },
    });
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { email: 'fake_email' },
    });
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { userId: mockUser.id, boardId: numericBoardId },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'User is already a member of this board!',
    });
  });

  it('should handle internal server error', async () => {
    repoMock.findOne.mockRejectedValueOnce(new Error('Internal Server Error'));

    await addMemberToBoard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});

describe('Get Activities endpoint', () => {
  it('should fetch board activities successfully', async () => {
    const mockBoardId = '1';
    const numericBoardId = parseInt(mockBoardId, 10);

    const mockActivities = [
      { id: 1, description: 'Activity 1' },
      { id: 2, description: 'Activity 2' },
    ];

    repoMock.find.mockResolvedValueOnce(mockActivities);
    mockRequest.params = { id: mockBoardId };

    await getActivities(mockRequest as Request, mockResponse as Response);
    expect(repoMock.find).toHaveBeenCalledWith({
      where: { board: { id: numericBoardId } },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'success',
      activities: mockActivities,
    });
  });

  it('should handle errors when fetching board activities', async () => {
    const mockBoardId = '1';
    repoMock.find.mockRejectedValueOnce(new Error('Mocked error'));
    mockRequest.params = { id: mockBoardId };

    await getActivities(mockRequest as Request, mockResponse as Response);
    expect(repoMock.find).toHaveBeenCalledWith({
      where: { board: { id: parseInt(mockBoardId, 10) } },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Mocked error',
    });
  });
});
