import { useState } from "react";
import Icon from "@/components/ui/icon";

type Section = "home" | "methods" | "cases" | "wizard" | "shina";

const NAV_ITEMS = [
  { id: "home" as Section, label: "Главная" },
  { id: "methods" as Section, label: "Методы" },
  { id: "cases" as Section, label: "Кейсы" },
  { id: "shina" as Section, label: "1С:Шина" },
];

const METHODS = [
  {
    code: "COM",
    name: "COM-соединение",
    desc: "Прямое подключение к базе 1С через COM-объект. Работает только в локальной сети.",
    pros: ["Высокая скорость", "Полный доступ к объектам 1С", "Без доп. лицензий"],
    cons: ["Только Windows", "Требует доступ к серверу", "Зависимость от версий"],
    speed: 95,
    difficulty: 60,
    tags: ["Локальная сеть", "Windows", "Синхронно"],
  },
  {
    code: "HTTP",
    name: "HTTP-сервисы 1С",
    desc: "Встроенный REST/SOAP механизм публикации сервисов через веб-сервер на платформе 1С.",
    pros: ["Кроссплатформенность", "Стандартный HTTP", "Гибкая авторизация"],
    cons: ["Требует настройки IIS/Apache", "Нагрузка на сервер 1С", "Лицензия веб-сервиса"],
    speed: 70,
    difficulty: 45,
    tags: ["Интернет", "REST/SOAP", "Универсально"],
  },
  {
    code: "ODATA",
    name: "OData-протокол",
    desc: "Автоматически генерируемый REST API для объектов конфигурации 1С без программирования.",
    pros: ["Без доработок 1С", "Стандарт OData v3/v4", "Быстрый старт"],
    cons: ["Ограниченная фильтрация", "Не все объекты доступны", "Нет транзакций"],
    speed: 65,
    difficulty: 30,
    tags: ["REST", "Без доработок", "Быстрый старт"],
  },
  {
    code: "ШИНА",
    name: "1С:Шина",
    desc: "Продукт фирмы «1С» для надёжного асинхронного обмена данными между базами 1С и внешними системами без сторонних брокеров.",
    pros: ["Нативная интеграция с платформой 1С", "Гарантированная доставка сообщений", "Единый мониторинг и журнал обмена"],
    cons: ["Отдельная лицензия 1С:Шина", "Требует выделенного сервера", "Оптимален только в экосистеме 1С"],
    speed: 55,
    difficulty: 50,
    tags: ["1С:Шина", "Асинхронно", "Без сторонних брокеров"],
  },
  {
    code: "HTTPREQ",
    name: "HTTP-запросы из 1С",
    desc: "Исходящие HTTP/HTTPS запросы из кода 1С к внешним REST/SOAP API с помощью объекта HTTPСоединение.",
    pros: ["Встроен в платформу", "Гибкость запросов", "Без внешних компонент"],
    cons: ["Только исходящие запросы", "Нет очереди повторов", "Блокирует транзакцию"],
    speed: 75,
    difficulty: 35,
    tags: ["REST/SOAP", "Исходящий", "Встроено"],
  },
  {
    code: "DB",
    name: "Прямой доступ к БД",
    desc: "Чтение данных напрямую из СУБД (MS SQL, PostgreSQL). Только для чтения — запись опасна.",
    pros: ["Максимальная скорость", "Сложные SQL-запросы", "Без лицензий 1С"],
    cons: ["Не поддерживается 1С", "Риск повреждения данных", "Привязка к СУБД"],
    speed: 100,
    difficulty: 90,
    tags: ["Только чтение", "SQL", "Опасно"],
  },
  {
    code: "FILE",
    name: "Файловый обмен",
    desc: "Обмен через XML/JSON/CSV файлы в общей папке или через FTP. Классический подход.",
    pros: ["Простота", "Надёжность", "Независимость систем"],
    cons: ["Задержки", "Нет реального времени", "Ручное управление ошибками"],
    speed: 30,
    difficulty: 20,
    tags: ["XML/JSON", "Надёжно", "Просто"],
  },
];

