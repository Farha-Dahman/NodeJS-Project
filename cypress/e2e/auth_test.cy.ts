describe('authentication APIs', () => {
  let newUser, existingUser;
  beforeEach(function () {
    cy.fixture('existingUserInfo').then((user) => {
      existingUser = user;
    });
    cy.fixture('newUserInfo').then((user) => {
      newUser = user;
    });
  });

  describe('Signup API', () => {
    const signupEndpoint = '/auth/signup';
    it('should successfully sign up a new user', () => {
      cy.request({
        method: 'POST',
        url: signupEndpoint,
        body: {
          fullName: newUser.fullName,
          email: newUser.email,
          password: newUser.password,
          cPassword: newUser.cPassword,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
        expect(response.body.newUser).to.have.property('id');
        expect(response.body.newUser.fullName).to.equal(newUser.fullName);
        expect(response.body.newUser.email).to.equal(newUser.email);
      });
    });

    it('should handle the case where the email already exists', () => {
      const signupData = {
        fullName: newUser.fullName,
        email: newUser.email,
        password: newUser.password,
        cPassword: newUser.cPassword,
      };
      cy.request({
        method: 'POST',
        url: signupEndpoint,
        body: signupData,
        headers: {
          'Content-Type': 'application/json',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(409);
        expect(response.body).to.deep.equal({
          message: 'Email already exists',
        });
      });
    });
  });

  describe('Login API', () => {
    const loginEndpoint = '/auth/login';
    it('should log in successfully with valid credentials', () => {
      cy.request({
        method: 'POST',
        url: loginEndpoint,
        body: {
          email: existingUser.email,
          password: existingUser.password,
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('success');
        expect(response.body.token).to.exist;
        expect(response.body.refreshToken).to.exist;
      });
    });

    it('should return an error for invalid credentials', () => {
      cy.request({
        method: 'POST',
        url: loginEndpoint,
        body: {
          email: 'invalid@example.com',
          password: 'invalidPassword',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Invalid email or password');
      });
    });

    it('should return an error for unconfirmed email', () => {
      cy.request({
        method: 'POST',
        url: loginEndpoint,
        body: {
          email: newUser.email,
          password: newUser.password,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(403);
        expect(response.body.message).to.equal('Plz confirm your email');
      });
    });
  });

  describe('Forgot Password API', () => {
    const forgotPasswordEndpoint = '/auth/forgot-password';
    it('should reset password successfully', () => {
      cy.request({
        method: 'POST',
        url: forgotPasswordEndpoint,
        body: {
          email: 'example@example.com',
          password: 'newPassword123',
          code: '123456',
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal('success');
      });
    });
    it('should handle user not found', () => {
      cy.request({
        method: 'POST',
        url: forgotPasswordEndpoint,
        body: {
          email: 'nonexistent@example.com',
          password: 'newPassword123',
          code: '123456',
        },
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Not registered account!');
      });
    });

    it('should handle invalid code', () => {
      cy.request({
        method: 'POST',
        url: forgotPasswordEndpoint,
        body: {
          email: 'example@example.com',
          password: 'newPassword123',
          code: 'invalidCode',
        },
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal('Invalid code!');
      });
    });

    it('should handle internal server error', () => {
      cy.intercept('POST', forgotPasswordEndpoint, {
        statusCode: 500,
        body: { message: 'Internal Server Error' },
      });

      cy.request({
        method: 'POST',
        url: forgotPasswordEndpoint,
        body: {
          email: 'example@example.com',
          password: 'newPassword123',
          code: '123456',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(500);
        expect(response.body.message).to.equal('Internal Server Error');
      });
    });
  });
});
