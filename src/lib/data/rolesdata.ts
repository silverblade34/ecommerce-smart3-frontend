import {
  Bank,
  BoxArrowDown,
  BoxArrowUp,
  Icon,
  LinkSimple,
  Star,
  UsersThree,
} from '@phosphor-icons/react';

export const Roles: {
  name: string;
  views: {
    title: string;
    url: string;
    icon: Icon;
  }[];
}[] = [
  {
    name: 'Estrella',
    views: [
      {
        title: 'Perfil',
        url: '/dashboard/perfil',
        icon: Star,
      },
      {
        title: 'Pedidos',
        url: '/dashboard/pedidos/estrella',
        icon: BoxArrowDown,
      },
      {
        title: 'Registro de devoluciones',
        url: '/dashboard/devoluciones-estrella/solicitud',
        icon: BoxArrowUp,
      },
      {
        title: 'Seguimiento de devoluciones',
        url: '/dashboard/devoluciones-estrella',
        icon: BoxArrowUp,
      },
      {
        title: 'Solictud de traslado',
        url: '/dashboard/translado/solicitud-estrella',
        icon: BoxArrowUp,
      },
    ],
  },
  {
    name: 'Interno',
    views: [
      {
        title: 'Perfil',
        url: '/dashboard/perfil',

        icon: LinkSimple,
      },
      {
        title: 'Gestión de estrellas',
        url: '/dashboard/gestion/interno',
        icon: UsersThree,
      },
    ],
  },
  {
    name: 'Directora',
    views: [
      {
        title: 'Perfil',
        url: '/dashboard/perfil',
        icon: LinkSimple,
      },
      {
        title: 'Pedidos ',
        url: '/dashboard/pedidos/directora',
        icon: LinkSimple,
      },
      {
        title: 'Seguimiento de pedidos',
        url: '/dashboard/pedidos/directora/seguimiento',
        icon: LinkSimple,
      },
      {
        title: 'Cuenta corriente',
        url: '/dashboard/cuenta-corriente',
        icon: Bank,
      },
      {
        title: 'Gestión de estrellas',
        url: '/dashboard/gestion/directora',
        icon: UsersThree,
      },
      {
        title: 'Solictud de traslado',
        url: '/dashboard/translado/solicitud-directora',
        icon: BoxArrowUp,
      },
    ],
  },
  {
    name: 'Tienda',
    views: [
      {
        title: 'Perfil',
        url: '/dashboard/perfil',
        icon: LinkSimple,
      },
      {
        title: 'Gestión de estrellas',
        url: '/dashboard/gestion/tienda',
        icon: UsersThree,
      },
    ],
  },
];
