#!/usr/bin/env python3
"""Instala as texturas PNG reais a partir do pacote de cenário RiverStorm.

Uso:
  python scripts/install-premium-environment.py caminho/para/RiverStorm_Premium_Cenario_Instalacao_29out2026.zip
Não modifica gameplay, apenas escreve as três imagens binárias nos caminhos
que premium-environment.js consome.
"""
from __future__ import annotations
import sys, zipfile, shutil, struct
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "assets/sprites/premium/runtime/environment"
ASSETS = ("water_calm.png", "riverbank_left.png", "riverbank_right.png")
PNG = b"\x89PNG\r\n\x1a\n"

def install(archive: Path) -> int:
    if not archive.is_file():
        print(f"ERRO: pacote ZIP não encontrado: {archive}", file=sys.stderr)
        return 2
    with zipfile.ZipFile(archive) as source:
        names = source.namelist()
        staged = {}
        for name in ASSETS:
            candidates = [x for x in names if Path(x).name.casefold() == name.casefold()]
            if len(candidates) != 1:
                print(f"ERRO: esperado exatamente um {name}, encontrados {len(candidates)}", file=sys.stderr)
                return 2
            data = source.read(candidates[0])
            if len(data) < 24 or not data.startswith(PNG):
                print(f"ERRO: assinatura PNG inválida: {name}", file=sys.stderr)
                return 2
            w, h = struct.unpack(">II", data[16:24])
            if w < 50 or h < 50:
                print(f"ERRO: dimensão inválida: {name} ({w}x{h})", file=sys.stderr)
                return 2
            staged[name] = (data, w, h)
    DEST.mkdir(parents=True, exist_ok=True)
    for name, (data, w, h) in staged.items():
        target = DEST / name
        target.write_bytes(data)
        print(f"OK {target.relative_to(ROOT)} ({w}x{h}, {len(data)} bytes)")
    return 0

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__, file=sys.stderr)
        raise SystemExit(2)
    raise SystemExit(install(Path(sys.argv[1]).expanduser()))
