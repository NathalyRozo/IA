import logging
from typing import List, Tuple, Optional
import numpy as np

from app.core.config import settings

logger = logging.getLogger(__name__)

# Intentar cargar sentence_transformers; si aún no está descargado el modelo, se usa fallback TF-IDF vectorizer
_embedding_model = None

def get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        try:
            from sentence_transformers import SentenceTransformer
            _embedding_model = SentenceTransformer(settings.EMBEDDING_MODEL_NAME)
        except Exception as e:
            logger.info(f"Modelo local SentenceTransformer no disponible ({e}), usando vectorizador sintético para desarrollo.")
            _embedding_model = "fallback"
    return _embedding_model


class EventClusterer:
    """
    Agrupador semántico de acontecimientos a través de múltiples medios.
    Identifica si dos o más noticias de diferentes salas de redacción cubren el mismo hecho.
    """

    def compute_embedding(self, text: str) -> List[float]:
        """Calcula el vector denso para el texto (titular + resumen)."""
        model = get_embedding_model()
        if model != "fallback":
            try:
                emb = model.encode(text, normalize_embeddings=True)
                return emb.tolist()
            except Exception as e:
                logger.error(f"Error calculando embedding: {e}")

        # Fallback determinista ligero para desarrollo si no hay modelo neuronal cargado
        from sklearn.feature_extraction.text import HashingVectorizer
        vectorizer = HashingVectorizer(n_features=128, alternate_sign=False)
        sparse_vec = vectorizer.transform([text]).toarray()[0]
        norm = np.linalg.norm(sparse_vec)
        if norm > 0:
            sparse_vec = sparse_vec / norm
        return sparse_vec.tolist()

    @staticmethod
    def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
        """Calcula la similitud de cosenos entre dos vectores densos."""
        v1 = np.array(vec1, dtype=float)
        v2 = np.array(vec2, dtype=float)
        norm1 = np.linalg.norm(v1)
        norm2 = np.linalg.norm(v2)
        if norm1 == 0 or norm2 == 0:
            return 0.0
        return float(np.dot(v1, v2) / (norm1 * norm2))

    def find_best_matching_cluster(
        self,
        article_embedding: List[float],
        active_clusters: List[Tuple[int, List[float]]]  # [(cluster_id, cluster_average_embedding), ...]
    ) -> Tuple[Optional[int], float]:
        """
        Compara el vector del artículo con los clústeres activos dentro de la ventana de tiempo.
        Retorna (cluster_id, similarity) si supera el umbral configurado.
        """
        if not active_clusters:
            return None, 0.0

        best_cluster_id = None
        max_similarity = 0.0

        for cluster_id, cluster_vec in active_clusters:
            sim = self.cosine_similarity(article_embedding, cluster_vec)
            if sim > max_similarity:
                max_similarity = sim
                best_cluster_id = cluster_id

        if max_similarity >= settings.SIMILARITY_EVENT_THRESHOLD:
            return best_cluster_id, max_similarity

        return None, max_similarity


clusterer_service = EventClusterer()
