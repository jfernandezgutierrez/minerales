<template>
  <v-container>
    <!-- Campo de búsqueda -->
    <v-text-field
      v-model="filter"
      label="Buscar minerales"
      class="mb-4"
    ></v-text-field>

    <!-- Chips para filtrar por grupo -->
    <div class="chips-group mb-4">
      <v-chip
        v-for="group in groupChips"
        :key="group"
        class="ma-1"
        outlined
        :color="activeGroup === group ? 'primary' : ''"
        @click="filterByGroup(group)"
      >
        {{ group }}
      </v-chip>
    </div>

    <!-- Agrupamos los minerales por grupo -->
    <div v-for="(mineralsInGroup, group) in filteredGroupedMinerals" :key="group" class="group-section">
      <h3>{{ group }}</h3>
      <div class="mineral-group">
        <v-card
          v-for="mineral in mineralsInGroup"
          :key="mineral.Nombre_Científico"
          class="mineral-card"
          @click="showMineralDetails(mineral)"
        >
          <v-card-title>{{ mineral.Nombre_Científico }}</v-card-title>
          <v-card-subtitle>{{ mineral.Familia }}</v-card-subtitle>
        </v-card>
      </div>
    </div>

    <!-- Modal para mostrar los detalles del mineral -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>{{ selectedMineral?.Nombre_Científico }}</v-card-title>
        <v-card-text>
          <p><strong>Grupo:</strong> {{ selectedMineral?.Grupo }}</p>
          <p><strong>Familia:</strong> {{ selectedMineral?.Familia }}</p>
          <p><strong>Fórmula Química:</strong> {{ selectedMineral?.Fórmula_Química }}</p>
          <p><strong>Color:</strong> {{ selectedMineral?.Color }}</p>
          <p><strong>Dureza:</strong> {{ selectedMineral?.Dureza }}</p>
          <p><strong>Peso Específico:</strong> {{ selectedMineral?.Peso_Específico }}</p>
          <p><strong>Forma:</strong> {{ selectedMineral?.Forma }}</p>
          <p><strong>Raya:</strong> {{ selectedMineral?.Raya }}</p>
          <p><strong>Brillo:</strong> {{ selectedMineral?.Brillo }}</p>
          <p><strong>Comentarios:</strong> {{ selectedMineral?.Comentarios }}</p>
          <p><strong>Identificación:</strong> {{ selectedMineral?.Identificación }}</p>
          <p><strong>Limitaciones:</strong> {{ selectedMineral?.Limitaciones }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default {
  setup() {
    const minerals = ref([]); // Todos los minerales
    const filter = ref(""); // Filtro de búsqueda
    const dialog = ref(false); // Estado del modal
    const selectedMineral = ref(null); // Mineral seleccionado
    const activeGroup = ref("Todos"); // Grupo seleccionado en los chips

    // Obtener los grupos únicos para los chips
    const groupChips = computed(() => {
      const groups = new Set(minerals.value.map((mineral) => mineral.Grupo));
      return ["Todos", ...Array.from(groups)];
    });

    // Agrupar los minerales por grupo, considerando el grupo activo y el filtro
    const filteredGroupedMinerals = computed(() => {
      const grouped = minerals.value.reduce((groups, mineral) => {
        if (!groups[mineral.Grupo]) groups[mineral.Grupo] = [];
        groups[mineral.Grupo].push(mineral);
        return groups;
      }, {});

      // Filtrar los minerales según el grupo activo y el término de búsqueda
      const result = {};
      Object.keys(grouped).forEach((group) => {
        if (activeGroup.value === "Todos" || activeGroup.value === group) {
          const filtered = grouped[group].filter((mineral) =>
            mineral.Nombre_Científico?.toLowerCase().includes(filter.value.toLowerCase())
          );
          if (filtered.length > 0) {
            result[group] = filtered;
          }
        }
      });

      return result;
    });

    // Cambiar el grupo activo
    const filterByGroup = (group) => {
      activeGroup.value = group;
    };

    // Mostrar los detalles del mineral en el modal
    const showMineralDetails = (mineral) => {
      selectedMineral.value = mineral;
      dialog.value = true;
    };

    // Cargar los datos desde Firebase
    onMounted(async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "minerales"));
        minerals.value = querySnapshot.docs.map((doc) => doc.data());
      } catch (error) {
        console.error("Error al obtener los datos de Firebase:", error);
      }
    });

    return {
      minerals,
      filter,
      groupChips,
      filteredGroupedMinerals,
      dialog,
      selectedMineral,
      showMineralDetails,
      filterByGroup,
      activeGroup,
    };
  },
};
</script>

<style>
.chips-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.group-section {
  margin-bottom: 40px;
}

.mineral-group {
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

h3 {
  font-size: 1.5rem;
  color: #3f51b5;
  margin-bottom: 16px;
}
</style>
