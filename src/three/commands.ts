import { profile } from '@/content/profile';
import { projects } from '@/content/projects';
import { fromPath, type Room } from '@/routes';
import { isThemeName, THEMES, type ThemeName } from './themes';

/** What a `/` command is allowed to do. */
export interface CommandActions {
  say(text: string): void;
  open(route: Room): void;
  setTheme(name: ThemeName): void;
  toggleRgb(): boolean;
  dance(): void;
}

/** `cd about`, `cd work`, `cd plumbline`, `cd plumb`: a section path, a project slug, or the start of one. */
function resolve(name: string | undefined): Room | null {
  if (!name) return null;
  const route = fromPath(`/${name === 'projects' ? 'work' : name}`);
  if (route && route.kind !== 'home') return route;
  const p = projects.find((x) => x.slug === name) ?? projects.find((x) => x.slug.startsWith(name));
  return p ? { kind: 'project', slug: p.slug } : null;
}

const COMMANDS: Record<string, (arg: string | undefined, a: CommandActions) => void> = {
  help: (_, a) => a.say('ls · whoami · hire · cd <name> · theme day|night|retro · rgb · blink · sudo'),
  ls: (_, a) => a.say(['experience', 'projects', ...projects.map((p) => p.slug)].join('  ')),
  whoami: (_, a) => a.say(`Tomás. ${profile.role} at Psynth. Breaks things on purpose.`),
  hire: (_, a) => { a.say('Good call. Opening contact…'); setTimeout(() => a.open({ kind: 'contact' }), 700); },
  sudo: (_, a) => a.say("Nice try. You're not root here."),
  rgb: (_, a) => a.say(a.toggleRgb() ? 'RGB mode. Obviously.' : 'RGB off. Back to serious.'),
  blink: (_, a) => { a.dance(); a.say("That's me!"); },
  theme: (arg, a) => {
    if (isThemeName(arg)) { a.setTheme(arg); a.say(`Theme: ${arg}.`); }
    else a.say(`theme ${Object.keys(THEMES).join(', theme ')}.`);
  },
  cd: (arg, a) => { const r = resolve(arg); if (r) a.open(r); else a.say(`cd: no such place: ${arg ?? ''}`); },
  clear: (_, a) => a.say('Clean.'),
  exit: (_, a) => a.say('You cannot exit. You can only press keys.'),
};
COMMANDS.open = COMMANDS.cd;

export function runCommand(line: string, actions: CommandActions): void {
  const [name, arg] = line.trim().toLowerCase().split(/\s+/);
  if (!name) return;
  const command = COMMANDS[name];
  if (command) command(arg, actions);
  else actions.say(`command not found: ${name}`);
}

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'].join();

/** Feed it every key code; returns true the moment the Konami code completes. */
export function konamiListener(): (code: string) => boolean {
  let recent: string[] = [];
  return (code) => {
    recent = [...recent, code].slice(-10);
    if (recent.join() !== KONAMI) return false;
    recent = [];
    return true;
  };
}
