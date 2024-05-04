import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { AnwserUpdate, FormCreation, HeaderAPI, HeaderCreation, User, UserCreation } from "../gec-tripetto";
import { sfAnd, sfEqual, sfLike } from "spring-filter-query-builder";

// Création de l'instance Axios pour les requêtes vers l'API
const instance = axios.create({
  baseURL: process.env.API_URL,
  timeout: 5000,
});

/**
 * Lancement d'une requête vers l'API
 *    le payload est un objet json contenant:
 *      - la méthode "GET", "POST", "PATCH", "DELETE"
 *      - l'url correspondant à la route
 *      - un objet "data" pour les métodes "POST" et "PATCH"
 * @param {Object} payload
 * @returns Promise retournant la réponse ou un Object JSON avec l'erreur
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const apiRequest = async (payload: AxiosRequestConfig): Promise<any> => {
  try {
    const response = await instance.request(payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response!;
    } else {
      throw new Error("Erreur serveur");
    }
  }
};

/**
 * Mise à jour du Header de l'instance pour les futures requêtes
 * avec le token fourni par l'API
 * @param {String} token
 */
const setAuthorisation = (token: string) => {
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

/**
 * Suppresion du token dans le Header des futures requêtes
 */
const delAuthorisation = () => {
  instance.defaults.headers.common["Authorization"] = "";
};

/**
 * Lancement requête de récupération des formulaires
 * @param titre chaine de caractères à rechercher dans le titre du formulaire null par défaut
 * @param page numéro de la page première page par défaut
 * @returns Promise retournant une réponse de type AxiosResponse
 */
const getForms = (titre: string | null = null, page = 0, include = ["id", "titre", "slug"], size = 10) => {
  // construction du chemin d'interrogation de l'API
  const searchParams = titre ? sfAnd([sfEqual("valide", "true"), sfLike("titre", `*${titre}*`)]) : sfEqual("valide", "true");
  // lancement de la requête
  return instance.request({
    method: "GET",
    url: encodeURI(`/data/forms?filter=${searchParams}&page=${page + 1}&size=${size}&include=${include.join(",")}`),
  });
};

const getFormsInit = (initForm: number, page = 1) => {
  // lancement de la requête
  return instance.request({
    method: "GET",
    url: encodeURI(`/data/forms?filter=${sfEqual("initForm", initForm)}&page=${page}&size=${50}&include=id`),
  });
}

const getForm = (slug: string | undefined, include = []) => {
  const searchParams = slug ? sfEqual("slug", slug) : "";
  let url = `data/forms?filter=${searchParams}`;
  if (include.length) url += `&include=${include.join(",")}`;
  return instance.request({
    method: "GET",
    url: encodeURI(url),
  });
};

const createForm = (payload: FormCreation) => {
  return instance.request({
    method: "POST",
    url: "/data/forms",
    data: payload,
  });
};

const updateForm = (payload: { id?: number; titre?: string; description?: string | null; formulaire?: string; createur?: number }) => {
  return instance.request({
    method: "PATCH",
    url: `/data/forms/${payload.id}`,
    data: payload,
  });
};

//const saveAnswer = (payload: { reponse: string; donnees: string; formulaire: number; createur: number }) => {
const saveAnswer = (payload: { reponse: string; formulaire: number }) => {
  return instance.request({
    method: "POST",
    url: "/data/answers",
    data: payload,
  });
};

const getAnswers = (query: string) => {
  return instance.request({
    method: "GET",
    url: encodeURI(`data/answers?${query}`),
  });
};

const getUniqueAnswer = async (query: string) => {
  const { data: rep } = await instance.request({
    method: "GET",
    url: encodeURI(`data/answers?${query}`),
  });
  if (rep.nombreReponses !== 1) throw new Error("La réponse n'est pas unique");
  return instance.request({
    method: "GET",
    url: `data/answers/${rep.data[0].id}`,
  });
};

const getAnswer = (id: number, query: string | null) => {
  const url = query ? `data/answers/${id}?${query}` : `data/answers/${id}`;
  return instance.request({
    method: "GET",
    url,
  });
};

const updateAnswer = (payload: AnwserUpdate) => {
  return instance.request({
    method: "PATCH",
    url: `data/answers/${payload.id}`,
    data: payload,
  });
};

const lockAnswer = (id: number) => {
  return instance.request({
    method: "POST",
    url: `data/answers/lock/${id}`,
  });
};

const unlockAnswer = (id: number) => {
  return instance.request({
    method: "POST",
    url: `data/answers/unlock/${id}`,
  });
};

const login = (payload: { login: string; password: string }) => {
  return instance.request({
    method: "POST",
    url: "/auth/authenticated",
    data: payload,
  });
};

const getCurrentUser = () => {
  return instance.request({
    method: "GET",
    url: "/data/users/me",
  });
};

const getUsers = (filter: string | null = null, include: string[] = [], page: number = 1, size: number = 10) => {
  // construction du chemin d'interrogation de l'API
  const params: string[] = [];
  if (filter) params.push(filter);
  if (include.length) params.push(`include=${include.join(",")}`);
  params.push(`page=${page}`);
  params.push(`size=${size}`);
  // lancement de la requête
  return instance.request({
    method: "GET",
    url: `/data/users?${params.join("&")}`,
  });
};

const createUser = (payload: UserCreation) => {
  return instance.request({
    method: "POST",
    url: "signin",
    data: payload,
  });
};

const updateUser = (payload: User) => {
  return instance.request({
    method: "PATCH",
    url: `/data/users/${payload.id}`,
    data: payload,
  });
}

const getResetPwdToken = (id: number) => {
  return instance.request({
    method: "GET",
    url: `/data/users/reset-token/${id}`,
  })
}

const resetPassword = (payload: { password: string, token: string }) => {
  return instance.request({
    method: "POST",
    url: "/reset-password",
    data: payload,
  })
}

const logout = () => {
  return instance.request({
    method: "GET",
    url: "/auth/logout",
  })
}

const getHeaders = (page: number = 1, filter: string = "", include: string[] = []) => {
  let url = "";
  url = `/data/headers?page=${page}&order=desc(id)`;
  if (filter.length) url += `&filter=${filter}`;
  if (include.length) url += `&include=${include.join(",")}`;
  return instance.request({
    method: "GET",
    url: encodeURI(url),
  })
}

const updateHeader = (payload: HeaderAPI) => {
  return instance.request({
    method: "PATCH",
    url: encodeURI(`/data/headers/${payload.id}`),
    data: payload
  })
}

const getProduits = (page: number = 1, filter: string = "", include: string[] = []) => {
  let url = "";
  url = `/data/produits?page=${page}&order=desc(id)`;
  if (filter.length) url += `&filter=${filter}`;
  if (include.length) url += `&include=${include.join(",")}`;
  return instance.request({
    method: "GET",
    url: encodeURI(url),
  })
}

const updateProduit = (payload: { id: number, description: string }) => {
  return instance.request({
    method: "PATCH",
    url: encodeURI(`/data/produits/${payload.id}`),
    data: payload,
  })
}

const createProduit = (payload: { header: number, description: string }) => {
  return instance.request({
    method: "POST",
    url: "/data/produits",
    data: payload,
  })
}

const createHeadersWithProducts = (payload: HeaderCreation) => {
  return instance.request({
    method: "POST",
    url: "/data/headers/with-products",
    data: payload,
  })
}

export {
  apiRequest,
  setAuthorisation,
  delAuthorisation,
  login,
  logout,
  getCurrentUser,
  getForms,
  getFormsInit,
  getForm,
  saveAnswer,
  getAnswers,
  getUniqueAnswer,
  getAnswer,
  lockAnswer,
  unlockAnswer,
  updateAnswer,
  getUsers,
  createForm,
  updateForm,
  createUser,
  updateUser,
  getResetPwdToken,
  resetPassword,
  getHeaders,
  updateHeader,
  createHeadersWithProducts,
  getProduits,
  createProduit,
  updateProduit,
};
