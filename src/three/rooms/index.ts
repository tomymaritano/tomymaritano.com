import { findProject } from '@/content/projects';
import type { Room } from '@/routes';
import { buildProjectRoom } from './project';
import { buildAboutRoom, buildContactRoom, buildExperienceRoom, buildProjectsRoom } from './sections';
import type { RoomContext, RoomView } from './shared';

export type { RoomContext, RoomView } from './shared';

/** Builds the 3D room for a route. Rooms are built on first visit and reused. */
export function buildRoom(route: Room, ctx: RoomContext): RoomView {
  switch (route.kind) {
    case 'about': return buildAboutRoom(ctx);
    case 'experience': return buildExperienceRoom(ctx);
    case 'projects': return buildProjectsRoom(ctx);
    case 'contact': return buildContactRoom(ctx);
    case 'project': {
      const p = findProject(route.slug);
      if (!p) throw new Error(`No project with slug "${route.slug}"`);
      return buildProjectRoom(p, ctx);
    }
  }
}
