/**
 * ArenaPromoManager - Recomendación pedagógica hacia Sudoku Arena
 * Sugiere con control estricto de frecuencia dar el salto a la competición
 * multijugador en Sudoku Arena cuando el jugador demuestra soltura y nivel.
 * Totalmente internacionalizado en 9 idiomas.
 */

export const ARENA_PROMO_I18N = {
  es: {
    badge: "🏆 Nivel Avanzado Detectado",
    title: "¿Listo para el siguiente reto?",
    msg: "Has completado este Sudoku en {time} ({level}). ¡Tu capacidad de deducción lógica está lista para el siguiente nivel!<br><br>Te invitamos a descubrir <strong>Sudoku Arena</strong>, nuestra plataforma oficial de <strong>duelos multijugador</strong> en tiempo real, <strong>auditoría cognitiva</strong> de puntos y <strong>retos semanales</strong> mundiales.",
    btn_arena: "⚔️ Entrar a Sudoku Arena Gratis",
    btn_stay: "Seguir practicando en Top Sudoku",
    mute_text: "Recordármelo más adelante",
    footer_text: "Sudoku Arena: Duelos & Competición",
    diff_names: { facil: "Fácil", medio: "Medio", dificil: "Difícil", endemoniado: "Endemoniado" }
  },
  en: {
    badge: "🏆 Advanced Skill Detected",
    title: "Ready for the next challenge?",
    msg: "You solved this Sudoku in {time} ({level}). Your deductive reasoning is ready for the next level!<br><br>We invite you to discover <strong>Sudoku Arena</strong>, our official platform for real-time <strong>multiplayer duels</strong>, <strong>cognitive autonomy scoring</strong>, and global <strong>weekly challenges</strong>.",
    btn_arena: "⚔️ Try Sudoku Arena Free",
    btn_stay: "Keep practicing in Top Sudoku",
    mute_text: "Remind me later",
    footer_text: "Sudoku Arena: Duels & Competition",
    diff_names: { facil: "Easy", medio: "Medium", dificil: "Hard", endemoniado: "Evil" }
  },
  ja: {
    badge: "🏆 上級レベル到達！",
    title: "次のステージへ挑戦しませんか？",
    msg: "この数独を {time}（{level}）で見事にクリアしました！あなたの論理的推論力は更なる高みへ進む準備が整っています。<br><br>リアルタイム<strong>マルチプレイヤー対戦</strong>、<strong>認知自立度監査</strong>、そして世界ランキングを競う<strong>週間公式チャレンジ</strong>が楽しめる<strong>「Sudoku Arena」</strong>をぜひ体験してみてください。",
    btn_arena: "⚔️ Sudoku Arena を無料で体験",
    btn_stay: "Top Sudoku で練習を続ける",
    mute_text: "後で通知する",
    footer_text: "Sudoku Arena: 対戦＆競技",
    diff_names: { facil: "初級", medio: "中級", dificil: "上級", endemoniado: "達人" }
  },
  fr: {
    badge: "🏆 Niveau Avancé Détecté",
    title: "Prêt pour le défi supérieur ?",
    msg: "Vous avez résolu ce Sudoku en {time} ({level}). Vos compétences en déduction logique sont prêtes pour l'étape suivante !<br><br>Nous vous invitons à découvrir <strong>Sudoku Arena</strong>, notre plateforme officielle de <strong>duels multijoueurs</strong> en temps réel, <strong>score d'autonomie cognitive</strong> et <strong>défis hebdomadaires</strong> mondiaux.",
    btn_arena: "⚔️ Essayer Sudoku Arena Gratuitement",
    btn_stay: "Continuer l'entraînement sur Top Sudoku",
    mute_text: "Me le rappeler plus tard",
    footer_text: "Sudoku Arena : Duels & Compétition",
    diff_names: { facil: "Facile", medio: "Moyen", dificil: "Difficile", endemoniado: "Diabolique" }
  },
  de: {
    badge: "🏆 Fortgeschrittenes Niveau Erreicht",
    title: "Bereit für die nächste Herausforderung?",
    msg: "Sie haben dieses Sudoku in {time} ({level}) gelöst. Ihre Kombinationsgabe ist bereit für die nächste Stufe!<br><br>Wir laden Sie ein, <strong>Sudoku Arena</strong> zu entdecken: unsere offizielle Plattform für <strong>Echtzeit-Duelle</strong>, <strong>kognitive Autonomie-Bewertung</strong> und weltweite <strong>Wochen-Challenges</strong>.",
    btn_arena: "⚔️ Sudoku Arena Kostenlos Testen",
    btn_stay: "Weiter in Top Sudoku üben",
    mute_text: "Später erinnern",
    footer_text: "Sudoku Arena: Duelle & Wettbewerb",
    diff_names: { facil: "Einfach", medio: "Mittel", dificil: "Schwer", endemoniado: "Teuflisch" }
  },
  ca: {
    badge: "🏆 Nivell Avançat Detectat",
    title: "A punt per al següent repte?",
    msg: "Has resolt aquest Sudoku en {time} ({level}). La teva capacitat deductiva està a punt per al següent nivell!<br><br>Et convidem a descobrir <strong>Sudoku Arena</strong>, la nostra plataforma oficial de <strong>duels multijugador</strong> en temps real, <strong>auditoria cognitiva</strong> de punts i <strong>reptes setmanals</strong> mundials.",
    btn_arena: "⚔️ Entrar a Sudoku Arena de Franc",
    btn_stay: "Continuar practicant a Top Sudoku",
    mute_text: "Recorda-m'ho més endavant",
    footer_text: "Sudoku Arena: Duels & Competició",
    diff_names: { facil: "Fàcil", medio: "Mitjà", dificil: "Difícil", endemoniado: "Endimoniat" }
  },
  va: {
    badge: "🏆 Nivell Avançat Detectat",
    title: "A punt per al següent repte?",
    msg: "Has resolt este Sudoku en {time} ({level}). La teua capacitat deductiva està a punt per al següent nivell!<br><br>Et convidem a descobrir <strong>Sudoku Arena</strong>, la nostra plataforma oficial de <strong>duels multijugador</strong> en temps real, <strong>auditoria cognitiva</strong> de punts i <strong>reptes setmanals</strong> mundials.",
    btn_arena: "⚔️ Entrar a Sudoku Arena de Debades",
    btn_stay: "Continuar practicant en Top Sudoku",
    mute_text: "Recorda-m'ho més avant",
    footer_text: "Sudoku Arena: Duels & Competició",
    diff_names: { facil: "Fàcil", medio: "Mitjà", dificil: "Difícil", endemoniado: "Endimoniat" }
  },
  eu: {
    badge: "🏆 Maila Aurreratua Detektatu Da",
    title: "Prest zaude hurrengo erronkarako?",
    msg: "Sudoku hau {time}-tan ({level}) ebatzi duzu. Zure gaitasun deduktiboa hurrengo mailarako prest dago!<br><br><strong>Sudoku Arena</strong> ezagutzera gonbidatzen zaitugu: <strong>jokalari anitzeko lehiak</strong> denbora errealean, puntuazioaren <strong>auditoria kognitiboa</strong> eta mundu mailako <strong>asteko erronkak</strong>.",
    btn_arena: "⚔️ Probatu Sudoku Arena Doan",
    btn_stay: "Top Sudokun praktikatzen jarraitu",
    mute_text: "Gogorarazi geroago",
    footer_text: "Sudoku Arena: Lehiak & Erronkak",
    diff_names: { facil: "Erraza", medio: "Ertaina", dificil: "Zaila", endemoniado: "Deabruzkoa" }
  },
  gl: {
    badge: "🏆 Nivel Avanzado Detectado",
    title: "Listo para o seguinte reto?",
    msg: "Resolviches este Sudoku en {time} ({level}). A túa capacidade deductiva está lista para o seguinte nivel!<br><br>Convidámoste a descubrir <strong>Sudoku Arena</strong>, a nosa plataforma oficial de <strong>duelos multixogador</strong> en tempo real, <strong>auditoría cognitiva</strong> de puntos e <strong>retos semanais</strong> mundiais.",
    btn_arena: "⚔️ Entrar a Sudoku Arena de Balde",
    btn_stay: "Seguir practicando en Top Sudoku",
    mute_text: "Lembrarme máis adiante",
    footer_text: "Sudoku Arena: Duelos & Competición",
    diff_names: { facil: "Fácil", medio: "Medio", dificil: "Difícil", endemoniado: "Endiañado" }
  }
};

