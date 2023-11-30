import { mock } from 'jest-mock-extended';
import { Repository } from 'typeorm';

export const repoMock = mock<Repository<any>>();

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
    DataSource: () => {},
    createConnection: () => {},
    getConnectionOptions: () => {},
  };
});
