import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes'

export default [
  layout('./routes/auth/layout.tsx', [
    route('login', 'routes/auth/login.tsx'),
    route('register', 'routes/auth/register.tsx'),
    route('verify-email', 'routes/auth/verify-email.tsx'),
    route('forgot-password', 'routes/auth/password-reset.tsx'),
  ]),

  layout('./routes/_authenticated.tsx', [
    layout('./routes/_app.tsx', [index('routes/home.tsx')]),
  ]),
] satisfies RouteConfig
