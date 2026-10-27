#!/usr/bin/env python3
"""Install approved RiverStorm premium assets from the v3 zip into this checkout.
Does not modify gameplay or audio. Run: python scripts/install-premium-assets.py PATH_TO_ZIP
Then commit/push the two PNGs using your existing GitHub credentials.
"""
import hashlib
from pathlib import Path
from zipfile import ZipFile
import sys

FILES = {
 "assets/sprites/premium/runtime/player/fighter_candidate.png": "0c730c34440a2e99e24a8af9dc3d7aae74dd35a609e90875aa3dc22c81ef0615",
 "assets/sprites/premium/runtime/fx/explosion_atlas_4x3.png": "5f02ca30b4e2158f1d45630f80185db6e156c079c5f3dec0fded0c324885dbd2",
}
def main():
    if len(sys.argv) != 2:
        raise SystemExit("Uso: python scripts/install-premium-assets.py RiverStorm_Premium_Preparacao_v3.zip")
    root=Path(__file__).resolve().parents[1]
    with ZipFile(sys.argv[1]) as z:
        for path,expected in FILES.items():
            data=z.read(path)
            digest=hashlib.sha256(data).hexdigest()
            if digest!=expected:
                raise SystemExit(f"Hash inesperado: {path} ({digest}). Nenhum recurso foi instalado.")
        for path in FILES:
            target=root/path
            target.parent.mkdir(parents=True,exist_ok=True)
            target.write_bytes(z.read(path))
            print("Instalado",path)
    print("Arquivos instalados localmente. Para publicar: git add assets/sprites/premium/runtime && git commit -m 'art: approved premium sprites' && git push")
if __name__=="__main__":
    main()
