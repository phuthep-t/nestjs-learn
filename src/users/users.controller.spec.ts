import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './uesr.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({ id, email: 'dsfads', password: 'asd' } as User);
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'asd' } as User]);
      }
    };
    fakeAuthService = {
      signin:(email:string, password:string)=>{
        return Promise.resolve({ id: 1, email, password: 'asd' } as User);
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]

    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('findAllUers',async ()=>{
    const users = await controller.findAllUsers('asdf@sadf.com');
    expect(users.length).toEqual(1);
  });

  it('signin update sessions and return users',async ()=>{
    const session = {userId:-10};
    const user = await controller.signIn({email:'as@2.com', password:'test'}, session);
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  })
});
