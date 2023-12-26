import { authenticate, authenticateNewUser } from '../utilities/authUtils';

describe('Workspace API Tests', () => {
  let existingUser;
  beforeEach(() => {
    cy.fixture('existingUserInfo').then((user) => {
      existingUser = user;
    });
    authenticate().then((token) => {
      Cypress.env('authToken', token);
    });
    authenticateNewUser().then((token) => {
      Cypress.env('authTokenNewUser', token);
    });
  });

  describe('createWorkspace API', () => {
    it('should create a new workspace successfully', () => {
      const workspaceName = 'NewWorkspace';
      const workspaceType = 'Private';
      const workspaceDescription = 'This is a new workspace.';

      cy.request({
        method: 'POST',
        url: '/w/',
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          name: workspaceName,
          type: workspaceType,
          description: workspaceDescription,
        },
      }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body.message).to.equal('success');
        expect(response.body.newWorkspace.name).to.equal(workspaceName);
      });
    });

    it('should handle duplicate workspace names', () => {
      const existingWorkspace = 'ExistingWorkspace';
      const workspaceType = 'Public';
      const workspaceDescription = 'This is an existing workspace.';

      cy.request({
        method: 'POST',
        url: '/w/',
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          name: existingWorkspace,
          type: workspaceType,
          description: workspaceDescription,
        },
      }).then((response) => {
        expect(response.status).to.equal(409);
        expect(response.body.message).to.equal('Workspace name already exists!');
      });
    });

    it('should handle unauthorized requests', () => {
      const workspaceName = 'UnauthorizedWorkspace';
      const workspaceType = 'Private';
      const workspaceDescription = 'This is an unauthorized workspace.';

      cy.request({
        method: 'POST',
        url: '/w/',
        body: {
          name: workspaceName,
          type: workspaceType,
          description: workspaceDescription,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal('Invalid token');
      });
    });
  });

  describe('getSpecificWorkspace API', () => {
    it('should get a specific workspace successfully', () => {
      const existingWorkspaceId = 7;

      cy.request({
        method: 'GET',
        url: `/w/${existingWorkspaceId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
        expect(response.body.workspace).to.exist;
      });
    });

    it('should handle workspace not found with 404 status', () => {
      const nonExistingWorkspaceId = 999;

      cy.request({
        method: 'GET',
        url: `/w/${nonExistingWorkspaceId}`,
        headers: {
          Authorization: Cypress.env('authTokenNewUser'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Workspace not found!');
      });
    });
  });

  describe('getAllWorkspace API', () => {
    it('should get all workspaces for the user', () => {
      cy.request({
        method: 'GET',
        url: '/w',
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
        expect(response.body.workspaces).to.exist;
      });
    });

    it('should handle no workspaces found for the user', () => {
      cy.intercept('GET', '/w', {
        statusCode: 404,
        body: { message: 'No workspaces found for you' },
      });
      cy.request({
        method: 'GET',
        url: '/w',
        headers: {
          Authorization: Cypress.env('authTokenNewUser'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('No workspaces found for you');
      });
    });
  });

  describe('deleteWorkspace API', () => {
    it('should handle workspace not found', () => {
      const nonExistingWorkspaceId = 999;
      cy.request({
        method: 'DELETE',
        url: `/w/${nonExistingWorkspaceId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Workspace not found!');
      });
    });
    it('should handle user not being an member', () => {
      const workspaceId = 8;
      cy.request({
        method: 'DELETE',
        url: `/w/${workspaceId}`,
        headers: {
          Authorization: Cypress.env('authTokenNewUser'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(403);
        expect(response.body.message).to.equal(
          'Can not delete this workspace! You are not a member of this workspace',
        );
      });
    });
    it('should successfully delete the workspace', () => {
      const adminWorkspaceId = 16;
      cy.request({
        method: 'DELETE',
        url: `/w/${adminWorkspaceId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
      });
    });
  });

  describe('updateWorkspace API', () => {
    it('should update workspace successfully', () => {
      const workspaceId = 17;

      cy.request({
        method: 'PUT',
        url: `/w/${workspaceId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          name: 'NewWorkspaceName',
          type: 'UpdatedType',
          description: 'UpdatedDescription',
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
      });
    });

    it('should handle updating with an existing workspace name', () => {
      const workspaceId = 17;
      const existingWorkspaceName = 'ExistingWorkspace';

      cy.request({
        method: 'PUT',
        url: `/w/${workspaceId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          name: existingWorkspaceName,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(409);
        expect(response.body.message).to.equal('This workspace already exists!');
      });
    });

    it('should handle updating a non-existing workspace', () => {
      const nonExistingWorkspaceId = 999;

      cy.request({
        method: 'PUT',
        url: `/w/${nonExistingWorkspaceId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          name: 'NewWorkspaceName',
          type: 'UpdatedType',
          description: 'UpdatedDescription',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Workspace not found!');
      });
    });

    it('should handle user not being a member of the workspace', () => {
      const workspaceId = 8;

      cy.request({
        method: 'PUT',
        url: `/w/${workspaceId}`,
        headers: {
          Authorization: Cypress.env('authTokenNewUser'),
        },
        body: {
          name: 'NewWorkspaceName',
          type: 'UpdatedType',
          description: 'UpdatedDescription',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(403);
        expect(response.body.message).to.equal(
          'Can not update this workspace! You are not a member of this workspace',
        );
      });
    });
  });

  describe('addUserToWorkspace API', () => {
    it('should successfully add user to workspace', () => {
      const workspaceId = 1;
      const userEmail = 'new@test.com';

      cy.request({
        method: 'POST',
        url: `/w/${workspaceId}/members`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          email: userEmail,
        },
      }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body.message).to.equal('success');
      });
    });

    it('should handle user already a member of the workspace', () => {
      const workspaceId = 1;
      const userEmail = existingUser.email;

      cy.request({
        method: 'POST',
        url: `/w/${workspaceId}/members`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          email: userEmail,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(409);
        expect(response.body.message).to.equal('User is already a member of this workspace!');
      });
    });

    it('should handle user not found', () => {
      const workspaceId = 1;
      const unknownUserEmail = 'unknown_user@example.com';

      cy.request({
        method: 'POST',
        url: `/w/${workspaceId}/members`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          email: unknownUserEmail,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('User not found!');
      });
    });
  });

  describe('removeUserFromWorkspace API', () => {
    it('should successfully remove user from workspace', () => {
      const workspaceId = 1;
      const userId = 52;

      cy.request({
        method: 'DELETE',
        url: `/w/${workspaceId}/members/${userId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
      });
    });

    it('should handle user not a member of the workspace', () => {
      const workspaceId = 1;
      const nonMemberUserId = 999;

      cy.request({
        method: 'DELETE',
        url: `/w/${workspaceId}/members/${nonMemberUserId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('User is not a member of this workspace!');
      });
    });

    it('should handle workspace not found', () => {
      const unknownWorkspaceId = 999;
      const userId = 1;

      cy.request({
        method: 'DELETE',
        url: `/w/${unknownWorkspaceId}/members/${userId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Workspace not found!');
      });
    });
  });

  describe('getAllMembers API', () => {
    it('should successfully get all members of a workspace', () => {
      const workspaceId = 1;

      cy.request({
        method: 'GET',
        url: `/w/${workspaceId}/members`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
        expect(response.body.members).to.be.an('array');
      });
    });

    it('should handle workspace not found', () => {
      const unknownWorkspaceId = 999;

      cy.request({
        method: 'GET',
        url: `/w/${unknownWorkspaceId}/members`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Workspace not found!');
      });
    });
  });
});
