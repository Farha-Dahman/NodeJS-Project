import './__mocks__/setupTests';
import './__mocks__/mocks';
import { Request, Response } from 'express';
import {
  addUserToWorkspace,
  createWorkspace,
  deleteWorkspace,
  getAllWorkspace,
  getSpecificWorkspace,
  removeUserFromWorkspace,
  updateWorkspace,
} from '../controller/workspace.controller';
import { getAllMembers } from '../controller/workspace.controller';
import { Workspace } from '../entity/Workspace';
import { WorkspaceUser } from '../entity/WorkspaceUser';
import { AuthenticatedRequest } from '../types/types';
import { repoMock } from './__mocks__/setupTests';

let mockRequest: Partial<AuthenticatedRequest>;
let mockResponse: Partial<Response>;
mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe('Create workspace endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      user: { id: 123, fullName: 'fake_name' },
      body: {
        name: 'Test Workspace',
        type: 'Test Type',
        description: 'Test Description',
      },
    };
  });

  it('should create a new workspace', async () => {
    repoMock.findOne.mockResolvedValueOnce(undefined);
    repoMock.create.mockReturnValueOnce({});
    repoMock.save.mockResolvedValueOnce({});

    mockRequest.body = {
      name: 'Test Workspace',
      type: 'Test Type',
      description: 'Test Description',
    };

    await createWorkspace(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'success', newWorkspace: {} });
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { name: 'Test Workspace' } });
    expect(repoMock.create).toHaveBeenCalledWith({
      name: 'Test Workspace',
      type: 'Test Type',
      description: 'Test Description',
    });
    expect(repoMock.save).toHaveBeenCalledWith({});
  });

  it('should handle existing workspace name', async () => {
    repoMock.findOne.mockResolvedValueOnce({});
    mockRequest.body = {
      name: 'Test Workspace',
      type: 'Test Type',
      description: 'Test Description',
    };

    await createWorkspace(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Workspace name already exists!' });
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { name: 'Test Workspace' },
    });
  });

  it('should handle error', async () => {
    (repoMock.findOne as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

    await createWorkspace(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});

describe('Delete workspace endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      user: { id: 123, fullName: 'fake_name' },
    };
  });

  it('should handle workspace not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(undefined);
    mockRequest.params = { id: '123' };

    await deleteWorkspace(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Workspace not found!' });
  });

  it('should handle user not being an admin', async () => {
    const existingWorkspace = new Workspace();
    repoMock.findOne.mockResolvedValueOnce(existingWorkspace);

    repoMock.findOne.mockResolvedValueOnce(undefined);

    mockRequest.params = { id: '123' };
    mockRequest.user = { id: 456, fullName: 'fake_name' };

    await deleteWorkspace(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Can not delete this workspace! You are not a member of this workspace',
    });
  });

  it('should successfully delete the workspace', async () => {
    const existingWorkspace = new Workspace();
    repoMock.findOne.mockResolvedValueOnce(existingWorkspace);

    const adminUser = new WorkspaceUser();
    adminUser.isAdmin = true;
    repoMock.findOne.mockResolvedValueOnce(adminUser);
    mockRequest.params = { id: '123' };
    mockRequest.user = { id: 456, fullName: 'fake_name' };

    await deleteWorkspace(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'success' });
    expect(repoMock.remove).toHaveBeenCalledWith(existingWorkspace);
  });
});

describe('Update workspace endpoint', () => {
  it('should handle workspace not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(undefined);
    mockRequest.params = { id: '123' };

    await updateWorkspace(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Workspace not found!' });
  });

  it('should handle user not being a member', async () => {
    const existingWorkspace = new Workspace();
    repoMock.findOne.mockResolvedValueOnce(existingWorkspace);
    repoMock.findOne.mockResolvedValueOnce(undefined);

    mockRequest.params = { id: '123' };
    mockRequest.user = { id: 456, fullName: 'fake_name' };
    mockRequest.body = { name: 'New Workspace Name' };

    await updateWorkspace(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Can not update this workspace! You are not a member of this workspace',
    });
  });

  it('should create a new workspace successfully', async () => {
    const mockWorkspace = new Workspace();
    mockWorkspace.name = 'TestWorkspace';
    mockWorkspace.type = 'TestType';
    mockWorkspace.description = 'TestDescription';

    repoMock.findOne.mockResolvedValueOnce(null);
    repoMock.create.mockReturnValueOnce(mockWorkspace);
    repoMock.save.mockResolvedValueOnce(mockWorkspace);

    const mockWorkspaceUser = new WorkspaceUser();
    repoMock.create.mockReturnValueOnce(mockWorkspaceUser);
    repoMock.save.mockResolvedValueOnce(mockWorkspaceUser);

    mockRequest.body = {
      name: 'TestWorkspace',
      type: 'TestType',
      description: 'TestDescription',
    };

    await createWorkspace(mockRequest as Request, mockResponse as Response);

    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { name: 'TestWorkspace' },
    });
    expect(repoMock.create).toHaveBeenCalledWith({
      name: 'TestWorkspace',
      type: 'TestType',
      description: 'TestDescription',
    });
    expect(repoMock.save).toHaveBeenCalledWith(mockWorkspace);
    expect(repoMock.create).toHaveBeenCalledWith({
      user: mockRequest.user,
      workspace: mockWorkspace,
      isAdmin: true,
    });
    expect(repoMock.save).toHaveBeenCalledWith(mockWorkspaceUser);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'success',
      newWorkspace: mockWorkspace,
    });
  });
});

