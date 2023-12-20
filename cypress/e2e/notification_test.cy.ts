import { authenticate } from '../utilities/authUtils';

describe('Notifications API Tests', () => {
  const notificationsEndpoint = '/n';
  beforeEach(() => {
    authenticate().then((token) => {
      Cypress.env('authToken', token);
    });
  });

  describe('Get Notifications API', () => {
    it('should fetch notifications successfully', () => {
      cy.request({
        method: 'GET',
        url: `${notificationsEndpoint}/25`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.deep.equal('success');
        expect(response.body.notifications).to.be.an('array');
      });
    });

    it('should handle invalid user ID', () => {
      cy.request({
        method: 'GET',
        url: `${notificationsEndpoint}/invalidUserId`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(500);
      });
    });
  });

  describe('Change Notification Read Status API', () => {
    it('should mark notification as read successfully', () => {
      const notificationId = 1;

      cy.request({
        method: 'PATCH',
        url: `${notificationsEndpoint}/${notificationId}`,
        body: {
          isRead: true,
        },
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).should((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
        expect(response.body.isRead).to.be.true;
      });
    });

    it('should mark notification as unread successfully', () => {
      const notificationId = 1;

      cy.request({
        method: 'PATCH',
        url: `${notificationsEndpoint}/${notificationId}`,
        body: {
          isRead: false,
        },
        headers: {
          Authorization: Cypress.env('authToken'),
        },
      }).should((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
        expect(response.body.isRead).to.be.false;
      });
    });

    it('should handle marking nonexistent notification as read', () => {
      const invalidNotificationId = 999;

      cy.request({
        method: 'PATCH',
        url: `${notificationsEndpoint}/${invalidNotificationId}`,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        failOnStatusCode: false,
      }).should((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Notification not found');
      });
    });
  });
});
