from functools import lru_cache
from supabase import create_client, Client

from .config import get_settings


@lru_cache
def get_supabase() -> Client:
    """Cliente Supabase autenticado com a service role key.

    Usado apenas no backend — nunca exponha a service role key no frontend.
    As policies de RLS ainda protegem os dados; aqui filtramos manualmente
    por user_id em cada query para reforçar o isolamento por usuário.
    """
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_service_role_key)
