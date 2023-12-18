import './__mocks__/setupTests';
import { DataSource, getConnectionOptions } from 'typeorm';
import connectDB from '../db/connection';
import { mockConnectionOptions } from './__mocks__/setupTests';

beforeEach(() => {
  jest.clearAllMocks();
});

class MockDataSource {
  async connect() {
    throw new Error('Database connection error');
  }
}

describe('connect to the Database', () => {
  it('should successfully connect to the database', async () => {
    jest.spyOn(require('typeorm'), 'getConnectionOptions').mockResolvedValue(mockConnectionOptions);
    const connectMock = jest.fn();
    jest.spyOn(require('typeorm'), 'DataSource').mockImplementation(() => ({
      connect: connectMock,
    }));

    const dataSource = await connectDB();
    expect(dataSource).toBeDefined();
    expect(connectMock).toHaveBeenCalledTimes(1);
  });

  it('should handle connection errors and log an error', async () => {
    (getConnectionOptions as jest.Mock).mockResolvedValueOnce(mockConnectionOptions);
    (DataSource as jest.Mock).mockImplementationOnce(() => new MockDataSource());

    await expect(connectDB()).rejects.toThrow('Database connection error');
    expect(DataSource).toHaveBeenCalledWith(expect.objectContaining({ name: 'default' }));
    expect(DataSource).toHaveBeenCalledTimes(1);
  });
});
