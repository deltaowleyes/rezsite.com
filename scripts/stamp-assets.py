"""Cache-busting: give every local CSS/JS reference ?v=<hash of that file's contents>.
Run before every commit:  python3 scripts/stamp-assets.py
A changed file gets a new ?v=, so browsers never keep an old copy. --check exits 1 if anything is stale."""
import re, sys, hashlib, os
ROOT = os.path.join(os.path.dirname(__file__), '..')
PAGES = ['index.html', 'directory.html', 'verified.html', 'update.html', 'faq.html']
PAT = re.compile(r'((?:href|src)=")((?:\.\./)?assets/[\w./-]+\.(?:css|js))(\?v=[\w.-]+)?(")')
def h(path): return hashlib.sha1(open(os.path.join(ROOT, path), 'rb').read()).hexdigest()[:10]
stale = []
# Module files whose own import/asset URLs need stamping too (stamped first, so pages then get their final hash).
MODULES = ['assets/rezsite/arrowhead/install.js']
MPAT = re.compile(r"(['\"]\./)([\w.-]+\.(?:js|svg))(\?v=[\w.-]+)?(['\"])")
for m_path in MODULES:
    f = os.path.join(ROOT, m_path); s = open(f).read(); base = os.path.dirname(m_path)
    def mfix(m):
        want = '?v=' + h(os.path.join(base, m.group(2)))
        if m.group(3) != want: stale.append(f'{m_path}: {m.group(2)}')
        return m.group(1) + m.group(2) + want + m.group(4)
    new_s = MPAT.sub(mfix, s)
    if '--check' not in sys.argv and new_s != s: open(f, 'w').write(new_s)
for p in PAGES:
    f = os.path.join(ROOT, p); s = open(f).read()
    def fix(m):
        want = '?v=' + h(m.group(2).lstrip('./'))
        if m.group(3) != want: stale.append(f'{p}: {m.group(2)}')
        return m.group(1) + m.group(2) + want + m.group(4)
    new = PAT.sub(fix, s)
    if '--check' not in sys.argv and new != s: open(f, 'w').write(new)
if stale: print(('STALE (run without --check to fix):\n  ' if '--check' in sys.argv else 'stamped:\n  ') + '\n  '.join(stale))
else: print('all asset links up to date')
sys.exit(1 if stale and '--check' in sys.argv else 0)
