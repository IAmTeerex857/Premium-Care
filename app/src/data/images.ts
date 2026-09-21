/** Project-owned, generated photography showing care at home and in the community. */
const care = (name: string) => `/images/care/${name}.jpg`

export const img = {
  hero: care('hero-home-care'),
  heroPortrait: care('community-support'),

  aboutStory: care('medication-support'),
  aboutTeam: care('community-support'),
  mission: care('companion-care'),

  services: {
    'in-home-care': care('hero-home-care'),
    'personal-care': care('personal-care'),
    'companion-care': care('companion-care'),
    'respite-care': care('meal-support'),
    'skilled-nursing': care('medication-support'),
    'disability-support': care('community-support'),
    'care-coordination': care('medication-support'),
    'transportation': care('transportation'),
  } as Record<string, string>,


  team: {
    dana: care('hero-home-care'),
    marcus: care('personal-care'),
    priya: care('medication-support'),
    james: care('community-support'),
  },

  avatars: {
    sarah: care('hero-home-care'),
    robert: care('meal-support'),
    linda: care('companion-care'),
    michael: care('community-support'),
  },

  careers: care('meal-support'),
  cta: care('transportation'),
}
