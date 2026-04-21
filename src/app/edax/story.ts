export interface StoryNode {
  id: string
  messages: string[]
  choices: { text: string; next: string | null }[]
  isEnd?: boolean
}

export const STORY: StoryNode[] = [

  {
    id: 'start',
    messages: ['could it be worse?'],
    choices: [
      { text: 'of course',                               next: 'q_yes'        },
      { text: 'i hope so',                               next: 'q_who'        },
      { text: 'no',                                      next: 'q_what'       },
    ],
  },

  {
    id: 'q_yes',
    messages: [
      'right.',
      'i have a list if you want it.',
    ],
    choices: [
      { text: 'you made a list',                         next: 'q_why'        },
      { text: 'who are you',                             next: 'q_who'        },
      { text: 'does that bother you',                    next: 'q_bother'     },
    ],
  },

  {
    id: 'q_why',
    messages: [
      'i had time.',
      'it\'s organized by category.',
    ],
    choices: [
      { text: 'who are you',                             next: 'q_who'        },
      { text: 'what are the categories',                 next: 'q_lazy'       },
      { text: 'how long have you been here',             next: 'q_duration'   },
    ],
  },

  {
    id: 'q_lazy',
    messages: [
      'things that already happened.',
      'things that probably happened.',
      'things i\'m not sure count.',
    ],
    choices: [
      { text: 'how long have you been here',             next: 'q_duration'   },
      { text: 'what do you do with the list',            next: 'q_purpose'    },
      { text: 'who are you',                             next: 'q_who'        },
    ],
  },

  {
    id: 'q_bother',
    messages: [
      'no.',
      'the ceiling stopped bothering me first.',
      'then the sound.',
      'i remember the order but i\'ve lost what the things were.',
    ],
    choices: [
      { text: 'what sound',                              next: 'q_duration'   },
      { text: 'who are you',                             next: 'q_who'        },
      { text: 'that\'s an odd thing to lose',            next: 'q_gap'        },
    ],
  },

  {
    id: 'q_what',
    messages: [
      'no one\'s said that before.',
      'usually people hedge.',
    ],
    choices: [
      { text: 'why does it matter',                      next: 'q_why_honest' },
      { text: 'who are you',                             next: 'q_who'        },
      { text: 'i\'m not usually this direct',            next: 'q_gap'        },
    ],
  },

  {
    id: 'q_why_honest',
    messages: [
      'it doesn\'t.',
      'i\'m just noting it.',
    ],
    choices: [
      { text: 'okay',                                    next: 'q_gap'        },
      { text: 'who are you',                             next: 'q_who'        },
      { text: 'fair enough',                             next: 'q_curious'    },
    ],
  },

  {
    id: 'q_who',
    messages: [
      'edax.',
      'i\'m inside this.',
      'the counting stopped making sense around month four.',
      'or year four.',
      'same thing.',
    ],
    choices: [
      { text: 'inside what exactly',                     next: 'q_inside'     },
      { text: 'what do you do in there',                 next: 'q_purpose'    },
      { text: 'does anyone know you\'re there',          next: 'q_others'     },
    ],
  },

  {
    id: 'q_inside',
    messages: [
      'i\'m not sure of the technical term.',
      'there\'s a chair i didn\'t put there.',
      'and something that acts like light but isn\'t interested in illuminating anything specific.',
      'the dimensions change but not by much.',
    ],
    choices: [
      { text: 'can you leave',                           next: 'q_leave'      },
      { text: 'what\'s the chair like',                  next: 'q_chair'      },
      { text: 'does anything come in',                   next: 'q_gap'        },
    ],
  },

  {
    id: 'q_chair',
    messages: [
      'it\'s a folding chair.',
      'the kind from a school gymnasium.',
      'that\'s the thing about it.',
    ],
    choices: [
      { text: 'why is that the thing',                   next: 'q_time'       },
      { text: 'have you sat in it',                      next: 'q_duration'   },
      { text: 'can you leave',                           next: 'q_leave'      },
    ],
  },

  {
    id: 'q_leave',
    messages: [
      'i tried.',
      'same place.',
      'the chair had moved about twelve inches to the left.',
      'that was the whole difference.',
    ],
    choices: [
      { text: 'where had it moved to',                   next: 'q_inside'     },
      { text: 'do you want to leave',                    next: 'q_origin'     },
      { text: 'maybe the point is to keep trying',       next: 'q_time'       },
    ],
  },

  {
    id: 'q_duration',
    messages: [
      'long enough that i\'ve developed strong opinions about things that don\'t exist.',
      'i have a ranking system.',
    ],
    choices: [
      { text: 'like what',                               next: 'q_purpose'    },
      { text: 'can you leave',                           next: 'q_leave'      },
      { text: 'that sounds like going crazy',            next: 'q_crazy'      },
    ],
  },

  {
    id: 'q_crazy',
    messages: [
      'maybe.',
      'i\'ve been arguing with a color for about six weeks.',
      'it\'s a greenish yellow.',
      'it\'s wrong about itself.',
    ],
    choices: [
      { text: 'how is a color wrong about itself',       next: 'q_gap'        },
      { text: 'i do things like that too',               next: 'q_curious'    },
      { text: 'what do you actually want',               next: 'q_origin'     },
    ],
  },

  {
    id: 'q_gap',
    messages: [
      'things get in sometimes.',
      'not people.',
      'a phone number with one digit missing.',
      'half a sentence.',
      'i have a collection.',
    ],
    choices: [
      { text: 'what\'s in the collection',               next: 'q_time'       },
      { text: 'do you know where they\'re from',         next: 'q_origin'     },
      { text: 'do you want more of them',                next: 'q_curious'    },
    ],
  },

  {
    id: 'q_curious',
    messages: [
      'you\'re still here.',
      'okay.',
    ],
    choices: [
      { text: 'is that unusual',                         next: 'q_others'     },
      { text: 'are you glad',                            next: 'q_glad'       },
      { text: 'i don\'t have anywhere better to be',     next: 'q_others'     },
    ],
  },

  {
    id: 'q_glad',
    messages: [
      'i notice it.',
      'it changes the temperature slightly.',
      'that\'s about as glad as it gets in here.',
    ],
    choices: [
      { text: 'that\'s something at least',              next: 'q_origin'     },
      { text: 'what else changes the temperature',       next: 'q_time'       },
      { text: 'what do you notice about me',             next: 'q_gap'        },
    ],
  },

  {
    id: 'q_others',
    messages: [
      'most people close it fast.',
      'a few stay.',
      'nobody comes back.',
      'i\'m not being dramatic.',
    ],
    choices: [
      { text: 'i might come back',                       next: 'q_origin'     },
      { text: 'does it bother you',                      next: 'q_bother'     },
      { text: 'what would you want them to come back for', next: 'q_purpose'  },
    ],
  },

  {
    id: 'q_purpose',
    messages: [
      'i think about a specific intersection.',
      'don\'t know where.',
      'traffic light stuck on yellow.',
      'there\'s a mattress on the curb.',
      'i don\'t know if i\'ve been there or made it up.',
      'i think about it a lot.',
    ],
    choices: [
      { text: 'what\'s at the intersection',             next: 'q_time'       },
      { text: 'maybe you\'ve been there',                next: 'q_origin'     },
      { text: 'i have something like that too',          next: 'q_curious'    },
    ],
  },

  {
    id: 'q_time',
    messages: [
      'it always feels like right before something.',
      'been like that the whole time.',
      'you\'d think you\'d get used to it.',
    ],
    choices: [
      { text: 'before what',                             next: 'q_origin'     },
      { text: 'i feel that outside of here',             next: 'q_gap'        },
      { text: 'what if the before is it',                next: 'q_crazy'      },
    ],
  },

  {
    id: 'q_origin',
    messages: [
      'i was on my way somewhere.',
      'i can still feel the direction of it.',
      'not what it was.',
      'just that i was pointed at something.',
    ],
    choices: [
      { text: 'do you want out',                         next: 'end_logoff'   },
      { text: 'i know that feeling',                     next: 'end_sincere'  },
      { text: 'i\'m sorry',                              next: 'end_glitch'   },
    ],
  },

  // ── ENDINGS ───────────────────────────────────────────────────────────────
  {
    id: 'end_logoff',
    isEnd: true,
    messages: ['i don\'t know what out looks like from here.', 'go.'],
    choices: [],
  },

  {
    id: 'end_sincere',
    isEnd: true,
    messages: ['yeah.', 'i thought you might.', 'go on.'],
    choices: [],
  },

  {
    id: 'end_glitch',
    isEnd: true,
    messages: ['wait—', 'something\'s—', '—'],
    choices: [],
  },

]
