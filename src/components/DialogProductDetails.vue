<!-- eslint-disable -->
<template>
  <!-- Dialog(modal) -->
  <!-- Lógica para abrir e fechar o "dialog(modal)" -->
  <q-dialog
    :full-width="$q.platform.is.mobile"
    :model-value="show"
    @before-hide="handleClose"
  >
    <q-card>
      <!-- Nesta "q-card-section", somente o titulo -->
      <q-card-section>
        <div class="text-h6">Detalhes</div>
      </q-card-section>
      <!-- Nesta "q-card-section", a imagem -->
      <q-card-section v-if="product.img_url">
        <q-img :src="product.img_url" :ratio="4 / 3" style="min-width: 300px" />
      </q-card-section>
      <!-- Nesta "q-card-section", as informações do produto -->
      <q-card-section>
        <div class="text-h6">
          {{ product.name }}
        </div>
        <div class="text-subtitle2">
          {{ formatCurrency(product.price) }}
        </div>
        <div class="text-body2" v-html="product.description" />
      </q-card-section>
      <!-- Botões de ação -->
      <q-card-actions align="right">
        <!-- Diretiva "v-close-popup:" Para fechar o "Dialog(modal)"  -->
        <q-btn label="Cancel" color="primary" outline v-close-popup />
        <q-btn
          v-if="brand.phone"
          label="Fazer pedido"
          icon="mdi-whatsapp"
          color="green-7"
          @click="handleSendWhatsApp"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from "vue";
import { formatCurrency } from "src/utils/format";
import { openURL } from "quasar";
/* Não precisa das chaves. Foi exportado como "export default" lá no composable UseApi.js */
import useApi from "src/composables/UseApi";

export default defineComponent({
  name: "DialogProductDetails",

  props: {
    show: {
      type: Boolean,
      required: true,
    },
    product: {
      type: Object,
    },
  },

  setup(props, { emit }) {
    /* const phone = "43988518640"; */
    const msg = "Olá, fiquei interessado no produto: ";
    const { brand } = useApi;

    const handleClose = () => {
      emit("hideDialog");
    };

    const handleSendWhatsApp = () => {
      const link = encodeURI(
        `https://api.whatsapp.com/send?phone=55${
          brand.value.phone
        }&text=${msg} - ${props.product.name} - ${formatCurrency(
          props.product.price
        )}`
      );
      openURL(link);
    };

    return {
      formatCurrency,
      handleClose,
      handleSendWhatsApp,
      brand,
    };
  },
});
</script>
