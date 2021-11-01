import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { passwordAuthChecker } from "./utils/auth-checker";
import depthLimit from 'graphql-depth-limit'
import { GraphQLError } from 'graphql';
import queryComplexity, { simpleEstimator } from 'graphql-query-complexity';


export async function getApolloServer() {

    const queryComplexityRule = queryComplexity({
        maximumComplexity: 1000,
        variables: {},
        // eslint-disable-next-line no-console
        createError: (max: number, actual: number) => new GraphQLError(`Query is too complex: ${actual}. Maximum allowed complexity: ${max}`),
        estimators: [
            simpleEstimator({
                defaultComplexity: 1,
            }),
        ],
    });


    const schema = await buildSchema({
        resolvers: [__dirname + "/resolvers/*.{ts,js}"],
        authChecker: passwordAuthChecker,
        nullableByDefault: null,
    });

    const server = new ApolloServer({
        schema,
        playground: true,
        introspection: process.env.NODE_ENV === 'developpement',
        context: ({ req, res }) => ({ req, res }),
        validationRules: [depthLimit(5, queryComplexityRule)],
        formatError: (err): Error => {
            if (err.message.startsWith('Database Error: ')) {
                return new Error('Internal server error');
            }

            return err;
        },
    });

    return server
}
