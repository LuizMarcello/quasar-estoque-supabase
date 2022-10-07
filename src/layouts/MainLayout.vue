<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Quasar App </q-toolbar-title>

        <!-- <div>Quasar v{{ $q.version }}</div> -->
        <q-btn-dropdown flat color="white" icon="person">
          <q-list>
            <q-item clickable v-close-popup @click="handleLogout">
              <q-item-section>
                <q-item-label>Sair</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
/* Lá no composable, esta função "useAuthUser" é a default função,
   e foi "exportada" no "export default". Então acho que é por isso
   que aqui, neste "import, não está entre chaves. */
import useAuthUser from "src/composables/UseAuthUser";
import EssentialLink from "components/EssentialLink.vue";
import { useRouter } from "vue-router";
/* Para também poder usar o plugin do quasar "Dialog" */
import { useQuasar } from "quasar";

const linksList = [
  {
    title: "Docs",
    caption: "quasar.dev",
    icon: "school",
    link: "https://quasar.dev",
  },
  {
    title: "Github",
    caption: "github.com/quasarframework",
    icon: "code",
    link: "https://github.com/quasarframework",
  },
  {
    title: "Discord Chat Channel",
    caption: "chat.quasar.dev",
    icon: "chat",
    link: "https://chat.quasar.dev",
  },
  {
    title: "Forum",
    caption: "forum.quasar.dev",
    icon: "record_voice_over",
    link: "https://forum.quasar.dev",
  },
  {
    title: "Twitter",
    caption: "@quasarframework",
    icon: "rss_feed",
    link: "https://twitter.quasar.dev",
  },
  {
    title: "Facebook",
    caption: "@QuasarFramework",
    icon: "public",
    link: "https://facebook.quasar.dev",
  },
  {
    title: "Quasar Awesome",
    caption: "Community Quasar projects",
    icon: "favorite",
    link: "https://awesome.quasar.dev",
  },
];
export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    /* Para também poder usar o plugin do quasar "Dialog" */
    const $q = useQuasar();
    const router = useRouter();
    /* Pegando do nosso composable "UseAuthUser.js" */
    const { logout } = useAuthUser();

    /* Para efetuar o logoff */
    const handleLogout = async () => {
      $q.dialog({
        title: "Logout",
        message: "Certeza que você quer sair ?",
        cancel: true,
        /* Clicando fora do diálogo, a janela não some.
           tem que clicar em "Cancelar" ou  "OK" */
        persistent: true,
      }).onOk(async () => {
        await logout();
        /* O push permite apertar o botão de voltar, porque as telas
           foram adicionadas nas pilhas */
        // router.push({ name: "Login" });
        /* O replace não permite voltar, zera a pilha(rota) */
        router.replace({ name: "Login" });
      });
    };
    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      handleLogout,
    };
  },
});
</script>
