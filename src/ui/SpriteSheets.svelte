<script lang="ts">
  // Buildings
  import bHome from '../assets/sprites/buildings/home.svg?raw';
  import bUpscaleHome from '../assets/sprites/buildings/upscale-home.svg?raw';
  import bOffice from '../assets/sprites/buildings/office.svg?raw';
  import bLab from '../assets/sprites/buildings/lab.svg?raw';
  import bLibrary from '../assets/sprites/buildings/library.svg?raw';
  import bClassroom from '../assets/sprites/buildings/classroom.svg?raw';
  import bSeminarRoom from '../assets/sprites/buildings/seminar-room.svg?raw';
  import bCafePub from '../assets/sprites/buildings/cafe-pub.svg?raw';
  import bConferenceVenue from '../assets/sprites/buildings/conference-venue.svg?raw';
  import bFunderPortal from '../assets/sprites/buildings/funder-portal.svg?raw';
  import bGym from '../assets/sprites/buildings/gym.svg?raw';
  import bHealthCentre from '../assets/sprites/buildings/health-centre.svg?raw';
  import bParkWest from '../assets/sprites/buildings/park-west.svg?raw';
  import bParkEast from '../assets/sprites/buildings/park-east.svg?raw';

  // Interiors
  import iHome from '../assets/sprites/interiors-scenes/home.svg?raw';
  import iUpscaleHome from '../assets/sprites/interiors-scenes/upscale-home.svg?raw';
  import iOffice from '../assets/sprites/interiors-scenes/office.svg?raw';
  import iLab from '../assets/sprites/interiors-scenes/lab.svg?raw';
  import iLibrary from '../assets/sprites/interiors-scenes/library.svg?raw';
  import iClassroom from '../assets/sprites/interiors-scenes/classroom.svg?raw';
  import iSeminarRoom from '../assets/sprites/interiors-scenes/seminar-room.svg?raw';
  import iCafePub from '../assets/sprites/interiors-scenes/cafe-pub.svg?raw';
  import iConferenceVenue from '../assets/sprites/interiors-scenes/conference-venue.svg?raw';
  import iFunderPortal from '../assets/sprites/interiors-scenes/funder-portal.svg?raw';
  import iGym from '../assets/sprites/interiors-scenes/gym.svg?raw';
  import iHealthCentre from '../assets/sprites/interiors-scenes/health-centre.svg?raw';
  import iParkWest from '../assets/sprites/interiors-scenes/park-west.svg?raw';
  import iParkEast from '../assets/sprites/interiors-scenes/park-east.svg?raw';
  import iWalk from '../assets/sprites/interiors-scenes/walk.svg?raw';

  // Tokens
  import tPlayer from '../assets/sprites/tokens/player.svg?raw';
  import tRival1 from '../assets/sprites/tokens/rival-1.svg?raw';
  import tRival2 from '../assets/sprites/tokens/rival-2.svg?raw';
  import tRival3 from '../assets/sprites/tokens/rival-3.svg?raw';
  import tRival4 from '../assets/sprites/tokens/rival-4.svg?raw';

  // Glyphs
  import gClock from '../assets/sprites/glyphs/clock.svg?raw';
  import gHourglass from '../assets/sprites/glyphs/hourglass.svg?raw';
  import gSeal from '../assets/sprites/glyphs/seal.svg?raw';
  import gLock from '../assets/sprites/glyphs/lock.svg?raw';
  import gCap from '../assets/sprites/glyphs/cap.svg?raw';
  import gFlag from '../assets/sprites/glyphs/flag.svg?raw';
  import gStar from '../assets/sprites/glyphs/star.svg?raw';

  // Location characters (Jones-style clerks)
  import nLandlady from '../assets/sprites/npcs/landlady.svg?raw';
  import nConcierge from '../assets/sprites/npcs/concierge.svg?raw';
  import nChair from '../assets/sprites/npcs/chair.svg?raw';
  import nTech from '../assets/sprites/npcs/tech.svg?raw';
  import nLibrarian from '../assets/sprites/npcs/librarian.svg?raw';
  import nStudent from '../assets/sprites/npcs/student.svg?raw';
  import nEmeritus from '../assets/sprites/npcs/emeritus.svg?raw';
  import nBarista from '../assets/sprites/npcs/barista.svg?raw';
  import nRep from '../assets/sprites/npcs/rep.svg?raw';
  import nRobot from '../assets/sprites/npcs/robot.svg?raw';
  import nCoach from '../assets/sprites/npcs/coach.svg?raw';
  import nGp from '../assets/sprites/npcs/gp.svg?raw';
  import nPigeon from '../assets/sprites/npcs/pigeon.svg?raw';
  import nDuck from '../assets/sprites/npcs/duck.svg?raw';

  // Extract inner SVG content and viewBox from a raw SVG string
  function svgInner(raw: string): { inner: string; vb: string } {
    const vbMatch = raw.match(/viewBox="([^"]+)"/);
    const vb = vbMatch ? vbMatch[1] : '0 0 24 24';
    // Strip opening <svg ...> tag and closing </svg>
    const inner = raw
      .replace(/<svg[^>]*>/, '')
      .replace(/<\/svg>\s*$/, '')
      .trim();
    return { inner, vb };
  }

  // Build symbol entries
  interface SymbolEntry { id: string; vb: string; inner: string }

  function sym(id: string, raw: string, vbOverride?: string): SymbolEntry {
    const { inner, vb } = svgInner(raw);
    return { id, vb: vbOverride ?? vb, inner };
  }

  const symbols: SymbolEntry[] = [
    // Buildings (32x32)
    sym('ext-home', bHome, '0 0 32 32'),
    sym('ext-upscale_home', bUpscaleHome, '0 0 32 32'),
    sym('ext-office', bOffice, '0 0 32 32'),
    sym('ext-lab', bLab, '0 0 32 32'),
    sym('ext-library', bLibrary, '0 0 32 32'),
    sym('ext-classroom', bClassroom, '0 0 32 32'),
    sym('ext-seminar_room', bSeminarRoom, '0 0 32 32'),
    sym('ext-cafe_pub', bCafePub, '0 0 32 32'),
    sym('ext-conference_venue', bConferenceVenue, '0 0 32 32'),
    sym('ext-funder_portal', bFunderPortal, '0 0 32 32'),
    sym('ext-gym', bGym, '0 0 32 32'),
    sym('ext-health_centre', bHealthCentre, '0 0 32 32'),
    sym('ext-park_west', bParkWest, '0 0 32 32'),
    sym('ext-park_east', bParkEast, '0 0 32 32'),
    // Interiors (128x64)
    sym('int-home', iHome, '0 0 128 64'),
    sym('int-upscale_home', iUpscaleHome, '0 0 128 64'),
    sym('int-office', iOffice, '0 0 128 64'),
    sym('int-lab', iLab, '0 0 128 64'),
    sym('int-library', iLibrary, '0 0 128 64'),
    sym('int-classroom', iClassroom, '0 0 128 64'),
    sym('int-seminar_room', iSeminarRoom, '0 0 128 64'),
    sym('int-cafe_pub', iCafePub, '0 0 128 64'),
    sym('int-conference_venue', iConferenceVenue, '0 0 128 64'),
    sym('int-funder_portal', iFunderPortal, '0 0 128 64'),
    sym('int-gym', iGym, '0 0 128 64'),
    sym('int-health_centre', iHealthCentre, '0 0 128 64'),
    sym('int-park_west', iParkWest, '0 0 128 64'),
    sym('int-park_east', iParkEast, '0 0 128 64'),
    sym('int-walk', iWalk, '0 0 128 64'),
    // Tokens (16x16)
    sym('tok-player', tPlayer, '0 0 16 16'),
    sym('tok-rival1', tRival1, '0 0 16 16'),
    sym('tok-rival2', tRival2, '0 0 16 16'),
    sym('tok-rival3', tRival3, '0 0 16 16'),
    sym('tok-rival4', tRival4, '0 0 16 16'),
    // Glyphs (24x24)
    sym('ui-clock', gClock, '0 0 24 24'),
    sym('ui-hourglass', gHourglass, '0 0 24 24'),
    sym('ui-seal', gSeal, '0 0 24 24'),
    sym('ui-lock', gLock, '0 0 24 24'),
    sym('ui-cap', gCap, '0 0 24 24'),
    sym('ui-flag', gFlag, '0 0 24 24'),
    sym('ui-star', gStar, '0 0 24 24'),
    // Location characters (24x24)
    sym('npc-landlady', nLandlady, '0 0 24 24'),
    sym('npc-concierge', nConcierge, '0 0 24 24'),
    sym('npc-chair', nChair, '0 0 24 24'),
    sym('npc-tech', nTech, '0 0 24 24'),
    sym('npc-librarian', nLibrarian, '0 0 24 24'),
    sym('npc-student', nStudent, '0 0 24 24'),
    sym('npc-emeritus', nEmeritus, '0 0 24 24'),
    sym('npc-barista', nBarista, '0 0 24 24'),
    sym('npc-rep', nRep, '0 0 24 24'),
    sym('npc-robot', nRobot, '0 0 24 24'),
    sym('npc-coach', nCoach, '0 0 24 24'),
    sym('npc-gp', nGp, '0 0 24 24'),
    sym('npc-pigeon', nPigeon, '0 0 24 24'),
    sym('npc-duck', nDuck, '0 0 24 24'),
  ];

  // Inline SVG symbol strings for extra glyphs without files
  const extraSymbols = `
<symbol id="ui-pin" viewBox="0 0 24 24">
  <rect x="10" y="12" width="4" height="8" fill="#b00020"/>
  <circle cx="12" cy="8" r="5" fill="#b00020" stroke="#1a1a1a" stroke-width="1.5"/>
  <circle cx="12" cy="8" r="2" fill="#fffdf5"/>
</symbol>
<symbol id="ui-help" viewBox="0 0 24 24">
  <rect x="2" y="2" width="20" height="20" rx="10" fill="#3a6ea5" stroke="#1a1a1a" stroke-width="1.5"/>
  <rect x="10" y="6" width="4" height="7" rx="1" fill="#fffdf5"/>
  <rect x="10" y="15" width="4" height="3" rx="1" fill="#fffdf5"/>
</symbol>
<symbol id="deco-tree" viewBox="0 0 32 32">
  <rect x="14" y="22" width="4" height="8" fill="#6b4a2a"/>
  <rect x="10" y="14" width="12" height="10" fill="#1f6f43"/>
  <rect x="8" y="8" width="16" height="10" fill="#2f8f6b"/>
  <rect x="12" y="3" width="8" height="8" fill="#1f6f43"/>
</symbol>
<symbol id="ui-coin" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="10" fill="#c79a00" stroke="#1a1a1a" stroke-width="1.5"/>
  <circle cx="12" cy="12" r="6.5" fill="#f0e3a6"/>
  <rect x="10" y="7" width="3" height="2" fill="#8a6b00"/>
  <rect x="9" y="9" width="3" height="2" fill="#8a6b00"/>
  <rect x="9" y="11" width="5" height="2" fill="#8a6b00"/>
  <rect x="9" y="13" width="3" height="2" fill="#8a6b00"/>
  <rect x="9" y="15" width="6" height="2" fill="#8a6b00"/>
</symbol>
`;
</script>

<svg style="display:none" xmlns="http://www.w3.org/2000/svg">
  {#each symbols as s (s.id)}
    {@html `<symbol id="${s.id}" viewBox="${s.vb}" shape-rendering="crispEdges">${s.inner}</symbol>`}
  {/each}
  {@html extraSymbols}
</svg>
