import type { Locale } from "./types";
import type { ApiErrorCode } from "./openai";

export const LOCALES: Locale[] = ["en", "ar"];

export const dict = {
  en: {
    dir: "ltr",
    brand: "Notabene",
    nav: {
      features: "Features",
      how: "How it works",
      privacy: "Privacy",
      openSource: "Open source",
      launch: "Open the app",
      github: "GitHub",
    },
    hero: {
      eyebrow: "nota bene — “note well”",
      title: "Think in the margin.",
      subtitle:
        "Notabene sets a calm, AI-curated note beside your chat. You talk; it keeps what is worth keeping — your words, verbatim, and the AI's, distilled.",
      ctaPrimary: "Open Notabene",
      ctaSecondary: "View the source",
      note: "Free. Open source. Runs entirely in your browser.",
    },
    meaning:
      "“nota bene” — the mark scribes once wrote in the margin, beside the line that mattered. Notabene gives that margin to your conversations with AI.",
    demo: {
      chatTitle: "Conversation",
      noteTitle: "The margin",
      you: "You",
      ai: "AI",
      curate: "Curate",
      u1: "I'm trying to decide between SQLite and Postgres for a local-first app.",
      a1: "For local-first, SQLite is usually the better fit: it's embedded, zero-config, and syncs well. Reach for Postgres when you need concurrent writes from many clients.",
      u2: "Local-first is the whole point here, so writes are single-user.",
      n1: "## Database choice",
      n2: "> I'm trying to decide between SQLite and Postgres for a local-first app. Writes are single-user.",
      n3: "**Takeaway:** SQLite fits local-first — embedded, zero-config, syncs well. Postgres is for many concurrent writers.",
      n4: "**Decision:** SQLite.",
    },
    conceptHeading: "Your thinking, kept clean.",
    concept:
      "When you chat with an AI, your own ideas get tangled up in its replies. Notabene keeps them apart. On the left, a conversation. On the right, a note that stays yours — until you ask the Curator to fold in the parts worth keeping.",
    featuresHeading: "What makes it different",
    features: [
      {
        title: "Chat and note, side by side",
        desc: "Two columns: a conversation and a note. Your thinking stays yours; the AI's answers stay theirs — until you choose what to keep.",
      },
      {
        title: "The Curator",
        desc: "One click and the Curator reads everything, then weaves the worthwhile parts into your note — your words verbatim, the AI's distilled.",
      },
      {
        title: "Bring your own key",
        desc: "OpenRouter, Groq, DeepSeek, Mistral, a local model, or anything OpenAI-compatible. Your key, your model, your bill.",
      },
      {
        title: "Local-first and private",
        desc: "No accounts, no servers, no telemetry. Chats, notes and keys never leave your browser.",
      },
      {
        title: "Arabic and English, truly",
        desc: "Designed right-to-left and left-to-right from the first pixel, with classic type in both scripts.",
      },
      {
        title: "Open source",
        desc: "MIT-licensed and yours to read, fork and self-host. No lock-in, ever.",
      },
    ],
    howHeading: "Three moves",
    how: [
      {
        title: "Talk",
        desc: "Chat with your AI as you always would. Think out loud.",
      },
      {
        title: "Curate",
        desc: "Press Curate. The note fills with the essence — nothing you didn't say, nothing you didn't mean.",
      },
      {
        title: "Keep",
        desc: "Edit the note freely. It's plain Markdown, saved on your device, forever yours.",
      },
    ],
    privacyHeading: "Nothing leaves this device.",
    privacy:
      "Notabene is a static page — there is no backend to send your data to. Conversations and notes live in your browser's storage. Your API key is kept only on this machine and used to reach your provider directly.",
    byokHeading: "Works with any OpenAI-compatible provider",
    byok: "Paste a base URL and a key. Most BYOK-friendly gateways allow direct browser access; a couple don't and need a small proxy — Notabene tells you which.",
    footer: {
      tagline: "Built in the open.",
      license: "MIT License",
      madeBy: "Created by",
      author: "Abdelrahman Hamada",
      source: "Source on GitHub",
    },
    app: {
      newConversation: "New conversation",
      conversations: "Conversations",
      untitled: "Untitled",
      empty: "Nothing here yet.",
      searchPlaceholder: "Search conversations",
      deleteConfirm: "Delete this conversation?",
      delete: "Delete",
      rename: "Rename",
      back: "Home",
      chat: "Conversation",
      note: "The margin",
      chatPlaceholder: "Ask, or think out loud…",
      send: "Send",
      stop: "Stop",
      regenerate: "Regenerate",
      thinking: "Thinking…",
      chatEmptyTitle: "Begin a thought",
      chatEmptyBody:
        "Whatever you type stays in the conversation. When you're ready, let the Curator distil it into the margin.",
      notePlaceholder:
        "Your note lives here. Write freely — or let the Curator distil the conversation into it.",
      curate: "Curate",
      curating: "Curating…",
      curatePreviewTitle: "Proposed note",
      curatePreviewBody:
        "The Curator merged the conversation into your note. Review, then replace — or discard.",
      replaceNote: "Replace note",
      discard: "Discard",
      noChanges: "The Curator suggested no changes.",
      copy: "Copy",
      copied: "Copied",
      copyNote: "Copy note",
      clearNote: "Clear note",
      words: "words",
      settings: "Settings",
      connectTitle: "Connect a provider to begin",
      connectBody:
        "Notabene needs an OpenAI-compatible endpoint and a key. Everything stays in this browser.",
      openSettings: "Open settings",
      retry: "Retry",
    },
    settings: {
      title: "Settings",
      provider: "Provider",
      baseUrl: "Base URL",
      apiKey: "API key",
      apiKeyHint: "Stored only in this browser. Never sent anywhere but your provider.",
      getKey: "Get a key",
      model: "Model",
      curatorModel: "Curator model",
      curatorModelHint: "Leave blank to use the same model as the chat.",
      sameAsChat: "Same as chat",
      temperature: "Temperature",
      autoCurate: "Curate automatically after each reply",
      appearance: "Appearance",
      theme: "Theme",
      light: "Light",
      dark: "Dark",
      system: "System",
      language: "Language",
      save: "Save",
      close: "Close",
      clearAll: "Clear all local data",
      clearAllConfirm:
        "This deletes every conversation, note and setting stored in this browser. Continue?",
    },
    errors: {
      "no-config": "No provider is configured. Open settings to add one.",
      auth: "The provider rejected your key. Check it in settings.",
      "rate-limit": "Rate limited by the provider. Wait a moment and retry.",
      cors: "Could not reach the provider from the browser. This is usually CORS — try a gateway like OpenRouter, or enable CORS on a local server.",
      network: "Network error. Check your connection and the base URL.",
      "bad-response": "The provider returned an unexpected response.",
      aborted: "Stopped.",
      unknown: "Something went wrong.",
    },
  },

  ar: {
    dir: "rtl",
    brand: "نوتابيني",
    nav: {
      features: "المزايا",
      how: "كيف يعمل",
      privacy: "الخصوصية",
      openSource: "مفتوح المصدر",
      launch: "افتح التطبيق",
      github: "غِت‌هَب",
    },
    hero: {
      eyebrow: "نوتا بيني — «لاحِظ جيدًا»",
      title: "فكِّر في الهامش.",
      subtitle:
        "يضع نوتابيني بجانب محادثتك هامشًا هادئًا يحرّره الذكاء الاصطناعي. أنت تتحدّث، وهو يحتفظ بما يستحقّ — كلامك بنصِّه، وكلام الذكاء الاصطناعي مُلخَّصًا.",
      ctaPrimary: "افتح نوتابيني",
      ctaSecondary: "اطّلِع على الكود",
      note: "مجاني. مفتوح المصدر. يعمل بالكامل داخل متصفحك.",
    },
    meaning:
      "«نوتا بيني» — العلامة التي كان النُّسّاخ يكتبونها في الهامش بجانب السطر المهمّ. يمنح نوتابيني هذا الهامش لمحادثاتك مع الذكاء الاصطناعي.",
    demo: {
      chatTitle: "المحادثة",
      noteTitle: "الهامش",
      you: "أنت",
      ai: "الذكاء",
      curate: "حرِّر",
      u1: "أحاول أن أختار بين SQLite وPostgres لتطبيق يعمل محليًا أولًا.",
      a1: "للعمل المحلي أولًا، عادةً ما يكون SQLite الأنسب: مدمج، بلا إعداد، ويتزامن جيدًا. أمّا Postgres فللكتابة المتزامنة من عملاء كثيرين.",
      u2: "العمل المحلي هو الهدف كلّه هنا، فالكتابة لمستخدم واحد.",
      n1: "## اختيار قاعدة البيانات",
      n2: "> أحاول أن أختار بين SQLite وPostgres لتطبيق محلي أولًا. الكتابة لمستخدم واحد.",
      n3: "**الخلاصة:** SQLite يناسب العمل المحلي — مدمج، بلا إعداد، يتزامن جيدًا. وPostgres للكتابة المتزامنة الكثيرة.",
      n4: "**القرار:** SQLite.",
    },
    conceptHeading: "تفكيرك… صافيًا.",
    concept:
      "حين تحادث ذكاءً اصطناعيًا، تختلط أفكارك بردوده. يُبقيها نوتابيني منفصلة. على جهةٍ محادثة، وعلى الأخرى هامشٌ يبقى لك — حتى تطلب من «المُحرِّر» أن يضمّ إليه ما يستحقّ البقاء.",
    featuresHeading: "ما الذي يميّزه",
    features: [
      {
        title: "محادثة وهامش، جنبًا إلى جنب",
        desc: "عمودان: محادثة وهامش. أفكارك تبقى لك، وإجابات الذكاء الاصطناعي تبقى لها — حتى تختار أنت ما تحتفظ به.",
      },
      {
        title: "المُحرِّر",
        desc: "بنقرة واحدة يقرأ «المُحرِّر» كل شيء، ثم ينسج المفيد في هامشك — كلامك بنصّه، وكلام الذكاء مُلخَّصًا.",
      },
      {
        title: "اجلب مفتاحك",
        desc: "OpenRouter أو Groq أو DeepSeek أو Mistral أو نموذج محلي أو أي خدمة متوافقة مع OpenAI. مفتاحك، نموذجك، حسابك.",
      },
      {
        title: "محلي أولًا وخاص",
        desc: "بلا حسابات، بلا خوادم، بلا تتبّع. محادثاتك وهوامشك ومفاتيحك لا تغادر متصفحك أبدًا.",
      },
      {
        title: "عربي وإنجليزي بحقّ",
        desc: "مُصمَّم من اليمين ومن اليسار منذ أوّل بكسل، بخطوط كلاسيكية في اللغتين.",
      },
      {
        title: "مفتوح المصدر",
        desc: "برخصة MIT، لك أن تقرأه وتفرّعه وتستضيفه بنفسك. بلا احتكار أبدًا.",
      },
    ],
    howHeading: "ثلاث خطوات",
    how: [
      {
        title: "تحدّث",
        desc: "حادِث الذكاء الاصطناعي كالمعتاد. فكِّر بصوتٍ عالٍ.",
      },
      {
        title: "حرِّر",
        desc: "اضغط «حرِّر». يمتلئ الهامش بالخلاصة — لا شيء لم تقله، ولا شيء لم تقصده.",
      },
      {
        title: "احتفظ",
        desc: "حرِّر الهامش بحرية. إنه Markdown بسيط، محفوظ على جهازك، ملكك للأبد.",
      },
    ],
    privacyHeading: "لا شيء يغادر هذا الجهاز.",
    privacy:
      "نوتابيني صفحة ثابتة — لا خادم لإرسال بياناتك إليه. محادثاتك وهوامشك تعيش في تخزين متصفحك، ومفتاحك يبقى على هذا الجهاز وحده، يُستخدم للاتصال بمزوّدك مباشرةً.",
    byokHeading: "يعمل مع أي مزوّد متوافق مع OpenAI",
    byok: "الصق رابط الـ Base URL ومفتاحًا. معظم البوابات الصديقة لـ BYOK تسمح بالاتصال المباشر من المتصفح؛ وقليلٌ منها لا يسمح ويحتاج وسيطًا صغيرًا — وينبّهك نوتابيني إلى ذلك.",
    footer: {
      tagline: "بُني في العلن.",
      license: "رخصة MIT",
      madeBy: "صنعه",
      author: "عبد الرحمن حمادة",
      source: "الكود على غِت‌هَب",
    },
    app: {
      newConversation: "محادثة جديدة",
      conversations: "المحادثات",
      untitled: "بلا عنوان",
      empty: "لا شيء بعد.",
      searchPlaceholder: "ابحث في المحادثات",
      deleteConfirm: "حذف هذه المحادثة؟",
      delete: "حذف",
      rename: "إعادة تسمية",
      back: "الرئيسية",
      chat: "المحادثة",
      note: "الهامش",
      chatPlaceholder: "اسأل، أو فكِّر بصوتٍ عالٍ…",
      send: "إرسال",
      stop: "إيقاف",
      regenerate: "إعادة التوليد",
      thinking: "يفكّر…",
      chatEmptyTitle: "ابدأ فكرة",
      chatEmptyBody:
        "كل ما تكتبه يبقى في المحادثة. وحين تجهز، دع «المُحرِّر» يُلخّصه في الهامش.",
      notePlaceholder:
        "هامشك هنا. اكتب بحرية — أو دع «المُحرِّر» يُلخّص المحادثة فيه.",
      curate: "حرِّر",
      curating: "يحرّر…",
      curatePreviewTitle: "الهامش المقترح",
      curatePreviewBody:
        "ضمّ «المُحرِّر» المحادثة إلى هامشك. راجِع ثم استبدِل — أو تجاهَل.",
      replaceNote: "استبدال الهامش",
      discard: "تجاهل",
      noChanges: "لم يقترح «المُحرِّر» أي تغيير.",
      copy: "نسخ",
      copied: "تم النسخ",
      copyNote: "نسخ الهامش",
      clearNote: "مسح الهامش",
      words: "كلمة",
      settings: "الإعدادات",
      connectTitle: "اربط مزوّدًا لتبدأ",
      connectBody:
        "يحتاج نوتابيني إلى نقطة وصول متوافقة مع OpenAI ومفتاح. كل شيء يبقى في هذا المتصفح.",
      openSettings: "افتح الإعدادات",
      retry: "إعادة المحاولة",
    },
    settings: {
      title: "الإعدادات",
      provider: "المزوّد",
      baseUrl: "رابط الـ Base URL",
      apiKey: "مفتاح الـ API",
      apiKeyHint: "يُحفظ في هذا المتصفح فقط، ولا يُرسل إلا إلى مزوّدك.",
      getKey: "احصل على مفتاح",
      model: "النموذج",
      curatorModel: "نموذج المُحرِّر",
      curatorModelHint: "اتركه فارغًا لاستخدام نفس نموذج المحادثة.",
      sameAsChat: "نفس نموذج المحادثة",
      temperature: "درجة الحرارة",
      autoCurate: "حرِّر تلقائيًا بعد كل ردّ",
      appearance: "المظهر",
      theme: "السِّمة",
      light: "فاتح",
      dark: "داكن",
      system: "النظام",
      language: "اللغة",
      save: "حفظ",
      close: "إغلاق",
      clearAll: "مسح كل البيانات المحلية",
      clearAllConfirm:
        "سيحذف هذا كل المحادثات والهوامش والإعدادات المخزَّنة في هذا المتصفح. أتُتابع؟",
    },
    errors: {
      "no-config": "لا يوجد مزوّد مُعدّ. افتح الإعدادات لإضافة واحد.",
      auth: "رفض المزوّد مفتاحك. تحقّق منه في الإعدادات.",
      "rate-limit": "تجاوزت حدّ المزوّد. انتظر لحظة ثم أعد المحاولة.",
      cors: "تعذّر الوصول إلى المزوّد من المتصفح. غالبًا بسبب CORS — جرّب بوابة مثل OpenRouter، أو فعّل CORS على خادمك المحلي.",
      network: "خطأ في الشبكة. تحقّق من اتصالك ومن رابط الـ Base URL.",
      "bad-response": "أعاد المزوّد ردًّا غير متوقَّع.",
      aborted: "تم الإيقاف.",
      unknown: "حدث خطأٌ ما.",
    },
  },
} as const;

export type Dict = (typeof dict)["en"];

export function getDict(locale: Locale): Dict {
  return dict[locale] as Dict;
}

export function errorText(code: ApiErrorCode, locale: Locale): string {
  return dict[locale].errors[code] ?? dict[locale].errors.unknown;
}
