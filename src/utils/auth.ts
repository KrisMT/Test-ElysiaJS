import { betterAuth } from 'better-auth';
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as authSchema from '@/db/auth-schema';
import { Elysia } from 'elysia';

import { openAPI, admin as adminPlugin } from 'better-auth/plugins';

import { createAccessControl } from 'better-auth/plugins/access';
import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access';

const statment = {
  ...defaultStatements,
  project: ['create', 'share', 'update', 'delete'],
} as const;

const ac = createAccessControl(statment);

const admin = ac.newRole({
  project: ['create', 'update'],
  ...adminAc.statements,
});

export const auth = betterAuth({
  basePath: '/api',
  database: drizzleAdapter(db, {
    provider: "pg", //"pg" or "mysql", "sqlite"
    schema: {
      ...authSchema,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    openAPI(),
    adminPlugin({
      adminUserIds: [''],
      ac,
      roles: {
        admin,
      },
    }),
  ],
});

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema());

export const OpenAPI = {
  getPaths: (prefix = '/auth/api') =>
    getSchema().then(({ paths }) => {
      const reference: typeof paths = Object.create(null);

      for (const path of Object.keys(paths)) {
        const key = prefix + path;
        reference[key] = paths[path];

        for (const method of Object.keys(paths[path])) {
          const operation = (reference[key] as any)[method];

          operation.tags = ['Better Auth'];
        }
      }

      return reference;
    }) as Promise<any>,
  components: getSchema().then(({ components }) => components) as Promise<any>
} as const;

export const betterAuthService = new Elysia({ name: 'better-auth/service' })
  .mount('/auth', auth.handler)
  .macro({
    auth: {
      async resolve({ error, request: { headers }}) {
        const session = await auth.api.getSession({
          headers,
        });
        
        if (!session) return error(401);

        return {
          user: session.user,
          session: session.session,
        };
      },
    }
  });

