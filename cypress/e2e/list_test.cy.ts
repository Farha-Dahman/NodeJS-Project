import { authenticate } from '../utilities/authUtils';

describe('List APIs', () => {
  beforeEach(function () {
    authenticate().then((token) => {
      Cypress.env('authToken', token);
    });
  });

  describe('createList API', () => {
    it('should create a new list successfully', () => {
      const boardId = 1;
      const title = 'New List';
      const position = 1;
      cy.request({
        method: 'POST',
        url: `/l/${boardId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          title,
          position,
        },
      }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body.message).to.equal('List created successfully');
        expect(response.body.list).to.have.property('title', title);
        expect(response.body.list).to.have.property('position', position);
      });
    });

    it('should handle missing board', () => {
      const nonExistentBoardId = 999;
      const title = 'New List';
      const position = 1;
      cy.request({
        method: 'POST',
        url: `/l/${nonExistentBoardId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          title,
          position,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Board not found!');
      });
    });
  });

  describe('updateList API', () => {
    it('should update list title and position', () => {
      const updatedTitle = 'Updated List Title';
      const updatedPosition = 2;
      const listId = 10;
      cy.request({
        method: 'PATCH',
        url: `/l/${listId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          title: updatedTitle,
          position: updatedPosition,
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
        expect(response.body.list.title).to.equal(updatedTitle);
        expect(response.body.list.position).to.equal(updatedPosition);
      });
    });

    it('should return 403 when updating list with the same position', () => {
      const samePosition = 1;
      const listId = 11;
      cy.request({
        method: 'PATCH',
        url: `/l/${listId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          position: samePosition,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(403);
        expect(response.body.message).to.equal('New position is the same as the current position!');
      });
    });

    it('should return 404 when updating a non-existing list', () => {
      const nonExistingListId = 999;
      cy.request({
        method: 'PATCH',
        url: `/l/${nonExistingListId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          title: 'Updated Title',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('List not found!');
      });
    });
  });

  describe('archiveState API', () => {
    it('should archive a list successfully', () => {
      const listId = 10;
      cy.request({
        method: 'PATCH',
        url: `/l/${listId}/archive`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
        expect(response.body.list.isArchived).to.be.true;
      });
    });

    it('should unarchive a list successfully', () => {
      const archivedListId = 10;
      cy.request({
        method: 'PATCH',
        url: `/l/${archivedListId}/un-archive`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
        expect(response.body.list.isArchived).to.be.false;
      });
    });

    it('should return 404 when trying to archive a non-existing list', () => {
      const nonExistingListId = 999;
      cy.request({
        method: 'PATCH',
        url: `/l/${nonExistingListId}/archive`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('List not found!');
      });
    });
  });

  describe('getAllList API', () => {
    it('should get all non-archived lists successfully', () => {
      const boardId = 1;
      cy.request({
        method: 'GET',
        url: `/l/${boardId}/lists`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
        expect(response.body.lists).to.be.an('array');
        expect(response.body.lists.length).to.be.greaterThan(0);
      });
    });

    it('should return 404 when trying to get lists for a non-existing board', () => {
      const nonExistingBoardId = 999;
      cy.request({
        method: 'GET',
        url: `/l/${nonExistingBoardId}/lists`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Board not found');
      });
    });
  });
});
