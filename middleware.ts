// middleware.ts
import { IMEstudianteRes } from 'interfaces/Entities';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const baseURL = '/api/ema/V1';

const valideteStudentRoutes = (pathname: string) =>
  pathname === `${baseURL}/Especialidad` ||
  pathname === `${baseURL}/Genero` ||
  pathname === `${baseURL}/Inteligencia` ||
  pathname === `${baseURL}/Semestre`;

export default withAuth(
  async function middleware(req) {
    console.log(
      '----------------------------------------middleware----------------------------------------'
    );
    const {
      method,
      nextUrl: { pathname },
    } = req;

    const token = req.cookies.get('next-auth.session-token');

    if (pathname.startsWith('/api/ema') && !token) {
      if (method === 'GET' && valideteStudentRoutes(pathname)) {
        NextResponse.redirect(new URL('/api/Unauthorized', req.url));
        return NextResponse.next();
      }
      console.log(
        '------------------------No autorizado------------------------'
      );

      return NextResponse.redirect(new URL('/api/Unauthorized', req.url));
    }
    if (!token) return NextResponse.redirect(new URL('/', req.url));

    // Se protegen las rutas para que los usuarios no logueados las puedan consular

    // const session = req.cookies.get('next-auth.session-token');

    // if (pathname.startsWith('/api/ema') && !session) {
    //   const baseURL = '/api/ema/V1';
    //   if (
    //     method === 'GET' &&
    //     (pathname === `${baseURL}/Especialidad` ||
    //       pathname === `${baseURL}/Genero` ||
    //       pathname === `${baseURL}/Inteligencia` ||
    //       pathname === `${baseURL}/Semestre`)
    //   ) {
    //     return NextResponse.next();
    //   }
    //   console.log(
    //     '------------------------No autorizado------------------------'
    //   );

    //   return NextResponse.redirect(new URL('/api/Unauthorized', req.url));
    // }

    // // Se protegen las rutas para que solo los usuarios logeados las puedan consultar

    // // Si no te haz logueado te regresa a la pagina principal

    // if (!session) return NextResponse.redirect(new URL('/', req.url));

    // // Obtenemos el payload del token

    // // Si no se cumple ninguna de las condiciones anteriores continua tu comportamiento por defecto
    // return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        console.log(
          '----------------------------------------authorized----------------------------------------'
        );
        const {
          method,
          nextUrl: { pathname },
        } = req;

        // console.log({ token });
        if (!token) return true;

        const data = token.data as IMEstudianteRes;

        const { id_rol } = data.user.rol;

        if (pathname.startsWith('/api/ema')) {
          const baseURL = '/api/ema/V1';
          return !(
            id_rol === 2 &&
            method === 'GET' &&
            !valideteStudentRoutes(pathname)
          );
        } //   // Se protegen las rutas para que solo los usuarios con el rol de administrador puedan consultarlas

        //   // Se protegen las rutas para que solo los usuarios con el rol de administrador puedan consultarlas
        //   if (id_rol !== 1 && method !== 'GET')
        //     NextResponse.redirect(new URL('/api/Unauthorized', request.url));
        //   NextResponse.next();
        // }

        return true;
      },
      //
    },
  }
);

// See "Matching Paths" below to learn more
export const config = {
  // '/api/ema/:path*'
  matcher: ['/studnt/:path*', '/ad/:path*'],
};
