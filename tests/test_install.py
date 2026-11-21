"""Offline installer integration tests; write only to temporary destinations."""
from pathlib import Path
import hashlib, os, shutil, subprocess, tempfile, unittest

ROOT=Path(__file__).resolve().parents[1]

class InstallTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory(prefix='tam-paket-test-')
        self.base=Path(self.tmp.name)
        self.dest=self.base/'skills with spaces'
    def tearDown(self):
        self.tmp.cleanup()
    def run_install(self,*args,root=ROOT,ok=True,extra_env=None):
        env=dict(os.environ)
        env.pop('CLAUDE_SKILLS_DIR',None)
        if extra_env: env.update(extra_env)
        result=subprocess.run(['bash',str(root/'install.sh'),*args],capture_output=True,text=True,env=env)
        if ok:self.assertEqual(result.returncode,0,result.stderr)
        else:self.assertNotEqual(result.returncode,0)
        return result
    def test_list_is_read_only(self):
        result=self.run_install('--liste','--dest',str(self.dest))
        self.assertIn('Toplam: 37',result.stdout)
        self.assertFalse(self.dest.exists())
    def test_full_install(self):
        self.run_install('--dest',str(self.dest))
        self.assertEqual(len(list(self.dest.glob('*/SKILL.md'))),37)
        self.assertFalse(any(p.is_symlink() for p in self.dest.rglob('*')))
    def test_light_install(self):
        self.run_install('--hafif','--dest',str(self.dest))
        self.assertEqual(len(list(self.dest.glob('*/SKILL.md'))),25)
    def test_existing_preserved_and_force_backed_up(self):
        old=self.dest/'peer-review';old.mkdir(parents=True)
        (old/'custom.txt').write_text('keep my work')
        self.run_install('--dest',str(self.dest))
        self.assertEqual((old/'custom.txt').read_text(),'keep my work')
        self.run_install('--dest',str(self.dest),'--force')
        saved=list((self.dest/'.tam-paket-backups').glob('peer-review.*/original/custom.txt'))
        self.assertEqual(len(saved),1)
        self.assertEqual(saved[0].read_text(),'keep my work')
        self.assertTrue((old/'SKILL.md').exists())
    def test_dangling_symlink_preserved(self):
        self.dest.mkdir();link=self.dest/'peer-review';link.symlink_to(self.base/'missing')
        self.run_install('--dest',str(self.dest))
        self.assertTrue(link.is_symlink())
        self.run_install('--dest',str(self.dest),'--force')
        self.assertFalse(link.is_symlink())
        self.assertTrue(any(p.is_symlink() for p in (self.dest/'.tam-paket-backups').glob('peer-review.*/original')))
    def test_codex_target(self):
        self.run_install('--target','codex',extra_env={'CODEX_HOME':str(self.base/'codex')})
        self.assertEqual(len(list((self.base/'codex/skills').glob('*/SKILL.md'))),37)
    def test_invalid_target(self):
        self.run_install('--target','other','--dest',str(self.dest),ok=False)
        self.assertFalse(self.dest.exists())
    def test_tampered_input_stops_before_install(self):
        copied=self.base/'package';shutil.copytree(ROOT,copied,ignore=shutil.ignore_patterns('.git','video'))
        with (copied/'skills/peer-review/SKILL.md').open('a') as out:out.write('\nTAMPERED\n')
        self.run_install('--dest',str(self.dest),root=copied,ok=False)
        self.assertFalse(self.dest.exists())

if __name__=='__main__':unittest.main(verbosity=2)
