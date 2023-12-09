import { UserController } from '../../src/controllers/user.js';
import UserService from '../../src/services/user.js';
import models from '../../src/models/_index.js';
import { jwtToken } from '../../src/utils/jwt.js';

describe('UserController', () => {
  let userController;
  let userServiceMock;
  let reqMock;
  let resMock;

  beforeEach(() => {
    userServiceMock = new UserService(models.User);
    userController = new UserController();
    userController.userService = userServiceMock;
    reqMock = {
      params: {},
      query: {},
      body: {
        idRole: 1,
        idUnit: 1,
      },
    };
    resMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('loginUser', () => {
    // it('should authenticate user with valid credentials', async () => {
    //   const user = { cpf: '1234567890', password: 'password', accepted: true };
    //   const token = 'jwt_token';
    //   userServiceMock.getUserByCpfWithPassword = jest
    //     .fn()
    //     .mockResolvedValue(user);
    //   jwtUtils.generateToken = jest.fn().mockReturnValue(token);
    //   reqMock.body = user;
    //   await userController.loginUser(reqMock, resMock);
    //   expect(userServiceMock.getUserByCpfWithPassword).toHaveBeenCalledWith(
    //     '1234567890',
    //   );
    //   expect(jwtUtils.generateToken).toHaveBeenCalledWith('1234567890');
    //   expect(resMock.status).toHaveBeenCalledWith(200);
    //   expect(resMock.json).toHaveBeenCalledWith({
    //     cpf: '1234567890',
    //     fullName: user.fullName,
    //     email: user.email,
    //     idUnit: user.idUnit,
    //     token,
    //     idRole: user.idRole,
    //     expiresIn: expect.any(Date),
    //   });
    // });

    it('should return 401 if user does not exist', async () => {
      userServiceMock.getUserByCpfWithPasswordRolesAndUnit = jest
        .fn()
        .mockResolvedValue(null);

      reqMock.body = { cpf: '12345678901', password: 'password' };

      await userController.loginUser(reqMock, resMock);

      expect(
        userServiceMock.getUserByCpfWithPasswordRolesAndUnit,
      ).toHaveBeenCalledWith('12345678901');
      expect(resMock.status).toHaveBeenCalledWith(401);
      expect(resMock.json).toHaveBeenCalledWith({
        error: 'Usuário inexistente',
        message: 'Usuário inexistente',
      });
    });

    it('should return 401 if user is not accepted', async () => {
      const Users = [
        {
          fullName: 'John Doe',
          idRole: 5,
          accepted: false,
          cpf: '12345678901',
          email: 'john@email.com',
          password: 'password',
          idUnit: 1,
        },
        {
          fullName: 'Jane Smith',
          idRole: 2,
          accepted: false,
          cpf: '212222222222',
          email: 'j@test.com',
          password: 'password',
          idUnit: 2,
        },
      ];

      userServiceMock.getUserByCpfWithPasswordRolesAndUnit = jest
        .fn()
        .mockResolvedValue(Users[0]);

      reqMock.body = { cpf: '12345678901', password: 'password' };

      await userController.loginUser(reqMock, resMock);

      expect(
        userServiceMock.getUserByCpfWithPasswordRolesAndUnit,
      ).toHaveBeenCalledWith('12345678901');

      expect(resMock.status).toHaveBeenCalledWith(401);
      expect(resMock.json).toHaveBeenCalledWith({
        message: 'Usuário não aceito',
      });
    });

    // it('should return 401 if password is incorrect', async () => {
    //   const Users = [
    //     {
    //       fullName: 'John Doe',
    //       idRole: 5,
    //       accepted: true,
    //       cpf: '12345678901',
    //       email: 'john@email.com',
    //       password: 'password',
    //       idUnit: 1,
    //     },
    //     {
    //       fullName: 'Jane Smith',
    //       idRole: 2,
    //       accepted: false,
    //       cpf: '212222222222',
    //       email: 'j@test.com',
    //       password: 'password',
    //       idUnit: 2,
    //     },
    //   ];
    //   userServiceMock.getUserByCpfWithPasswordRolesAndUnit = jest
    //     .fn()
    //     .mockResolvedValue(Users[0]);

    //   userServiceMock.verify = jest.fn().mockResolvedValue(false);

    //   reqMock.body = { cpf: '12345678901', password: 'wrong_password' };
    //   resMock = {
    //     status: jest.fn().mockReturnThis(),
    //     json: jest.fn(),
    //   };

    //   await userController.loginUser(reqMock, resMock);

    //   expect(userServiceMock.getUserByCpfWithPasswordRolesAndUnit).toHaveBeenCalledWith(
    //     '12345678901',
    //   );
    //   expect(resMock.status).toHaveBeenCalledWith(401);
    //   expect(resMock.json).toHaveBeenCalledWith({
    //     error: 'Impossível autenticar',
    //     message: 'Senha ou usuário incorretos',
    //   });
    // });

    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Internal server error';

      userServiceMock.getUserByCpfWithPasswordRolesAndUnit = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      reqMock.body = { cpf: '12345678901', password: '123' };

      await userController.loginUser(reqMock, resMock);

      expect(
        userServiceMock.getUserByCpfWithPasswordRolesAndUnit,
      ).toHaveBeenCalledWith('12345678901');
      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        error: expect.any(Error),
        message: 'erro inesperado',
      });
    });
  });

  describe('store', () => {
    // it('should create a new user', async () => {
    //   const newUser = {
    //     fullName: 'John Doe',
    //     cpf: '1234567890',
    //     email: 'john@example.com',
    //     password: 'password',
    //     idUnit: 1,
    //     idRole: 2,
    //   };
    //   const createdUser = {
    //     id: 1,
    //     fullName: 'John Doe',
    //     cpf: '1234567890',
    //     email: 'john@example.com',
    //     accepted: false,
    //     idUnit: 1,
    //     idRole: 2,
    //   };
    //   const createUserSpy = jest
    //     .spyOn(UserService.prototype, 'createUser')
    //     .mockReturnValue(createdUser);
    //   reqMock.body = newUser;
    //   await userController.store(reqMock, resMock);
    //   expect(createUserSpy).toHaveBeenCalled();
    //   expect(resMock.json).toHaveBeenCalledWith({
    //     user: createdUser,
    //     message: 'Usuario cadastrado com sucesso',
    //   });
    // });
    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Internal server error';
      userServiceMock.hash = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      reqMock.body = {
        fullName: 'John Doe',
        cpf: '1234567890',
        email: 'john@example.com',
        password: 'password',
        idUnit: 1,
        idRole: 2,
      };

      await userController.store(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        error: expect.any(Error),
        message: 'Erro ao criar usuário',
      });
    });
  });

  describe('updateUserPassword', () => {
    it('Should successfully update password (status 200)', async () => {
      userServiceMock.updateUserPassword = jest.fn().mockResolvedValue(true);

      reqMock = {
        params: { cpf: '12345678901' },
        body: { oldPassword: 'old', newPassword: 'new' },
      };

      await userController.updateUserPassword(reqMock, resMock);
      expect(userServiceMock.updateUserPassword).toHaveBeenCalledWith(
        '12345678901',
        'old',
        'new',
      );
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith({
        message: 'Senha atualizada com sucesso',
      });
    });

    it('should return 400 if the password is do not changed', async () => {
      userServiceMock.updateUserPassword = jest.fn().mockResolvedValue(null);
      reqMock = {
        params: { cpf: '12345678901' },
        body: { oldPassword: 'old', newPassword: 'new' },
      };

      await userController.updateUserPassword(reqMock, resMock);

      expect(userServiceMock.updateUserPassword).toHaveBeenCalledWith(
        '12345678901',
        'old',
        'new',
      );
      expect(resMock.status).toHaveBeenCalledWith(400);
      expect(resMock.json).toHaveBeenCalledWith({
        message: 'Senha não atualizada!',
      });
    });

    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Internal server error';
      userServiceMock.updateUserPassword = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));
      reqMock = {
        params: { cpf: '12345678901' },
        body: { oldPassword: 'old', newPassword: 'new' },
      };

      await userController.updateUserPassword(reqMock, resMock);

      expect(userServiceMock.updateUserPassword).toHaveBeenCalledWith(
        '12345678901',
        'old',
        'new',
      );
      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        error: expect.any(Error),
        message: 'Erro ao atualizar senha',
      });
    });
  });

  describe('getAllUsers', () => {
    // it('should return all users', async () => {
    //   jest.spyOn(middleware, 'tokenToUser').mockReturnValue({
    //     idUnit: 1,
    //     idRole: 1,
    //   });
    //   const users = [
    //     {
    //       fullName: 'John Doe',
    //       idRole: 1,
    //       accepted: false,
    //       cpf: '1019283727222',
    //       email: 'john@email.com',
    //       idUnit: 1,
    //     },
    //     {
    //       fullName: 'Jane Smith',
    //       idRole: 2,
    //       accepted: false,
    //       cpf: '212222222222',
    //       email: 'j@test.com',
    //       idUnit: 2,
    //     },
    //   ];
    //   userServiceMock.getAllUsers = jest.fn().mockResolvedValue(users);
    //   await userController.index(reqMock, resMock);
    //   // expect(userServiceMock.getAllUsers).toHaveBeenCalled();
    //   expect(resMock.status).toHaveBeenCalledWith(200);
    //   expect(resMock.json).toHaveBeenCalledWith({ users: users });
    // });
    // it('should return accepted users if "accepted" query parameter is true', async () => {
    //   jest.spyOn(middleware, 'tokenToUser').mockReturnValue({
    //     idUnit: 1,
    //     idRole: 1,
    //   });
    //   const users = [
    //     {
    //       fullName: 'John Doe',
    //       idRole: 1,
    //       accepted: false,
    //       cpf: '1019283727222',
    //       email: 'john@email.com',
    //       idUnit: 1,
    //     },
    //     {
    //       fullName: 'Jane Smith',
    //       idRole: 2,
    //       accepted: false,
    //       cpf: '212222222222',
    //       email: 'j@test.com',
    //       idUnit: 2,
    //     },
    //   ];
    //   const getAcceptedUsersSpy = jest
    //     .spyOn(UserService.prototype, 'getAcceptedUsers')
    //     .mockReturnValue(users);
    //   reqMock.query.accepted = 'true';
    //   await userController.index(reqMock, resMock);
    //   expect(getAcceptedUsersSpy).toHaveBeenCalled();
    //   expect(resMock.status).toHaveBeenCalledWith(500);
    // });
    // it('should return non-accepted users if "accepted" query parameter is false', async () => {
    //   jest.spyOn(middleware, 'tokenToUser').mockReturnValue({
    //     idUnit: 1,
    //     idRole: 1,
    //   });
    //   const users = [
    //     {
    //       fullName: 'John Doe',
    //       idRole: 1,
    //       accepted: false,
    //       cpf: '1019283727222',
    //       email: 'john@email.com',
    //       idUnit: 1,
    //     },
    //     {
    //       fullName: 'Jane Smith',
    //       idRole: 2,
    //       accepted: false,
    //       cpf: '212222222222',
    //       email: 'j@test.com',
    //       idUnit: 2,
    //     },
    //   ];
    //   const getNoAcceptedUsersSpy = jest
    //     .spyOn(UserService.prototype, 'getNoAcceptedUsers')
    //     .mockReturnValue(users);
    //   reqMock.query.accepted = 'false';
    //   reqMock.query.limit = 1;
    //   await userController.index(reqMock, resMock);
    //   expect(getNoAcceptedUsersSpy).toHaveBeenCalled();
    //   expect(resMock.status).toHaveBeenCalledWith(500);
    // });

    // it('should return 400 if "accepted" query parameter is neither true nor false', async () => {
    //   userServiceMock.userFromReq = jest
    //   .fn()
    //   .mockResolvedValue({ unit: { idUnit: 1 }, role: { idRole: 1 } });

    //   reqMock.query.accepted = 'inválido';

    //   await userController.index(reqMock, resMock);

    //   expect(resMock.status).toHaveBeenCalledWith(400);
    //   expect(resMock.json).toHaveBeenCalledWith({
    //     message: "O parâmetro accepted deve ser 'true' ou 'false'",
    //   });
    // });

    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Internal server error';
      userServiceMock.getAllUsers = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));
      await userController.index(reqMock, resMock);
      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        error: expect.any(Error),
        message: 'Erro ao listar usuários aceitos ou não',
      });
    });
  });

  describe('indexUsersAdminByUnitId', () => {
    it('Should return admin user data for a valid idUnit (status 200)', async () => {
      const Users = [
        {
          fullName: 'John Doe',
          idRole: 5,
          accepted: false,
          cpf: '12345678901',
          email: 'john@email.com',
          idUnit: 1,
        },
        {
          fullName: 'Jane Smith',
          idRole: 2,
          accepted: false,
          cpf: '212222222222',
          email: 'j@test.com',
          idUnit: 2,
        },
      ];

      userServiceMock.getUsersAdminByIdUnit = jest
        .fn()
        .mockResolvedValue(Users[0]);

      reqMock.params.idUnit = 1;

      await userController.indexUsersAdminByUnitId(reqMock, resMock);

      expect(userServiceMock.getUsersAdminByIdUnit).toHaveBeenCalledWith(1);
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(Users[0]);
    });

    it('should return 404 if user does not exist', async () => {
      userServiceMock.getUsersAdminByIdUnit = jest.fn().mockResolvedValue(null);
      reqMock.params.idUnit = 1;

      await userController.indexUsersAdminByUnitId(reqMock, resMock);

      expect(userServiceMock.getUsersAdminByIdUnit).toHaveBeenCalledWith(1);
      expect(resMock.status).toHaveBeenCalledWith(404);
      expect(resMock.json).toHaveBeenCalledWith({
        error: 'Usuários não existem',
      });
    });

    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Internal server error';
      userServiceMock.getUsersAdminByIdUnit = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));
      reqMock.params.idUnit = 1;

      await userController.indexUsersAdminByUnitId(reqMock, resMock);

      expect(userServiceMock.getUsersAdminByIdUnit).toHaveBeenCalledWith(1);
      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        message: 'Erro ao buscar usuários',
      });
    });
  });

  describe('getUserByCpf', () => {
    it('Should return user data for a valid CPF (status 200)', async () => {
      const Users = [
        {
          fullName: 'John Doe',
          idRole: 1,
          accepted: false,
          cpf: '12345678901',
          email: 'john@email.com',
          idUnit: 1,
        },
        {
          fullName: 'Jane Smith',
          idRole: 2,
          accepted: false,
          cpf: '212222222222',
          email: 'j@test.com',
          idUnit: 2,
        },
      ];

      userServiceMock.getUserByCpf = jest.fn().mockResolvedValue(Users[0]);

      reqMock.params.cpf = '12345678901';

      await userController.showUserByCpf(reqMock, resMock);

      expect(userServiceMock.getUserByCpf).toHaveBeenCalledWith('12345678901');
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(Users[0]);
    });

    it('should return 404 if user does not exist', async () => {
      userServiceMock.getUserByCpf = jest.fn().mockResolvedValue(null);
      reqMock.params.cpf = '1234567890';

      await userController.showUserByCpf(reqMock, resMock);

      expect(userServiceMock.getUserByCpf).toHaveBeenCalledWith('1234567890');
      expect(resMock.status).toHaveBeenCalledWith(404);
      expect(resMock.json).toHaveBeenCalledWith({
        error: 'Usuário não existe',
      });
    });

    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Internal server error';
      userServiceMock.getUserByCpf = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));
      reqMock.params.cpf = '1234567890';

      await userController.showUserByCpf(reqMock, resMock);

      expect(userServiceMock.getUserByCpf).toHaveBeenCalledWith('1234567890');
      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        message: 'Erro ao buscar usuário',
      });
    });
  });

  describe('showUserByUnit', () => {
    it('Should return user data for a valid idUnit (status 200)', async () => {
      const Users = [
        {
          fullName: 'John Doe',
          idRole: 1,
          accepted: false,
          cpf: '12345678901',
          email: 'john@email.com',
          idUnit: 1,
        },
        {
          fullName: 'Jane Smith',
          idRole: 2,
          accepted: false,
          cpf: '212222222222',
          email: 'j@test.com',
          idUnit: 2,
        },
      ];

      reqMock.params = { cpf: '12345678901', idUnit: 1 };

      userServiceMock.getUserByUnit = jest.fn().mockResolvedValue(Users[0]);

      await userController.showUserByUnit(reqMock, resMock);

      expect(userServiceMock.getUserByUnit).toHaveBeenCalledWith(
        '12345678901',
        1,
      );
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(Users[0]);
    });

    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Internal server error';
      userServiceMock.getUserByUnit = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));
      reqMock.params = { cpf: '12345678901', idUnit: 1 };

      await userController.showUserByUnit(reqMock, resMock);

      expect(userServiceMock.getUserByUnit).toHaveBeenCalledWith(
        '12345678901',
        1,
      );
      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        message: 'Erro ao buscar usuário',
      });
    });
  });

  describe('acceptRequest', () => {
    it('Should return accepted message for a valid cpf (status 200)', async () => {
      const User = {
        fullName: 'John Doe',
        idRole: 1,
        accepted: false,
        cpf: '12345678901',
        email: 'john@email.com',
        idUnit: 1,
        set: jest.fn(),
        save: jest.fn(),
      };

      userServiceMock.getUserByCpf = jest.fn().mockResolvedValue(User);

      reqMock.params.cpf = '12345678901';

      await userController.acceptRequest(reqMock, resMock);

      expect(userServiceMock.getUserByCpf).toHaveBeenCalledWith('12345678901');
      expect(User.set).toHaveBeenCalledWith({ accepted: true });
      expect(User.save).toHaveBeenCalled();
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith({
        message: 'Usuário aceito com sucesso',
      });
    });

    it('should return 404 if user does not exist', async () => {
      userServiceMock.getUserByCpf = jest.fn().mockResolvedValue(null);

      reqMock.params.cpf = '12345678901';

      await userController.acceptRequest(reqMock, resMock);

      expect(userServiceMock.getUserByCpf).toHaveBeenCalledWith('12345678901');
      expect(resMock.status).toHaveBeenCalledWith(404);
      expect(resMock.json).toHaveBeenCalledWith({
        error: 'Usuário não existe',
      });
    });

    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Internal server error';
      userServiceMock.getUserByCpf = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      reqMock.params.cpf = '12345678901';

      await userController.acceptRequest(reqMock, resMock);

      expect(userServiceMock.getUserByCpf).toHaveBeenCalledWith('12345678901');
      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        error: expect.any(Error),
        message: 'Falha ao aceitar usuário',
      });
    });
  });

  describe('updateUserEmail', () => {
    it('Should return accepted message email changed for a valid cpf and email (status 200)', async () => {
      reqMock = {
        params: { cpf: '12345678901' },
        body: { email: 'example@email.com' },
      };

      userServiceMock.updateUserEmail = jest.fn().mockResolvedValue(true);

      await userController.updateUserEmail(reqMock, resMock);

      expect(userServiceMock.updateUserEmail).toHaveBeenCalledWith(
        '12345678901',
        'example@email.com',
      );
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith({
        message: 'Email atualizado com sucesso',
      });
    });

    it('should return 400 if email is dont changed', async () => {
      userServiceMock.updateUserEmail = jest.fn().mockResolvedValue(null);

      reqMock = {
        params: { cpf: '12345678901' },
        body: { email: 'example@email.com' },
      };

      await userController.updateUserEmail(reqMock, resMock);

      expect(userServiceMock.updateUserEmail).toHaveBeenCalledWith(
        '12345678901',
        'example@email.com',
      );
      expect(resMock.status).toHaveBeenCalledWith(400);
      expect(resMock.json).toHaveBeenCalledWith({
        message: 'Email não atualizado',
      });
    });

    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Internal server error';
      userServiceMock.updateUserEmail = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      reqMock = {
        params: { cpf: '12345678901' },
        body: { email: 'example@email.com' },
      };

      await userController.updateUserEmail(reqMock, resMock);

      expect(userServiceMock.updateUserEmail).toHaveBeenCalledWith(
        '12345678901',
        'example@email.com',
      );
      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        error: expect.any(Error),
        message: 'Erro ao atualizar email',
      });
    });
  });

  describe('updateUserRole', () => {
    it('Should return accepted message role changed for a valid idRole and cpf (status 200)', async () => {
      reqMock.body = { idRole: 2, cpf: '12345678901' };

      userServiceMock.updateUserRole = jest.fn().mockResolvedValue(true);

      await userController.updateUserRole(reqMock, resMock);

      expect(userServiceMock.updateUserRole).toHaveBeenCalledWith(
        '12345678901',
        2,
      );
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith({
        message: 'Role atualizado com sucesso',
      });
    });

    it('should return 400 if role is do not changed', async () => {
      userServiceMock.updateUserRole = jest.fn().mockResolvedValue(null);

      reqMock.body = { idRole: 2, cpf: '12345678901' };

      await userController.updateUserRole(reqMock, resMock);

      expect(userServiceMock.updateUserRole).toHaveBeenCalledWith(
        '12345678901',
        2,
      );
      expect(resMock.status).toHaveBeenCalledWith(400);
      expect(resMock.json).toHaveBeenCalledWith({
        message: 'Role não atualizada',
      });
    });

    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Internal server error';
      userServiceMock.updateUserRole = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      reqMock.body = { idRole: 2, cpf: '12345678901' };

      await userController.updateUserRole(reqMock, resMock);

      expect(userServiceMock.updateUserRole).toHaveBeenCalledWith(
        '12345678901',
        2,
      );
      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        error: expect.any(Error),
        message: 'Erro ao atualizar role',
      });
    });
  });

  describe('deleteByCpf', () => {
    // it('should delete an existing user by CPF', async () => {
    //   const user = { cpf: '1234567890', destroy: jest.fn() };
    //   userServiceMock.getAcceptedUserByCpf = jest.fn().mockResolvedValue(user);
    //   reqMock.params.cpf = '1234567890';
    //   await userController.deleteByCpf(reqMock, resMock);
    //   expect(userServiceMock.getAcceptedUserByCpf).toHaveBeenCalledWith(
    //     '1234567890',
    //   );
    //   expect(user.destroy).toHaveBeenCalled();
    //   expect(resMock.status).toHaveBeenCalledWith(200);
    //   expect(resMock.json).toHaveBeenCalledWith({
    //     message: 'Usuário apagado com sucesso',
    //   });
    // });
    it('should return 404 if user does not exist', async () => {
      userServiceMock.getAcceptedUserByCpf = jest.fn().mockResolvedValue(null);
      reqMock.params.cpf = '1234567890';
      await userController.deleteByCpf(reqMock, resMock);
      expect(userServiceMock.getAcceptedUserByCpf).toHaveBeenCalledWith(
        '1234567890',
      );
      expect(resMock.status).toHaveBeenCalledWith(404);
      expect(resMock.json).toHaveBeenCalledWith({
        error: 'Usuário não existe!',
      });
    });

    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Internal server error';
      userServiceMock.getAcceptedUserByCpf = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));
      reqMock.params.cpf = '1234567890';
      await userController.deleteByCpf(reqMock, resMock);
      expect(userServiceMock.getAcceptedUserByCpf).toHaveBeenCalledWith(
        '1234567890',
      );
      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        error: expect.any(Error),
        message: 'Erro ao apagar usuário',
      });
    });
  });
});