export class ArenaPromoManager {
  constructor() {
    this.storageKey = 'top_sudoku_arena_promo_v1';
    this.lang = this.detectUserLang();
    this.modal = null;
  }

  detectUserLang() {
    if (this.customLang && ARENA_PROMO_I18N[this.customLang]) {
      return this.customLang;
    }
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = (urlParams.get('lang') || '').toLowerCase();
      if (urlLang && ARENA_PROMO_I18N[urlLang]) return urlLang;
    } catch (e) {}

    const htmlLang = (document.documentElement.lang || '').split('-')[0].toLowerCase();
    if (htmlLang && ARENA_PROMO_I18N[htmlLang]) return htmlLang;

    const nav = (navigator.language || navigator.userLanguage || 'es').split('-')[0].toLowerCase();
    const supported = Object.keys(ARENA_PROMO_I18N);
    return supported.includes(nav) ? nav : 'es';
  }

  getArenaUrl() {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const baseUrl = isLocal ? 'http://localhost/sudoku-arena/' : 'https://guitusol.github.io/sudoku-arena/';
    return `${baseUrl}?lang=${this.lang}`;
  }

  getPromoState() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {
        shownCount: 0,
        lastShownTime: 0,
        gamesWonSince: 0,
        mutedUntil: 0,
        clicked: false
      };
    } catch (e) {
      return { shownCount: 0, lastShownTime: 0, gamesWonSince: 0, mutedUntil: 0, clicked: false };
    }
  }

  savePromoState(state) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(state));
    } catch (e) {}
  }

  init() {
    this.modal = document.getElementById('modal-arena-promo');
    this.updateFooterLink();
    this.bindEvents();
  }

  updateFooterLink() {
    const footerLink = document.getElementById('footer-link-arena');
    const footerText = document.getElementById('footer-text-arena');
    if (footerLink) {
      footerLink.href = this.getArenaUrl();
    }
    if (footerText) {
      const texts = ARENA_PROMO_I18N[this.lang] || ARENA_PROMO_I18N.es;
      footerText.textContent = texts.footer_text;
    }
  }

  bindEvents() {
    const closeBtn = document.getElementById('btn-close-arena-promo');
    const stayBtn = document.getElementById('btn-arena-promo-stay');
    const goBtn = document.getElementById('btn-arena-promo-go');

    if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal());
    if (stayBtn) stayBtn.addEventListener('click', () => this.closeModal());

    if (goBtn) {
      goBtn.addEventListener('click', () => {
        const state = this.getPromoState();
        state.clicked = true;
        // Si hace clic, silenciar sugerencias por 14 días para no atosigar
        state.mutedUntil = Date.now() + (14 * 24 * 3600 * 1000);
        this.savePromoState(state);
        this.closeModal();
      });
    }

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal && !this.modal.classList.contains('hidden')) {
        this.closeModal();
      }
    });
  }

  /**
   * Evalúa si corresponde mostrar la sugerencia al ganar una partida.
   * Reglas de nivel y frecuencia:
   * 1. Nivel avanzado: el sudoku completado es Medio, Difícil o Endemoniado, o total victorias >= 2.
   * 2. Frecuencia espaciada:
   *    - Primera vez: se muestra al primer sudoku Medio/Difícil/Endemoniado ganado.
   *    - Posteriores: se muestra solo cada 4 o más victorias Y tras al menos 48 horas.
   *    - Muted: si el usuario marcó silenciar, respeta la fecha.
   */
  checkAndSuggest(timeFormatted, level, storage) {
    const state = this.getPromoState();
    state.gamesWonSince = (state.gamesWonSince || 0) + 1;

    // Comprobar si está silenciado
    if (state.mutedUntil && Date.now() < state.mutedUntil) {
      this.savePromoState(state);
      return false;
    }

    // 1. Detección de nivel del jugador
    const isAdvancedLevel = (level === 'medio' || level === 'dificil' || level === 'endemoniado');
    let totalSolved = 0;
    try {
      if (storage && typeof storage.getAllPuzzles === 'function') {
        totalSolved = storage.getAllPuzzles().filter(p => p.isSolved).length;
      }
    } catch (e) {}

    const hasSufficientSkill = isAdvancedLevel || totalSolved >= 2;
    if (!hasSufficientSkill) {
      this.savePromoState(state);
      return false;
    }

    // 2. Control de frecuencia (espaciada)
    const isFirstTime = (state.shownCount === 0);
    const enoughGamesSince = state.gamesWonSince >= 4;
    const enoughTimeSince = (Date.now() - (state.lastShownTime || 0)) >= (48 * 3600 * 1000);

    const shouldShow = isFirstTime || (enoughGamesSince && enoughTimeSince);

    if (shouldShow) {
      state.shownCount = (state.shownCount || 0) + 1;
      state.lastShownTime = Date.now();
      state.gamesWonSince = 0;
      this.savePromoState(state);

      this.openModal(timeFormatted, level);
      return true;
    }

    this.savePromoState(state);
    return false;
  }

  openModal(timeFormatted, level) {
    if (!this.modal) return;

    this.lang = this.detectUserLang();
    const texts = ARENA_PROMO_I18N[this.lang] || ARENA_PROMO_I18N.es;
    const diffName = (texts.diff_names && texts.diff_names[level]) ? texts.diff_names[level] : level;

    // Asignar textos traducidos
    const badgeEl = document.getElementById('arena-promo-badge');
    const titleEl = document.getElementById('arena-promo-title');
    const msgEl = document.getElementById('arena-promo-message');
    const goBtn = document.getElementById('btn-arena-promo-go');
    const btnTextEl = document.getElementById('arena-promo-btn-text');
    const stayTextEl = document.getElementById('arena-promo-stay-text');
    const muteTextEl = document.getElementById('arena-promo-mute-text');
    const chkMute = document.getElementById('chk-arena-promo-mute');

    if (badgeEl) badgeEl.textContent = texts.badge;
    if (titleEl) titleEl.textContent = texts.title;
    if (msgEl) {
      const renderedMsg = texts.msg
        .replace('{time}', timeFormatted)
        .replace('{level}', diffName);
      msgEl.innerHTML = renderedMsg;
    }

    if (goBtn) {
      goBtn.href = this.getArenaUrl();
    }
    if (btnTextEl) btnTextEl.textContent = texts.btn_arena;
    if (stayTextEl) stayTextEl.textContent = texts.btn_stay;
    if (muteTextEl) muteTextEl.textContent = texts.mute_text;
    if (chkMute) chkMute.checked = false;

    this.modal.classList.remove('hidden');
  }

  closeModal() {
    if (!this.modal) return;
    const chkMute = document.getElementById('chk-arena-promo-mute');
    if (chkMute && chkMute.checked) {
      const state = this.getPromoState();
      // Silenciar sugerencia durante 7 días
      state.mutedUntil = Date.now() + (7 * 24 * 3600 * 1000);
      this.savePromoState(state);
    }
    this.modal.classList.add('hidden');
  }
}
