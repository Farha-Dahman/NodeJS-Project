import { authenticate } from '../utilities/authUtils';

describe('Attachment APIs', () => {
  beforeEach(() => {
    authenticate().then((token) => {
      Cypress.env('authToken', token);
    });
  });

  describe('updateAttachment API', () => {
    const cardId = 10;
    it('should handle missing file', () => {
      cy.request({
        method: 'POST',
        url: `/c/${cardId}/attachments`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal('No file uploaded');
      });
    });

    it('should handle card not found', () => {
      cy.request({
        method: 'POST',
        url: '/c/999/attachments',
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

  describe('getAllAttachments API', () => {
    const cardId = 10;
    it('should get all attachments for a card', () => {
      cy.request({
        method: 'GET',
        url: `/c/${cardId}/attachments`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
        expect(response.body.attachments).to.be.an('array');
      });
    });

    it('should handle the case when there are no attachments for a card', () => {
      cy.request({
        method: 'GET',
        url: `/c/${cardId}/attachments`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
        expect(response.body.attachments).to.be.an('array');
      });
    });

    it('should handle the case when the cardId is invalid', () => {
      const invalidCardId = 999;
      cy.request({
        method: 'GET',
        url: `/c/${invalidCardId}/attachments`,
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

  describe('updateAttachment API', () => {
    it('should update attachment name successfully', () => {
      const attachmentId = 10;
      cy.request({
        method: 'PATCH',
        url: `/c/${attachmentId}/attachments`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          newName: 'new-attachment-name',
        },
      }).then((updateResponse) => {
        expect(updateResponse.status).to.equal(200);
        expect(updateResponse.body.message).to.equal('success');
      });
    });

    it('should handle updating non-existent attachment', () => {
      const attachmentId = 999;
      cy.request({
        method: 'PATCH',
        url: `/c/${attachmentId}/attachments`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          newName: 'new-name',
        },
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('Attachment not found!');
      });
    });
  });

  describe('deleteAttachment API', () => {
    it('should delete an existing attachment', () => {
      const attachmentId = 11;
      cy.request({
        method: 'DELETE',
        url: `/c/${attachmentId}/attachments`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
      });
    });

    it('should handle deleting non-existent attachment', () => {
      const nonExistentAttachmentId = 999;
      cy.request({
        method: 'DELETE',
        url: `/c/${nonExistentAttachmentId}/attachments`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Attachment not found!');
      });
    });
  });
});
