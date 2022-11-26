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

          <q-btn
            label="My Store"
            dense
            size="sm"
            outline
            class="q-ml-sm"
            icon="mdi-store"
            color="primary"
            @click="handleGoToStore"
          />

          <q-btn
            label="Copy Link"
            dense
            size="sm"
            outline
            class="q-ml-sm"
            icon="mdi-content-copy"
            color="primary"
            @click="handleCopyPublicUrl"
          />

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

        <template v-slot:body-cell-img_url="props">
          <q-td :props="props">
            <q-avatar v-if="props.row.img_url">
              <!-- Toda informação que vem da tabela, da coluna
                   "row.img_url", será modificada, e ao invés do conteúdo
                   original da coluna, que era a url da imagem informada, agora
                   na listagem, será exibido a própria imagem -->
              <img :src="props.row.img_url" />
            </q-avatar>
            <q-avatar
              v-else
              color="grey"
              text-color="white"
              icon="mdi-image-off"
            />
          </q-td>
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
import useAuthUser from "src/composables/UseAuthUser";
import useNotify from "src/composables/UseNotify";
import { useRouter } from "vue-router";
/* openURL: Facilitador do Quasar que abre uma url externa */
/* copyToClipboard: Facilitador do Quasar que copia o link para o clipboard*/
import { useQuasar, openURL, copyToClipboard } from "quasar";
import { columnsProduct } from "./table";

/* vue3 */
export default defineComponent({
  name: "PageProductList",

  setup() {
    const products = ref([]);

    /* Com esta variável "api", temos acesso a todos os métodos
       dentro do composable de acesso a api (para o supabase)
       (UseApi.js)  */
    //const api = useApi();
    /* Mas assim, importamos os métodos "listPublic" e "remove" diretamente de
       dentro do composable */

    /* Para listar somente os produtos dddaqueleee usuário */
    const { listPublic, remove } = useApi();

    /* Para listar todos os produtos */
    /*  const { list, remove } = useApi(); */

    const { user } = useAuthUser();

    const loading = ref(true);

    const router = useRouter();

    const $q = useQuasar();

    const table = "product";

    const { notifyError, notifySuccess } = useNotify();

    const handleListProducts = async () => {
      try {
        /* Tabela do supabase "product" */
        loading.value = true;
        /* Para listar todos os produtos */
        /* products.value = await list(table); */
        /* Para listar somente os produtos dddaqueleee usuário */
        products.value = await listPublic(table, user.value.id);
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

    const handleGoToStore = () => {
      /* "user.value.id:" è o id do usuário atual */
      const idUser = user.value.id;
      const linkkk = router.resolve({
        name: "product-public",
        params: { id: idUser },
      });
      /* Enviando o "id" junto para esta rota */
      /* router.push({ name: "product-public", params: { id: idUser } }); */
      /* "origin": url original(no caso "localhost:8080") */
      openURL(window.origin + linkkk.href);
     /*  openURL(app.netlify.com/sites/quasar-supabase-lm + linkkk.href); */
    };

    const handleCopyPublicUrl = async () => {
      /* "user.value.id:" è o id do usuário atual */
      const idUser = user.value.id;
      const linkkk = router.resolve({
        name: "product-public",
        params: { id: idUser },
      });
      const externalLink = window.origin + linkkk.href;
      copyToClipboard(externalLink)
        .then(() => {
          notifySuccess("Sucessfully copied");
        })
        .catch(() => {
          notifyError("Error copied link");
        });
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
      handleGoToStore,
      handleCopyPublicUrl,
    };
  },
});
</script>
