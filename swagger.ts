import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Trello-like App API',
      version: '1.0.0',
      description: 'API documentation for a Trello-like task management app.',
    },
    components: {
      securitySchemes: {
        AuthToken: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: "Use 'Bearer ' + the token obtained from the login endpoint.",
        },
      },
    },
  },
  apis: ['./src/router/*.router.ts'],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
