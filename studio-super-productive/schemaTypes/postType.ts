// schemas/postType.ts - Simplified version for troubleshooting
import { defineField, defineType } from 'sanity';

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
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
          { title: 'Writing', value: 'Writing' },
          { title: 'Learning', value: 'Learning' },
          { title: 'Planning', value: 'Planning' },
          { title: 'Building', value: 'Building' },
          { title: 'Creativity', value: 'Creativity' },
          { title: 'Growth', value: 'Growth' },
          { title: 'Focus', value: 'Focus' },
          { title: 'Communication', value: 'Communication' },
          { title: 'Thinking', value: 'Thinking' },
          { title: 'Shortcuts', value: 'Shortcuts' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'readTime',
      title: 'Read Time',
      type: 'string',
      description: 'Estimated read time (e.g., "5 min").',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'string',
      description: 'A short summary of the post for previews.',
      validation: (rule) => rule.max(200),
    }),
  ],
});