describe('Get all members of workspace endpoint', () => {
  mockRequest = {
    params: {
      id: '1',
    },
  };

  it('should fetch all members successfully', async () => {
    const numericWorkspaceId = 123;
    const mockWorkspace = { id: numericWorkspaceId };
    const mockWorkspaceUser1 = { id: 1, user: { id: 101, name: 'User 1' } };
    const mockWorkspaceUser2 = { id: 2, user: { id: 102, name: 'User 2' } };

    repoMock.findOne.mockResolvedValueOnce(mockWorkspace);
    repoMock.find.mockResolvedValueOnce([mockWorkspaceUser1, mockWorkspaceUser2]);

    await getAllMembers(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: numericWorkspaceId },
    });
    expect(repoMock.find).toHaveBeenCalledWith({
      where: { workspaceId: numericWorkspaceId },
      relations: ['user'],
    });

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'success',
      members: [mockWorkspaceUser1.user, mockWorkspaceUser2.user],
    });
  });

  it('should handle workspace not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await getAllMembers(mockRequest as Request, mockResponse as Response);

    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 123 },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Workspace not found!' });
  });

  it('should handle internal server error', async () => {
    repoMock.findOne.mockRejectedValueOnce(new Error('Internal Server Error'));

    await getAllMembers(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 123 },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});

describe('Remove user from workspace endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      params: { id: '1', userId: '123' },
      user: { id: 123, fullName: 'fake_name' },
    };
    repoMock.findOne.mockReset();
    repoMock.remove.mockReset();
  });

  it('should remove user from workspace successfully', async () => {
    const mockWorkspaceUser = { userId: 123, workspaceId: 1 };
    const mockWorkspace = { id: 1, name: 'Test Workspace' };

    repoMock.findOne.mockResolvedValueOnce(mockWorkspace);
    repoMock.findOne.mockResolvedValueOnce(mockWorkspaceUser);
    repoMock.remove.mockResolvedValueOnce({});

    await removeUserFromWorkspace(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { userId: 123, workspaceId: 1 },
    });
    expect(repoMock.remove).toHaveBeenCalledWith(mockWorkspaceUser);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'success' });
  });

  it('should handle workspace not found', async () => {
    const mockWorkspaceId = '1';
    const mockUserId = '2';
    repoMock.findOne.mockResolvedValueOnce(null);
    mockRequest.params = { id: mockWorkspaceId, userId: mockUserId };

    await removeUserFromWorkspace(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: parseInt(mockWorkspaceId, 10) },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Workspace not found!' });
  });

  it('should handle user not a member of the workspace', async () => {
    const mockWorkspaceId = '1';
    const mockUserId = '2';
    const mockWorkspace = new Workspace();
    mockWorkspace.id = parseInt(mockWorkspaceId, 10);

    repoMock.findOne.mockResolvedValueOnce(mockWorkspace);
    repoMock.findOne.mockResolvedValueOnce(null);

    mockRequest.params = { id: mockWorkspaceId, userId: mockUserId };

    await removeUserFromWorkspace(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: mockWorkspace.id },
    });
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { userId: parseInt(mockUserId, 10), workspaceId: mockWorkspace.id },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'User is not a member of this workspace!',
    });
  });

  it('should handle errors when removing user from workspace', async () => {
    const mockWorkspaceId = '1';
    const mockUserId = '2';

    const mockWorkspace = new Workspace();
    mockWorkspace.id = parseInt(mockWorkspaceId, 10);

    const mockWorkspaceUser = new WorkspaceUser();
    mockWorkspaceUser.userId = parseInt(mockUserId, 10);
    mockWorkspaceUser.workspaceId = mockWorkspace.id;

    repoMock.findOne.mockResolvedValueOnce(mockWorkspace);
    repoMock.findOne.mockResolvedValueOnce(mockWorkspaceUser);
    repoMock.remove.mockRejectedValueOnce(new Error('Mocked error'));

    mockRequest.params = { id: mockWorkspaceId, userId: mockUserId };

    await removeUserFromWorkspace(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: mockWorkspace.id },
    });
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { userId: mockWorkspaceUser.userId, workspaceId: mockWorkspace.id },
    });
    expect(repoMock.remove).toHaveBeenCalledWith(mockWorkspaceUser);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Mocked error',
    });
  });
});

