<template>
    <v-app>
      <v-navigation-drawer app permanent>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ user.name || "Usuario" }}</v-list-item-title>
              <v-list-item-subtitle>{{ user.email || "Correo" }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="goTo('/user')">Usuario</v-list-item>
          <v-list-item @click="goTo('/minerals')">Minerales</v-list-item>
          <v-list-item @click="goTo('/library')">Biblioteca</v-list-item>
          <v-list-item @click="goTo('/periodica')">Tabla Periodica</v-list-item>
          <v-list-item @click="logout">Cerrar Sesión</v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <router-view></router-view>
      </v-main>
    </v-app>
  </template>
  
  <script>
  import { ref } from "vue";
  import { auth } from "../firebase";
  import { useRouter } from "vue-router";
  
  export default {
    setup() {
      const router = useRouter();
      const user = ref({
        name: auth.currentUser?.displayName || "Usuario",
        email: auth.currentUser?.email || "Correo",
      });
  
      const logout = async () => {
        await auth.signOut();
        router.push("/login");
      };
  
      const goTo = (path) => {
        router.push(path);
      };
  
      return { user, logout, goTo };
    },
  };
  </script>
  