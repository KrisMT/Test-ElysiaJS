import { Elysia, t } from "elysia";
import { swagger } from '@elysiajs/swagger'
import { note } from '@/note'
import { user } from '@/user'
import { betterAuthService } from '@/utils/auth'

import { OpenAPI, auth } from '@/utils/auth'

const app = new Elysia()
  .use(betterAuthService)
  .use(swagger({ 
    provider: 'swagger-ui' ,
    documentation: {
      components: await OpenAPI.components,
      paths: await OpenAPI.getPaths(),
    },
  }))
  .onError(({ error, code }) => {
    if (code === 'NOT_FOUND') return 'Not Found :('

    console.error(error);
  })
  .use(note)
  .use(user)
  .get("/", 'Hello Elysia')
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}/swagger`
);
