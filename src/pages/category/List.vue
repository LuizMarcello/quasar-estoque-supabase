<!-- eslint-disable -->
<template>
  <q-page padding>
    <div class="row">
      <q-table
        title="Category"
        :rows="categories"
        :columns="columnsCategory"
        row-key="id"
        class="col-12"
        :loading="loading"
      >
        <template v-slot:top>
          <span class="text-h6"> Category </span>
          <q-space />

          <!-- Assim -->
          <q-btn
            class="desktop-only"
            label="Add New"
            color="primary"
            icon="mdi-plus"
            dense
            :to="{ name: 'form-category' }"
          />
          <!-- ou -->

          <!-- <q-btn
            v-if="$q.platform.is.desktop"
            label="Add New"
            color="primary"
            icon="mdi-plus"
            dense
            :to="{ name: 'form-category' }"
          /> -->
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <!-- "dense": tira os espaços laterais, diminui -->
            <q-btn
              icon="mdi-pencil-outline"
              color="info"
              dense
              size="sm"
              @click="handleEdit(props.row)"
            >
              <q-tooltip> Editar </q-tooltip>
            </q-btn>

            <q-btn
              icon="mdi-delete-outline"
              color="negative"
              dense
              size="sm"
              @click="handleRemoveCategory(props.row)"
            >
              <q-tooltip> Deletar </q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
    <!-- "offset": espaçamentos -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <!-- Assim -->
      <q-btn
        class="mobile-only"
        fab
        icon="mdi-plus"
        color="primary"
        :to="{ name: 'form-category' }"
      />
      <!-- ou -->

      <!-- <q-btn
        v-if="$q.platform.is.mobile"
        fab
        icon="mdi-plus"
        color="primary"
        :to="{ name: 'form-category' }"
      /> -->
    </q-page-sticky>
  </q-page>
</template>

<script>
/* vue3 */
/* Na "compositionApi" do vue3, temos que importar
   este "onMounted" */
import { defineComponent, ref, onMounted } from "vue";
import useApi from "src/composables/UseApi";
import useNotify from "src/composables/UseNotify";
import useAuthUser from "src/composables/UseAuthUser";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { columnsCategory } from "./table";

/* vue3 */
export default defineComponent({
  name: "PageCategoryList",

  setup() {
    const categories = ref([]);
    const loading = ref(true);
    const router = useRouter();
    const $q = useQuasar();
    const { user } = useAuthUser();
    const table = "category";
    /* Com esta variável "api", temos acesso a todos os métodos
       dentro do composable de acesso a api (para o supabase)
       (UseApi.js)  */
    //const api = useApi();
    /* Mas assim importamos o método "list", diretamente de
       dentro do composable */
    const { listPublic, remove } = useApi();
    const { notifyError, notifySuccess } = useNotify();

    const handleListCategories = async () => {
      try {
        /* Tabela do supabase "category" */
        loading.value = true;
        categories.value = await listPublic(table, user.value.id);
        loading.value = false;
      } catch (error) {
        notifyError(error.message);
      }
    };

    const handleEdit = (category) => {
      router.push({ name: "form-category", params: { id: category.id } });
    };

    const handleRemoveCategory = async (category) => {
      try {
        $q.dialog({
          title: "Confirm",
          message: `Do you really delete ${category.name} ?`,
          cancel: true,
          persistent: true,
        }).onOk(async () => {
          await remove(table, category.id);
          notifySuccess("successfully deleted");
          handleListCategories();
        });
      } catch (error) {
        notifyError(error.message);
      }
    };

    onMounted(() => {
      handleListCategories();
    });

    /* return: Para serem usados aqui neste componente mesmo */
    return {
      columnsCategory,
      categories,
      loading,
      handleEdit,
      handleRemoveCategory,
    };
  },
});
</script>
