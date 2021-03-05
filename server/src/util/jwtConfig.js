const allRoles = [1, 2, 3, 4, 5];
module.exports = {
  jwtSecret: 'testsercret',
  jwtOptions: {
    issuer: 'engoo.cn',
    expiresIn: '3d'
  },
  anonymouns: [
    {
      path: '/token',
      method: '*'
    }, 
    {
      path: '/sms',
      method: '*'
    }, 
    {
      path: '/register',
      method: '*'
    }, 
    {
      path: '/static',
      method: 'GET'
    },
    {
      path: '/api/teamtype',
      method: 'GET'
    },
    {
      path: '/upload',
      method: 'POST'
    },
    {
      path: '/rnupload/image',
      method: 'POST'
    },
    {
      path: '/api/site/many',
      method: 'POST'
    },
    {
      path: '/api/site',
      method: 'GET'
    },
    {
      path: '/wxtoken',
      method: '*'
    },
    {
      path: '/wxsign',
      method: '*'
    },
    {
      path: '/wxticket',
      method: '*'
    },
  ],
  path_role_arr: [
    {
      path: '/api/users',
      roles: allRoles
    },
    {
      path: '/api/users/detail',
      roles: allRoles
    },
    {
      path: '/api/org',
      roles: allRoles
    },
    {
      path: '/api/role',
      roles: allRoles
    },
    {
      path: '/api/department',
      roles: allRoles
    },
    {
      path: '/api/alarm',
      roles: allRoles
    },
    {
      path: '/api/alarm/some',
      roles: allRoles
    },
    {
      path: '/api/alarm/total',
      roles: allRoles
    },
    {
      path: '/api/mongouser/some',
      roles: allRoles
    },
    {
      path: '/api/mongouser',
      roles: allRoles
    },
    {
      path: '/api/file',
      roles: allRoles
    },
    {
      path: '/api/avatar',
      roles: allRoles
    },
    {
      path: '/api/notice',
      roles: allRoles
    },
    {
      path: '/api/notice/byUserId',
      roles: allRoles
    },
    {
      path: '/api/chat',
      roles: allRoles
    },
  ]
}