<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handlePasswordReset">
      <p class="col-12 text-h5 text-center">Resetar a senha</p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">

        <q-input label="Nova senha" v-model="password" lazy-rules :rules="[
        val => (val && val.length >= 6) || 'Informe a nova senha (mínimo 6 digitos)']" />

        <div class="full-width q-pt-md q-gutter-y-sm">
          <q-btn label="Confirmar nova senha" color="primary" class="full-width" outline rounded size="md"
            type="submit"></q-btn>

        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import useNotify from "src/composables/UseNotify";
import useAuthUser from 'src/composables/UseAuthUser';
import { useRouter, useRoute } from 'vue-router';
/* Diferença: */
/* useRouter: Ex: router push, router replace. Jogar para outra rota */
/* useRoute: Rota atual que está localizado */

export default defineComponent({
  name: 'PageResetPassword',

  setup() {
    const { resetPassword } = useAuthUser();
    const { notifyError, notifySuccess } = useNotify()
    /* Para fazer o redirecionamento */
    const router = useRouter();
    /* Pegando a rota atual para extrair o token dela */
    const route = useRoute();

    const token = route.query.token;

    const password = ref('');

    const handlePasswordReset = async () => {
      try {
        await resetPassword(token, password.value)
        notifySuccess('Nova senha enviada com sucesso')
        router.push({ name: 'login' })
      } catch (error) {
        notifyError(error.message)
      }
    }

    return {
      password,
      handlePasswordReset
    };
  },
});
</script>
