import { createConnection, getConnectionOptions } from 'typeorm';
import { connectDB } from '../../DB/connection';

jest.mock('typeorm');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('connect to the Database', () => {
  it('should connect to the database successfully', async () => {
    const mockConnectionOptions = {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'test',
      password: 'test',
      database: 'test',
    };
    (getConnectionOptions as jest.Mock).mockResolvedValueOnce(mockConnectionOptions);
    (createConnection as jest.Mock).mockResolvedValueOnce({ isConnected: true });
    await expect(connectDB()).resolves.toEqual({ isConnected: true });
    expect(getConnectionOptions).toHaveBeenCalledWith(process.env.NODE_ENV);
    expect(createConnection).toHaveBeenCalledWith({ ...mockConnectionOptions, name: 'default' });
  });

  it('should handle connection errors and log an error', async () => {
    const mockError = new Error('Database connection error');
    (createConnection as jest.Mock).mockRejectedValueOnce(mockError);
    await expect(connectDB()).rejects.toThrow(mockError);
    expect(createConnection).toHaveBeenCalled();
  });
});
