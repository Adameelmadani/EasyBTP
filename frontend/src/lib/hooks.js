import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/client.js";

const STORE_KEY = "easybtp_project";

// Liste des projets (pour les filtres) + sélection courante.
// La sélection suit l'utilisateur entre les modules : on lit d'abord le projet
// transmis par la navigation (state), puis le dernier projet mémorisé, puis le 1er.
export function useProjects(initialId = "") {
  const location = useLocation();
  const navProjectId = location.state?.projectId;
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectIdState] = useState(
    initialId || navProjectId || localStorage.getItem(STORE_KEY) || ""
  );

  // Sélection persistée (mémorisée pour les autres pages)
  const setProjectId = (id) => {
    setProjectIdState(id);
    if (id) localStorage.setItem(STORE_KEY, id);
  };

  useEffect(() => {
    api.get("/projects").then((r) => {
      setProjects(r.data);
      const ids = new Set(r.data.map((p) => p.id));
      // Choisit la 1re valeur valide : courante > navigation > mémorisée > 1er projet
      const pick = [projectId, navProjectId, localStorage.getItem(STORE_KEY), r.data[0]?.id]
        .find((x) => x && ids.has(x));
      if (pick) {
        setProjectIdState(pick);
        localStorage.setItem(STORE_KEY, pick);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { projects, projectId, setProjectId };
}

export function useFetch(url, deps = []) {
  const [data, setData] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const reload = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    let active = true;
    if (!url) { setData(null); return; }
    api.get(url).then((r) => active && setData(r.data)).catch(() => active && setData([]));
    return () => { active = false; };
  }, [url, reloadKey, ...deps]);

  return { data, reload, setData };
}
