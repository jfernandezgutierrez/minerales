import { createApp } from "vue";
import App from "./App.vue";
import { createVuetify } from "vuetify";
import "vuetify/styles";
import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";
import { auth } from "./firebase";

const app = createApp(App);
const vuetify = createVuetify();
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Proteger rutas
router.beforeEach((to, from, next) => {
  const user = auth.currentUser;
  if (to.meta.requiresAuth && !user) {
    next("/login");
  } else {
    next();
  }
});

app.use(vuetify);
app.use(router);
app.mount("#app");
