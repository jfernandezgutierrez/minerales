<template>
  <v-container>
    <!-- Botón para abrir el modal -->
    <v-btn color="primary" class="mb-4" @click="dialog = true">Añadir Mineral</v-btn>
    
    <!-- Chips para filtrar por grupo en la biblioteca -->
    <div class="chips-group mb-4">
      <v-chip
        v-for="group in allGroupsLibrary"
        :key="group"
        class="mr-2"
        :color="activeGroupLibrary === group ? 'primary' : ''"
        @click="filterLibraryByGroup(group)"
      >
        {{ group }}
      </v-chip>
    </div>
    

    <!-- Campo de búsqueda en la biblioteca -->
    <v-text-field
      v-model="filter"
      label="Buscar minerales en tu biblioteca"
      class="mb-4"
    ></v-text-field>

    <!-- Lista de minerales agrupados -->
    <div v-for="(groupedMinerals, group) in groupedLibrary" :key="group" class="group-section">
      <h3>{{ group }}</h3>
      <div class="minerals-list">
        <v-card
          v-for="mineral in groupedMinerals"
          :key="mineral.Nombre_Científico"
          class="mineral-card"

          @click="selectMineral(mineral)"
        >
          <v-card-title>{{ mineral.Nombre_Científico }}</v-card-title>
          <v-card-subtitle>{{ mineral.Fórmula_Química }}</v-card-subtitle>
        </v-card>
      </div>
    </div>

    <!-- Modal para añadir minerales -->
    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title class="text-h5">
      Añadir Mineral
      <v-btn icon class="close-btn" @click="dialog = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
        <v-card-text>
          <!-- Chips de filtrado en el modal -->
          <div class="chips-group mb-4">
            <v-chip
              v-for="group in allGroupsModal"
              :key="group"
              class="mr-2"
              :color="activeGroupModal === group ? 'primary' : ''"
              @click="filterModalByGroup(group)"
            >
              {{ group }}
            </v-chip>
            </div>

          <!-- Campo de búsqueda en el modal -->
          <v-text-field
            v-model="search"
            label="Buscar mineral por nombre científico"
            class="mb-4"
          ></v-text-field>

          <!-- Lista de minerales agrupados en el modal -->
          <div v-for="(groupedMinerals, group) in groupedModal" :key="group" class="group-section">
            <h3>{{ group }}</h3>
            <div class="minerals-list">
              <v-card
                v-for="mineral in groupedMinerals"
                :key="mineral.Nombre_Científico"
                class="mineral-card"
                @click="addMineralToLibrary(mineral)"
              >
                <v-card-title>{{ mineral.Nombre_Científico }}</v-card-title>
                <v-card-subtitle>{{ mineral.Fórmula_Química }}</v-card-subtitle>
              </v-card>
            </div>
          </div>
        </v-card-text>
        
      </v-card>
    </v-dialog>
     <!-- Modal para mostrar detalles del mineral -->
     <v-dialog v-model="dialogDetails" max-width="600px">
      <v-card>
        <v-card-title>{{ selectedMineral?.Nombre_Científico }}</v-card-title>
        <v-card-text>
          <p><strong>Grupo:</strong> {{ selectedMineral?.Grupo }}</p>
          <p><strong>Familia:</strong> {{ selectedMineral?.Familia }}</p>
          <p><strong>Fórmula Química:</strong> {{ selectedMineral?.Fórmula_Química }}</p>
          <p><strong>Color:</strong> {{ selectedMineral?.Color }}</p>
          <p><strong>Dureza:</strong> {{ selectedMineral?.Dureza }}</p>
        </v-card-text>
        <div>
    <img :src="selectedMineral?.imagen" alt="Imagen Base64" />
  </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialogDetails = false">Cerrar</v-btn>
        </v-card-actions>
        <input
    ref="fileInput"
    type="file"
    accept="image/*"
    capture="camera"
    @change="handleFileChange"
  />
      </v-card>
  
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { query, where } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
export default {
  setup() {
    const library = ref([]); // Biblioteca del usuario
    const minerals = ref([]); // Todos los minerales descargados de la base de datos
    const filter = ref(""); // Filtro de la lista de la biblioteca del usuario
    const search = ref(""); // Filtro del modal de minerales
    const dialog = ref(false); // Estado del modal para añadir minerales
    let activeGroupLibrary = ref("Todos"); // Grupo activo en la biblioteca
    const activeGroupModal = ref("Todos"); // Grupo activo en el modal
    const dialogDetails = ref(false); // Estado del modal de detalles del mineral
    const selectedMineral = ref(null);
    const fileInput = ref(null);
    // Obtener todos los grupos únicos en la biblioteca
    const allGroupsLibrary = computed(() => {
      const groups = library.value.map((mineral) => mineral.Grupo || "Desconocido");
      return ["Todos", ...new Set(groups)];
    });

    // Obtener todos los grupos únicos en el modal
    const allGroupsModal = computed(() => {
      const groups = minerals.value.map((mineral) => mineral.Grupo || "Desconocido");
      return ["Todos", ...new Set(groups)];
    });

    // Agrupar los minerales en la biblioteca
    const groupedLibrary = computed(() => {
      const grouped = library.value.reduce((groups, mineral) => {
        if (!groups[mineral.Grupo]) groups[mineral.Grupo] = [];
        groups[mineral.Grupo].push(mineral);
        return groups;
      }, {});
console.log("hola");

      // Filtrar minerales según el grupo activo y el término de búsqueda
      const result = {};
      Object.keys(grouped).forEach((group) => {
        if (activeGroupLibrary.value === "Todos" || activeGroupLibrary.value === group) {
          const filtered = grouped[group].filter((mineral) =>
            mineral.Nombre_Científico.toLowerCase().includes(filter.value.toLowerCase())
          );
          if (filtered.length > 0) {
            result[group] = filtered;
          }
        }
      });

      return result;
    });
// Método para abrir la cámara o galería
const openCamera = (mineral) => {
  selectedMineral.value = mineral; // Asocia la imagen al mineral seleccionado
  fileInput.value.click(); // Abre el selector de archivo o cámara
};
// Método para manejar el archivo seleccionado
const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Convierte la imagen a Base64
  const base64 = await convertImageToBase64(file);

  // Guarda la imagen asociada al mineral en Firestore
  await saveImageToMineral(selectedMineral.value.Nombre_Científico, base64);

  alert(`Imagen añadida al mineral: ${selectedMineral.value.Nombre_Científico}`);
};
// Convierte la imagen a Base64
const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};
const saveImageToMineral = async (nombreCientifico, base64) => {
  const mineralsRef = collection(db, `minerales_${auth.currentUser.uid}`);
  const q = query(mineralsRef, where("Nombre_Científico", "==", nombreCientifico));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docRef = querySnapshot.docs[0].ref;
    await updateDoc(docRef, { imagen: base64 }); // Agregar o actualizar el campo `imagen`
  } else {
    console.error("Mineral no encontrado en la colección.");
  }
};
    // Agrupar los minerales en el modal
    const groupedModal = computed(() => {
      const grouped = minerals.value.reduce((groups, mineral) => {
        if (!groups[mineral.Grupo]) groups[mineral.Grupo] = [];
        groups[mineral.Grupo].push(mineral);
        return groups;
      }, {});

      // Filtrar minerales según el grupo activo y el término de búsqueda
      const result = {};
      Object.keys(grouped).forEach((group) => {
        if (activeGroupModal.value === "Todos" || activeGroupModal.value === group) {
          const filtered = grouped[group].filter((mineral) =>
            mineral.Nombre_Científico.toLowerCase().includes(search.value.toLowerCase())
          );
          if (filtered.length > 0) {
            result[group] = filtered;
          }
        }
      });

      return result;
    });

    // Cargar datos desde Firebase
    const fetchLibrary = async () => {
      if (!auth.currentUser) return;
      const userCollection = `minerales_${auth.currentUser.uid}`;
      const querySnapshot = await getDocs(collection(db, userCollection));
      library.value = querySnapshot.docs.map((doc) => doc.data());
    };
    const selectMineral = (mineral) => {
      selectedMineral.value = mineral;
      dialogDetails.value = true;
    };
    const fetchMinerals = async () => {
      const querySnapshot = await getDocs(collection(db, "minerales"));
      minerals.value = querySnapshot.docs.map((doc) => doc.data());
    };

    // Agregar mineral a la biblioteca
    const addMineralToLibrary = async (mineral) => {
      if (!auth.currentUser) return;
      const userCollection = `minerales_${auth.currentUser.uid}`;
      await addDoc(collection(db, userCollection), mineral);
      library.value.push(mineral);
    };

    const filterLibraryByGroup = (group) => {
      console.log("les");
      activeGroupLibrary.value = group;
    };

    const filterModalByGroup = (group) => {
      
      
      activeGroupModal.value = group;
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
      activeGroupLibrary,
      activeGroupModal,
      selectedMineral,
      selectMineral,
      openCamera,
      handleFileChange,
      dialogDetails,
      addMineralToLibrary,
      filterLibraryByGroup,
      filterModalByGroup,
    };
  },
};
</script>

<style>
.camera-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #000; /* Cambia el color si es necesario */
}
.d-none {
  display: none;
}
.chips-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.group-section {
  margin-bottom: 40px;
}

.minerals-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.mineral-card {
  width: 200px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.mineral-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
}
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #000; /* Cambia el color si es necesario */
}
</style>
