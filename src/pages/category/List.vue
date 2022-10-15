<!-- eslint-disable -->
<template>
  <q-page padding>
    <div class="row">
      <q-table
        title="Category"
        :rows="categories"
        :columns="columns"
        row-key="id"
        class="col-12"
        :loading="loading"
      >
        <template v-slot:top>
          <span class="text-h6"> Category </span>
          <q-space />
          <q-btn label="Add New" color="primary" />
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <!-- "dense": tira os espaços laterais, diminui -->
            <q-btn icon="mdi-pencil-outline" color="info" dense size="sm">
              <q-tooltip> Editar </q-tooltip>
            </q-btn>
            <q-btn icon="mdi-delete-outline" color="negative" dense size="sm">
              <q-tooltip> Deletar </q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
const columns = [
  {
    name: "name",
    align: "left",
    label: "Name",
    field: "name",
    sortable: true,
  },
  {
    name: "actions",
    align: "right",
    label: "Actions",
    field: "actions",
    sortable: true,
  },
];

/* vue3 */
/* Na "compositionApi" do vue3, temos que importar
   este "onMounted" */
import { defineComponent, ref, onMounted } from "vue";
import useApi from "src/composables/UseApi";
import useNotify from "src/composables/UseNotify";

/* vue3 */
export default defineComponent({
  name: "PageCategoryList",

  setup() {
    const categories = ref([]);

    /* Com esta variável "api", temos acesso a todos os métodos
       dentro do composable de acesso a api (para o supabase)
       (UseApi.js)  */
    //const api = useApi();
    /* Mas assim importamos o método "list", diretamente de
       dentro do composable */
    const { list } = useApi();

    const loading = ref(true);

    const { notifyError } = useNotify();

    const handleListCategories = async () => {
      try {
        /* Tabela do supabase "category" */
        loading.value = true;
        categories.value = await list("category");
        loading.value = false
      } catch (error) {
        notifyError(error.message);
      }
    };

    onMounted(() => {
      handleListCategories();
    });

    /* return: Exportando para serem usados aqui
               neste componente mesmo */
    return {
      columns,
      categories,
      loading,
    };
  },
});
</script>
