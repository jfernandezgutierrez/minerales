<template>
  <v-app>
    <!-- Navegación con botón de colapso -->
    <v-navigation-drawer
      v-model="drawer"
      app
      :mini-variant="mini"
      :mini-variant-width="56"
    >
      <!-- Botón para colapsar o expandir -->
      <template v-slot:prepend>
        <v-toolbar flat dense>
          <v-btn icon @click="toggleMini">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </v-toolbar>
      </template>

      <!-- Lista de opciones del menú -->
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>{{ user.name || "Usuario" }}</v-list-item-title>
            <v-list-item-subtitle>{{ user.email || "Correo" }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>

        <v-list-item @click="goTo('/user')">
          <v-list-item-icon><v-icon>mdi-account</v-icon></v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Usuario</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="goTo('/minerals')">
          <v-list-item-icon><v-icon>mdi-diamond</v-icon></v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Minerales</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="goTo('/library')">
          <v-list-item-icon><v-icon>mdi-book</v-icon></v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Biblioteca</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="goTo('/periodica')">
          <v-list-item-icon><v-icon>mdi-table</v-icon></v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Tabla Periodica</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-icon><v-icon>mdi-logout</v-icon></v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Cerrar Sesión</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Botón flotante para mostrar el menú -->
    <v-btn
      v-if="!drawer"
     class="menu"
      color="primary"
      @click="drawer = true"
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>

    <!-- Contenido principal -->
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

    // Estado del usuario
    const user = ref({
      name: auth.currentUser?.displayName || "Usuario",
      email: auth.currentUser?.email || "Correo",
    });

    // Estado del drawer
    const drawer = ref(true); // Estado de abierto o cerrado
    const mini = ref(false); // Estado de tamaño mini

    // Alternar tamaño mini
    const toggleMini = () => {
      drawer.value = !drawer.value;
    };

    // Función para cerrar sesión
    const logout = async () => {
      await auth.signOut();
      router.push("/login");
    };

    // Navegar a otra ruta
    const goTo = (path) => {
      router.push(path);
    };

    return { user, drawer, mini, toggleMini, logout, goTo };
  },
};
</script>

<style>
/* Opcional: ajusta la posición del botón flotante si es necesario */
.menu {
  position: fixed;
  z-index: 9999;
}
</style>
