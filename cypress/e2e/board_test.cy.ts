import { authenticate, authenticateNewUser } from '../utilities/authUtils';

describe('Board APIs', () => {
  let newUser, existingUser;
  beforeEach(function () {
    cy.fixture('existingUserInfo').then((user) => {
      existingUser = user;
    });
    cy.fixture('newUserInfo').then((user) => {
      newUser = user;
    });
    authenticate().then((token) => {
      Cypress.env('authToken', token);
    });
    authenticateNewUser().then((token) => {
      Cypress.env('authTokenNewUser', token);
    });
  });

  describe('createBoard API', () => {
    it('should create a new board successfully', () => {
      const boardData = {
        name: 'New Board',
        WorkspaceName: 'ExistingWorkspace',
        isPublic: true,
      };

      cy.request({
        method: 'POST',
        url: '/b',
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: boardData,
      }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body.message).to.equal('success');
        expect(response.body.board).to.have.property('name', boardData.name);
        expect(response.body.board).to.have.property('isPublic', boardData.isPublic);
      });
    });

    it('should handle missing workspace', () => {
      const boardData = {
        name: 'New Board',
        WorkspaceName: 'NonExistentWorkspace',
        isPublic: true,
      };

      cy.request({
        method: 'POST',
        url: '/b',
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: boardData,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Workspace not found');
      });
    });

    it('should handle duplicate board names', () => {
      const existingBoard = 'test_board';
      const workspaceName = 'test_workspace';
      const isPublic = true;

      cy.request({
        method: 'POST',
        url: '/b',
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          name: existingBoard,
          workspace: workspaceName,
          isPublic: isPublic,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(409);
        expect(response.body.message).to.equal('Board name already exists!');
      });
    });
  });

  describe('closeBoard API', () => {
    it('should close the board successfully', () => {
      const boardId = 4;
      cy.request({
        method: 'POST',
        url: `/b/${boardId}/close`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          name: 'Test Board',
          WorkspaceName: 'Test Workspace',
          isPublic: true,
        },
      }).then((boardResponse) => {
        cy.request({
          method: 'PATCH',
          url: 'b/4/close',
          headers: {
            Authorization: Cypress.env('authToken'),
          },
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body.message).to.equal('Board closed successfully');
        });
      });
    });

    it('should handle closing a non-existing board', () => {
      const boardId = 999;

      cy.request({
        method: 'PATCH',
        url: `/b/${boardId}/close`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Board not found!');
      });
    });

    it('should handle unauthorized access', () => {
      const boardId = 1;
      cy.request({
        method: 'PATCH',
        url: `/b/${boardId}/close`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal('Invalid token');
      });
    });
  });

  describe('reopenBoard API', () => {
    it('should reopen the board successfully', () => {
      const boardId = 1;
      cy.request({
        method: 'PATCH',
        url: `/b/${boardId}/close`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((closeResponse) => {
        expect(closeResponse.status).to.equal(200);

        cy.request({
          method: 'PATCH',
          url: `/b/${boardId}/re-open`,
          headers: {
            Authorization: Cypress.env('authToken'),
          },
        }).then((reopenResponse) => {
          expect(reopenResponse.status).to.equal(200);
          expect(reopenResponse.body.message).to.equal('Board opened successfully');
        });
      });
    });

    it('should handle reopening a non-existing board', () => {
      cy.request({
        method: 'PATCH',
        url: '/b/999/re-open',
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Board not found!');
      });
    });

    it('should handle unauthorized access', () => {
      const boardId = 1;

      cy.request({
        method: 'PATCH',
        url: `/b/${boardId}/re-open`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal('Invalid token');
      });
    });
  });

  describe('getAllOpenBoards API', () => {
    it('should get all open boards in a workspace successfully', () => {
      const workspaceId = 1;
      cy.request({
        method: 'GET',
        url: `/b/${workspaceId}/boards`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
        expect(response.body.boards).to.be.an('array');
      });
    });

    it('should handle getting open boards in a non-existing workspace', () => {
      cy.request({
        method: 'GET',
        url: '/b/999/boards',
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Workspace not found');
      });
    });

    it('should handle unauthorized access', () => {
      const workspaceId = 1;

      cy.request({
        method: 'GET',
        url: `/b/${workspaceId}/boards`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal('Invalid token');
      });
    });
  });

  describe('getSpecificBoard endpoint', () => {
    it('should get a specific open board in a workspace successfully', () => {
      const workspaceId = 8;
      const boardId = 5;
      cy.request({
        method: 'GET',
        url: `/b/${workspaceId}/boards/${boardId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
        expect(response.body.board).to.not.be.null;
        expect(response.body.board.isClosed).to.equal(false);
      });
    });

    it('should handle getting a specific board in a non-existing workspace', () => {
      const boardId = 999;
      cy.request({
        method: 'GET',
        url: `/b/999/boards/${boardId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Workspace not found');
      });
    });

    it('should handle getting a specific board in a non-existing board', () => {
      const workspaceId = 1;
      cy.request({
        method: 'GET',
        url: `/b/${workspaceId}/boards/999`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Board not found in this workspace!');
      });
    });

    it('should handle unauthorized access', () => {
      const workspaceId = 1;
      const boardId = 1;
      cy.request({
        method: 'GET',
        url: `/b/${workspaceId}/boards/${boardId}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal('Invalid token');
      });
    });

    it('should handle getting a closed board', () => {
      const workspaceId = 8;
      const boardId = 1;
      cy.request({
        method: 'PATCH',
        url: `/b/${boardId}/close`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((closeResponse) => {
        expect(closeResponse.status).to.equal(200);

        cy.request({
          method: 'GET',
          url: `/b/${workspaceId}/boards/${boardId}`,
          headers: {
            Authorization: Cypress.env('authToken'),
          },
          failOnStatusCode: false,
        }).then((getResponse) => {
          expect(getResponse.status).to.equal(403);
          expect(getResponse.body.message).to.equal(
            'Cannot show board because it is closed. Please re-open and try again.',
          );
        });
      });
    });
  });

  describe('deleteBoard endpoint', () => {
    it('should delete a board successfully', () => {
      const boardId = 99;
      cy.request({
        method: 'DELETE',
        url: `/b/${boardId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
      });
    });

    it('should handle deleting a non-existing board', () => {
      cy.request({
        method: 'DELETE',
        url: '/b/999',
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Board not found!');
      });
    });

    it('should handle unauthorized deletion', () => {
      const boardId = 1;
      cy.request({
        method: 'DELETE',
        url: `/b/${boardId}`,
        headers: {
          Authorization: Cypress.env('authTokenNewUser'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(403);
        expect(response.body.message).to.equal('You do not have permission to delete this board!');
      });
    });
  });

  describe('updateBoard API', () => {
    it('should update the board name', () => {
      const newName = 'Updated Board Name';
      const boardId = 1;

      cy.request({
        method: 'PUT',
        url: `/b/${boardId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          name: newName,
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Board updated successfully');
        expect(response.body.board.name).to.equal(newName);
      });
    });

    it('should update the board workspace', () => {
      const newWorkspaceName = 'test_worckspace';
      const boardId = 1;
      cy.request({
        method: 'PUT',
        url: `/b/${boardId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          workspaceName: newWorkspaceName,
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Board updated successfully');
        expect(response.body.board.workspace.name).to.equal(newWorkspaceName);
      });
    });

    it('should update the board visibility', () => {
      const newVisibility = false;
      const boardId = 1;
      cy.request({
        method: 'PUT',
        url: `/b/${boardId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          isPublic: newVisibility,
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Board updated successfully');
        expect(response.body.board.isPublic).to.equal(newVisibility);
      });
    });
  });

  describe('addMemberToBoard API', () => {
    it('should add a member to the board', () => {
      const userEmail = 'test@example.com';
      const boardId = 99;
      cy.request({
        method: 'POST',
        url: `/b/${boardId}/members`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          email: userEmail,
        },
      }).then((addMemberResponse) => {
        expect(addMemberResponse.status).to.equal(201);
        expect(addMemberResponse.body.message).to.equal('success');
      });
    });

    it('should return 404 when adding a member to a non-existing board', () => {
      const nonExistingBoardId = 999;

      cy.request({
        method: 'POST',
        url: `/b/${nonExistingBoardId}/members`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          email: 'new-member@example.com',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Board not found!');
      });
    });

    it('should return 404 when adding a non-existing user to the board', () => {
      const nonExistingUserEmail = 'non-existing-member@example.com';
      const boardId = 1;

      cy.request({
        method: 'POST',
        url: `/b/${boardId}/members`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          email: nonExistingUserEmail,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('User not found!');
      });
    });

    it('should return 409 when adding an existing member to the board', () => {
      const existingMemberEmail = existingUser.email;
      const boardId = 1;
      cy.request({
        method: 'POST',
        url: `/b/${boardId}/members`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          email: existingMemberEmail,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(409);
        expect(response.body.message).to.equal('User is already a member of this board!');
      });
    });
  });

  describe('removeMemberFromBoard API', () => {
    it('should remove a member from the board', () => {
      const boardId = 1;
      cy.request({
        method: 'DELETE',
        url: `/b/${boardId}/members/25`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
      });
    });

    it('should return 404 when removing a member from a non-existing board', () => {
      const nonExistingBoardId = 999;
      cy.request({
        method: 'DELETE',
        url: `/b/${nonExistingBoardId}/members/123`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Board not found!');
      });
    });

    it('should return 404 when removing a member that is not in the board', () => {
      const nonExistingMemberId = 456;
      const boardId = 1;

      cy.request({
        method: 'DELETE',
        url: `/b/${boardId}/members/${nonExistingMemberId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('User is not a member of this board!');
      });
    });
  });

  describe('removeMemberFromBoard API', () => {
    it('should get all members of a board', () => {
      const boardId = 1;
      cy.request({
        method: 'GET',
        url: `/b/${boardId}/members`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
        expect(response.body.members).to.be.an('array');
      });
    });

    it('should return 404 when getting members of a non-existing board', () => {
      const nonExistingBoardId = 999;
      cy.request({
        method: 'GET',
        url: `/b/${nonExistingBoardId}/members`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Board not found!');
      });
    });
  });
});
