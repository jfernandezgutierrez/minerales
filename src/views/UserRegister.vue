<template>
    <v-container>
      <v-card class="mx-auto" max-width="400">
        <v-card-title>Registro</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field v-model="name" label="Nombre" required></v-text-field>
            <v-text-field v-model="email" label="Correo" required></v-text-field>
            <v-text-field
              v-model="password"
              label="Contraseña"
              type="password"
              required
            ></v-text-field>
            <v-text-field
              v-model="confirmPassword"
              label="Confirmar Contraseña"
              type="password"
              required
            ></v-text-field>
            <v-btn color="primary" block @click="register">Registrar</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import { ref } from "vue";
  import { auth, db } from "../firebase";
  import { createUserWithEmailAndPassword } from "firebase/auth";
  import { doc, setDoc } from "firebase/firestore";
  import { useRouter } from "vue-router";
  
  export default {
    setup() {
      const email = ref("");
      const name = ref("");
      const password = ref("");
      const confirmPassword = ref("");
      const router = useRouter();
  
      const register = async () => {
        if (password.value !== confirmPassword.value) {
          alert("Las contraseñas no coinciden.");
          return;
        }
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email.value,
            password.value
          );
          const user = userCredential.user;
  
          // Guardar en Firestore
          await setDoc(doc(db, "usuarios", user.uid), {
            name: name.value,
            email: email.value,
          });
  
          alert("Usuario registrado con éxito.");
          router.push("/login");
        } catch (error) {
          alert("Error al registrarse: " + error.message);
        }
      };
  
      return { email, name, password, confirmPassword, register };
    },
  };
  </script>
  