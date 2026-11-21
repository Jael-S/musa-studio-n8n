import type { Obra } from "@/components/SubirObra";

type ObraGuardada = Omit<Obra, "imagen"> & {
  ownerId: string;
  imagenBlob: Blob;
  savedAt: number;
};

const DB_NAME = "musa-studio-local";
const STORE_NAME = "obras";
const DB_VERSION = 1;

function abrirBase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("ownerId", "ownerId", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function cargarObrasLocales(ownerId: string): Promise<Obra[]> {
  const db = await abrirBase();

  try {
    const guardadas = await new Promise<ObraGuardada[]>((resolve, reject) => {
      const request = db
        .transaction(STORE_NAME, "readonly")
        .objectStore(STORE_NAME)
        .index("ownerId")
        .getAll(ownerId);

      request.onsuccess = () => resolve(request.result as ObraGuardada[]);
      request.onerror = () => reject(request.error);
    });

    return guardadas
      .sort((a, b) => b.savedAt - a.savedAt)
      .map(({ imagenBlob, savedAt: _savedAt, ...obra }) => ({
        ...obra,
        imagen: URL.createObjectURL(imagenBlob),
        imagenBlob,
      }));
  } finally {
    db.close();
  }
}

export async function guardarObraLocal(
  ownerId: string,
  obra: Obra,
): Promise<void> {
  if (!obra.imagenBlob) return;

  const db = await abrirBase();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).put({
        id: obra.id,
        ownerId,
        titulo: obra.titulo,
        categoria: obra.categoria,
        notas: obra.notas,
        imagenBlob: obra.imagenBlob,
        savedAt: Date.now(),
      } satisfies ObraGuardada);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally {
    db.close();
  }
}
