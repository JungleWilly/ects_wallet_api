import { createConnection, getConnection, getRepository } from 'typeorm';
import { createTestClient } from 'apollo-server-testing';
import { User } from './entities/User';
import * as bcrypt from 'bcrypt';
import { getApolloServer } from './server';


describe('Apollo server', () => {
    let query, mutate;

    beforeEach(async () => {
        if (process.env.NODE_ENV === 'test') {
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
        } else {
            await createConnection({
                name: 'default',
                type: 'mysql',
                host: 'localhost',
                port: 3306,
                username: "user",
                password: "secret",
                database: "test_db",
                dropSchema: true,
                logging: false,
                synchronize: true,
                migrationsRun: true,
                entities: [User],
            });
        }

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
            getConnection().manager.connection.getRepository(User);

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

            const user = await getRepository(User)
                .findOne(
                    { email: response.data.createUser.email }
                )

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
            const salt = await bcrypt.genSalt(10);

            const user1 = User.create({
                email: 'laure@pinson.fr',
                password: await bcrypt.hash('Pinson', salt),
            });
            await user1.save();
            const user2 = User.create({
                email: 'pierre@corbeau.fr',
                password: await bcrypt.hash('Corbeau', salt),
            });
            await user2.save();

            const response = await query({
                query: `
                {
                    users {
                        id
                        email
                    }
                }
            `,
            });

            expect(response.data).toEqual({
                users: [
                    {
                        id: '1',
                        email: 'laure@pinson.fr',

                    },
                    {
                        id: '2',
                        email: 'pierre@corbeau.fr',
                    }
                ],
            });
        });
    });
});
