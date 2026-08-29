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


@lru_cache
def get_supabase_auth() -> Client:
    """Cliente Supabase autenticado com a anon key, usado só para signup/login/logout.

    Mantém o mesmo nível de privilégio que o frontend teria, em vez de usar a
    service role key (reservada às operações de dados em get_supabase()).
    """
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_anon_key)
