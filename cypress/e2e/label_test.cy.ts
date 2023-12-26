import { authenticate } from '../utilities/authUtils';

describe('Label APIs', () => {
  beforeEach(function () {
    authenticate().then((token) => {
      Cypress.env('authToken', token);
    });
  });

  describe('createLabel API', () => {
    it('should create a new label successfully', () => {
      const boardId = 1;
      const labelData = {
        title: 'Test Label',
        color: '#ff0000',
      };
      cy.request({
        method: 'POST',
        url: `/labels/${boardId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: labelData,
      }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body.message).to.equal('success');
        expect(response.body.label).to.be.an('object');
        expect(response.body.label.title).to.equal(labelData.title);
        expect(response.body.label.color).to.equal(labelData.color);
      });
    });

    it('should return 404 when trying to create a label for a non-existing board', () => {
      const nonExistingBoardId = 999;
      const labelData = {
        title: 'Test Label',
        color: '#ff0000',
      };

      cy.request({
        method: 'POST',
        url: `/labels/${nonExistingBoardId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: labelData,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Board not found!');
      });
    });
  });

  describe('deleteLabel API', () => {
    it('should delete a label successfully', () => {
      const createdLabelId = 1;
      cy.request({
        method: 'DELETE',
        url: `/labels/${createdLabelId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
      });
    });

    it('should return 404 when trying to delete a non-existing label', () => {
      const nonExistingLabelId = 999;
      cy.request({
        method: 'DELETE',
        url: `/labels/${nonExistingLabelId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Label not found!');
      });
    });
  });

  describe('searchForLabel API', () => {
    it('should search for labels successfully', () => {
      const searchTerm = 'ExampleLabel';
      cy.request({
        method: 'GET',
        url: `/labels/search?name=${searchTerm}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
        expect(response.body.labels).to.be.an('array');
      });
    });

    it('should return 400 when searching with an invalid query', () => {
      const invalidSearchTerm = '';
      cy.request({
        method: 'GET',
        url: `/labels/search?name=${invalidSearchTerm}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal('Invalid search query');
      });
    });

    it('should return an empty array when no matching labels are found', () => {
      const nonExistingSearchTerm = 'NonExistingLabel';
      cy.request({
        method: 'GET',
        url: `/labels/search?name=${nonExistingSearchTerm}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
        expect(response.body.labels).to.be.an('array').that.is.empty;
      });
    });
  });

  describe('getAllLabels API', () => {
    it('should fetch all labels for a board successfully', () => {
      const boardId = 1;
      cy.request({
        method: 'GET',
        url: `/labels/${boardId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
        expect(response.body.labels).to.be.an('array').that.is.not.empty;
      });
    });

    it('should return 404 when fetching labels for a non-existing board', () => {
      const nonExistingBoardId = 999;
      cy.request({
        method: 'GET',
        url: `/labels/${nonExistingBoardId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Board not found!');
      });
    });

    it('should return an empty array when no labels are found for the board', () => {
      const boardIdWithoutLabels = 11;
      cy.request({
        method: 'GET',
        url: `/labels/${boardIdWithoutLabels}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
        expect(response.body.labels).to.be.an('array').that.is.empty;
      });
    });
  });

  describe('updateLabel API', () => {
    const boardId = 1;
    const labelId = 11;

    it('should update label title and color', () => {
      const updatedTitle = 'Updated Label Title';
      const updatedColor = '#000000';

      cy.request({
        method: 'PATCH',
        url: `/labels/${labelId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          title: updatedTitle,
          color: updatedColor,
          boardId: boardId,
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
        expect(response.body.label.title).to.equal(updatedTitle);
        expect(response.body.label.color).to.equal(updatedColor);
      });
    });

    it('should return 403 when updating label in a board without membership', () => {
      const nonMemberBoardId = 2;
      cy.request({
        method: 'PATCH',
        url: `/labels/${labelId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          title: 'Updated Title',
          color: '#ABCDEF',
          boardId: nonMemberBoardId,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(403);
        expect(response.body.message).to.equal('You are not a member of this board');
      });
    });

    it('should return 404 when updating a non-existing label', () => {
      const nonExistingLabelId = 999;
      cy.request({
        method: 'PATCH',
        url: `/labels/${nonExistingLabelId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          title: 'Updated Title',
          color: '#ABC',
          boardId: boardId,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Label not found!');
      });
    });
  });
});
