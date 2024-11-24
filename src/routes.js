import UserLogin from "./views/UserLogin.vue";
import UserRegister from "./views/UserRegister.vue";
import AppLayout from "./components/AppLayout.vue";
import UserProfile  from "./views/UserProfile.vue";
import AllMinerals from "./views/AllMinerals.vue";
import UserLibrary from "./views/UserLibrary.vue";
import PeriodicTable from './views/PeriodicTable.vue';
const routes = [
  { path: "/login", component: UserLogin },
  { path: "/register", component: UserRegister },
  {
    path: "/",
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "user", component: UserProfile },
      { path: "minerals", component: AllMinerals },
      { path: "library", component: UserLibrary },
      { path: "periodica", component: PeriodicTable},
    ],
  },
];

export default routes;