describe('Get specific workspace endpoint', () => {
  const mockUser = { id: 123, fullName: 'fake_name' };
  const mockWorkspace = { id: 1, name: 'Test Workspace' };
  const numericId = 1;

  it('should show a specific workspace successfully', async () => {
    repoMock.findOne.mockResolvedValueOnce(mockUser).mockResolvedValueOnce(mockWorkspace);

    await getSpecificWorkspace(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { userId: mockUser.id, workspaceId: numericId },
    });
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: numericId } });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'success',
      workspace: mockWorkspace,
    });
  });

  it('should handle user not being a member', async () => {
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await getSpecificWorkspace(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { userId: mockUser.id, workspaceId: numericId },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Access denied! You not a member of this workspace',
    });
  });

  it('should handle workspace not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(mockUser);
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await getSpecificWorkspace(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { userId: mockUser.id, workspaceId: numericId },
    });
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: numericId } });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Workspace not found!' });
  });
});

describe('Add user to workspace endpoint', () => {
  beforeEach(() => {
    mockRequest = {
      params: { id: '1' },
      body: { email: 'fake_email' },
      user: { id: 1, fullName: 'fake_name' },
    };
  });

  it('should add user to workspace successfully', async () => {
    const workspace = { id: 1, name: 'Workspace 1' };
    const newUser = { id: 2, email: 'fake_email' };
    repoMock.findOne.mockResolvedValueOnce(workspace);
    repoMock.findOne.mockResolvedValueOnce(newUser);
    repoMock.findOne.mockResolvedValueOnce(undefined);
    const createSpy = jest.spyOn(repoMock, 'create');
    repoMock.save.mockResolvedValueOnce({});

    await addUserToWorkspace(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { email: 'fake_email' } });
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { userId: 2, workspaceId: 1 },
    });
    expect(createSpy).toHaveBeenCalledWith({
      userId: 2,
      workspaceId: 1,
      isAdmin: false,
    });
    expect(repoMock.save).toHaveBeenCalledWith(createSpy.mock.results[0].value);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'success' });
  });

  it('should handle workspace not found', async () => {
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await addUserToWorkspace(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Workspace not found!' });
  });

  it('should handle user not found', async () => {
    repoMock.findOne.mockResolvedValueOnce({ id: 1, name: 'Workspace 1' });
    repoMock.findOne.mockResolvedValueOnce(undefined);

    await addUserToWorkspace(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { email: 'fake_email' } });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found!' });
  });

  it('should handle user already a member', async () => {
    repoMock.findOne.mockResolvedValueOnce({ id: 1, name: 'Workspace 1' });
    repoMock.findOne.mockResolvedValueOnce({ id: 2, email: 'fake_email' });
    repoMock.findOne.mockResolvedValueOnce({ userId: 2, workspaceId: 1 });

    await addUserToWorkspace(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { email: 'fake_email' } });
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { userId: 2, workspaceId: 1 },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'User is already a member of this workspace!',
    });
  });

  it('should handle internal server error', async () => {
    repoMock.findOne.mockRejectedValueOnce(new Error('Internal Server Error'));

    await addUserToWorkspace(mockRequest as Request, mockResponse as Response);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});

describe('Get all workspace endpoint', () => {
  it('should handle case where no workspaces found for the user', async () => {
    repoMock.find.mockResolvedValueOnce([]);

    await getAllWorkspace(mockRequest as Request, mockResponse as Response);
    expect(repoMock.find).toHaveBeenCalledWith({
      where: { userId: 1 },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'No workspaces found for you',
    });
  });

  it('should handle internal server error when fetching user workspaces', async () => {
    repoMock.find.mockRejectedValueOnce(new Error('Internal Server Error'));

    await getAllWorkspace(mockRequest as Request, mockResponse as Response);
    expect(repoMock.find).toHaveBeenCalledWith({
      where: { userId: 1 },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
    });
  });
});
