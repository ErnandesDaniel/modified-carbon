import { isNil } from 'lodash-es';
import { NextResponse } from 'next/server';

import { auth } from '@/auth';

export default auth((req) => {
  const isLoggedIn = !isNil(req.auth?.user);

  // if(!isLoggedIn && req.nextUrl.pathname.includes('main')) {
  //     return NextResponse.redirect(new URL('/', req.nextUrl.origin))
  // }

  if (!isLoggedIn && req.nextUrl.pathname.includes('profile')) {
    return NextResponse.redirect(new URL('/', req.nextUrl.origin));
  }

  if (!isLoggedIn && req.nextUrl.pathname.includes('logout')) {
    return NextResponse.redirect(new URL('/', req.nextUrl.origin));
  }

  if (isLoggedIn && req.nextUrl.pathname.includes('login')) {
    return NextResponse.redirect(new URL('/main', req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
