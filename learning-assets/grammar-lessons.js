/* 每日模块只增加内容数据；交互与样式由 grammar-coach.js / .css 统一提供。 */
window.roboticsGrammar = {
  moduleId: 'joint-arm-01',
  version: 1,
  topics: [
    { id: 'parameters', title: '介绍参数', pattern: 'The arm weighs…', lessons: ['6'] },
    { id: 'ability', title: '说明能力', pattern: 'We can deliver…', lessons: ['3'] },
    { id: 'state', title: '比较特点', pattern: 'Our joint can be…', lessons: ['4'] },
    { id: 'manner', title: '描述运行方式', pattern: 'It operates reliably.', lessons: ['7'] },
    { id: 'past', title: '介绍研发经历', pattern: 'We developed… / We spent…', lessons: ['2', '1'] },
    { id: 'result', title: '解释技术带来的结果', pattern: 'This allows us to…', lessons: ['5'] },
    { id: 'achievement', title: '说明已取得的成果', pattern: 'It has achieved…', lessons: ['8'] }
  ],
  glossary: [
    ['主语', '句子谈论的对象，回答“谁／什么”。例如 Our robotic arm。'],
    ['谓语', '说明主语做什么或处于什么状态，核心是动词。can deliver 也是一个动词组合。'],
    ['宾语', '动作涉及的对象。例如 develop the components 中，the components 是“开发什么”。'],
    ['形容词 adj.', '说明人或事物的特点，例如 compact（紧凑的）。'],
    ['副词 adv.', '在本课中常用来说明动作怎样进行，例如 reliably（可靠地）。'],
    ['动词原形', '词典里的基本形式，例如 be、weigh、deliver。is、weighs、delivered 都是变化后的形式。'],
    ['时态', '用动词形式表达时间和看待事件的角度。本课先区分现在的参数、过去的经历和已经取得的成果。']
  ],
  lessons: {
    '1': {
      topic: 'past', title: '花了多久做什么',
      goal: '告诉客户，公司在过去投入了多长时间打磨产品。',
      rule: '说过去的投入，用 spent + 时间 + doing；spent 是 spend 的过去式。',
      parts: [
        ['From twenty eighteen to twenty twenty-one', '从2018年到2021年', '时间背景', 'context'],
        ['we', '我们', '主语：谁', 'subject'],
        ['spent', '花费了', '谓语：做了什么', 'verb'],
        ['approximately three and a half years', '大约三年半', '花了多久', 'object'],
        ['refining our products', '打磨我们的产品', '时间用在什么事上', 'context']
      ],
      build: [
        ['We refined our products.', '我们改进了产品。', '先把“谁做了什么”说清楚。'],
        ['We spent three years refining our products.', '我们用了三年改进产品。', '要突出投入时间，换成 spent + 时间 + refining。'],
        ['We spent approximately three and a half years refining our products.', '我们用了大约三年半改进产品。', '补上 approximately（大约）和 and a half（半）。'],
        ['From 2018 to 2021, we spent approximately three and a half years refining our products.', '从2018年到2021年，我们用了大约三年半打磨产品。', '把年份背景放在句首，先让客户知道是在什么时候。']
      ],
      why: [
        ['为什么用 spent？', '这句话在回顾2018—2021年的经历，所以用一般过去时。spend 的过去式是不规则变化 spent。'],
        ['为什么是 refining，不是 refine 或 to refine？', '在“花时间做某事”这个搭配中，形式是 spend time doing something。因此 refine 要变成 refining；不能在这个结构里直接用 to refine。'],
        ['中文“潜心打磨”怎么处理？', '这里用 refine 表达持续改进，用投入的三年半体现专注。中文的每个字不必都对应一个英文词。'],
        ['from…to… 一定放开头吗？', '不一定，也可以放句尾。放开头是为了先给时间背景。from 2018 to 2021 和“大约三年半”应以公司的实际起止月份为准。']
      ],
      quizzes: [
        { prompt: 'We spent three years ___ our products.', choices: ['refine', 'refining', 'to refine'], correct: 1, feedback: ['refine 是原形；spend + 时间后表达所做的事，要用 -ing 形式。', '正确。spent + 时间 + refining，说明时间花在改进产品上。', 'to refine 可以出现在其他结构中，但这里的固定搭配是 spent time refining。'] },
        { prompt: '回顾2018—2021年的投入：We ___ three and a half years on development.', choices: ['spend', 'spent', 'spends'], correct: 1, feedback: ['spend 可描述现在的习惯，但这里明确在回顾过去，需要 spent。', '正确。过去的经历用 spent；on development 表示“在研发上”。', 'spends 用于一般现在时的第三人称单数；这里主语是 we，时间又是过去。'] }
      ],
      transfer: { prompt: '练习情境：我们用了两年开发这款控制器。请沿用 spent + 时间 + doing 说一句英文。', answer: 'We spent two years developing this controller.', checks: ['过去的“花费”用了 spent。', 'two years 后面用了 developing。', '“这款控制器”用了 this controller。'] },
      dialogue: { question: 'How long did you spend refining the products?', questionZh: '你们用了多长时间打磨产品？', answer: 'We spent approximately three and a half years refining our products.', answerZh: '我们用了大约三年半的时间打磨产品。' }
    },
    '2': {
      topic: 'past', title: '说明哪些部件由我们自研',
      goal: '先说“我们开发了什么”，再补充“自主开发”和具体部件。',
      rule: 'We developed + 零部件；in-house 说明研发在公司内部完成。',
      parts: [
        ['We', '我们', '主语：谁', 'subject'], ['developed', '开发了', '谓语：过去的动作', 'verb'],
        ['the key components', '核心零部件', '宾语：开发什么', 'object'],
        ['of our robotic joints', '我们机器人关节的', '补充：谁的零部件', 'context'],
        ['in-house', '在公司内部／自主地', '补充：研发方式', 'context'],
        ['including harmonic reducers, servo motors, drives, and controllers', '包括谐波减速器、伺服电机、驱动器和控制器', '列举具体项目', 'context']
      ],
      build: [
        ['We developed the components.', '我们开发了这些零部件。', '主干：我们 + 开发了 + 零部件。'],
        ['We developed the key components of our robotic joints.', '我们开发了机器人关节的核心零部件。', '英文先说 components，再用 of… 说明属于什么；中文通常把“……的”放前面。'],
        ['We developed the key components of our robotic joints in-house.', '我们自主开发了机器人关节的核心零部件。', '在句尾加 in-house，说明由公司内部研发。'],
        ['We developed the key components of our robotic joints in-house, including harmonic reducers, servo motors, drives, and controllers.', '我们自主开发了机器人关节的核心零部件，包括谐波减速器、伺服电机、驱动器和控制器。', '最后用 including 引出清单，主干不用改变。']
      ],
      why: [
        ['为什么 developed 后面直接放 components？', 'develop 是“开发”的动词，可以直接接开发对象。We developed the components 就有完整主干。'],
        ['为什么“关节的零部件”翻译顺序变了？', 'the components of our joints 按英文顺序先说“零部件”，再说明“属于我们的关节”。理解时先找到中心词 components，再把 of… 译成“……的”。'],
        ['develop 与 developed 有什么不同？', 'We develop… 可以介绍公司目前的研发业务；We developed… 回顾过去的研发工作。两种形式都可能正确，但表达的时间角度不同。'],
        ['including 的 -ing 和 refining 一样吗？', '不能只看词尾就判断作用。这里 including 用来引出“包括哪些”，按“包括”这个整体表达学习；refining 则属于 spend time doing 结构。']
      ],
      quizzes: [
        { prompt: '介绍过去的研发工作：We ___ the controller in-house.', choices: ['developed', 'develops', 'are developed'], correct: 0, feedback: ['正确。developed 表达过去的研发工作。', 'develops 是一般现在时第三人称单数形式，不能搭配 we。', 'are developed 会把 we 变成“被开发的对象”，不符合“我们开发控制器”的意思。'] },
        { prompt: '“机器人关节的核心零部件”是哪一个？', choices: ['the robotic joints of our key components', 'the key components of our robotic joints', 'the key of components robotic joints'], correct: 1, feedback: ['中心词变成了 joints，变成“零部件的关节”，关系颠倒了。', '正确。先给中心词 components，再用 of our robotic joints 说明所属关系。', 'key 要修饰 components，of 后面再接完整的名词短语。'] }
      ],
      transfer: { prompt: '练习情境：我们自主开发了这款伺服电机。用一般过去时表达。', answer: 'We developed this servo motor in-house.', checks: ['主干是 We developed this servo motor。', '研发方式用 in-house 表达。', 'servo motor 是电机；没有把驱动器 drive 混进去。'] },
      dialogue: { question: 'Which components did you develop in-house?', questionZh: '哪些零部件是你们自主研发的？', answer: 'We developed the harmonic reducers, servo motors, drives, and controllers in-house.', answerZh: '我们自主研发了谐波减速器、伺服电机、驱动器和控制器。' }
    },
    '3': {
      topic: 'ability', title: '说明能够输出什么',
      goal: '告诉客户：关节尺寸相同时，我们能输出更高扭矩。',
      rule: 'can + 动词原形：can deliver。can 后面不加 to，deliver 也不加 s。',
      parts: [
        ['For the same joint size', '在关节尺寸相同的情况下', '比较条件', 'context'],
        ['we', '我们', '主语：谁', 'subject'], ['can deliver', '能够输出', '能力 + 动作', 'verb'],
        ['higher torque', '更高的扭矩', '宾语：输出什么', 'object']
      ],
      build: [
        ['We deliver torque.', '我们输出扭矩。', '先说“谁做什么”。deliver 本身就是动词。'],
        ['We can deliver torque.', '我们能够输出扭矩。', '加 can 表达能力，deliver 保持原形。'],
        ['We can deliver higher torque.', '我们能够输出更高扭矩。', '把 high 变成 higher，突出比较。'],
        ['For the same joint size, we can deliver higher torque.', '在关节尺寸相同的情况下，我们能够输出更高扭矩。', '加比较条件，让优势的含义更准确。']
      ],
      why: [
        ['为什么 can 后面没有 be？', 'deliver 已经是动词，可以直接放在 can 后。be 用来连接状态等其他结构；本句不需要再插入 be。'],
        ['如果主语换成 our joint，要写 delivers 吗？', '有 can 时仍然用原形：Our joint can deliver…。没有 can 的一般现在时才会出现 Our joint delivers…。'],
        ['higher 在修饰什么？', 'higher 修饰 torque，表示输出的扭矩更高。句首的 for the same joint size 是比较的条件，不是“为了相同尺寸”。']
      ],
      quizzes: [
        { prompt: 'Our joint can ___ higher torque.', choices: ['deliver', 'delivers', 'to deliver'], correct: 0, feedback: ['正确。有 can 时，无论主语是 we 还是 our joint，后面都用 deliver。', '虽然 our joint 是单数，但 can 后用原形，因此不能加 s。', 'can 后直接接动词原形，不加 to。'] },
        { prompt: '“我们能够输出更高扭矩”正确的主干是：', choices: ['We can be deliver higher torque.', 'We can deliver higher torque.', 'We can higher torque.'], correct: 1, feedback: ['deliver 本身是动作动词，不需要插入 be。', '正确。we 是主语，can deliver 表达能力，higher torque 是输出对象。', 'higher torque 是名词短语，还缺少“输出”这个动作 deliver。'] }
      ],
      transfer: { prompt: '练习情境：这款电机能够输出更高扭矩。把主语换成 this motor。', answer: 'This motor can deliver higher torque.', checks: ['把 we 换成了 this motor。', 'can 后仍然是 deliver，没有加 s。', 'higher 表达“更高”。'] },
      dialogue: { question: 'What is the advantage of your joint at the same size?', questionZh: '在尺寸相同的情况下，你们关节的优势是什么？', answer: 'For the same joint size, we can deliver higher torque.', answerZh: '在关节尺寸相同的情况下，我们可以输出更高的扭矩。' }
    },
    '4': {
      topic: 'state', title: '说明可以更紧凑',
      goal: '在扭矩相同的前提下，说明我们的关节可以更紧凑。',
      rule: 'compact 是特点（形容词）；can 后用 be 把关节和特点连接起来：can be more compact。',
      parts: [
        ['For the same torque output', '在输出扭矩相同的情况下', '比较条件', 'context'],
        ['our joint', '我们的关节', '主语：什么', 'subject'], ['can be', '可以是／可以做到', '连接主语和特点', 'verb'],
        ['more compact', '更紧凑的', '表语：主语的特点', 'object']
      ],
      build: [
        ['Our joint is compact.', '我们的关节是紧凑的。', 'compact 是形容词；这里用 is 连接主语和特点。'],
        ['Our joint can be compact.', '我们的关节可以是紧凑的。', '加 can 表达可以做到的状态，is 变成原形 be。'],
        ['Our joint can be more compact.', '我们的关节可以更紧凑。', 'more compact 表示比对照方案更紧凑。'],
        ['For the same torque output, our joint can be more compact.', '在输出扭矩相同的情况下，我们的关节可以更紧凑。', '补上比较条件。先说扭矩相同，再谈体积差异。']
      ],
      why: [
        ['为什么这里需要 be？', 'compact 说明特点，本句用 be 连接 our joint 和 more compact。中文可以说“关节更紧凑”，英文这个结构需要动词。'],
        ['为什么不是 can is？', 'can 后面需要动词原形。is、am、are 的原形都是 be，所以是 can be。'],
        ['和上一句 can deliver 怎么区分？', 'deliver 是动作：can deliver。compact 是特点：can be compact。先认出后面的词是动作还是特点，再选结构。'],
        ['can be more compact 与 is more compact 一样吗？', '前者强调“可以做到更紧凑”，后者直接陈述“更紧凑”。两种语法都可以，但承诺程度和表达重点不同。']
      ],
      quizzes: [
        { prompt: 'Our joint can ___ more compact.', choices: ['be', 'is', '不填'], correct: 0, feedback: ['正确。can + be（原形）+ more compact（特点）。', 'is 是变化后的形式，can 后应使用原形 be。', 'compact 是形容词，这个结构需要 be 来连接主语和特点。'] },
        { prompt: '“我们的关节更紧凑”作为直接陈述，用哪句？', choices: ['Our joint more compact.', 'Our joint is more compact.', 'Our joint is more compactly.'], correct: 1, feedback: ['缺少动词。这里要用 is 连接 our joint 和 more compact。', '正确。is 连接主语和形容词；相比 can be，这是直接陈述产品特点。', 'compactly 是副词；这里需要形容词 compact 描述关节的特点。'] }
      ],
      transfer: { prompt: '练习情境：机械臂可以更轻。用 can，提示“更轻”＝lighter。', answer: 'The robotic arm can be lighter.', checks: ['有 can be，没有写 can is。', 'lighter 是特点，前面需要 be。', '主语是 the robotic arm。'] },
      dialogue: { question: 'Can your joint be smaller at the same torque output?', questionZh: '在相同扭矩输出下，你们的关节能更小吗？', answer: 'For the same torque output, our joint can be more compact.', answerZh: '在相同扭矩输出下，我们的关节可以更紧凑。' }
    },
    '5': {
      topic: 'result', title: '把技术优势接到产品结果',
      goal: '说明这项技术让我们能够制造什么样的机械臂。',
      rule: 'allow + 人 + to do：allows us to build。先讲结果主干，再用 that… 描述机械臂。',
      parts: [
        ['This', '这／前面说的技术优势', '主语：什么', 'subject'], ['allows', '使能够', '谓语：带来什么作用', 'verb'],
        ['us', '我们', '谁得到这种能力', 'object'], ['to build robotic arms', '制造机械臂', '能够做什么', 'context'],
        ['that are slim, lightweight, and similar in appearance to a human arm', '纤细、轻量、外观类似人类手臂的', '定语从句：补充说明机械臂', 'context']
      ],
      build: [
        ['We can build robotic arms.', '我们能够制造机械臂。', '先说清结果。'],
        ['This allows us to build robotic arms.', '这使我们能够制造机械臂。', '把“这项技术的作用”放到主句，用 allows us to build。'],
        ['This allows us to build robotic arms that are slim.', '这使我们能够制造纤细的机械臂。', '英文先说 arms，再用 that are slim 补充描述；中文通常把“纤细的”放在前面。'],
        ['This allows us to build robotic arms that are slim, lightweight, and similar in appearance to a human arm.', '这使我们能够制造纤细、轻量、外观类似人类手臂的机械臂。', '把另外两个特点并列加到 slim 后面；that are 后的整体仍在描述 arms。']
      ],
      why: [
        ['为什么 allows 要加 s？', '主语 This 指前面提到的优势，是单数。一般现在时的肯定句中，allow 变成 allows。'],
        ['为什么是 us，而不是 we？', 'we 是主语形式；在 allow 后面表示“让谁能够”时，用宾语形式 us。记住 This allows us to…。'],
        ['为什么 build 前面要 to，can 后却不要？', '这是两个不同搭配：can build；allow someone to build。to 由 allow 这个结构决定，不能把 can 的规则直接搬过来。'],
        ['that are 指什么，为什么不是 is？', 'that 连接后面的说明并指向前面的 robotic arms。arms 是复数，所以用 are。把短句 robotic arms are slim 接回去，就容易理解了。']
      ],
      quizzes: [
        { prompt: 'This allows us ___ slim robotic arms.', choices: ['build', 'to build', 'building'], correct: 1, feedback: ['allow + 人后需要 to do；不能省掉 to。', '正确。allows us to build＝使我们能够制造。', '本句是 allow us to build，不是 allow us building。'] },
        { prompt: 'robotic arms that ___ slim', choices: ['is', 'are', 'be'], correct: 1, feedback: ['that 指前面的 arms，是复数，所以不用 is。', '正确。可以先还原成 robotic arms are slim 来判断。', '这里没有 can 等要求原形的词，要使用与复数主语搭配的 are。'] }
      ],
      transfer: { prompt: '练习情境：这种设计让我们能够制造更轻的机械臂。提示 this design、lighter robotic arms。', answer: 'This design allows us to build lighter robotic arms.', checks: ['This design 是单数，用了 allows。', '“让我们能够”用了 allows us to。', 'lighter 放在 robotic arms 前修饰它。'] },
      dialogue: { question: 'What does this joint design allow you to do?', questionZh: '这种关节设计让你们能够实现什么？', answer: 'It allows us to build robotic arms that are slim and lightweight.', answerZh: '它使我们能够制造纤细、轻量的机械臂。' }
    },
    '6': {
      topic: 'parameters', title: '准确介绍自重和负载',
      goal: '向客户说清7.2千克是自重，5千克是负载。',
      rule: 'weigh 本身就是“重量为”的动词：The arm weighs…，不用 is weigh。',
      parts: [
        ['Our robotic arm', '我们的机械臂', '主语：什么', 'subject'], ['weighs', '重量为', '谓语：参数', 'verb'],
        ['only seven point two kilograms', '仅7.2千克', '重量数值', 'object'],
        ['but provides', '但提供／但具备', '转折 + 第二个动作', 'verb'], ['a payload of five kilograms', '5千克的负载', '负载参数', 'object']
      ],
      build: [
        ['The arm weighs 7.2 kilograms.', '这款机械臂重量为7.2千克。', '先说参数：主语 + weighs + 重量。'],
        ['Our robotic arm weighs only 7.2 kilograms.', '我们的机械臂自重仅7.2千克。', '用 our robotic arm 明确对象，only 突出“仅”。'],
        ['Our robotic arm weighs only 7.2 kilograms, but provides a payload of 5 kilograms.', '我们的机械臂自重仅7.2千克，但负载为5千克。', 'but 引出与低自重形成对比的负载；两个谓语共用同一个主语。']
      ],
      why: [
        ['为什么是 weighs，不是 weigh？', '介绍当前产品参数，用一般现在时。our robotic arm 是单数，相当于 it，所以在肯定句里用 weighs；后面的 provides 同理。'],
        ['为什么不能写 is weigh？', 'weigh 本身已经是动词。要用 is，需要换成名词结构：The weight is 7.2 kilograms.（重量为7.2千克。）这两种结构不能混在一起。'],
        ['weigh 和 weight 差在哪里？', '本课中 weigh 是动词“重量为”；weight 是名词“重量”。The arm weighs… 与 The weight of the arm is… 都能表达重量。'],
        ['客户问重量时怎么问？', 'How much does the arm weigh? 问句用 does 帮忙后，weigh 恢复原形。不要写 does the arm weighs。'],
        ['a 5-kilogram payload 中 kilogram 为什么不加 s？', '放在名词前作一个整体修饰语时用 5-kilogram。换成 a payload of 5 kilograms，kilograms 是复数单位。']
      ],
      quizzes: [
        { prompt: 'The robotic arm ___ 7.2 kilograms.', choices: ['weighs', 'is weigh', 'weigh'], correct: 0, feedback: ['正确。单数主语、一般现在时肯定句，用 weighs。', 'weigh 已经是动词，不能直接写 is weigh；也可以改写 The weight is…。', '本句没有 can 或 does，单数主语需要 weighs。'] },
        { prompt: 'How much does the robotic arm ___?', choices: ['weighs', 'weight', 'weigh'], correct: 2, feedback: ['does 已经承担了相应的语法变化，后面的 weigh 要恢复原形。', 'weight 在这里是名词，does 后面需要动词 weigh。', '正确。How much does…weigh? 是询问重量的常用问法。'] }
      ],
      transfer: { prompt: '参数替换练习（假设数据）：这款控制器重2千克。提示 the controller。', answer: 'The controller weighs 2 kilograms.', checks: ['单数 controller 后用了 weighs。', '没有把名词 weight 放在动词位置。', '2 kilograms 的单位用了复数。'] },
      dialogue: { question: 'How much does the robotic arm weigh?', questionZh: '这款机械臂多重？', answer: 'It weighs only seven point two kilograms and has a payload of five kilograms.', answerZh: '它自重仅7.2千克，负载为5千克。' }
    },
    '7': {
      topic: 'manner', title: '区分产品特点和运行方式',
      goal: '向客户说明机械臂能够可靠、稳定地运行。',
      rule: '描述“怎样运行”，用副词 reliably / stably；描述“产品是什么样”，用 reliable / stable。',
      parts: [
        ['It', '它，指机械臂', '主语：什么', 'subject'], ['can operate', '能够运行', '能力 + 动作', 'verb'],
        ['reliably and stably', '可靠且稳定地', '副词：怎样运行', 'context']
      ],
      build: [
        ['It operates.', '它运行。', '单数 it 的一般现在时肯定句用 operates。'],
        ['It can operate.', '它能够运行。', '加 can 后，operate 恢复原形。'],
        ['It can operate reliably.', '它能够可靠地运行。', '加副词 reliably，回答“怎样运行”。'],
        ['It can operate reliably and stably.', '它能够可靠、稳定地运行。', '用 and 连接两个并列副词。']
      ],
      why: [
        ['为什么不是 operate reliable？', '这里要描述 operate 这个动作进行得怎样，所以用副词 reliably。reliable 是形容词，用在 It is reliable. 中描述产品特点。'],
        ['副词一定都是 -ly 结尾吗？', '不是。这里 reliable → reliably、stable → stably 是本课要掌握的变化；不要据此推断所有副词都以 -ly 结尾。'],
        ['It is reliable. 和 It operates reliably. 有什么不同？', '前一句描述产品可靠这一特点；后一句具体说明运行方式可靠。语法都成立，要根据你想强调的内容选择。']
      ],
      quizzes: [
        { prompt: 'It can operate ___.', choices: ['reliable', 'reliably', 'reliability'], correct: 1, feedback: ['reliable 是形容词，可以说 It is reliable；这里要修饰动作 operate。', '正确。reliably 是副词，回答“运行得怎样”。', 'reliability 是名词“可靠性”，不能直接在这里修饰 operate。'] },
        { prompt: '描述产品本身的特点：The arm is ___.', choices: ['stably', 'stable', 'stability'], correct: 1, feedback: ['stably 是副词，用于 operates stably；这里描述机械臂的特点。', '正确。is 后用形容词 stable 描述主语。', 'stability 是名词“稳定性”，这里不能表达“机械臂是稳定的”。'] }
      ],
      transfer: { prompt: '练习情境：这款电机能够稳定地运行。提示 this motor、stably。', answer: 'This motor can operate stably.', checks: ['can 后用了 operate 原形。', '修饰“运行”用了 stably。', '如果改说特点，则可以用 This motor is stable。'] },
      dialogue: { question: 'How does the robotic arm operate?', questionZh: '这款机械臂运行表现如何？', answer: 'It can operate reliably and stably.', answerZh: '它能够可靠、稳定地运行。' }
    },
    '8': {
      topic: 'achievement', title: '说明截至目前取得的成果',
      goal: '引用测试结果，说明已经取得的可靠性指标。',
      rule: 'has / have + 过去分词：it has achieved…，强调过去取得、与现在有关的结果。',
      parts: [
        ['According to our test results', '根据我们的测试结果', '信息依据', 'context'],
        ['it', '它，指产品', '主语：什么', 'subject'], ['has achieved', '已经达到', '现在完成时：取得的结果', 'verb'],
        ['an MTBF of fifty million hours', '5000万小时的平均故障间隔时间', '达到的指标', 'object']
      ],
      build: [
        ['It achieved this result.', '它取得了这一结果。', '先理解过去发生的动作。'],
        ['It has achieved this result.', '它已经取得了这一结果。', '用 has achieved 强调这个结果与当前介绍相关。'],
        ['It has achieved an MTBF of fifty million hours.', '它已经达到5000万小时的MTBF。', '把 this result 换成具体指标。'],
        ['According to our test results, it has achieved an MTBF of fifty million hours.', '根据我们的测试结果，它已经达到5000万小时的MTBF。', '句首交代依据；数值沿用你的原始材料，对外使用应与报告口径一致。']
      ],
      why: [
        ['为什么是 has achieved？', 'it 是第三人称单数，用 has；we 或 they 用 have。现在完成时结构是 has/have + 过去分词。achieve 的过去分词是 achieved。'],
        ['为什么和过去时都出现 achieved？', '规则动词 achieve 的过去式和过去分词恰好同形。It achieved… 是一般过去时；It has achieved… 是现在完成时，要看前面是否有 has/have。'],
        ['能把 In 2021 和 has achieved 放一起吗？', '当你明确说“在2021年取得这个结果”时，通常用一般过去时：In 2021, it achieved…。原句没有指定这项成果的已结束时间，强调当前已取得的结果。'],
        ['为什么是 an MTBF，不是 a MTBF？', 'a/an 按发音选择。M 读 /em/，开头是元音音素，所以逐字母读 MTBF 时用 an。不是按字母是否属于元音字母来判断。']
      ],
      quizzes: [
        { prompt: 'It ___ achieved this result.', choices: ['have', 'has', 'is'], correct: 1, feedback: ['have 搭配 we/they 等；it 是单数，应该用 has。', '正确。it + has + achieved，说明截至目前取得的结果。', '此处要表达“已经取得”，用 has achieved；is achieved 是另一种被动结构，意思不同。'] },
        { prompt: '练习情境：明确说“2021年通过测试”，选哪句？', choices: ['In 2021, it has passed the test.', 'In 2021, it passed the test.', 'In 2021, it pass the test.'], correct: 1, feedback: ['In 2021 是明确、已结束的过去时间；这里通常用一般过去时 passed。', '正确。指定过去时间讲事件，用 passed。这里是语法练习情境。', '过去事件需要过去式 passed，不能使用 pass 原形。'] }
      ],
      transfer: { prompt: '练习情境：我们已经完成了测试。强调现在已经有结果，提示 complete the test。', answer: 'We have completed the test.', checks: ['主语 we 搭配 have。', 'complete 变成过去分词 completed。', '没有把 has 套在 we 后面。'] },
      dialogue: { question: 'What reliability result has the product achieved?', questionZh: '这款产品取得了什么可靠性测试结果？', answer: 'According to our test results, it has achieved an M T B F of fifty million hours.', answerZh: '根据我们的测试结果，它已达到5000万小时的MTBF。' }
    }
  }
};
