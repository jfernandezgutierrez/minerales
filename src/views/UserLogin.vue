<template>
    <v-container>
      <v-card class="mx-auto" max-width="400">
        <v-card-title>Iniciar Sesión</v-card-title>
        <v-card-text>
          <v-form  @keydown.enter="login">
            <v-text-field v-model="email" label="Correo" required></v-text-field>
            <v-text-field
              v-model="password"
              label="Contraseña"
              type="password"
              required
            ></v-text-field>
            <v-btn color="primary" block @click="login">Iniciar Sesión</v-btn>
          </v-form>
          <v-btn block text color="secondary" @click="goToRegister">
            ¿No tienes cuenta? Regístrate
          </v-btn>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import { ref } from "vue";
  import { signInWithEmailAndPassword } from "firebase/auth";
  import { auth } from "../firebase";
  import { useRouter } from "vue-router";
  
  export default {
    setup() {
      const email = ref("");
      const password = ref("");
      const router = useRouter();
  
      const login = async () => {
        try {
          await signInWithEmailAndPassword(auth, email.value, password.value);
          router.push("/");
        } catch (error) {
          alert("Error al iniciar sesión: " + error.message);
        }
      };
  
      const goToRegister = () => {
        router.push("/register");
      };
  
      return { email, password, login, goToRegister };
    },
  };
  </script>
  