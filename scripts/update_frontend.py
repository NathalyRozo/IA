import os

def update_file(filename):
    if not os.path.exists(filename):
        print(f"File {filename} not found, skipping.")
        return

    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add Gemini sync button in header
    old_hdr = '<!-- PRD Ethical Limits Shortcut -->'
    new_hdr = '''<!-- Gemini Daily Sync Button -->
        <button id="btn-sync-gemini" onclick="syncDailyNewsWithGemini()" class="px-space-md py-1.5 rounded-full bg-primary-container text-on-primary-container hover:shadow-[0_0_18px_rgba(253,228,0,0.45)] flex items-center gap-1.5 font-label-sm text-label-sm uppercase font-bold transition-all border border-primary-fixed/40 cursor-pointer">
          <span id="sync-icon" class="material-symbols-outlined text-[16px] text-on-primary-container">sync</span>
          <span id="sync-text" class="hidden md:inline">Sincronizar Gemini</span>
        </button>

        <!-- PRD Ethical Limits Shortcut -->'''

    if old_hdr in content and 'id="btn-sync-gemini"' not in content:
        content = content.replace(old_hdr, new_hdr, 1)
        print(f'[{filename}] Header button added')

    # 2. Add full 10 topic buttons
    old_topics = '''            <button onclick="setTopicFilter('tecnologia', this)" data-topic="tecnologia" class="topic-filter-btn px-space-md py-space-xs rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container-high font-label-md text-label-md uppercase tracking-wider flex items-center gap-1.5 transition-all shrink-0 cursor-pointer">
              <span class="w-2 h-2 rounded-full bg-[#0066ff]"></span>
              Tecnología
            </button>'''

    new_topics = '''            <button onclick="setTopicFilter('tecnologia', this)" data-topic="tecnologia" class="topic-filter-btn px-space-md py-space-xs rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container-high font-label-md text-label-md uppercase tracking-wider flex items-center gap-1.5 transition-all shrink-0 cursor-pointer">
              <span class="w-2 h-2 rounded-full bg-[#0066ff]"></span>
              Tecnología
            </button>
            <button onclick="setTopicFilter('sociedad', this)" data-topic="sociedad" class="topic-filter-btn px-space-md py-space-xs rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container-high font-label-md text-label-md uppercase tracking-wider flex items-center gap-1.5 transition-all shrink-0 cursor-pointer">
              <span class="w-2 h-2 rounded-full bg-indigo-400"></span>
              Sociedad
            </button>
            <button onclick="setTopicFilter('conflicto-y-paz', this)" data-topic="conflicto-y-paz" class="topic-filter-btn px-space-md py-space-xs rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container-high font-label-md text-label-md uppercase tracking-wider flex items-center gap-1.5 transition-all shrink-0 cursor-pointer">
              <span class="w-2 h-2 rounded-full bg-amber-400"></span>
              Conflicto y Paz
            </button>
            <button onclick="setTopicFilter('medio-ambiente', this)" data-topic="medio-ambiente" class="topic-filter-btn px-space-md py-space-xs rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container-high font-label-md text-label-md uppercase tracking-wider flex items-center gap-1.5 transition-all shrink-0 cursor-pointer">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              Medio Ambiente
            </button>
            <button onclick="setTopicFilter('internacional', this)" data-topic="internacional" class="topic-filter-btn px-space-md py-space-xs rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container-high font-label-md text-label-md uppercase tracking-wider flex items-center gap-1.5 transition-all shrink-0 cursor-pointer">
              <span class="w-2 h-2 rounded-full bg-sky-400"></span>
              Internacional
            </button>
            <button onclick="setTopicFilter('cultura', this)" data-topic="cultura" class="topic-filter-btn px-space-md py-space-xs rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container-high font-label-md text-label-md uppercase tracking-wider flex items-center gap-1.5 transition-all shrink-0 cursor-pointer">
              <span class="w-2 h-2 rounded-full bg-purple-400"></span>
              Cultura
            </button>'''

    if old_topics in content and 'data-topic="sociedad"' not in content:
        content = content.replace(old_topics, new_topics, 1)
        print(f'[{filename}] 10 canonical topics added')

    # 3. Add Hero IDs
    if '<h1 class="font-headline-xl' in content and 'id="hero-headline"' not in content:
        content = content.replace(
            '<h1 class="font-headline-xl',
            '<h1 id="hero-headline" class="font-headline-xl',
            1
        )
        print(f'[{filename}] Hero headline ID added')

    if '<p class="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-2xl">' in content and 'id="hero-summary"' not in content:
        content = content.replace(
            '<p class="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-2xl">',
            '<p id="hero-summary" class="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-2xl">',
            1
        )
        print(f'[{filename}] Hero summary ID added')

    # 4. Add dynamic JS code before `switchView('inicio');` in DOMContentLoaded
    dynamic_js = '''
    // ==========================================
    // INTEGRACIÓN AUTOMATIZADA CON GEMINI Y CACHÉ DIARIA
    // ==========================================
    let dailyCachePayload = null;

    function slugifyTopic(topic) {
      if (!topic) return 'sociedad';
      const map = {
        'política': 'politica',
        'politica': 'politica',
        'economía': 'economia',
        'economia': 'economia',
        'sociedad': 'sociedad',
        'conflicto y paz': 'conflicto-y-paz',
        'conflicto': 'conflicto-y-paz',
        'salud': 'salud',
        'medio ambiente': 'medio-ambiente',
        'medioambiente': 'medio-ambiente',
        'internacional': 'internacional',
        'tecnología': 'tecnologia',
        'tecnologia': 'tecnologia',
        'deportes': 'deportes',
        'cultura': 'cultura'
      };
      return map[topic.toLowerCase().trim()] || 'sociedad';
    }

    function getToneBadgeColor(tone) {
      switch ((tone || '').toLowerCase()) {
        case 'alarma': return 'bg-red-500/20 text-red-300 border-red-500/40';
        case 'crítico':
        case 'critico': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
        case 'institucional': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
        case 'optimista': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
        default: return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
      }
    }

    function getTopicColor(topicSlug) {
      const colors = {
        'politica': { bg: 'bg-primary-container', text: 'text-on-primary-container' },
        'economia': { bg: 'bg-tertiary-container', text: 'text-on-tertiary-container' },
        'sociedad': { bg: 'bg-indigo-500/30 text-indigo-300' },
        'conflicto-y-paz': { bg: 'bg-amber-500/30 text-amber-300' },
        'salud': { bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
        'medio-ambiente': { bg: 'bg-emerald-500/30 text-emerald-300' },
        'internacional': { bg: 'bg-sky-500/30 text-sky-300' },
        'tecnologia': { bg: 'bg-cyan-500/30 text-cyan-300' },
        'deportes': { bg: 'bg-orange-500/30 text-orange-300' },
        'cultura': { bg: 'bg-purple-500/30 text-purple-300' }
      };
      return colors[topicSlug] || { bg: 'bg-slate-500/30 text-slate-300' };
    }

    async function loadDailyData(showNotification = false) {
      const syncIcon = document.getElementById('sync-icon');
      const syncText = document.getElementById('sync-text');

      if (syncIcon) syncIcon.classList.add('animate-spin');
      if (syncText) syncText.innerText = 'Sincronizando...';

      let data = null;
      let fromApi = false;

      // 1. Intentar API local FastAPI
      try {
        const resp = await fetch('http://localhost:8000/api/v1/cron/daily-cache', { cache: 'no-store' });
        if (resp.ok) {
          data = await resp.json();
          fromApi = true;
        }
      } catch (err) {
        // API local no disponible
      }

      // 2. Si falla API, cargar archivo local de caché estática
      if (!data) {
        try {
          const respStatic = await fetch('./data/daily_cache.json', { cache: 'no-store' });
          if (respStatic.ok) {
            data = await respStatic.json();
          }
        } catch (err) {
          console.warn('No se pudo cargar daily_cache.json:', err);
        }
      }

      if (syncIcon) syncIcon.classList.remove('animate-spin');
      if (syncText) syncText.innerText = 'Sincronizar Gemini';

      if (!data) return;

      dailyCachePayload = data;
      renderDailyDataToUI(data);

      if (showNotification) {
        const total = data.metadata ? data.metadata.total_articles : 50;
        showToast(`¡${total} noticias sincronizadas con Gemini (${fromApi ? 'API en vivo' : 'Caché diaria'})!`);
      }
    }

    function renderDailyDataToUI(data) {
      if (!data) return;

      const allArticles = (data.feed && data.feed.all_articles) ? data.feed.all_articles : [];
      if (!allArticles.length) return;

      // Actualizar Hero Card con artículo destacado
      const featured = allArticles[0];
      if (featured) {
        const heroTitle = document.getElementById('hero-headline');
        const heroSummary = document.getElementById('hero-summary');
        if (heroTitle) heroTitle.innerText = featured.title;
        if (heroSummary) heroSummary.innerText = featured.narrative_angle || featured.excerpt || '';
      }

      // Re-renderizar #news-grid con las noticias reales del día
      const grid = document.getElementById('news-grid');
      if (grid && allArticles.length > 0) {
        grid.innerHTML = allArticles.map((art) => {
          const slug = slugifyTopic(art.topic);
          const territory = art.source_scope === 'internacional' ? 'internacional' : 'nacional';
          const toneClass = getToneBadgeColor(art.tone);
          const topicColor = getTopicColor(slug);
          const initials = (art.source_name || 'MD').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

          const highlightsHtml = (art.highlighted_aspects && art.highlighted_aspects.length)
            ? `<div class="mt-2 text-[11px] text-on-surface-variant line-clamp-1"><strong class="text-on-surface">Destaca:</strong> ${art.highlighted_aspects.join(', ')}</div>`
            : '';

          return `
            <article class="news-card group flex flex-col justify-between rounded-2xl bg-surface-container p-space-lg shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-outline-variant/30 hover:border-primary-fixed/40" 
                     data-category="${slug}" 
                     data-territory="${territory}">
              <div class="flex flex-col gap-space-md">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center font-label-sm font-extrabold shadow-sm border border-outline-variant/20">
                      ${initials}
                    </div>
                    <span class="font-label-sm text-label-sm uppercase text-on-surface-variant font-bold">${art.source_name}</span>
                  </div>
                  <span class="px-2 py-0.5 rounded-full border text-[11px] font-bold uppercase tracking-wider ${toneClass}">
                    ${art.tone || 'Neutro'}
                  </span>
                </div>

                <div class="flex flex-col gap-space-xs">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="px-2 py-0.5 rounded-full ${topicColor.bg} text-[11px] font-bold uppercase tracking-wider">
                      ${art.topic}
                    </span>
                    <span class="text-[11px] text-on-surface-variant">
                      ${territory === 'nacional' ? '🇨🇴 Colombia' : '🌐 Internacional'}
                    </span>
                  </div>

                  <h3 class="font-headline-sm text-headline-sm text-primary font-bold transition-colors group-hover:text-primary-fixed leading-snug line-clamp-2 mt-1">
                    ${art.title}
                  </h3>

                  <p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                    ${art.narrative_angle || art.excerpt || 'Análisis de encuadre realizado por FOQUÉ.'}
                  </p>

                  ${highlightsHtml}
                </div>
              </div>

              <div class="flex items-center justify-between pt-space-md border-t border-outline-variant/20 mt-space-md">
                <a href="${art.url}" target="_blank" rel="noopener noreferrer" class="text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm uppercase tracking-wider flex items-center gap-1 transition-colors">
                  <span class="material-symbols-outlined text-[14px]">open_in_new</span> Leer en medio
                </a>
                <button type="button" onclick="switchView('contraste')" class="px-space-md py-space-xs rounded-full bg-surface-container-high hover:bg-primary-container hover:text-on-primary-container text-on-surface font-label-sm text-label-sm uppercase tracking-wider font-bold flex items-center gap-1 transition-all cursor-pointer">
                  <span>Contrastar</span>
                  <span class="material-symbols-outlined text-[14px]">compare_arrows</span>
                </button>
              </div>
            </article>
          `;
        }).join('');
      }

      // Reaplicar filtros temáticos y territoriales
      applyFilters();

      // Actualizar vista de Tendencias
      if (data.trends && data.trends.ranking) {
        const trendsTbody = document.querySelector('#trends-table tbody');
        if (trendsTbody) {
          trendsTbody.innerHTML = data.trends.ranking.map(tr => {
            const badgeClass = tr.status === 'en_auge' 
              ? 'bg-emerald-500/20 text-emerald-300' 
              : tr.status === 'estable' ? 'bg-blue-500/20 text-blue-300' : 'bg-red-500/20 text-red-300';
            const labelStatus = tr.status === 'en_auge' ? 'En Auge' : tr.status === 'estable' ? 'Estable' : 'En Declive';

            return `
              <tr class="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                <td class="p-space-md font-bold text-primary">#${tr.rank}</td>
                <td class="p-space-md font-bold text-on-surface">${tr.topic}</td>
                <td class="p-space-md text-on-surface-variant">${tr.count} notas</td>
                <td class="p-space-md font-mono text-tertiary-fixed font-bold">${tr.share_pct}%</td>
                <td class="p-space-md"><span class="px-2.5 py-1 rounded-full text-xs font-bold uppercase ${badgeClass}">${labelStatus}</span></td>
                <td class="p-space-md text-on-surface-variant text-right font-mono">${tr.velocity}</td>
              </tr>
            `;
          }).join('');
        }
      }

      // Actualizar vista de Contraste con acontecimientos detectados
      if (data.contrast && data.contrast.events && data.contrast.events.length > 0) {
        const eventSelect = document.getElementById('event-selector');
        if (eventSelect) {
          eventSelect.innerHTML = data.contrast.events.map(ev => 
            `<option value="${ev.id}">${ev.canonical_title}</option>`
          ).join('');
        }

        const contrastOverview = document.getElementById('contrast-overview-text');
        if (contrastOverview && data.contrast.events[0]) {
          contrastOverview.innerText = data.contrast.events[0].summary || data.contrast.events[0].canonical_title;
        }
      }

      // Actualizar vista de Informes
      if (data.reports && data.reports.latest_report) {
        const rep = data.reports.latest_report;
        const repAiMarkdown = document.getElementById('report-ai-markdown-display');
        if (repAiMarkdown && rep.ai_interpretation_markdown) {
          let html = rep.ai_interpretation_markdown;
          html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-on-surface mt-4 mb-2">$1</h3>');
          html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-extrabold text-primary mt-6 mb-3">$1</h2>');
          html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-black text-primary mb-4">$1</h1>');
          html = html.replace(/^\\> (.*$)/gim, '<blockquote class="border-l-4 border-primary-fixed pl-4 my-3 text-on-surface-variant italic bg-surface-container-low p-2 rounded-r">$1</blockquote>');
          html = html.replace(/\\*\\*(.*?)\\*\\*/gim, '<strong class="text-on-surface font-bold">$1</strong>');
          html = html.replace(/\\*(.*?)\\*/gim, '<em class="text-primary-fixed-dim">$1</em>');
          html = html.replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-on-surface-variant mb-1">$1</li>');
          html = html.replace(/\\n\\n/gim, '<p class="my-2 text-on-surface-variant leading-relaxed"></p>');
          repAiMarkdown.innerHTML = html;
        }
      }
    }

    async function syncDailyNewsWithGemini() {
      const syncIcon = document.getElementById('sync-icon');
      const syncText = document.getElementById('sync-text');

      if (syncIcon) syncIcon.classList.add('animate-spin');
      if (syncText) syncText.innerText = 'Analizando con Gemini...';
      showToast('Recolectando noticias de los 10 medios y analizando encuadres con Gemini...');

      try {
        const resp = await fetch('http://localhost:8000/api/v1/cron/daily-update?sync=true', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        if (resp.ok) {
          await loadDailyData(true);
        } else {
          await loadDailyData(true);
        }
      } catch (err) {
        console.warn('Backend local no detectado, cargando caché local:', err);
        await loadDailyData(false);
        showToast('Noticias del día actualizadas desde la caché generada con Gemini.');
      } finally {
        if (syncIcon) syncIcon.classList.remove('animate-spin');
        if (syncText) syncText.innerText = 'Sincronizar Gemini';
      }
    }
'''

    if 'function syncDailyNewsWithGemini' not in content:
        content = content.replace(
            "switchView('inicio');",
            f"{dynamic_js}\n      switchView('inicio');\n      loadDailyData(false);",
            1
        )
        print(f'[{filename}] Dynamic JS integration added')

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'[{filename}] Completed successfully')

if __name__ == '__main__':
    for fname in ['index.html', 'preview.html', 'App Agenda Setting .html']:
        update_file(fname)
