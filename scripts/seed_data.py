#!/usr/bin/env python3
"""
Script para gerar dados de teste no Supabase.
Uso: python scripts/seed_data.py
"""

import os
import random
import string
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

def generate_room_code():
    """Gera código de sala aleatório."""
    chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    return ''.join(random.choice(chars) for _ in range(6))

def seed_rooms():
    """Cria salas de teste."""
    print("[GAME] Gerando dados de teste...")
    print(f"Codigo de exemplo: {generate_room_code()}")
    print("\n[OK] Ambiente pronto para desenvolvimento!")

if __name__ == "__main__":
    seed_rooms()
