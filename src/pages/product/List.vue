<!-- eslint-disable -->
<template>
  <q-page padding>
    <div class="row">
      <q-table
        title="Products"
        :rows="products"
        :columns="columnsProduct"
        row-key="id"
        class="col-12"
        :loading="loading"
      >
        <template v-slot:top>
          <span class="text-h6"> Product </span>
          <q-space />

          <!-- Assim -->
          <q-btn
            class="desktop-only"
            label="Add New"
            color="primary"
            icon="mdi-plus"
            dense
            :to="{ name: 'form-product' }"
          />
          <!-- ou -->

          <!-- <q-btn
            v-if="$q.platform.is.desktop"
            label="Add New"
            color="primary"
            icon="mdi-plus"
            dense
            :to="{ name: 'form-product' }"
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
              @click="handleRemoveProduct(props.row)"
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
        :to="{ name: 'form-product' }"
      />
      <!-- ou -->

      <!-- <q-btn
        v-if="$q.platform.is.mobile"
        fab
        icon="mdi-plus"
        color="primary"
        :to="{ name: 'form-product' }"
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
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { columnsProduct } from "./table";

/* vue3 */
export default defineComponent({
  name: "PageproductList",

  setup() {
    const products = ref([]);

    /* Com esta variável "api", temos acesso a todos os métodos
       dentro do composable de acesso a api (para o supabase)
       (UseApi.js)  */
    //const api = useApi();
    /* Mas assim importamos o método "list", diretamente de
       dentro do composable */
    const { list, remove } = useApi();

    const loading = ref(true);

    const router = useRouter();

    const $q = useQuasar();

    const table = "product";

    const { notifyError, notifySuccess } = useNotify();

    const handleListProducts = async () => {
      try {
        /* Tabela do supabase "product" */
        loading.value = true;
        products.value = await list(table);
        loading.value = false;
      } catch (error) {
        notifyError(error.message);
      }
    };

    const handleEdit = (product) => {
      router.push({ name: "form-product", params: { id: product.id } });
    };

    const handleRemoveProduct = async (product) => {
      try {
        $q.dialog({
          title: "Confirm",
          message: `Do you really delete ${product.name} ?`,
          cancel: true,
          persistent: true,
        }).onOk(async () => {
          await remove(table, product.id);
          notifySuccess("successfully deleted");
          handleListProducts();
        });
      } catch (error) {
        notifyError(error.message);
      }
    };

    onMounted(() => {
      handleListProducts();
    });

    /* return: Para serem usados aqui neste componente mesmo */
    return {
      columnsProduct,
      products,
      loading,
      handleEdit,
      handleRemoveProduct,
    };
  },
});
</script>
