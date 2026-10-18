(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.getElementById("siteHeader");
  const nav = document.getElementById("mainNav");
  const menuToggle = document.querySelector(".menu-toggle");
  const progressBar = document.getElementById("scrollProgress");
  const stageTabs = [...document.querySelectorAll(".stage-tab")];
  const stagePanels = [...document.querySelectorAll(".stage-panel")];
  const stageProgress = document.getElementById("stageProgress");
  const stageCounter = document.getElementById("stageCounter");
  const prevStageButton = document.getElementById("prevStage");
  const nextStageButton = document.getElementById("nextStage");
  const quickPathLinks = [...document.querySelectorAll(".quick-path a")];
  const mentorNodes = [...document.querySelectorAll(".mentor-node")];
  const mentorNoteTag = document.getElementById("mentorNoteTag");
  const mentorNoteTitle = document.getElementById("mentorNoteTitle");
  const mentorNoteText = document.getElementById("mentorNoteText");
  const dimensionItems = [...document.querySelectorAll(".dimension-item")];
  const radarAxes = [...document.querySelectorAll(".radar-axis")];
  const dimensionTitle = document.getElementById("dimensionTitle");
  const dimensionText = document.getElementById("dimensionText");
  const dialog = document.getElementById("quizDialog");
  const quizOptions = document.getElementById("quizOptions");
  const quizCount = document.getElementById("quizCount");
  const quizTitle = document.getElementById("quizTitle");
  const quizHint = document.getElementById("quizHint");
  const quizProgress = document.getElementById("quizProgress");
  const quizQuestionView = document.getElementById("quizQuestionView");
  const quizResultView = document.getElementById("quizResultView");
  const quizResultTitle = document.getElementById("quizResultTitle");
  const quizResultCopy = document.getElementById("quizResultCopy");
  const quizResultTags = document.getElementById("quizResultTags");
  const quizBack = document.getElementById("quizBack");
  const quizRestart = document.getElementById("quizRestart");
  const quizClose = document.querySelector(".quiz-close");

  /* Header and reading progress */
  const updateScrollState = () => {
    const scrollY = window.scrollY;
    header.classList.toggle("is-scrolled", scrollY > 40);
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  };

  window.addEventListener("scroll", updateScrollState, { passive: true });
  updateScrollState();

  /* Mobile navigation */
  const closeMenu = () => {
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "打开菜单");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "关闭菜单" : "打开菜单");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 780) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      closeMenu();
      menuToggle.focus();
    }
  });

  /* Active nav section */
  const sectionIds = ["philosophy", "system", "roadmap", "mentors", "services", "tracks", "join"];
  const navLinks = [...nav.querySelectorAll("a")];
  const navMap = new Map(
    navLinks.map((link) => [link.getAttribute("href").replace("#", ""), link])
  );
  const quickMap = new Map(
    quickPathLinks.map((link) => [link.getAttribute("href").replace("#", ""), link])
  );
  const quickAliases = {
    philosophy: "philosophy",
    system: "philosophy",
    roadmap: "roadmap",
    mentors: "roadmap",
    assessment: "roadmap",
    services: "services",
    tracks: "tracks",
    evidence: "tracks",
    join: "join"
  };

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => link.classList.remove("is-active"));
          navMap.get(entry.target.id)?.classList.add("is-active");
          const quickKey = quickAliases[entry.target.id];
          if (quickKey) {
            quickPathLinks.forEach((link) => link.classList.remove("is-active"));
            quickMap.get(quickKey)?.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
  }

  /* Reveal animation */
  const revealItems = [...document.querySelectorAll(".reveal")];
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -9% 0px", threshold: 0.08 }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  /* Four-year stage tabs */
  let activeStage = 0;

  const setStage = (index, focusTab = false) => {
    activeStage = Math.max(0, Math.min(index, stageTabs.length - 1));
    stageTabs.forEach((tab, tabIndex) => {
      const active = tabIndex === activeStage;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    stagePanels.forEach((panel, panelIndex) => {
      const active = panelIndex === activeStage;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    if (stageProgress) {
      stageProgress.style.transform = `translateX(${activeStage * 100}%)`;
    }
    if (stageCounter) {
      stageCounter.textContent = `${String(activeStage + 1).padStart(2, "0")} / ${String(stageTabs.length).padStart(2, "0")}`;
    }
    if (prevStageButton) prevStageButton.disabled = activeStage === 0;
    if (nextStageButton) nextStageButton.disabled = activeStage === stageTabs.length - 1;
    if (focusTab) stageTabs[activeStage].focus();
  };

  stageTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => setStage(index));
    tab.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setStage((index + 1) % stageTabs.length, true);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setStage((index - 1 + stageTabs.length) % stageTabs.length, true);
      }
      if (event.key === "Home") {
        event.preventDefault();
        setStage(0, true);
      }
      if (event.key === "End") {
        event.preventDefault();
        setStage(stageTabs.length - 1, true);
      }
    });
  });

  prevStageButton?.addEventListener("click", () => setStage(activeStage - 1));
  nextStageButton?.addEventListener("click", () => setStage(activeStage + 1));

  quickPathLinks.forEach((link) => {
    link.addEventListener("click", () => {
      quickPathLinks.forEach((item) => item.classList.remove("is-active"));
      link.classList.add("is-active");
    });
  });

  const faqItems = [...document.querySelectorAll(".faq-list details")];
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  /* Mentor network */
  mentorNodes.forEach((node) => {
    node.addEventListener("click", () => {
      mentorNodes.forEach((item) => item.classList.remove("is-active"));
      node.classList.add("is-active");
      mentorNoteTag.textContent = node.dataset.noteTag || "";
      mentorNoteTitle.textContent = node.dataset.noteTitle || "";
      mentorNoteText.textContent = node.dataset.note || "";
    });
  });

  /* Six-dimension model */
  const setDimension = (id) => {
    dimensionItems.forEach((item) => {
      item.classList.toggle("is-active", item.dataset.dimension === id);
    });
    radarAxes.forEach((axis) => {
      axis.classList.toggle("is-active", axis.dataset.axis === id);
    });
    const activeItem = dimensionItems.find((item) => item.dataset.dimension === id);
    if (activeItem) {
      dimensionTitle.textContent = activeItem.dataset.title;
      dimensionText.textContent = activeItem.dataset.text;
    }
  };

  dimensionItems.forEach((item) => {
    item.addEventListener("click", () => setDimension(item.dataset.dimension));
    item.addEventListener("mouseenter", () => setDimension(item.dataset.dimension));
  });

  /* Direction check */
  const questions = [
    {
      title: "你现在处在哪个阶段？",
      hint: "不同年级，成长任务的优先级并不相同。",
      options: [
        { label: "大一", note: "建立规则认知、绩点与英语底盘", value: "y1" },
        { label: "大二", note: "稳定排名，开始科研与竞赛积累", value: "y2" },
        { label: "大三", note: "形成代表作，进入定位与申请准备", value: "y3" },
        { label: "大四", note: "冲刺预推免、志愿与录取确认", value: "y4" }
      ]
    },
    {
      title: "当前最想解决的问题是？",
      hint: "先找到最需要优先处理的那一个问题。",
      options: [
        { label: "方向不清", note: "不知道目标院校、专业或路径怎么选", value: "direction" },
        { label: "绩点与英语", note: "希望守住基础门槛，改善学习方法", value: "foundation" },
        { label: "科研与竞赛", note: "希望形成真实参与的代表性成果", value: "research" },
        { label: "申请冲刺", note: "定位、材料、导师联系与笔面试", value: "application" }
      ]
    },
    {
      title: "你的目标院校范围更接近？",
      hint: "暂不确定也没关系，这会是评估的一部分。",
      options: [
        { label: "以 985 为主", note: "希望建立清晰、均衡的目标院校梯度", value: "top985" },
        { label: "冲刺更高平台", note: "希望强化成果，扩大目标院校选择", value: "higher" },
        { label: "面向 C9", note: "目标明确，希望提前进行高阶配置", value: "c9" },
        { label: "尚未确定", note: "希望先通过评估找到适合的方向", value: "unknown" }
      ]
    },
    {
      title: "每周可投入的课外成长时间？",
      hint: "资源配置必须与真实时间预算匹配。",
      options: [
        { label: "4 小时以内", note: "先做减法，优先守住关键基础", value: "low" },
        { label: "4—8 小时", note: "可以稳定推进一项长期积累", value: "medium" },
        { label: "8 小时以上", note: "可以并行推进科研、竞赛或论文", value: "high" }
      ]
    }
  ];

  let answers = [];
  let currentQuestion = 0;

  const resetQuiz = () => {
    answers = [];
    currentQuestion = 0;
    quizQuestionView.hidden = false;
    quizResultView.hidden = true;
    quizBack.hidden = true;
    renderQuestion();
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    quizCount.textContent = `${String(currentQuestion + 1).padStart(2, "0")} / ${String(questions.length).padStart(2, "0")}`;
    quizTitle.textContent = question.title;
    quizHint.textContent = question.hint;
    quizProgress.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
    quizBack.hidden = currentQuestion === 0;
    quizOptions.replaceChildren();

    question.options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-option";
      if (answers[currentQuestion] === option.value) button.classList.add("is-selected");
      const label = document.createElement("b");
      label.textContent = option.label;
      const note = document.createElement("small");
      note.textContent = option.note;
      button.append(label, note);
      button.addEventListener("click", () => {
        if (button.disabled) return;
        quizOptions.querySelectorAll(".quiz-option").forEach((item) => {
          item.disabled = true;
        });
        answers[currentQuestion] = option.value;
        quizOptions.querySelectorAll(".quiz-option").forEach((item) => item.classList.remove("is-selected"));
        button.classList.add("is-selected");
        window.setTimeout(() => {
          if (currentQuestion < questions.length - 1) {
            currentQuestion += 1;
            renderQuestion();
          } else {
            showResult();
          }
        }, 180);
      });
      quizOptions.append(button);
    });
  };

  const showResult = () => {
    const [year, need, goal, time] = answers;
    let track = "标准版";
    let trackReason = "从完整路径和基础能力起步，先把方向、绩点与英语底盘建立起来。";

    if (goal === "c9") {
      track = "C9 版";
      trackReason = "你已有较明确的 C9 目标，可重点了解高阶专业科研训练与院系方向适配。";
    } else if (goal === "higher" || need === "application" || (year === "y3" && goal !== "unknown")) {
      track = "旗舰版";
      trackReason = "你更需要扩大目标院校选择、强化成果组合与申请表达，旗舰版的资源配置更贴近这一阶段。";
    }

    const focusMap = {
      direction: "战略决策系统",
      foundation: "绩点与英语模块",
      research: "科研与竞赛模块",
      application: "申请作战系统"
    };
    const focus = focusMap[need] || "战略决策系统";
    const yearMap = { y1: "大一", y2: "大二", y3: "大三", y4: "大四" };
    const goalMap = { top985: "985 为主", higher: "冲刺更高平台", c9: "面向 C9", unknown: "目标待明确" };
    const timeMap = { low: "每周 4 小时以内", medium: "每周 4—8 小时", high: "每周 8 小时以上" };

    let copy = `你目前处于${yearMap[year]}阶段。建议先从「${focus}」切入，并重点了解「${track}」。${trackReason}`;
    if (year === "y1") {
      copy += " 大一阶段不必过早锁定版本，先完成规则理解、绩点与英语基础，再逐步观察科研与竞赛兴趣。";
    }
    if (time === "low") {
      copy += " 由于每周可投入时间有限，建议先做减法，优先守住学业基础，避免同时铺开过多项目。";
    }
    copy += " 正式方案需在完成本校政策解析与六维评估后确认。";

    quizResultTitle.textContent = `建议先了解「${track}」`;
    quizResultCopy.textContent = copy;
    quizResultTags.replaceChildren();
    [yearMap[year], `重点：${focus}`, goalMap[goal], timeMap[time]].forEach((text) => {
      const tag = document.createElement("span");
      tag.textContent = text;
      quizResultTags.append(tag);
    });

    quizQuestionView.hidden = true;
    quizResultView.hidden = false;
    quizBack.hidden = true;
    quizProgress.style.width = "100%";
  };

  const openQuiz = () => {
    closeMenu();
    resetQuiz();
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    document.body.classList.add("modal-open");
    window.setTimeout(() => quizClose.focus(), 30);
  };

  const closeQuiz = () => {
    if (dialog.open && typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
    document.body.classList.remove("modal-open");
  };

  document.querySelectorAll("[data-open-quiz]").forEach((trigger) => {
    trigger.addEventListener("click", openQuiz);
  });

  quizClose.addEventListener("click", closeQuiz);
  quizBack.addEventListener("click", () => {
    if (currentQuestion > 0) {
      currentQuestion -= 1;
      renderQuestion();
    }
  });
  quizRestart.addEventListener("click", resetQuiz);

  dialog.addEventListener("cancel", () => {
    document.body.classList.remove("modal-open");
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeQuiz();
  });

  document.querySelectorAll("[data-close-quiz]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      closeQuiz();
      window.setTimeout(() => {
        target?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
      }, 80);
    });
  });

  /* Footer year */
  const currentYear = document.getElementById("currentYear");
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());

  /* Failsafe if an observer is interrupted by an unusual browser state */
  window.setTimeout(() => {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }, 6000);
})();
