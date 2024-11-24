<template>
  <v-container>
    <!-- Botón para abrir el modal -->
    <v-btn color="primary" class="mb-4" @click="dialog = true">Añadir Mineral</v-btn>

    <!-- Chips de filtrado en la biblioteca -->
    <v-chip-group
      v-model="selectedGroupLibrary"
      class="mb-4"
      column
    >
      <v-chip
        v-for="group in allGroupsLibrary"
        :key="group"
        @click="filterLibraryByGroup(group)"
        :active="selectedGroupLibrary === group"
        class="mr-2"
      >
        {{ group }}
      </v-chip>
    </v-chip-group>

    <!-- Campo de búsqueda en la biblioteca -->
    <v-text-field
      v-model="filter"
      label="Buscar minerales en tu biblioteca"
      class="mb-4"
    ></v-text-field>

    <!-- Lista de minerales del usuario -->
    <div v-for="(groupedMinerals, group) in groupedLibrary" :key="group">
      <h3>{{ group }}</h3>
      <div class="minerals-list">
        <div
          v-for="mineral in groupedMinerals"
          :key="mineral.Nombre_Científico"
          class="mineral-card"
        >
          <h4>{{ mineral.Nombre_Científico }}</h4>
          <p>{{ mineral.Fórmula_Química }}</p>
        </div>
      </div>
    </div>

    <!-- Modal para añadir minerales -->
    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title class="text-h5">Añadir Mineral desde Base de Datos</v-card-title>
        <v-card-text>
          <!-- Chips de filtrado en el modal -->
          <v-chip-group
            v-model="selectedGroupModal"
            class="mb-4"
            column
          >
            <v-chip
              v-for="group in allGroupsModal"
              :key="group"
              @click="filterModalByGroup(group)"
              :active="selectedGroupModal === group"
              class="mr-2"
            >
              {{ group }}
            </v-chip>
          </v-chip-group>

          <!-- Campo de búsqueda en el modal -->
          <v-text-field
            v-model="search"
            label="Buscar mineral por nombre científico"
            class="mb-4"
          ></v-text-field>

          <!-- Lista de minerales en el modal -->
          <div v-for="(groupedMinerals, group) in groupedModal" :key="group">
            <h3>{{ group }}</h3>
            <div class="minerals-list">
              <div
                v-for="mineral in groupedMinerals"
                :key="mineral.Nombre_Científico"
                class="mineral-card"
                @click="addMineralToLibrary(mineral)"
              >
                <h4>{{ mineral.Nombre_Científico }}</h4>
                <p>{{ mineral.Fórmula_Química }}</p>
              </div>
            </div>
          </div>
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
import { ref, computed, onMounted } from "vue";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

export default {
  setup() {
    const library = ref([]); // Biblioteca del usuario
    const minerals = ref([]); // Todos los minerales descargados de la base de datos
    const filter = ref(""); // Filtro de la lista de la biblioteca del usuario
    const search = ref(""); // Filtro del modal de minerales
    const dialog = ref(false); // Estado del modal
    const selectedGroupLibrary = ref(null); // Grupo seleccionado en la biblioteca
    const selectedGroupModal = ref(null); // Grupo seleccionado en el modal

    // Obtener todos los grupos únicos en la biblioteca
    const allGroupsLibrary = computed(() => {
      const groups = library.value.map((mineral) => mineral.Grupo || "Desconocido");
      return [...new Set(groups)];
    });

    // Obtener todos los grupos únicos en el modal
    const allGroupsModal = computed(() => {
      const groups = minerals.value.map((mineral) => mineral.Grupo || "Desconocido");
      return [...new Set(groups)];
    });

    // Agrupar los minerales de la biblioteca por grupo
    const groupedLibrary = computed(() => {
      const filtered = library.value.filter(
        (mineral) =>
          (!selectedGroupLibrary.value || selectedGroupLibrary.value === mineral.Grupo) &&
          mineral.Nombre_Científico.toLowerCase().includes(filter.value.toLowerCase())
      );
      return filtered.reduce((groups, mineral) => {
        const group = mineral.Grupo || "Desconocido";
        if (!groups[group]) groups[group] = [];
        groups[group].push(mineral);
        return groups;
      }, {});
    });

    // Agrupar los minerales en el modal por grupo
    const groupedModal = computed(() => {
      const filtered = minerals.value.filter(
        (mineral) =>
          (!selectedGroupModal.value || selectedGroupModal.value === mineral.Grupo) &&
          mineral.Nombre_Científico.toLowerCase().includes(search.value.toLowerCase())
      );
      return filtered.reduce((groups, mineral) => {
        const group = mineral.Grupo || "Desconocido";
        if (!groups[group]) groups[group] = [];
        groups[group].push(mineral);
        return groups;
      }, {});
    });

    // Obtener los minerales del usuario desde Firebase
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
        console.error("Error al cargar la biblioteca del usuario:", error);
      }
    };

    // Obtener todos los minerales desde Firebase
    const fetchMinerals = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "minerales"));
        minerals.value = querySnapshot.docs.map((doc) => doc.data());
      } catch (error) {
        console.error("Error al cargar los minerales desde la base de datos:", error);
      }
    };

    // Agregar un mineral a la biblioteca del usuario
    const addMineralToLibrary = async (mineral) => {
      if (!auth.currentUser) {
        alert("No estás autenticado. Por favor, inicia sesión.");
        return;
      }

      const userCollection = `minerales_${auth.currentUser.uid}`;
      try {
        // Añadir el mineral a la base de datos del usuario
        await addDoc(collection(db, userCollection), mineral);

        // Añadir el mineral a la lista local de la biblioteca
        library.value.push(mineral);

        alert(`Mineral "${mineral.Nombre_Científico}" añadido con éxito.`);
      } catch (error) {
        console.error("Error al añadir el mineral:", error);
        alert("Hubo un error al añadir el mineral.");
      }
    };

    const filterLibraryByGroup = (group) => {
      selectedGroupLibrary.value = group === selectedGroupLibrary.value ? null : group;
    };

    const filterModalByGroup = (group) => {
      selectedGroupModal.value = group === selectedGroupModal.value ? null : group;
    };

    onMounted(() => {
      fetchLibrary();
      fetchMinerals();
    });

    return {
      library,
      minerals,
      filter,
      search,
      dialog,
      groupedLibrary,
      groupedModal,
      allGroupsLibrary,
      allGroupsModal,
      selectedGroupLibrary,
      selectedGroupModal,
      addMineralToLibrary,
      filterLibraryByGroup,
      filterModalByGroup,
    };
  },
};
</script>

<style>
.minerals-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.mineral-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  width: 250px;
  text-align: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.mineral-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}

.v-chip {
  cursor: pointer;
}
</style>
