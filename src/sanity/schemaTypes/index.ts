import { type SchemaTypeDefinition } from 'sanity';

import { restaurantSettingsType } from './restaurantSettings';
import { heroSectionType } from './heroSection';
import { categoryType } from './categories';
import { dishType } from './dish';
import { contactType } from './contact';
import { whyChooseUsType } from './whyChooseUs';
import { testimonialsType } from './testimonials';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    restaurantSettingsType,
    heroSectionType,
    categoryType,
    dishType,
    contactType,
    whyChooseUsType,
    testimonialsType,
  ],
};
