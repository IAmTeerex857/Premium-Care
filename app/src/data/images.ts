/**
 * All photography in one place, Unsplash hotlinks with sizing params.
 * Replace the URLs here when real photography is ready; nothing else changes.
 */
const u = (id: string, w = 1200, h?: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=${w}${h ? `&h=${h}` : ''}`

export const img = {
  hero: u('1576091160399-112ba8d25d1d', 1600, 900),
  heroPortrait: u('1521737604893-d14cc237f11d', 900, 1100),

  aboutStory: u('1559839734-2b71ea197ec2', 1200, 800),
  aboutTeam: u('1582750433449-648ed127bb54', 1200, 800),
  mission: u('1584515933487-779824d29309', 1000, 700),

  services: {
    'in-home-care': u('1584516150909-c43483ee7932', 900, 675),
    'personal-care': u('1576765608535-5f04d1e3f289', 900, 675),
    'companion-care': u('1573497019940-1c28c88b4f3e', 900, 675),
    'respite-care': u('1559839734-2b71ea197ec2', 900, 675),
    'skilled-nursing': u('1631217868264-e5b90bb7e133', 900, 675),
    'disability-support': u('1591604466107-ec97de577aff', 900, 675),
    'care-coordination': u('1551076805-e1869033e561', 900, 675),
    'transportation': u('1590419690008-905895e8fe0d', 900, 675),
  } as Record<string, string>,


  team: {
    dana: u('1594824476967-48c8b964273f', 400, 400),
    marcus: u('1612349317150-e413f6a5b16d', 400, 400),
    priya: u('1573497019940-1c28c88b4f3e', 400, 400),
    james: u('1622253692010-333f2da6031d', 400, 400),
  },

  avatars: {
    sarah: u('1544005313-94ddf0286df2', 200, 200),
    robert: u('1500648767791-00dcc994a43e', 200, 200),
    linda: u('1580489944761-15a19d654956', 200, 200),
    michael: u('1507003211169-0a1dd7228f2d', 200, 200),
  },

  careers: u('1600880292203-757bb62b4baf', 1200, 800),
  cta: u('1516574187841-cb9cc2ca948b', 1200, 800),
}
