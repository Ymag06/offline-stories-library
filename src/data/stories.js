export const categories = [
  { id: 'all', label: { en: 'All stories', my: 'ပုံပြင်အားလုံး' } },
  { id: 'nature', label: { en: 'Nature', my: 'သဘာဝ' }, icon: '🌿', art: 'nature', hint: { en: 'Animals, plants, and outdoor wonders.', my: 'တိရစ္ဆာန်၊ အပင်နှင့် သဘာဝအံ့ဖွယ်များအကြောင်း။' } },
  { id: 'adventure', label: { en: 'Adventure', my: 'စွန့်စားခန်း' }, icon: '🧭', art: 'adventure', hint: { en: 'Set off on a small, exciting journey.', my: 'စိတ်လှုပ်ရှားဖွယ် ခရီးလေးတစ်ခုကို စတင်လိုက်ပါ။' } },
  { id: 'friendship', label: { en: 'Friendship', my: 'မိတ်ဆွေများ' }, icon: '♡', art: 'friendship', hint: { en: 'Meet kind friends and solve things together.', my: 'မိတ်ဆွေကောင်းများနှင့် တွေ့ဆုံပြီး အတူတကွ ဖြေရှင်းကြပါ။' } },
  { id: 'learning', label: { en: 'Learning', my: 'လေ့လာသင်ယူခြင်း' }, icon: '✦', art: 'learning', hint: { en: 'Discover a new idea in every story.', my: 'ပုံပြင်တစ်ပုဒ်စီမှ စိတ်ကူးအသစ်များကို ရှာဖွေပါ။' } },
]

export const stories = [
  {
    id: 'moon-garden',
    title: { en: 'The Moon Garden', my: 'လရောင်ဥယျာဉ်' },
    description: {
      en: 'A curious fox discovers a tiny garden that glows after sunset.',
      my: 'စူးစမ်းတတ်သော မြေခွေးလေးတစ်ကောင်က နေဝင်ပြီးနောက် လင်းလက်လာသော ဥယျာဉ်လေးကို တွေ့ရှိသည်။',
    },
    category: 'nature',
    minutes: 5,
    icon: '🌙',
    art: 'moon',
    featured: true,
  },
  {
    id: 'paper-boat',
    title: { en: 'Milo and the Paper Boat', my: 'မိုင်လိုနှင့် စက္ကူလှေလေး' },
    description: {
      en: 'One rainy afternoon, a paper boat carries Milo on a gentle adventure.',
      my: 'မိုးရွာသောနေ့လယ်ခင်းတစ်ခုတွင် စက္ကူလှေလေးက မိုင်လိုကို ပျော်စရာစွန့်စားခန်းဆီ ခေါ်ဆောင်သွားသည်။',
    },
    category: 'adventure',
    minutes: 7,
    icon: '⛵',
    art: 'boat',
    featured: true,
  },
  {
    id: 'bright-kite',
    title: { en: "Nila's Bright Kite", my: 'နီလာ၏ ရောင်စုံစွန်လေး' },
    description: {
      en: 'Nila and her neighbors work together to bring a kite back from a tall tree.',
      my: 'နီလာနှင့် အိမ်နီးချင်းများက သစ်ပင်မြင့်ပေါ်မှ စွန်လေးကို ပြန်ရရန် အတူတကွ ကြိုးစားကြသည်။',
    },
    category: 'friendship',
    minutes: 6,
    icon: '🪁',
    art: 'kite',
    featured: true,
  },
  {
    id: 'little-seed',
    title: { en: 'A Very Little Seed', my: 'မျိုးစေ့လေးတစ်စေ့' },
    description: {
      en: 'A small seed learns that growing takes patience, sunlight, and a little help.',
      my: 'မျိုးစေ့သေးသေးလေးက ကြီးထွားရန် စိတ်ရှည်မှု၊ နေရောင်ခြည်နှင့် အကူအညီအနည်းငယ် လိုအပ်ကြောင်း သိလာသည်။',
    },
    category: 'learning',
    minutes: 4,
    icon: '🌱',
    art: 'seed',
    featured: false,
  },
]

