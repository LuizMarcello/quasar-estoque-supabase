const routes = [
  /* Todas as rotas aqui neste layout são publicas */
  {
    path: "/",
    component: () => import("layouts/LoginLayout.vue"),

    children: [{
        path: "",
        name: "loginDefault",
        component: () => import("pages/Login.vue"),
      },
      {
        path: "login",
        name: "login",
        component: () => import("pages/Login.vue"),
      },
      {
        path: "register",
        name: "register",
        component: () => import("pages/Register.vue"),
      },
      {
        path: "email-confirmation",
        name: "email-confirmation",
        component: () => import("pages/EmailConfirmation.vue"),
      },
      {
        path: "forgot-password",
        name: "forgot-password",
        component: () => import("pages/ForgotPassword.vue"),
      },
      {
        path: "reset-password",
        name: "reset-password",
        component: () => import("pages/ResetPassword.vue"),
      },
    ],
  },

  /* Todas as rotas aqui neste layout precisam estar logadas */
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{
        path: "me",
        name: "me",
        component: () => import("pages/Me.vue"),
      },
      {
        path: "category",
        name: "category",
        component: () => import("pages/category/List.vue"),
      },
      {
        path: "form-category",
        name: "form-category",
        component: () => import("pages/category/Form.vue"),
      },
      /*
    {
          path: "",
          component: () => import("pages/IndexPage.vue")
    }
    */
    ],
    /* meta: Para que as rotas sejam logadas
       Configurado no arquivo router/index.js */
    meta: {
      requiresAuth: true,
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
