import useSupabase from "src/boot/supabase";
import useAuthUser from "./UseAuthUser";
import {
  v4 as uuidv4
} from "uuid";
import {
  useRoute
} from "vue-router";
/* Sem chaves. Foi "exportada" no "export default" do composable "UseBrand" */
import useBrand from "src/composables/UseBrand";
import {
  ref
} from "vue";
import {
  useQuasar
} from "quasar";

const brand = ref({
  primary: "",
  secondary: "",
  name: "",
  phone: "",
  paralax_url: ""
});

export default function useApi() {
  const {
    supabase
  } = useSupabase();
  const {
    user
  } = useAuthUser();
  const route = useRoute();
  const {
    setBrand
  } = useBrand();
  const $q = useQuasar();

  const list = async (table) => {
    const {
      data,
      error
    } = await supabase.from(table).select("*");
    if (error) throw error;
    return data;
  };

  /* Para listar somente os produtos "dddaqueleee" usuário */
  /* userId: o usuário logado, do qual serão os registros */
  /* columnFilter: A coluna a ser filtrada(Para pesquisar por categoria) */
  /* filter: O valor(Para pesquisar por categoria) */
  const listPublic = async (table, userId, columnFilter = "", filter = "") => {
    const {
      data,
      error
    } = await supabase
      .from(table)
      .select("*")
      .eq("user_id", userId)
      .eq(columnFilter, filter);
    if (error) throw error;
    return data;
  };

  const getById = async (table, id) => {
    const {
      data,
      error
    } = await supabase.from(table).select("*").eq("id", id);
    if (error) throw error;
    return data[0];
  };

  const post = async (table, form) => {
    const {
      data,
      error
    } = await supabase.from(table).insert([{
      ...form,
      /* Passando o valor do id do usuário logado no momento,
         para o "user_id" da tabela, no supabase, porque este
         será o usuário que efetuou o registro */
      user_id: user.value.id,
    }, ]);
    if (error) throw error;
    return data;
  };

  const update = async (table, form) => {
    const {
      data,
      error
    } = await supabase
      .from(table)
      .update({
        ...form,
      })
      .match({
        id: form.id,
      });
    if (error) throw error;
    return data;
  };

  const remove = async (table, id) => {
    const {
      data,
      error
    } = await supabase.from(table).delete().match({
      id,
    });
    if (error) throw error;
    return data;
  };

  const uploadImg = async (file, storage) => {
    const fileName = uuidv4();
    const {
      error
    } = supabase.storage.from(storage).upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });
    const publicUrl = await getUrlPublic(fileName, storage);
    if (error) throw error;
    return publicUrl;
  };

  const getUrlPublic = async (fileName, storage) => {
    const {
      publicURL,
      error
    } = supabase.storage
      .from(storage)
      .getPublicUrl(fileName);
    if (error) throw error;
    return publicURL;
  };

  const getBrand = async () => {
    /* Verificando em duas urls diferentes, o "id" do usuário */
    /* Se o usuário está logado, ele possui o id */
    /* "?": Optional-chain do javascript, que verifica se "user" e "value" existem */
    const id = route.params.id || user ?.value ?.id;
    if (id) {
      $q.loading.show({
        backgroundColor: "dark",
      });
      const {
        data,
        error
      } = await supabase
        .from("config")
        .select("*")
        .eq("user_id", id);
      if (error) throw error;
      if (data.length > 0) {
        brand.value = data[0];
        setBrand(brand.value.primary, brand.value.secondary);
      }
      $q.loading.hide();
      return brand;
    }
  };

  return {
    list,
    /* Para listar somente os produtos dddaqueleee usuário */
    listPublic,
    getById,
    post,
    update,
    remove,
    uploadImg,
    getBrand,
    brand,
  };
}
