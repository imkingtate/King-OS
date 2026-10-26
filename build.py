"""Build a static preview without copying backups, Git metadata, or user data."""
from pathlib import Path
import shutil
root = Path(__file__).resolve().parent
out = root / 'dist'
out.mkdir(exist_ok=True)
for name in ('index.html', 'storage.js', 'domain.js', 'v2.js', 'v2.css'):
    shutil.copy2(root / name, out / name)
print('Static preview built in dist (5 application files)')