const CASES = [
  {
    num: "01",
    title: "Розничная сеть → маркетплейс",
    company: "ООО «Ромашка»",
    challenge: "Синхронизация остатков из 1С:Розница в Wildberries каждые 15 минут",
    solution: "HTTP-сервис 1С + планировщик задач",
    method: "HTTP",
    result: "Расхождение остатков снизилось с 23% до 0,4%",
    time: "3 недели",
  },
  {
    num: "02",
    title: "Производство → ERP",
    company: "Завод «Метиз»",
    challenge: "Передача производственных заданий из SAP в 1С:Управление производством",
    solution: "1С:Шина — асинхронная очередь между SAP и 1С",
    method: "ШИНА",
    result: "Исключён ручной ввод 400+ документов в день",
    time: "2 месяца",
  },
  {
    num: "03",
    title: "CRM → бухгалтерия",
    company: "Агентство «Прайм»",
    challenge: "Автоматическая выгрузка сделок из amoCRM в 1С:Бухгалтерию",
    solution: "OData + вебхуки amoCRM",
    method: "ODATA",
    result: "Счета формируются автоматически за 30 секунд",
    time: "5 дней",
  },
  {
    num: "04",
    title: "Интернет-магазин → склад",
    company: "ИП Соколов",
    challenge: "Загрузка заказов с сайта на Bitrix в 1С:Торговля",
    solution: "Файловый обмен через XML + CommerceML",
    method: "FILE",
    result: "Полная автоматизация обработки 200 заказов/день",
    time: "1 неделя",
  },
];

const METHOD_COLORS: Record<string, string> = {
  COM: "bg-foreground text-background",
  HTTP: "bg-accent text-white",
  ODATA: "bg-foreground text-background",
  ШИНА: "bg-accent text-white",
  HTTPREQ: "bg-foreground text-background",
  DB: "bg-foreground text-background",
  FILE: "bg-foreground text-background",
};

const WIZARD_QUESTIONS = [
  {
    id: "network",
    question: "Где находятся системы?",
    options: [
      { value: "local", label: "В локальной сети", icon: "Building2" },
      { value: "internet", label: "Через интернет", icon: "Globe" },
      { value: "mixed", label: "Смешанно", icon: "Network" },
    ],
  },
  {
    id: "direction",
    question: "Направление обмена?",
    options: [
      { value: "from1c", label: "Из 1С во внешнюю систему", icon: "ArrowRight" },
      { value: "to1c", label: "Внешняя система → в 1С", icon: "ArrowLeft" },
      { value: "both", label: "Двусторонний обмен", icon: "ArrowLeftRight" },
    ],
  },
  {
    id: "speed",
    question: "Требования к скорости обмена?",
    options: [
      { value: "realtime", label: "Реальное время (менее 1 сек)", icon: "Zap" },
      { value: "minutes", label: "Допустима задержка 1–15 мин", icon: "Clock" },
      { value: "batch", label: "Пакетная загрузка (часы/дни)", icon: "Package" },
    ],
  },
  {
    id: "dev",
    question: "Ресурсы разработки в 1С?",
    options: [
      { value: "none", label: "Нет программиста 1С", icon: "UserX" },
      { value: "basic", label: "Базовые знания", icon: "User" },
      { value: "expert", label: "Опытный разработчик", icon: "UserCheck" },
    ],
  },
];

function getRecommendation(answers: Record<string, string>): string[] {
  const { network, direction, speed, dev } = answers;
  if (dev === "none" && speed !== "realtime") return ["ODATA", "FILE"];
  if (network === "local" && dev === "expert" && speed === "realtime") return ["COM", "HTTP"];
  if (speed === "realtime" && network !== "local") return ["HTTPREQ", "HTTP"];
  if (speed === "batch") return ["FILE", "ШИНА"];
  if (direction === "both" && speed !== "batch") return ["ШИНА", "HTTPREQ"];
  if (network === "local") return ["COM", "HTTP"];
  return ["HTTPREQ", "ODATA"];
}

