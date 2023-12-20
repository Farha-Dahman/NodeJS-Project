import { authenticate } from '../utilities/authUtils';

describe('user API Tests', () => {
  let newUser, existingUser;
  beforeEach(() => {
    cy.fixture('existingUserInfo').then((user) => {
      existingUser = user;
    });
    cy.fixture('newUserInfo').then((user) => {
      newUser = user;
    });
    authenticate().then((token) => {
      Cypress.env('authToken', token);
    });
  });

  describe('Profile API Tests', () => {
    const profileEndpoint = '/user/profile';
    it('should return user data when the user is authenticated', () => {
      const userProfile = {
        id: 1,
        email: existingUser.email,
        fullName: existingUser.fullName,
      };

      cy.intercept('GET', profileEndpoint, {
        statusCode: 200,
        body: { message: 'success', user: userProfile },
      }).as('profileRequest');

      cy.request({
        method: 'GET',
        url: profileEndpoint,
        headers: {
          'Content-Type': 'application/json',
          Authorization: Cypress.env('authToken'),
        },
      }).as('apiResponse');

      cy.get('@apiResponse').its('status').should('eq', 200);
      cy.get('@apiResponse').its('body.message').should('eq', 'success');
    });

    it('should handle user not confirmed error during login', () => {
      const loginEndpoint = '/auth/login';
      cy.intercept('POST', loginEndpoint, {
        statusCode: 403,
        body: { message: 'Plz confirm your email' },
      }).as('loginRequest');

      cy.request({
        method: 'POST',
        url: loginEndpoint,
        failOnStatusCode: false,
        body: {
          email: newUser.email,
          password: newUser.password,
        },
      }).as('apiResponse');
      cy.get('@apiResponse').its('status').should('eq', 403);
      cy.get('@apiResponse').its('body.message').should('eq', 'Plz confirm your email');
    });
  });

  describe('update Profile API', () => {
    const updateProfileEndpoint = '/user/update-profile';
    it("should update the user's full name", () => {
      const newName = 'New Full Name';
      cy.request({
        method: 'PUT',
        url: updateProfileEndpoint,
        headers: {
          'Content-Type': 'application/json',
          Authorization: Cypress.env('authToken'),
        },
        body: {
          fullName: newName,
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
        expect(response.body.user.fullName).to.equal(newName);
      });
    });

    it("should update the user's job title", () => {
      const newJobTitle = 'new job title';

      cy.request({
        method: 'PUT',
        url: updateProfileEndpoint,
        headers: {
          'Content-Type': 'application/json',
          Authorization: Cypress.env('authToken'),
        },
        body: {
          jobTitle: newJobTitle,
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.deep.equal('success');
        expect(response.body.user.jobTitle).to.equal(newJobTitle);
      });
    });

    it('should return an error for unauthorized access', () => {
      cy.request({
        method: 'PUT',
        url: updateProfileEndpoint,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          fullName: 'Unauthorized User',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal('Invalid token');
      });
    });
  });

  describe('Profile Picture API', () => {
    const uploadEndpoint = '/user/profile-picture';

    it('should upload profile picture successfully', () => {
      cy.fixture('sample-image.png').then((fileContent) => {
        cy.request({
          method: 'PATCH',
          url: uploadEndpoint,
          headers: {
            Authorization: Cypress.env('authToken'),
          },
          body: {
            file: {
              value: Cypress.Blob.base64StringToBlob(fileContent, 'image/png'),
              options: {
                filename: 'sample-image.png',
                mimeType: 'image/png',
              },
            },
          },
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body.message).to.equal('success');
          expect(response.body.user.photo).to.have.property('public_id');
          expect(response.body.user.photo).to.have.property('secure_url');
        });
      });
    });

    it('should handle missing file', () => {
      cy.request({
        method: 'PATCH',
        url: uploadEndpoint,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body).to.equal('Please provide a file!');
      });
    });
  });

  describe('Change Password API', () => {
    const changePasswordEndpoint = '/user/change-password';

    it('should change password successfully', () => {
      cy.request({
        method: 'PATCH',
        url: changePasswordEndpoint,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          currentPassword: existingUser.password,
          newPassword: 'newPassword123',
          confirmNewPassword: 'newPassword123',
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Password changed successfully');
      });
    });

    it('should handle incorrect current password', () => {
      cy.request({
        method: 'PATCH',
        url: changePasswordEndpoint,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          currentPassword: 'incorrectPassword',
          newPassword: 'newPassword123',
          confirmNewPassword: 'newPassword123',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal('Current password is incorrect!');
      });
    });

    it('should handle password mismatch', () => {
      cy.request({
        method: 'PATCH',
        url: changePasswordEndpoint,
        headers: {
          Authorization: Cypress.env('authToken'),
        },
        body: {
          currentPassword: 'password123',
          newPassword: 'newPassword123',
          confirmNewPassword: 'mismatchedPassword',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal('New password and confirm password do not match!');
      });
    });
  });
});
