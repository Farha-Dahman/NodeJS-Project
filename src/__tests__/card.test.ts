import './__mocks__/setupTests';
import './__mocks__/mocks';
import { Request, Response } from 'express';
import {
  addComment,
  addMemberToCard,
  archiveState,
  createCard,
  deleteComment,
  deleteMemberFromCard,
  editComment,
  getActivities,
  getAllCard,
  getAllComments,
  getAllMembersForCard,
  logActivity,
  updateCard,
} from '../controller/card.controller';
import { Card } from '../entity/Card';
import { AuthenticatedRequest } from '../types/types';
import { repoMock } from './__mocks__/setupTests';

let mockRequest: Partial<AuthenticatedRequest>;
let mockResponse: Partial<Response>;
mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe('Create card endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      params: { listId: '1' },
      body: {
        title: 'New Card',
        description: 'Card Description',
        dueDate: new Date(),
        reminderDate: new Date(),
      },
      user: { id: 1, fullName: 'fake_name' },
    };
  });

  it('should create a card successfully', async () => {
    const numericListId = 1;
    const mockList = { id: numericListId };
    const mockCard = { id: 1, title: 'New Card', list: mockList, users: [mockRequest.user] };

    repoMock.findOne.mockResolvedValueOnce(mockList);
    repoMock.create.mockReturnValueOnce(mockCard);

    await createCard(mockRequest as Request, mockResponse as Response);

    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: numericListId } });
    expect(repoMock.create).toHaveBeenCalledWith({
      title: 'New Card',
      description: 'Card Description',
      dueDate: expect.any(Date),
      reminderDate: expect.any(Date),
      createdDate: expect.any(Date),
      isArchived: false,
      users: [mockRequest.user],
      list: mockList,
    });
    expect(repoMock.save).toHaveBeenCalledWith(mockCard);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'success', card: mockCard });
  });

  it('should handle case where user is not logged in', async () => {
    mockRequest.user = undefined;

    await createCard(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found! Please log in.' });
  });

  it('should handle case where list is not found', async () => {
    const numericListId = 1;
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await createCard(mockRequest as Request, mockResponse as Response);

    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: numericListId } });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'List not found!' });
  });

  it('should handle internal server error during card creation', async () => {
    const numericListId = 1;
    const errorMessage = 'Internal Server Error';

    repoMock.findOne.mockResolvedValueOnce({ id: numericListId });
    repoMock.create.mockReturnValueOnce({});
    repoMock.save.mockRejectedValueOnce(new Error(errorMessage));

    await createCard(mockRequest as Request, mockResponse as Response);

    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: numericListId } });
    expect(repoMock.create).toHaveBeenCalledWith(expect.any(Object));
    expect(repoMock.save).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
  });
});

describe('Update card endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      params: { id: '1', boardId: '1' },
      body: { title: 'Updated Title', description: 'Updated Description' },
      user: { id: 1, fullName: 'fake_name' },
    };
  });

  it('should update the card successfully', async () => {
    const numericId = 1;
    const numericBoardId = 1;
    const mockCard = { id: numericId, title: 'Old Title', description: 'Old Description' };
    const mockBoardUser = { userId: mockRequest.user?.id, boardId: numericBoardId };

    repoMock.findOne.mockResolvedValueOnce(mockCard);
    repoMock.findOne.mockResolvedValueOnce(mockBoardUser);

    await updateCard(mockRequest as Request, mockResponse as Response);

    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: numericId } });
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { userId: mockRequest.user?.id, boardId: numericBoardId },
    });
    expect(repoMock.save).toHaveBeenCalledWith(expect.objectContaining({ id: numericId }));
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'success',
      card: expect.objectContaining({ id: numericId }),
    });
  });

  it('should handle case where card is not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await updateCard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Card not found!' });
  });

  it('should handle case where user is not a member of the board', async () => {
    const numericId = 1;
    const numericBoardId = 1;
    const mockCard = { id: numericId };

    repoMock.findOne.mockResolvedValueOnce(mockCard);
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await updateCard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: numericId } });
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { userId: mockRequest.user?.id, boardId: numericBoardId },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Cannot update this card! You are not a member of this board',
    });
  });

  it('should handle internal server error during card update', async () => {
    const numericId = 1;
    const errorMessage = 'Internal Server Error';
    const mockCard = { id: numericId, title: 'Old Title', description: 'Old Description' };
    const mockBoardUser = { userId: mockRequest.user?.id, boardId: 1 };

    repoMock.findOne.mockResolvedValueOnce(mockCard);
    repoMock.findOne.mockResolvedValueOnce(mockBoardUser);
    repoMock.save.mockRejectedValueOnce(new Error(errorMessage));

    await updateCard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: numericId } });
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { userId: mockRequest.user?.id, boardId: 1 },
    });
    expect(repoMock.save).toHaveBeenCalledWith(expect.objectContaining({ id: numericId }));
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
  });
});

