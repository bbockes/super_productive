// schemas/linkCardType.ts
import { defineField, defineType } from 'sanity';

export const linkCardType = defineType({
  name: 'linkCard',
  title: 'App',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
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
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Tool', value: 'Tool' },
          { title: 'Resource', value: 'Resource' },
          { title: 'Article', value: 'Article' },
          { title: 'Website', value: 'Website' },
          { title: 'App', value: 'App' },
          { title: 'Course', value: 'Course' },
          { title: 'Template', value: 'Template' },
          { title: 'Other', value: 'Other' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      subtitle: 'url'
    },
  },
});