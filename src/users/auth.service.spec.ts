import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './uesr.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';


describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  const users: User[]=[];
  beforeEach(async () => {
    fakeUsersService = {
      find: (email:string) => {
        const filteredUsers = users.filter(user=> user.email===email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {id:Math.floor(Math.random()*99999),email,password} as User
        users.push(user);
        return Promise.resolve(user);
      }
    };

    const module = await Test.createTestingModule({
      providers: [AuthService, {
        provide: UsersService,
        useValue: fakeUsersService
      }]
    }).compile();
    service = module.get(AuthService);
  });

  it('can create instance of auth service', async () => {
    expect(service).toBeDefined();
  });
  it('create new user with salt password', async () => {
    const user = await service.signup('asdf@hotmail.com', 'Welcome1');

    expect(user.password).not.toEqual('Welcome1');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });
  it('throws error', async () => {
    await service.signup('as@asd.com', 'test');
    await expect(service.signup('as@asd.com', 'Welcome1')).rejects.toThrow(BadRequestException);

  });
  it('throws if signin is called with unused email', async () => {
    await expect(service.signin('as@asd.com', 'asdf')).rejects.toThrow(NotFoundException);
  });
  it('throws if an invalid password provided', async () => {
    await service.signup('as@asd.com', 'test1');
    await expect(service.signin('as@asd.com', 'test')).rejects.toThrow(BadRequestException);
  });

  it('throws if an correct password provided', async () => {
    await service.signup('as@asd.com', 'test');
    const user = await service.signin('as@asd.com', 'test');
    expect(user).toBeDefined();
  });
});