export default function Index() {
  const [section, setSection] = useState<Section>("home");
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardAnswers, setWizardAnswers] = useState<Record<string, string>>({});
  const [wizardDone, setWizardDone] = useState(false);
  const [expandedMethod, setExpandedMethod] = useState<string | null>(null);

  const handleWizardAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...wizardAnswers, [questionId]: value };
    setWizardAnswers(newAnswers);
    if (wizardStep < WIZARD_QUESTIONS.length - 1) {
      setWizardStep(wizardStep + 1);
    } else {
      setWizardDone(true);
    }
  };

  const resetWizard = () => {
    setWizardStep(0);
    setWizardAnswers({});
    setWizardDone(false);
  };

  const recommendations = wizardDone ? getRecommendation(wizardAnswers) : [];

  return (
    <div className="min-h-screen bg-background">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-foreground flex items-center justify-center">
              <span className="font-mono text-background text-[10px] font-bold">1С</span>
            </div>
            <span className="font-semibold text-sm tracking-tight">Интеграции</span>
          </div>

          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                  section === item.id
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => setSection("wizard")}
              className={`ml-2 px-4 py-1.5 text-sm font-medium border transition-colors ${
                section === "wizard"
                  ? "bg-accent text-white border-accent"
                  : "border-foreground text-foreground hover:bg-foreground hover:text-background"
              }`}
            >
              Подобрать метод
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-14">
        {/* HOME */}
        {section === "home" && (
          <div>
            <section className="relative min-h-[90vh] flex items-center overflow-hidden grid-bg">
              <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/40" />
              <div className="relative max-w-6xl mx-auto px-6 py-24 w-full">
                <div className="max-w-3xl">
                  <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-6 animate-fade-up">
                    Платформа выбора интеграций
                  </p>
                  <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-[0.95] tracking-tight text-foreground mb-6 animate-fade-up delay-100">
                    Какой метод<br />
                    интеграции<br />
                    <span className="relative inline-block">
                      выбрать
                      <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-accent" />
                    </span>
                    {" "}для 1С?
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-xl animate-fade-up delay-200">
                    Сравните 6 методов, изучите реальные кейсы и пройдите алгоритм подбора — за 2 минуты найдёте оптимальное решение.
                  </p>
                  <div className="flex gap-3 mt-10 animate-fade-up delay-300">
                    <button
                      onClick={() => setSection("wizard")}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-semibold text-sm hover:bg-foreground/80 transition-colors"
                    >
                      <Icon name="ArrowRight" size={16} />
                      Подобрать метод
                    </button>
                    <button
                      onClick={() => setSection("methods")}
                      className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground font-semibold text-sm hover:border-foreground transition-colors"
                    >
                      Сравнить методы
                    </button>
                  </div>
                </div>

                <div className="mt-20 grid grid-cols-3 gap-px border border-border animate-fade-up delay-400">
                  {[
                    { n: "6", label: "методов интеграции" },
                    { n: "4", label: "реальных кейса" },
                    { n: "2 мин", label: "на подбор решения" },
                  ].map((s, i) => (
                    <div key={i} className="bg-background px-8 py-6">
                      <div className="font-black text-3xl text-foreground">{s.n}</div>
                      <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="max-w-6xl mx-auto px-6 py-20">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-2">Методы</p>
                  <h2 className="text-3xl font-black tracking-tight">Способы подключения</h2>
                </div>
                <button
                  onClick={() => setSection("methods")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  Все методы <Icon name="ArrowRight" size={14} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-px border border-border bg-border">
                {METHODS.slice(0, 3).map((m) => (
                  <div key={m.code} className="bg-background p-6 hover:bg-secondary/50 transition-colors">
                    <span className="font-mono text-xs font-bold text-accent">{m.code}</span>
                    <h3 className="font-bold text-base mt-2 mb-2">{m.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{m.desc}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="flex-1 h-1 bg-border">
                        <div className="h-1 bg-foreground" style={{ width: `${m.speed}%` }} />
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">{m.speed}%</span>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground mt-1">скорость</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-border">
              <div className="max-w-6xl mx-auto px-6 py-20 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black tracking-tight mb-2">Не знаете с чего начать?</h2>
                  <p className="text-muted-foreground">Ответьте на 4 вопроса — алгоритм подберёт оптимальный метод</p>
                </div>
                <button
                  onClick={() => setSection("wizard")}
                  className="flex-shrink-0 inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-bold text-sm hover:bg-accent/90 transition-colors"
                >
                  Запустить алгоритм
                  <Icon name="Sparkles" size={16} />
                </button>
              </div>
            </section>
          </div>
        )}

        {/* METHODS */}
        {section === "methods" && (
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="mb-12">
              <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-3">Сравнение</p>
              <h1 className="text-4xl font-black tracking-tight mb-4">Методы интеграции 1С</h1>
              <p className="text-muted-foreground max-w-xl">
                Подробный разбор каждого метода с оценкой скорости, сложности и применимости.
              </p>
            </div>

            <div className="hidden md:grid grid-cols-[200px_1fr_80px_80px] gap-px mb-1">
              {["Метод", "Описание", "Скорость", "Сложность"].map((h) => (
                <div key={h} className="font-mono text-xs text-muted-foreground uppercase px-4 py-2">{h}</div>
              ))}
            </div>

            <div className="border border-border divide-y divide-border">
              {METHODS.map((m) => (
                <div key={m.code}>
                  <button
                    className="w-full text-left"
                    onClick={() => setExpandedMethod(expandedMethod === m.code ? null : m.code)}
                  >
                    <div className="grid md:grid-cols-[200px_1fr_80px_80px] gap-px items-center px-4 py-4 hover:bg-secondary/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className={`font-mono text-xs font-bold px-2 py-0.5 ${METHOD_COLORS[m.code]}`}>
                          {m.code}
                        </span>
                        <span className="font-semibold text-sm">{m.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground hidden md:block pr-4">{m.desc}</p>
                      <div className="hidden md:flex flex-col items-center gap-1">
                        <div className="w-full h-1.5 bg-border">
                          <div className="h-1.5 bg-foreground" style={{ width: `${m.speed}%` }} />
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">{m.speed}%</span>
                      </div>
                      <div className="hidden md:flex flex-col items-center gap-1">
                        <div className="w-full h-1.5 bg-border">
                          <div className="h-1.5 bg-accent" style={{ width: `${m.difficulty}%` }} />
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">{m.difficulty}%</span>
                      </div>
                    </div>
                  </button>

                  {expandedMethod === m.code && (
                    <div className="px-4 pb-6 bg-secondary/20 animate-fade-in">
                      <div className="md:hidden mb-4 pt-4">
                        <p className="text-sm text-muted-foreground">{m.desc}</p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6 pt-4">
                        <div>
                          <p className="font-mono text-xs text-muted-foreground uppercase mb-3">Преимущества</p>
                          <ul className="space-y-2">
                            {m.pros.map((p) => (
                              <li key={p} className="flex items-start gap-2 text-sm">
                                <Icon name="Check" size={14} className="text-foreground mt-0.5 flex-shrink-0" />
                                {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-mono text-xs text-muted-foreground uppercase mb-3">Ограничения</p>
                          <ul className="space-y-2">
                            {m.cons.map((c) => (
                              <li key={c} className="flex items-start gap-2 text-sm">
                                <Icon name="X" size={14} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {m.tags.map((t) => (
                          <span key={t} className="font-mono text-xs px-2 py-0.5 border border-border text-muted-foreground">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 border border-border bg-secondary/20 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm mb-1">Не можете выбрать?</p>
                <p className="text-sm text-muted-foreground">Алгоритм учтёт ваши условия и даст конкретный ответ</p>
              </div>
              <button
                onClick={() => setSection("wizard")}
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background font-semibold text-sm hover:bg-foreground/80 transition-colors"
              >
                Подобрать метод <Icon name="ArrowRight" size={14} />
              </button>
            </div>
          </div>
        )}

        {/* CASES */}
        {section === "cases" && (
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="mb-12">
              <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-3">Практика</p>
              <h1 className="text-4xl font-black tracking-tight mb-4">Реальные кейсы</h1>
              <p className="text-muted-foreground max-w-xl">
                Как конкретные компании решили задачи интеграции с 1С — метод, сроки, результат.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-px border border-border bg-border">
              {CASES.map((c) => (
                <div key={c.num} className="bg-background p-8 flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <span className="font-mono text-5xl font-black text-border leading-none">{c.num}</span>
                    <span className={`font-mono text-xs font-bold px-2 py-0.5 ${METHOD_COLORS[c.method]}`}>
                      {c.method}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg leading-snug mb-1">{c.title}</h3>
                  <p className="font-mono text-xs text-muted-foreground mb-5">{c.company}</p>

                  <div className="space-y-4 flex-1">
                    <div>
                      <p className="font-mono text-xs text-muted-foreground uppercase mb-1">Задача</p>
                      <p className="text-sm leading-relaxed">{c.challenge}</p>
                    </div>
                    <div>
                      <p className="font-mono text-xs text-muted-foreground uppercase mb-1">Решение</p>
                      <p className="text-sm leading-relaxed">{c.solution}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
                    <div>
                      <p className="font-mono text-xs text-muted-foreground mb-0.5">Результат</p>
                      <p className="text-sm font-semibold">{c.result}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs text-muted-foreground mb-0.5">Срок</p>
                      <p className="font-mono text-sm font-bold">{c.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WIZARD */}
        {section === "wizard" && (
          <div className="max-w-3xl mx-auto px-6 py-16">
            <div className="mb-12">
              <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-3">Алгоритм подбора</p>
              <h1 className="text-4xl font-black tracking-tight mb-4">Выбор метода интеграции</h1>
              <p className="text-muted-foreground">Ответьте на 4 вопроса — получите персональную рекомендацию.</p>
            </div>

            {!wizardDone ? (
              <div>
                <div className="flex items-center gap-2 mb-10">
                  {WIZARD_QUESTIONS.map((q, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 flex items-center justify-center font-mono text-xs font-bold transition-all ${
                          i < wizardStep
                            ? "bg-foreground text-background"
                            : i === wizardStep
                            ? "bg-accent text-white"
                            : "border border-border text-muted-foreground"
                        }`}
                      >
                        {i < wizardStep ? <Icon name="Check" size={12} /> : i + 1}
                      </div>
                      {i < WIZARD_QUESTIONS.length - 1 && (
                        <div className={`h-px w-8 ${i < wizardStep ? "bg-foreground" : "bg-border"}`} />
                      )}
                    </div>
                  ))}
                  <span className="ml-4 font-mono text-xs text-muted-foreground">
                    {wizardStep + 1} / {WIZARD_QUESTIONS.length}
                  </span>
                </div>

                <div className="animate-fade-up" key={wizardStep}>
                  <h2 className="text-2xl font-bold mb-8">{WIZARD_QUESTIONS[wizardStep].question}</h2>
                  <div className="grid gap-3">
                    {WIZARD_QUESTIONS[wizardStep].options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleWizardAnswer(WIZARD_QUESTIONS[wizardStep].id, opt.value)}
                        className="flex items-center gap-4 p-5 border border-border hover:border-foreground hover:bg-secondary/40 transition-all text-left group"
                      >
                        <div className="w-10 h-10 border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-all flex-shrink-0">
                          <Icon name={opt.icon} size={18} fallback="Circle" />
                        </div>
                        <span className="font-medium">{opt.label}</span>
                        <Icon name="ArrowRight" size={16} className="ml-auto text-muted-foreground group-hover:text-foreground transition-colors" />
                      </button>
                    ))}
                  </div>

                  {wizardStep > 0 && (
                    <button
                      onClick={() => setWizardStep(wizardStep - 1)}
                      className="mt-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Icon name="ChevronLeft" size={14} />
                      Назад
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="animate-fade-up">
                <div className="flex items-center gap-3 mb-8 p-4 border border-accent/30 bg-accent/5">
                  <Icon name="Sparkles" size={20} className="text-accent flex-shrink-0" />
                  <p className="text-sm font-medium">
                    Рекомендуем {recommendations.length > 1 ? "методы" : "метод"}:{" "}
                    <strong>{recommendations.join(" или ")}</strong>
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {recommendations.map((code) => {
                    const m = METHODS.find((x) => x.code === code)!;
                    return (
                      <div key={code} className="border-2 border-foreground p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`font-mono text-xs font-bold px-2 py-0.5 ${METHOD_COLORS[code]}`}>
                            {code}
                          </span>
                          <h3 className="font-bold text-lg">{m.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{m.desc}</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="font-mono text-xs text-muted-foreground uppercase mb-2">Плюсы</p>
                            <ul className="space-y-1">
                              {m.pros.map((p) => (
                                <li key={p} className="text-sm flex items-center gap-1.5">
                                  <Icon name="Check" size={12} className="text-foreground flex-shrink-0" />
                                  {p}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="font-mono text-xs text-muted-foreground uppercase mb-2">Учтите</p>
                            <ul className="space-y-1">
                              {m.cons.slice(0, 2).map((c) => (
                                <li key={c} className="text-sm flex items-center gap-1.5">
                                  <Icon name="AlertCircle" size={12} className="text-muted-foreground flex-shrink-0" />
                                  {c}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-5 bg-secondary/40 border border-border mb-8">
                  <p className="font-mono text-xs text-muted-foreground uppercase mb-3">Ваши условия</p>
                  <div className="grid grid-cols-2 gap-3">
                    {WIZARD_QUESTIONS.map((q) => (
                      <div key={q.id}>
                        <p className="font-mono text-xs text-muted-foreground">{q.question}</p>
                        <p className="text-sm font-medium mt-0.5">
                          {q.options.find((o) => o.value === wizardAnswers[q.id])?.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={resetWizard}
                    className="flex items-center gap-2 px-5 py-2.5 border border-border text-sm font-medium hover:border-foreground transition-colors"
                  >
                    <Icon name="RefreshCw" size={14} />
                    Пройти заново
                  </button>
                  <button
                    onClick={() => setSection("methods")}
                    className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-sm font-semibold hover:bg-foreground/80 transition-colors"
                  >
                    Подробнее о методах
                    <Icon name="ArrowRight" size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SHINA */}
        {section === "shina" && (
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="mb-12">
              <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-3">Архитектура</p>
              <h1 className="text-4xl font-black tracking-tight mb-4">1С:Шина</h1>
              <p className="text-muted-foreground max-w-xl">
                Платформенный продукт фирмы «1С» для надёжного асинхронного обмена данными — без сторонних брокеров и middleware.
              </p>
            </div>

            {/* Что такое */}
            <div className="grid md:grid-cols-2 gap-px border border-border bg-border mb-px">
              <div className="bg-background p-8">
                <p className="font-mono text-xs text-muted-foreground uppercase mb-4">Что такое 1С:Шина</p>
                <p className="text-sm leading-relaxed mb-4">
                  1С:Шина — это программный продукт фирмы «1С», реализующий паттерн Enterprise Service Bus (ESB) средствами платформы 1С:Предприятие. Он выступает центральным узлом обмена: все системы подключаются к шине, а не друг к другу напрямую.
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  В отличие от сторонних брокеров (RabbitMQ, Kafka), 1С:Шина разворачивается как обычная база 1С, администрируется стандартными инструментами и не требует отдельной экспертизы.
                </p>
              </div>
              <div className="bg-background p-8">
                <p className="font-mono text-xs text-muted-foreground uppercase mb-4">Когда применять</p>
                <ul className="space-y-3">
                  {[
                    "Несколько баз 1С нужно синхронизировать между собой",
                    "Внешние системы (CRM, ERP, сайт) обмениваются с 1С",
                    "Нужна гарантия доставки и журнал всех сообщений",
                    "Команда работает только в экосистеме 1С",
                    "Требуется централизованный мониторинг обменов",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <Icon name="Check" size={14} className="text-accent mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Архитектурная схема */}
            <div className="border border-border bg-background p-8 mb-px">
              <p className="font-mono text-xs text-muted-foreground uppercase mb-8">Схема работы</p>
              <div className="flex flex-col items-center gap-0">
                {/* Источники */}
                <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
                  {[
                    { label: "1С:Бухгалтерия", icon: "Database" },
                    { label: "Интернет-магазин", icon: "Globe" },
                    { label: "CRM-система", icon: "Users" },
                  ].map((node) => (
                    <div key={node.label} className="flex flex-col items-center gap-2">
                      <div className="w-full border border-border p-3 flex flex-col items-center gap-2 bg-secondary/30">
                        <Icon name={node.icon} size={18} className="text-muted-foreground" fallback="Box" />
                        <span className="font-mono text-xs text-center leading-tight">{node.label}</span>
                      </div>
                      <div className="w-px h-6 bg-border" />
                      <Icon name="ArrowDown" size={12} className="text-muted-foreground -mt-4" />
                    </div>
                  ))}
                </div>

                {/* Шина */}
                <div className="w-full max-w-2xl mt-2">
                  <div className="border-2 border-foreground bg-foreground text-background p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 border border-background/30 flex items-center justify-center">
                        <Icon name="Workflow" size={16} fallback="GitBranch" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">1С:Шина</p>
                        <p className="font-mono text-xs text-background/60">Маршрутизация · Очередь · Журнал</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-background/60 border border-background/20 px-2 py-0.5">ESB</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-0">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="w-px h-6 bg-border" />
                        <Icon name="ArrowDown" size={12} className="text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Получатели */}
                <div className="grid grid-cols-3 gap-4 w-full max-w-2xl mt-0">
                  {[
                    { label: "1С:УТ", icon: "ShoppingCart" },
                    { label: "1С:ЗУП", icon: "UserCheck" },
                    { label: "Внешняя система", icon: "Server" },
                  ].map((node) => (
                    <div key={node.label} className="border border-border p-3 flex flex-col items-center gap-2 bg-secondary/30">
                      <Icon name={node.icon} size={18} className="text-muted-foreground" fallback="Box" />
                      <span className="font-mono text-xs text-center leading-tight">{node.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ключевые компоненты */}
            <div className="border border-border bg-background p-8 mb-px">
              <p className="font-mono text-xs text-muted-foreground uppercase mb-6">Ключевые компоненты</p>
              <div className="grid md:grid-cols-3 gap-px bg-border">
                {[
                  {
                    icon: "Inbox",
                    title: "Очередь сообщений",
                    desc: "Сообщения сохраняются в базе данных шины и обрабатываются последовательно. При сбое — автоматический повтор.",
                  },
                  {
                    icon: "GitBranch",
                    title: "Маршрутизатор",
                    desc: "Определяет, какой получатель должен получить сообщение на основании типа объекта и правил конфигурации.",
                  },
                  {
                    icon: "ScrollText",
                    title: "Журнал обмена",
                    desc: "Полная история всех переданных сообщений: статус, время, содержимое, ошибки — доступно из интерфейса 1С.",
                  },
                  {
                    icon: "Plug",
                    title: "Адаптеры",
                    desc: "Готовые подключения для типовых конфигураций 1С. Внешние системы подключаются через REST или SOAP.",
                  },
                  {
                    icon: "RefreshCw",
                    title: "Транзакционность",
                    desc: "Гарантия «ровно один раз»: дубликаты исключены, порядок сообщений сохранён.",
                  },
                  {
                    icon: "Monitor",
                    title: "Мониторинг",
                    desc: "Дашборд состояния очередей, алерты на зависшие сообщения, статистика по узлам — всё в одном месте.",
                  },
                ].map((c) => (
                  <div key={c.title} className="bg-background p-6">
                    <div className="w-9 h-9 border border-border flex items-center justify-center mb-4">
                      <Icon name={c.icon} size={16} fallback="Box" />
                    </div>
                    <p className="font-semibold text-sm mb-2">{c.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Сравнение с прямой интеграцией */}
            <div className="border border-border bg-background p-8 mb-8">
              <p className="font-mono text-xs text-muted-foreground uppercase mb-6">1С:Шина vs. прямая интеграция</p>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="font-semibold text-sm mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 bg-foreground text-background flex items-center justify-center font-mono text-xs">✓</span>
                    С 1С:Шиной
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Все системы подключены к одной точке — легко добавлять новые",
                      "Сбой одной системы не блокирует остальные",
                      "Полная история обменов без дополнительных усилий",
                      "Изменение формата данных — только в одном месте",
                    ].map((item) => (
                      <li key={item} className="text-sm flex items-start gap-2">
                        <Icon name="Check" size={13} className="text-foreground mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 bg-border flex items-center justify-center font-mono text-xs text-muted-foreground">×</span>
                    Без шины (точка-точка)
                  </p>
                  <ul className="space-y-3">
                    {[
                      "При N системах нужно поддерживать N×(N-1) соединений",
                      "Каждая интеграция — отдельный код, отдельные ошибки",
                      "Нет единого журнала — сложно отследить сбой",
                      "Изменение формата ломает все смежные интеграции",
                    ].map((item) => (
                      <li key={item} className="text-sm flex items-start gap-2 text-muted-foreground">
                        <Icon name="X" size={13} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-6 border border-border bg-secondary/20 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm mb-1">Подходит ли 1С:Шина для вашей задачи?</p>
                <p className="text-sm text-muted-foreground">Пройдите алгоритм подбора — он учтёт все ваши условия</p>
              </div>
              <button
                onClick={() => setSection("wizard")}
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background font-semibold text-sm hover:bg-foreground/80 transition-colors"
              >
                Подобрать метод <Icon name="ArrowRight" size={14} />
              </button>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="border-t border-border mt-8">
          <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-foreground flex items-center justify-center">
                <span className="font-mono text-background text-[9px] font-bold">1С</span>
              </div>
              <span className="font-mono text-xs text-muted-foreground">Интеграции — гайд по выбору метода</span>
            </div>
            <span className="font-mono text-xs text-muted-foreground">2024</span>
          </div>
        </footer>
      </div>
    </div>
  );
}