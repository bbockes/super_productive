/**
 * Static blog data for error pages and about page
 */

export const notFoundPost = {
  id: '404',
  title: 'Uh-oh. Looks like that page doesn\'t exist.',
  excerpt: '',
  category: 'Errors',
  readTime: '404 sec',
  image: 'https://images.unsplash.com/photo-1594736797933-d0d92e2d0b3d?w=400&h=250&fit=crop',
  content: [
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          marks: [],
          text: 'It either wandered off or never existed in the first place.'
        }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      markDefs: [
        {
          _key: 'homepage-link',
          _type: 'link',
          href: '/'
        }
      ],
      children: [
        {
          _type: 'span',
          marks: [],
          text: 'You can head back to the '
        },
        {
          _type: 'span',
          marks: ['homepage-link'],
          text: 'homepage'
        },
        {
          _type: 'span',
          marks: [],
          text: ' — or, if you\'re up for it, just start clicking buttons.'
        }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          marks: [],
          text: '(No promises it\'ll be productive, but it might be fun.)'
        }
      ]
    }
  ]
};

export const aboutPost = {
  id: 'about',
  title: 'About Super Productive',
  excerpt: '',
  category: 'About',
  readTime: '1 min',
  image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=250&fit=crop',
  content: [
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          marks: ['strong'],
          text: 'Prompting without a strategy is like building a house without a blueprint.'
        }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          marks: [],
          text: 'It might feel like progress, but it\'s just motion without direction—'
        },
        {
          _type: 'span',
          marks: ['em'],
          text: 'fast, but aimless.'
        }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          marks: ['strong'],
          text: 'And using the wrong tools? That\'s like trying to hammer nails with a screwdriver.'
        }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          marks: [],
          text: 'It slows you down and handicaps your progress.'
        }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          marks: ['strong'],
          text: 'AI feels like magic. But most people treat it like a slot machine.'
        }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          marks: ['em'],
          text: 'Guess, tweak, and hope for the best.'
        }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          marks: ['strong'],
          text: 'And tools?'
        },
        {
          _type: 'span',
          marks: [],
          text: ' Most pick what\'s familiar or popular—leading them to overlook better options and waste time reinventing the wheel.'
        }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          marks: ['strong'],
          text: 'Super Productive is a weekly newsletter designed to help knowledge workers navigate the full spectrum of modern productivity'
        },
        {
          _type: 'span',
          marks: [],
          text: ' — from apps to AI prompts — so you can work smarter, save time, and focus on what truly matters.'
        }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          marks: [],
          text: 'Each week, we share:'
        }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [
        {
          _type: 'span',
          marks: [],
          text: '🧩 '
        },
        {
          _type: 'span',
          marks: ['strong'],
          text: 'One real-world problem'
        },
        {
          _type: 'span',
          marks: [],
          text: ' — a challenge that might be slowing you down'
        }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [
        {
          _type: 'span',
          marks: [],
          text: '🛠️ '
        },
        {
          _type: 'span',
          marks: ['strong'],
          text: 'One tool or AI prompt'
        },
        {
          _type: 'span',
          marks: [],
          text: ' — a smarter, faster, proven way to solve it'
        }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      children: [
        {
          _type: 'span',
          marks: [],
          text: '⚡ '
        },
        {
          _type: 'span',
          marks: ['strong'],
          text: 'One workflow'
        },
        {
          _type: 'span',
          marks: [],
          text: ' — simple steps to deliver repeatable results'
        }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          marks: [],
          text: 'No fluff. No overwhelm. '
        },
        {
          _type: 'span',
          marks: ['strong'],
          text: 'Just smart, practical content to help you use AI with intention, save time with the right tools, and '
        },
        {
          _type: 'span',
          marks: ['strong'],
          text: 'supercharge'
        },
        {
          _type: 'span',
          marks: ['strong'],
          text: ' your productivity.'
        }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          marks: ['em'],
          text: 'The perfect way to cut through the noise, reclaim your time, and unlock your full potential.'
        }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          marks: [],
          text: 'Ready to work smarter?'
        }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          marks: ['strong'],
          text: 'Subscribe now to start leveling up'
        },
        {
          _type: 'span',
          marks: [],
          text: ' — one email at a time.'
        }
      ]
    }
  ],
  psContent: [
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          marks: ['strong'],
          text: 'P.S. A newsletter about saving time should respect yours.'
        }
      ]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          marks: [],
          text: 'That\'s why each post is '
        },
        {
          _type: 'span',
          marks: ['strong'],
          text: 'bite-sized'
        },
        {
          _type: 'span',
          marks: [],
          text: ' and '
        },
        {
          _type: 'span',
          marks: ['strong'],
          text: 'super short'
        },
        {
          _type: 'span',
          marks: [],
          text: '—just look for the '
        },
        {
          _type: 'span',
          marks: ['strong'],
          text: 'read-time icon'
        },
        {
          _type: 'span',
          marks: [],
          text: '—so you can '
        },
        {
          _type: 'span',
          marks: ['strong'],
          text: 'get the insights you need'
        },
        {
          _type: 'span',
          marks: [],
          text: ' and '
        },
        {
          _type: 'span',
          marks: ['strong'],
          text: 'put them to work'
        },
        {
          _type: 'span',
          marks: [],
          text: ' '
        },
        {
          _type: 'span',
          marks: ['em'],
          text: 'as fast as possible!'
        }
      ]
    }
  ]
};