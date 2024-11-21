<template>
    <v-container>
      <v-card class="mx-auto" max-width="400">
        <v-card-title>Información del Usuario</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
              <v-list-item-title>Nombre:</v-list-item-title>
              <v-list-item-subtitle>{{ user.name }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Correo:</v-list-item-title>
              <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-btn color="primary" block @click="changePassword">Cambiar Contraseña</v-btn>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import { ref } from "vue";
  import { auth } from "../firebase";
  
  export default {
    setup() {
      const user = ref({
        name: auth.currentUser?.displayName || "Usuario",
        email: auth.currentUser?.email || "Correo",
      });
  
      const changePassword = async () => {
        try {
          await auth.sendPasswordResetEmail(user.value.email);
          alert("Se ha enviado un correo para restablecer la contraseña.");
        } catch (error) {
          alert("Error al cambiar la contraseña: " + error.message);
        }
      };
  
      return { user, changePassword };
    },
  };
  </script>
  