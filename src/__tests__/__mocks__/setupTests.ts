import { mock } from 'jest-mock-extended';
import { DataSource, Repository } from 'typeorm';

export const repoMock = mock<Repository<any>>();
export const dataSourceMock = mock<DataSource>();
export const mockConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'test',
  password: 'test',
  database: 'test',
};

jest.mock('typeorm', () => {
  return {
    getRepository: () => repoMock,
    PrimaryGeneratedColumn: () => {},
    PrimaryColumn: () => {},
    Column: () => {},
    Entity: () => {},
    CreateDateColumn: () => {},
    ManyToOne: () => {},
    OneToMany: () => {},
    ManyToMany: () => {},
    JoinTable: () => {},
    Index: () => {},
    DataSource: jest.fn(() => dataSourceMock),
    createConnection: () => {},
    getConnectionOptions: jest.fn().mockResolvedValue(mockConnectionOptions),
  };
});