describe('Archive state for card endpoint', () => {
  it('should archive the card successfully', async () => {
    const mockCard = { id: 1, isArchived: false };
    repoMock.findOne.mockResolvedValueOnce(mockCard);
    repoMock.save.mockResolvedValueOnce(mockCard);

    await archiveState(mockRequest as Request, mockResponse as Response, true);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(repoMock.save).toHaveBeenCalledWith({ ...mockCard, isArchived: true });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'success',
      card: { ...mockCard, isArchived: true },
    });
  });

  it('should unarchive the card successfully', async () => {
    const mockCard = { id: 1, isArchived: true };
    repoMock.findOne.mockResolvedValueOnce(mockCard);
    repoMock.save.mockResolvedValueOnce(mockCard);

    await archiveState(mockRequest as Request, mockResponse as Response, false);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(repoMock.save).toHaveBeenCalledWith({ ...mockCard, isArchived: false });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'success',
      card: { ...mockCard, isArchived: false },
    });
  });

  it('should handle card not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(null);

    await archiveState(mockRequest as Request, mockResponse as Response, true);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Card not found!' });
  });

  it('should handle errors during archiving', async () => {
    const error = new Error('Test error');
    repoMock.findOne.mockRejectedValueOnce(error);

    await archiveState(mockRequest as Request, mockResponse as Response, true);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Test error' });
  });
});

describe('Get all card endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      params: { listId: '1' },
      user: { id: 1, fullName: 'fake_name' },
    };
  });

  it('should fetch all cards successfully', async () => {
    const numericListId = 1;
    const mockList = { id: numericListId, board: { id: 1 } };
    const mockUser = { id: 1 };
    const mockBoardUser = { userId: mockUser.id, boardId: mockList.board.id };
    const mockCards = [
      { id: 1, title: 'Card 1' },
      { id: 2, title: 'Card 2' },
    ];

    repoMock.findOne.mockResolvedValueOnce(mockList);
    repoMock.findOne.mockResolvedValueOnce(mockBoardUser);
    repoMock.find.mockResolvedValueOnce(mockCards);

    await getAllCard(mockRequest as Request, mockResponse as Response);

    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: numericListId },
      relations: ['board'],
    });
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { userId: mockUser.id, boardId: mockList.board.id },
    });
    expect(repoMock.find).toHaveBeenCalledWith({
      where: { list: { id: numericListId }, isArchived: false },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'success', cards: mockCards });
  });

  it('should handle case where list is not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await getAllCard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['board'] });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'List not found' });
  });

  it('should handle case where user does not have permission', async () => {
    const numericListId = 1;
    const mockList = { id: numericListId, board: { id: 1 } };
    const mockUser = { id: 1 };

    repoMock.findOne.mockResolvedValueOnce(mockList);
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await getAllCard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: numericListId },
      relations: ['board'],
    });
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { userId: mockUser.id, boardId: mockList.board.id },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'You do not have permission to show cards!',
    });
  });

  it('should handle internal server error during card fetch', async () => {
    const numericListId = 1;
    const errorMessage = 'Internal Server Error';
    const mockList = { id: numericListId, board: { id: 1 } };
    const mockUser = { id: 1 };
    const mockBoardUser = { userId: mockUser.id, boardId: mockList.board.id };

    repoMock.findOne.mockResolvedValueOnce(mockList);
    repoMock.findOne.mockResolvedValueOnce(mockBoardUser);
    repoMock.find.mockRejectedValueOnce(new Error(errorMessage));

    await getAllCard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: numericListId },
      relations: ['board'],
    });
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { userId: mockUser.id, boardId: mockList.board.id },
    });
    expect(repoMock.find).toHaveBeenCalledWith({
      where: { list: { id: numericListId }, isArchived: false },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
  });
});

