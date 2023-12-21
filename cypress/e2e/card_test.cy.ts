import { authenticate, authenticateNewUser } from '../utilities/authUtils';

describe('Card APIs', () => {
  let newUser, existingUser;
  beforeEach(() => {
    cy.fixture('newUserInfo').then((user) => {
      newUser = user;
    });
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

  describe('createCard API', () => {
    const listId = 1;

    it('should create a new card', () => {
      const cardTitle = 'New Card Title';
      const cardDescription = 'This is a new card description';
      const dueDate = '2023-12-31 08:00:00';
      const reminderDate = '2023-12-30 08:00:00';

      cy.request({
        method: 'POST',
        url: `/c/${listId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          title: cardTitle,
          description: cardDescription,
          dueDate: dueDate,
          reminderDate: reminderDate,
        },
      }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body.message).to.equal('success');
        expect(response.body.card.title).to.equal(cardTitle);
        expect(response.body.card.description).to.equal(cardDescription);
        expect(response.body.card.dueDate).to.equal(dueDate);
        expect(response.body.card.reminderDate).to.equal(reminderDate);
      });
    });

    it('should return 401 when creating a card without authentication', () => {
      const cardTitle = 'Unauthorized Card';

      cy.request({
        method: 'POST',
        url: `/c/${listId}`,
        body: {
          title: cardTitle,
          description: 'Unauthorized card description',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal('Invalid token');
      });
    });

    it('should return 404 when creating a card in a non-existing list', () => {
      const nonExistingListId = 999;

      cy.request({
        method: 'POST',
        url: `/c/${nonExistingListId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          title: 'Non-existing List Card',
          description: 'Card in a non-existing list',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('List not found!');
      });
    });
  });

  describe('updateCard API', () => {
    const boardId = 1;
    const cardId = 10;

    it('should update card details', () => {
      const updatedTitle = 'Updated Card Title';
      const updatedDescription = 'This is an updated card description';
      const updatedDueDate = '2023-12-25 08:00:00';
      const updatedReminderDate = '2023-12-22 08:00:00';

      cy.request({
        method: 'PUT',
        url: `/c/${boardId}/${cardId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          title: updatedTitle,
          description: updatedDescription,
          dueDate: updatedDueDate,
          reminderDate: updatedReminderDate,
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
        expect(response.body.card.title).to.equal(updatedTitle);
        expect(response.body.card.description).to.equal(updatedDescription);
        expect(response.body.card.dueDate).to.equal(updatedDueDate);
        expect(response.body.card.reminderDate).to.equal(updatedReminderDate);
      });
    });

    it('should return 403 when updating a card without board membership', () => {
      const unauthorizedCardTitle = 'Unauthorized Card Title';

      cy.request({
        method: 'PUT',
        url: `/c/${boardId}/${cardId}`,
        headers: {
          Authorization: Cypress.env('authTokenNewUser'),
        },
        body: {
          title: unauthorizedCardTitle,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(403);
        expect(response.body.message).to.equal(
          'Cannot update this card! You are not a member of this board',
        );
      });
    });

    it('should return 404 when updating a non-existing card', () => {
      const nonExistingCardId = 999;

      cy.request({
        method: 'PUT',
        url: `/c/${boardId}/${nonExistingCardId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          title: 'Non-existing Card Title',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Card not found!');
      });
    });
  });

  describe('archiveCard API', () => {
    const cardId = 10;

    it('should archive a card', () => {
      cy.request({
        method: 'PATCH',
        url: `/c/${cardId}/archive`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
        expect(response.body.card.isArchived).to.be.true;
      });
    });

    it('should unarchive a card', () => {
      cy.request({
        method: 'PATCH',
        url: `/c/${cardId}/un-archive`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          isArchived: false,
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
        expect(response.body.card.isArchived).to.be.false;
      });
    });

    it('should return 404 when archiving a non-existing card', () => {
      const nonExistingCardId = 999;

      cy.request({
        method: 'PATCH',
        url: `/c/${nonExistingCardId}/archive`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Card not found!');
      });
    });
  });

  describe('deleteCard API', () => {
    const cardId = 20;

    it('should delete a card', () => {
      cy.request({
        method: 'DELETE',
        url: `/c/${cardId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
      });
    });

    it('should return 404 when deleting a non-existing card', () => {
      const nonExistingCardId = 999;

      cy.request({
        method: 'DELETE',
        url: `/c/${nonExistingCardId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Card not found!');
      });
    });

    it('should return 403 when user does not have permission to delete the card', () => {
      const cardWithoutPermissionId = 10;

      cy.request({
        method: 'DELETE',
        url: `/c/${cardWithoutPermissionId}`,
        headers: {
          Authorization: Cypress.env('authTokenNewUser'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(403);
        expect(response.body.message).to.equal('You do not have permission to delete this card!');
      });
    });
  });

  describe('getAllCard API', () => {
    const validListId = 1;
    const invalidListId = 999;

    it('should fetch all cards for a valid list', () => {
      cy.request({
        method: 'GET',
        url: `/c/${validListId}/cards`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
        expect(response.body.cards).to.be.an('array');
      });
    });

    it('should return 403 when user does not have permission to show cards', () => {
      cy.request({
        method: 'GET',
        url: `/c/${validListId}/cards`,
        headers: {
          Authorization: Cypress.env('authTokenNewUser'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(403);
        expect(response.body.message).to.equal('You do not have permission to show cards!');
      });
    });

    it('should return 404 for an invalid list ID', () => {
      cy.request({
        method: 'GET',
        url: `/c/${invalidListId}/cards`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('List not found');
      });
    });
  });

  describe('addMemberToCard API', () => {
    const cardId = 10;
    const invalidEmail = 'nonexistent@example.com';

    it('should add a member to the card', () => {
      cy.request({
        method: 'POST',
        url: `/c/${cardId}/members`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          email: newUser.email,
        },
      }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body.message).to.equal('success');
      });
    });

    it('should return 409 when adding a member who is already a member', () => {
      cy.request({
        method: 'POST',
        url: `/c/${cardId}/members`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          email: existingUser.email,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(409);
        expect(response.body.message).to.equal('User is already a member of this card!');
      });
    });

    it('should return 404 when adding a member with an invalid email', () => {
      cy.request({
        method: 'POST',
        url: `/c/${cardId}/members`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          email: invalidEmail,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('User not found!');
      });
    });
  });

  describe('deleteMemberFromCard API', () => {
    const cardId = 10;
    const memberIdToRemove = 1;
    const invalidMemberId = 999;

    it('should remove a member from the card', () => {
      cy.request({
        method: 'DELETE',
        url: `/c/${cardId}/members/${memberIdToRemove}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
      });
    });

    it('should return 404 when removing a member who is not in the card', () => {
      cy.request({
        method: 'DELETE',
        url: `/c/${cardId}/members/${invalidMemberId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('User not found in the card!');
      });
    });
  });

  describe('getAllMembersForCard API', () => {
    const cardId = 10;
    const invalidCardId = 999;

    it('should fetch members for a card', () => {
      cy.request({
        method: 'GET',
        url: `/c/${cardId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
        expect(response.body.members).to.be.an('array');
      });
    });

    it('should return 404 when fetching members for an invalid card ID', () => {
      cy.request({
        method: 'GET',
        url: `/c/${invalidCardId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Card not found!');
      });
    });
  });

  describe('getActivities API', () => {
    const cardId = 10;
    const invalidCardId = 999;

    it('should fetch card activities', () => {
      cy.request({
        method: 'GET',
        url: `/c/${cardId}/activities`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
        expect(response.body.activities).to.be.an('array');
      });
    });

    it('should return 404 when fetching activities for an invalid card ID', () => {
      cy.request({
        method: 'GET',
        url: `/c/${invalidCardId}/activities`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Card not found!');
      });
    });
  });

  describe('addComment API', () => {
    const cardId = 10;

    it('should add a comment to a card', () => {
      const commentContent = 'This is a test comment.';
      cy.request({
        method: 'POST',
        url: `/c/${cardId}/comment`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          content: commentContent,
        },
      }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body.message).to.equal('success');
        expect(response.body.comment.content).to.equal(commentContent);
      });
    });

    it('should return 404 when adding a comment to an invalid card ID', () => {
      const invalidCardId = 999;
      const commentContent = 'This is an invalid card test comment.';
      cy.request({
        method: 'POST',
        url: `/c/${invalidCardId}/comment`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          content: commentContent,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Card not found!');
      });
    });

    it('should return 401 when adding a comment without authorization', () => {
      const commentContent = 'This is an unauthorized test comment.';
      cy.request({
        method: 'POST',
        url: `/c/${cardId}/comment`,
        body: {
          content: commentContent,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(401);
      });
    });
  });

  describe('deleteComment API', () => {
    const commentId = 1;

    it('should delete a comment', () => {
      cy.request({
        method: 'DELETE',
        url: `/c/${commentId}/comment`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
      });
    });

    it('should return 404 when deleting an invalid comment ID', () => {
      const invalidCommentId = 999;
      cy.request({
        method: 'DELETE',
        url: `/c/${invalidCommentId}/comment`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Comment not found!');
      });
    });

    it('should return 401 when deleting a comment without authorization', () => {
      cy.request({
        method: 'DELETE',
        url: `/c/${commentId}/comment`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(401);
      });
    });
  });

  describe('editComment API', () => {
    const commentId = 1;

    it('should edit a comment', () => {
      const newContent = 'Updated content';
      cy.request({
        method: 'PATCH',
        url: `/c/${commentId}/comment`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          content: newContent,
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
      });
    });

    it('should return 404 when editing an invalid comment ID', () => {
      const invalidCommentId = 999;
      const newContent = 'Updated content';
      cy.request({
        method: 'PATCH',
        url: `/c/${invalidCommentId}/comment`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          content: newContent,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Comment not found!');
      });
    });

    it('should return 401 when editing a comment without authorization', () => {
      const newContent = 'Updated content';
      cy.request({
        method: 'PATCH',
        url: `/c/${commentId}/comment`,
        body: {
          content: newContent,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(401);
      });
    });
  });

  describe('getAllComments API', () => {
    const cardId = 10;

    it('should get all comments for a card', () => {
      cy.request({
        method: 'GET',
        url: `/c/${cardId}/comments`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
        expect(response.body.comments).to.be.an('array');
      });
    });

    it('should return 404 when getting comments for an invalid card ID', () => {
      const invalidCardId = 999;
      cy.request({
        method: 'GET',
        url: `/c/${invalidCardId}/comments`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Card not found!');
      });
    });

    it('should return 401 when getting comments without authorization', () => {
      cy.request({
        method: 'GET',
        url: `/c/${cardId}/comments`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(401);
      });
    });
  });
});
