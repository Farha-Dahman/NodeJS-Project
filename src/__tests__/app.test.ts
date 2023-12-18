import { Request, Response, NextFunction } from 'express';
import { AppRoutes } from '../routes';

describe('API Routes', () => {
  const mockRequest = {} as Request;
  const mockResponse = {
    json: jest.fn(),
  } as unknown as Response;
  const mockNext = jest.fn() as NextFunction;

  test('should return a welcome message for the "/" route', async () => {
    const welcomeRoute = AppRoutes.find((route) => route.path === '/');
    expect(welcomeRoute).toBeDefined();
    welcomeRoute?.action(mockRequest, mockResponse, mockNext);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'welcome!' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should use the wildcard route handler for unmatched routes', () => {
    const notFoundRoute = AppRoutes.find((route) => route.path === '*');
    expect(notFoundRoute).toBeDefined();
    notFoundRoute?.action(mockRequest, mockResponse, mockNext);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'page not found' });
  });
});