describe('Add member to card endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      params: { id: '1' },
      body: { email: 'fake_email' },
      user: { id: 1, fullName: 'fake_name' },
    };
  });

  it('should add the user to the card successfully', async () => {
    const numericCardId = 1;
    const mockCard = { id: numericCardId, title: 'Card 1', users: [] };
    const mockUser = { id: 2, email: 'fake_email' };

    repoMock.findOne.mockResolvedValueOnce(mockCard);
    repoMock.findOne.mockResolvedValueOnce(mockUser);

    await addMemberToCard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: numericCardId },
      relations: ['users'],
    });
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { email: 'fake_email' } });
    expect(repoMock.save).toHaveBeenCalledWith({ ...mockCard, users: [mockUser] });
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'success' });
  });

  it('should handle case where card is not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await addMemberToCard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['users'],
    });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Card not found!' });
  });

  it('should handle case where user is not found', async () => {
    const numericCardId = 1;
    repoMock.findOne.mockResolvedValueOnce({ id: numericCardId, title: 'Card 1', users: [] });
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await addMemberToCard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: numericCardId },
      relations: ['users'],
    });
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { email: 'fake_email' } });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found!' });
  });

  it('should handle case where user is already a member of the card', async () => {
    const numericCardId = 1;
    const mockCard = { id: numericCardId, title: 'Card 1', users: [{ id: 2 }] };
    const mockUser = { id: 2, email: 'fake_email' };
    repoMock.findOne.mockResolvedValueOnce(mockCard);
    repoMock.findOne.mockResolvedValueOnce(mockUser);

    await addMemberToCard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: numericCardId },
      relations: ['users'],
    });
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { email: 'fake_email' } });
    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'User is already a member of this card!',
    });
  });

  it('should handle internal server error during card update', async () => {
    const numericCardId = 1;
    const mockCard = { id: numericCardId, title: 'Card 1', users: [] };
    const mockUser = { id: 2, email: 'fake_email' };
    const errorMessage = 'Internal Server Error';
    repoMock.findOne.mockResolvedValueOnce(mockCard);
    repoMock.findOne.mockResolvedValueOnce(mockUser);
    repoMock.save.mockRejectedValueOnce(new Error(errorMessage));

    await addMemberToCard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: numericCardId },
      relations: ['users'],
    });
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { email: 'fake_email' } });
    expect(repoMock.save).toHaveBeenCalledWith({ ...mockCard, users: [mockUser] });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
  });
});

describe('Delete member from card endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      params: { id: '1', userId: '2' },
      user: { id: 1, fullName: 'fake_name' },
    };
  });

  it('should remove user from the card successfully', async () => {
    const numericCardId = 1;
    const numericUserId = 2;
    const mockCard = { id: numericCardId, title: 'Card 1', users: [{ id: numericUserId }] };
    repoMock.findOne.mockResolvedValueOnce(mockCard);

    await deleteMemberFromCard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: numericCardId },
      relations: ['users'],
    });
    expect(repoMock.save).toHaveBeenCalledWith({ ...mockCard, users: [] });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'success' });
  });

  it('should handle case where card is not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await deleteMemberFromCard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['users'],
    });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Card not found!' });
  });

  it('should handle case where user is not found in the card', async () => {
    const numericCardId = 1;
    const mockCard = { id: numericCardId, title: 'Card 1', users: [{ id: 3 }] };

    repoMock.findOne.mockResolvedValueOnce(mockCard);

    await deleteMemberFromCard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: numericCardId },
      relations: ['users'],
    });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found in the card!' });
  });

  it('should handle internal server error during card update', async () => {
    const numericCardId = 1;
    const numericUserId = 2;
    const errorMessage = 'Internal Server Error';
    const mockCard = { id: numericCardId, title: 'Card 1', users: [{ id: numericUserId }] };

    repoMock.findOne.mockResolvedValueOnce(mockCard);
    repoMock.save.mockRejectedValueOnce(new Error(errorMessage));

    await deleteMemberFromCard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: numericCardId },
      relations: ['users'],
    });
    expect(repoMock.save).toHaveBeenCalledWith({ ...mockCard, users: [] });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
  });
});

