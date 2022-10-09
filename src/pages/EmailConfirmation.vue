<template>
  <q-page padding>
    <p class="text-body1">Obrigado(a) por se registrar!</p>
    <p class="text-body1">
      Por favor, confirme seu e-mail para finalizar o registro:
      <strong>{{ $route.query.email }}</strong>
    </p>
    <div class="row justify-center">
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-btn label="Voltar para a tela de login" color="dark" class="full-width" rounded size="sm"
          :to="{ name: 'login' }" />
      </div>
    </div>

  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "PageEmailConfirmation",
});
</script>
