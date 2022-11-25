<!-- eslint-disable -->
<template>
  <!-- Muito bom colocar este "padding", desgruda
       das laterais, de cima, e de baixo  -->
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p class="text-h6">Form Config</p>
      </div>

      <q-form
        class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md"
        @submit.prevent="handleSubmit"
      >
        <q-input
          label="Store Name"
          v-model="form.name"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Informe seu nome completo',
          ]"
        />
        <!-- unmasked-value: O valor vai para o banco de dados sem a máscara -->
        <q-input
          label="Phone"
          v-model="form.phone"
          mask="(##) # ####-####"
          unmasked-value
        />
        <!-- {{ form.phone }} -->

        <q-input
          label="Image Paralax"
          stack-label
          v-model="paralax"
          type="file"
          accept="image/*"
        />

        <div class="row justify-center q-gutter-md q-pa-md">
          <q-color
            v-model="form.primary"
            class="col-md-4 col-sm-12 col-xs-12"
          />

          <q-color
            v-model="form.secondary"
            class="col-md-4 col-sm-12 col-xs-12"
          />
        </div>

        <q-btn
          label="Save"
          color="primary"
          class="full-width"
          rounded
          type="submit"
        />

        <q-btn
          label="Cancel"
          color="primary"
          class="full-width"
          rounded
          flat
          :to="{ name: 'category' }"
        />
      </q-form>
    </div>
  </q-page>
</template>

<script>
/* Vuejs 3: */
/* "defineComponent": para fazer o "export default" */
/* "ref": Para fazer o formulário reativo */
/* "onMounted": Gancho, ciclo de vida */
/* "computed": Propriedades computadas */
import { defineComponent, ref, onMounted } from "vue";
/* useRouter: Fazer roteamento */
/* useRoute: Verificar a rota atual */
import { useRouter } from "vue-router";
/* Importando o composable de acesso a API(UseApi.js) */
/* Sem as chaves, porque ainda não está pegando nada lá de dentro */
import useApi from "src/composables/UseApi";
/* Importando o composable de notify(useNotify.js) */
/* Sem as chaves, porque ainda não está pegando nada lá de dentro */
import useNotify from "src/composables/UseNotify";

import useBrand from "src/composables/UseBrand";
import useAuthUser from "src/composables/UseAuthUser";

/* "export default": Para exportar também para outros componentes  */
export default defineComponent({
  name: "PageFormConfig",

  setup() {
    const table = "config";
    const router = useRouter();
    const { post, listPublic, update, uploadImg } = useApi();
    const { notifyError, notifySuccess } = useNotify();
    const { setBrand } = useBrand();
    const { user } = useAuthUser();

    let config = {};

    const paralax = ref([]);

    const form = ref({
      name: "",
      phone: "",
      primary: "",
      secondary: "",
      paralax_url: "",
    });

    onMounted(() => {
      handleGetConfig();
    });

    const handleSubmit = async () => {
      try {
        if (paralax.value.length > 0) {
          /* "products": Storage(file) de imagens no supabase */
          const paralaxUrl = await uploadImg(paralax.value[0], "paralax");
          form.value.paralax_url = paralaxUrl;
        }
        /* Verificando se existe o id no formulário, se é update */
        if (form.value.id) {
          await update(table, form.value);
          notifySuccess("Update Successfully");
        } else {
          /* Sem o id na rota, então só faz o submit normalmente */
          await post(table, form.value);
          notifySuccess("Saved Successfully");
        }
        setBrand(form.value.primary, form.value.secondary);
        router.push({ name: "me" });
      } catch (error) {
        notifyError(error.message);
      }
    };

    const handleGetConfig = async () => {
      try {
        config = await listPublic(table, user.value.id);
        form.value = config[0];
      } catch (error) {
        notifyError(error.message);
      }
    };

    /* "return": Para exportar para este componente mesmo */
    return {
      handleSubmit,
      form,
      paralax,
    };
  },
});
</script>
