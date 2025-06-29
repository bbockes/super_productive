// schemas/linkCardType.ts
import { defineField, defineType } from 'sanity';

export const linkCardType = defineType({
  name: 'linkCard',
  title: 'Apps',
  type: 'document',
  fields: [
    defineField({
      name: 'hook',
      title: 'Hook',
      type: 'string',
      description: 'The text that will appear on hover',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'The link that opens when the card is clicked',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Creativity', value: 'Creativity' },
          { title: 'Knowledge', value: 'Knowledge' },
          { title: 'Marketing', value: 'Marketing' },
          { title: 'Analytics', value: 'Analytics' },
          { title: 'Automation', value: 'Automation' },
          { title: 'Collaboration', value: 'Collaboration' },
          { title: 'Time-saving', value: 'Time-saving' },
          { title: 'Security', value: 'Security' },
          { title: 'Learning', value: 'Learning' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'hook',
      media: 'image',
      subtitle: 'url'
    },
  },
});