describe('Get all members for card endpoint', () => {
  it('should fetch members for a card successfully', async () => {
    const mockCard = {
      id: 1,
      users: [
        { id: 2, name: 'User1' },
        { id: 3, name: 'User2' },
      ],
    };
    repoMock.findOne.mockResolvedValueOnce(mockCard);

    await getAllMembersForCard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['users'],
    });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'success',
      members: mockCard.users,
    });
  });

  it('should handle card not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(null);

    await getAllMembersForCard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: expect.any(Number) },
      relations: ['users'],
    });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Card not found!' });
  });

  it('should handle internal server error', async () => {
    repoMock.findOne.mockRejectedValueOnce(new Error('Test error'));

    await getAllMembersForCard(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: expect.any(Number) },
      relations: ['users'],
    });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Test error' });
  });
});

describe('Log activity endpoint', () => {
  it('should log activity successfully', async () => {
    const mockUser = { id: 1, name: 'fake_name' };
    const mockCard = { id: 2, title: 'Test Card' };
    const mockAction = 'Some Action';
    const expectedLog = {
      user: mockUser,
      action: mockAction,
      timestamp: expect.any(Date),
      card: mockCard,
    };
    repoMock.create.mockReturnValueOnce(expectedLog);

    await logActivity(mockUser, mockAction, mockCard as Card);
    expect(repoMock.create).toHaveBeenCalledWith(expectedLog);
    expect(repoMock.save).toHaveBeenCalledWith(expectedLog);
  });

  it('should handle error while logging activity', async () => {
    const mockUser = { id: 1, name: 'fake_name' };
    const mockCard = { id: 2, title: 'Test Card' };
    const mockAction = 'Some Action';
    repoMock.create.mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    await logActivity(mockUser, mockAction, mockCard as Card);
    expect(repoMock.create).toHaveBeenCalled();
    expect(repoMock.save).not.toHaveBeenCalled();
  });
});

describe('Get activities for card endpoint', () => {
  it('should fetch card activities successfully', async () => {
    const mockCardId = 1;
    const mockActivities = [
      { id: 1, action: 'Action 1' },
      { id: 2, action: 'Action 2' },
    ];
    repoMock.find.mockResolvedValueOnce(mockActivities);
    const mockRequest = { params: { id: mockCardId.toString() } } as any;
    const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    await getActivities(mockRequest, mockResponse);
    expect(repoMock.find).toHaveBeenCalledWith({ where: { card: { id: mockCardId } } });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'success',
      activities: mockActivities,
    });
  });

  it('should handle error while fetching card activities', async () => {
    const mockCardId = 1;
    repoMock.find.mockRejectedValueOnce(new Error('Test error'));
    const mockRequest = { params: { id: mockCardId.toString() } } as any;
    const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    await getActivities(mockRequest, mockResponse);
    expect(repoMock.find).toHaveBeenCalledWith({ where: { card: { id: mockCardId } } });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Test error' });
  });
});

