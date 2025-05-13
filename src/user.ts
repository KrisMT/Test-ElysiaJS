import { Elysia, t } from 'elysia';
import { betterAuthService } from '@/utils/auth';

export const getUserId = new Elysia()
  .use(betterAuthService)
  .guard({
    auth: true,
  })
  .resolve(({ user }) => ({
    user: user
  }))
  .as('scoped');

export const user = new Elysia({ 
  prefix: '/user' ,
  detail: {
    tags: ['User']
  }
})
  .use(getUserId)
  .get('/profile', ({ user }) => ({
      success: true,
      user
  }));

