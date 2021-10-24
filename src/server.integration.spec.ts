import { createConnection, getConnection, getRepository } from 'typeorm';
import { createTestClient } from 'apollo-server-testing';
import { User } from './entities/User';
import * as bcrypt from 'bcrypt';
import { getApolloServer } from './server';


describe('Apollo server', () => {
    let query, mutate;

    beforeEach(async () => {
        await createConnection({
            name: 'default',
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: "root",
            password: "rootuser",
            database: "ects_test",
            dropSchema: true,
            logging: false,
            synchronize: true,
            migrationsRun: true,
            entities: [User],
        });

        const testClient = createTestClient(await getApolloServer());
        query = testClient.query;
        mutate = testClient.mutate;
    });

    afterEach(() => {
        const conn = getConnection();
        return conn.close();
    });

    describe('mutation createUser', () => {
        it('creates and returns a new user', async () => {
            const manager = getConnection().manager;
            const test = manager.connection.getRepository(User);

            const response = await mutate({
                mutation: `
          mutation {
            createUser(
                email: "prune@hotmail.fr"
                password: "Banane"
            ) {
                id
                email
                password
            }
          }
      `,
            });

            expect(await User.count()).toEqual(1);
            const user = await getRepository(User).findOne({ email: response.data.createUser.email })
            //console.log(await bcrypt.compare("Banane", response.data.createUser.password));



            expect(response.data).toMatchObject({
                createUser: {
                    email: user.email,
                    password: user.password
                },
            });
        });
    });

    describe('query users', () => {
        it('returns all users', async () => {
            //const manager = getConnection().manager.getRepository(User);
            const user1 = User.create({
                email: 'laure@pinson.fr',
                password: 'Pinson',
            });
            await user1.save();
            const user2 = User.create({
                email: 'pierre@corbeau.fr',
                password: 'Corbeau',
            });
            await user2.save();

            const response = await query({
                query: `
            {
              users {
                id
                email
                password
              }
            }
          `,
            });

            expect(response.data).toEqual({
                users: [
                    {
                        id: '1',
                        email: 'laure@pinson.fr',
                        password: 'Pinson',

                    },
                    {
                        id: '2',
                        email: 'pierre@corbeau.fr',
                        password: 'Corbeau',
                    }
                ],
            });
        });
    });
});
