<template>
  <v-container>
    <!-- Botón para abrir el diálogo -->
    <v-btn color="primary" class="mb-4" @click="dialog = true">Añadir Mineral</v-btn>
    <!-- Campo de búsqueda -->
    <v-text-field
      v-model="filter"
      label="Buscar en tu biblioteca"
      class="mb-4"
    ></v-text-field>
    <!-- Tabla de minerales -->
    <v-data-table
      :items="filteredLibrary"
      class="elevation-1"
    ></v-data-table>

    <!-- Diálogo para añadir minerales -->
    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title>Buscar y Añadir Mineral</v-card-title>
        <v-card-text>
          <!-- Campo de búsqueda dentro del diálogo -->
          <v-text-field
            v-model="search"
            label="Buscar mineral"
            class="mb-4"
          ></v-text-field>
          <!-- Tabla para seleccionar minerales -->
          <v-data-table
            :items="filteredMinerals"
            :headers="dialogHeaders"
            class="elevation-1"
          >
            <template v-slot:body="{ items }">
              <tr
                v-for="item in items"
                :key="item.Nombre_Común"
                @click="addMineral(item)"
                style="cursor: pointer"
              >
                <td>{{ item.Nombre_Común }}</td>
                <td>{{ item.grupo }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

export default {
  setup() {
    const library = ref([]); // Datos de la biblioteca del usuario
    const minerals = ref([]); // Todos los minerales disponibles
    const filter = ref(""); // Filtro para la biblioteca
    const search = ref(""); // Filtro para el diálogo
    const dialog = ref(false); // Estado del diálogo

    // Encabezados de la tabla principal
    const headers = [
      { text: "Familia", value: "Familia" },
      { text: "Nombre Común", value: "Nombre_Común" },
      { text: "Nombre Científico", value: "Nombre_Científico" },
      { text: "Fórmula Química", value: "Fórmula_Química" },
      { text: "Color", value: "Color" },
      { text: "Dureza", value: "Dureza" },
      { text: "Peso Específico", value: "Peso_Específico" },
      { text: "Forma", value: "Forma" },
      { text: "Raya", value: "Raya" },
      { text: "Brillo", value: "Brillo" },
      { text: "Comentarios", value: "Comentarios" },
      { text: "Identificación", value: "Identificación" },
      { text: "Limitaciones", value: "Limitaciones" },
      { text: "Grupo", value: "grupo" },
    ];

    // Encabezados de la tabla en el diálogo
    const dialogHeaders = [
      { text: "Nombre Común", value: "Nombre_Común" },
      { text: "Grupo", value: "grupo" },
    ];

    // Filtrar la biblioteca del usuario
    const filteredLibrary = computed(() => {
      return library.value.filter((mineral) =>
        mineral.Nombre_Común.toLowerCase().includes(filter.value.toLowerCase())
      );
    });

    // Filtrar los minerales en el diálogo
    const filteredMinerals = computed(() => {
      return minerals.value.filter((mineral) =>
        mineral.Nombre_Común.toLowerCase().includes(search.value.toLowerCase())
      );
    });

    // Cargar la biblioteca del usuario desde Firebase
    const fetchLibrary = async () => {
      if (!auth.currentUser) {
        alert("No estás autenticado. Por favor, inicia sesión.");
        return;
      }

      const userCollection = `minerales_${auth.currentUser.uid}`;
      try {
        const querySnapshot = await getDocs(collection(db, userCollection));
        library.value = querySnapshot.docs.map((doc) => doc.data());
      } catch (error) {
        console.error("Error al cargar la biblioteca:", error);
        alert("Hubo un error al cargar tu biblioteca.");
      }
    };

    // Cargar todos los minerales disponibles
    const fetchMinerals = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "minerales"));
        minerals.value = querySnapshot.docs.map((doc) => doc.data());
      } catch (error) {
        console.error("Error al cargar los minerales:", error);
        alert("Hubo un error al cargar los minerales disponibles.");
      }
    };

    // Añadir el mineral completo del diálogo a la biblioteca del usuario
    const addMineral = async (selectedMineral) => {
      if (!auth.currentUser) {
        alert("No estás autenticado. Por favor, inicia sesión.");
        return;
      }

      const userCollection = `minerales_${auth.currentUser.uid}`;
      try {
        // Añadir el mineral completo a la base de datos del usuario
        await addDoc(collection(db, userCollection), selectedMineral);

        // Añadir el mineral completo a la biblioteca del usuario
        library.value.push(selectedMineral);

        alert(`Mineral "${selectedMineral.Nombre_Común}" añadido con éxito.`);
        dialog.value = false; // Cerrar el diálogo
      } catch (error) {
        console.error("Error al añadir el mineral:", error);
        alert("Hubo un error al añadir el mineral.");
      }
    };

    onMounted(() => {
      fetchLibrary();
      fetchMinerals();
    });

    return {
      library,
      filter,
      headers,
      filteredLibrary,
      dialog,
      search,
      filteredMinerals,
      dialogHeaders,
      addMineral,
    };
  },
};
</script>
