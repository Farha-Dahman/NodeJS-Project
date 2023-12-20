const bearerKey = Cypress.env('BEARER_KEY');

const authenticate = () => {
  return cy
    .request({
      method: 'POST',
      url: '/auth/login',
      body: {
        email: 'farhadahman33@gmail.com',
        password: 'farha123',
      },
    })
    .then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.token).to.exist;

      return bearerKey + response.body.token;
    });
};

const authenticateNewUser = () => {
  return cy
    .request({
      method: 'POST',
      url: '/auth/login',
      body: {
        email: 'new@test.com',
        password: 'newPassword123',
      },
    })
    .then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.token).to.exist;

      return bearerKey + response.body.token;
    });
};

export { authenticate, authenticateNewUser };