describe('Add comment endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      params: { cardId: '1' },
      body: { content: 'Test Comment' },
      user: { id: 1, fullName: 'fake_name' },
    };
  });

  it('should add the comment successfully', async () => {
    const numericCardId = 1;
    const mockCard = { id: numericCardId, title: 'Test Card' };
    const mockComment = { id: 1, content: 'Test Comment', user: mockRequest.user, card: mockCard };

    repoMock.findOne.mockResolvedValueOnce(mockCard);
    repoMock.create.mockReturnValueOnce(mockComment);
    repoMock.save.mockResolvedValueOnce(mockComment);

    await addComment(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: numericCardId } });
    expect(repoMock.create).toHaveBeenCalledWith({
      content: 'Test Comment',
      user: mockRequest.user,
      card: mockCard,
    });
    expect(repoMock.save).toHaveBeenCalledWith(mockComment);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'success', comment: mockComment });
  });

  it('should handle case where card is not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await addComment(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(repoMock.save).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Card not found!' });
  });

  it('should handle errors during comment creation', async () => {
    const numericCardId = 1;
    const mockCard = { id: numericCardId, title: 'Test Card' };

    repoMock.findOne.mockResolvedValueOnce(mockCard);
    repoMock.create.mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    });

    await addComment(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: numericCardId } });
    expect(repoMock.create).toHaveBeenCalledWith({
      content: 'Test Comment',
      user: mockRequest.user,
      card: mockCard,
    });
    expect(repoMock.save).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
    });
  });
});

describe('Delete comment endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      params: { id: '1' },
    };
  });

  it('should delete the comment successfully', async () => {
    const numericCommentId = 1;
    const mockComment = { id: numericCommentId, text: 'Test Comment' };

    repoMock.findOne.mockResolvedValueOnce(mockComment);
    repoMock.remove.mockResolvedValueOnce({} as any);

    await deleteComment(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: numericCommentId },
    });
    expect(repoMock.remove).toHaveBeenCalled();
    const removeCalls = repoMock.remove.mock.calls;
    expect(removeCalls.length).toBe(1);
    const [arg] = removeCalls[0];
    expect(arg).toEqual(mockComment);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'success' });
  });

  it('should handle case where comment is not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await deleteComment(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(repoMock.remove).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Comment not found!' });
  });

  it('should handle errors during deletion', async () => {
    const numericCommentId = 1;
    repoMock.findOne.mockResolvedValueOnce({ id: numericCommentId });
    repoMock.remove.mockRejectedValueOnce(new Error('Test error'));

    await deleteComment(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: numericCommentId },
    });
    expect(repoMock.remove).toHaveBeenCalled();
    const removeCalls = repoMock.remove.mock.calls;
    expect(removeCalls.length).toBe(1);
    const [arg] = removeCalls[0];
    expect(arg).toEqual({ id: numericCommentId });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Test error',
    });
  });
});

describe('Edit comment endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      params: { id: '1' },
      body: { content: 'Updated Content' },
    };
  });

  it('should update the comment successfully', async () => {
    const numericCommentId = 1;
    const mockComment = { id: numericCommentId, content: 'Old Content' };

    repoMock.findOne.mockResolvedValueOnce(mockComment);

    await editComment(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: numericCommentId } });
    expect(repoMock.save).toHaveBeenCalledWith({ ...mockComment, content: 'Updated Content' });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'success',
      comment: expect.any(Object),
    });
  });

  it('should handle case where comment is not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await editComment(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(repoMock.save).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Comment not found!' });
  });
});

describe('Get all comments endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      params: { cardId: '1' },
    };
  });

  it('should fetch comments successfully', async () => {
    const numericCardId = 1;
    const mockComments = [{ id: 1, content: 'Comment 1' }];

    repoMock.find.mockResolvedValueOnce(mockComments);

    await getAllComments(mockRequest as Request, mockResponse as Response);

    expect(repoMock.find).toHaveBeenCalledWith({ where: { card: { id: numericCardId } } });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'success', comments: mockComments });
  });

  it('should handle errors during comment fetching', async () => {
    const numericCardId = 1;
    repoMock.find.mockRejectedValueOnce(new Error('Internal Server Error'));

    await getAllComments(mockRequest as Request, mockResponse as Response);

    expect(repoMock.find).toHaveBeenCalledWith({ where: { card: { id: numericCardId } } });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});
