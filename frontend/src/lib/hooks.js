import { useEffect, useState } from "react";
import api from "../api/client.js";

// Liste des projets (pour les filtres) + sélection courante
export function useProjects(initialId = "") {
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState(initialId);

  useEffect(() => {
    api.get("/projects").then((r) => {
      setProjects(r.data);
      if (!initialId && r.data[0]) setProjectId(r.data[0].id);
    });
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
