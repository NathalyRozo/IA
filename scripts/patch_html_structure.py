import os
import re

FILES = ['index.html', 'preview.html', 'App Agenda Setting .html']

NEW_DROPDOWN_HTML = '''<div id="theme-dropdown-menu" class="hidden absolute top-full left-0 right-0 mt-2 bg-surface-container-high rounded-xl border border-outline-variant/40 shadow-2xl z-30 overflow-hidden py-1 max-h-72 overflow-y-auto">
                <button type="button" onclick="selectTheme('Todos los Temas', 'view_stream')" class="w-full px-space-md py-space-sm text-left flex items-center gap-2 hover:bg-surface-bright transition-colors text-on-surface font-body-sm text-body-sm cursor-pointer">
                  <span class="material-symbols-outlined text-[18px]">view_stream</span>
                  <span>Todos los Temas (10)</span>
                </button>
                <button type="button" onclick="selectTheme('Política', 'account_balance')" class="w-full px-space-md py-space-sm text-left flex items-center gap-2 hover:bg-surface-bright transition-colors text-on-surface font-body-sm text-body-sm cursor-pointer">
                  <span class="material-symbols-outlined text-[18px]">account_balance</span>
                  <span>Política</span>
                </button>
                <button type="button" onclick="selectTheme('Economía', 'trending_up')" class="w-full px-space-md py-space-sm text-left flex items-center gap-2 hover:bg-surface-bright transition-colors text-on-surface font-body-sm text-body-sm cursor-pointer">
                  <span class="material-symbols-outlined text-[18px]">trending_up</span>
                  <span>Economía</span>
                </button>
                <button type="button" onclick="selectTheme('Conflicto y Paz', 'shield')" class="w-full px-space-md py-space-sm text-left flex items-center gap-2 hover:bg-surface-bright transition-colors text-on-surface font-body-sm text-body-sm cursor-pointer">
                  <span class="material-symbols-outlined text-[18px]">shield</span>
                  <span>Conflicto y Paz</span>
                </button>
                <button type="button" onclick="selectTheme('Sociedad', 'groups')" class="w-full px-space-md py-space-sm text-left flex items-center gap-2 hover:bg-surface-bright transition-colors text-on-surface font-body-sm text-body-sm cursor-pointer">
                  <span class="material-symbols-outlined text-[18px]">groups</span>
                  <span>Sociedad</span>
                </button>
                <button type="button" onclick="selectTheme('Salud', 'vital_signs')" class="w-full px-space-md py-space-sm text-left flex items-center gap-2 hover:bg-surface-bright transition-colors text-on-surface font-body-sm text-body-sm cursor-pointer">
                  <span class="material-symbols-outlined text-[18px]">vital_signs</span>
                  <span>Salud</span>
                </button>
                <button type="button" onclick="selectTheme('Medio Ambiente', 'eco')" class="w-full px-space-md py-space-sm text-left flex items-center gap-2 hover:bg-surface-bright transition-colors text-on-surface font-body-sm text-body-sm cursor-pointer">
                  <span class="material-symbols-outlined text-[18px]">eco</span>
                  <span>Medio Ambiente</span>
                </button>
                <button type="button" onclick="selectTheme('Internacional', 'public')" class="w-full px-space-md py-space-sm text-left flex items-center gap-2 hover:bg-surface-bright transition-colors text-on-surface font-body-sm text-body-sm cursor-pointer">
                  <span class="material-symbols-outlined text-[18px]">public</span>
                  <span>Internacional</span>
                </button>
                <button type="button" onclick="selectTheme('Tecnología', 'memory')" class="w-full px-space-md py-space-sm text-left flex items-center gap-2 hover:bg-surface-bright transition-colors text-on-surface font-body-sm text-body-sm cursor-pointer">
                  <span class="material-symbols-outlined text-[18px]">memory</span>
                  <span>Tecnología</span>
                </button>
                <button type="button" onclick="selectTheme('Deportes', 'sports_soccer')" class="w-full px-space-md py-space-sm text-left flex items-center gap-2 hover:bg-surface-bright transition-colors text-on-surface font-body-sm text-body-sm cursor-pointer">
                  <span class="material-symbols-outlined text-[18px]">sports_soccer</span>
                  <span>Deportes</span>
                </button>
                <button type="button" onclick="selectTheme('Cultura', 'theater_comedy')" class="w-full px-space-md py-space-sm text-left flex items-center gap-2 hover:bg-surface-bright transition-colors text-on-surface font-body-sm text-body-sm cursor-pointer">
                  <span class="material-symbols-outlined text-[18px]">theater_comedy</span>
                  <span>Cultura</span>
                </button>
              </div>'''

OUTLETS_SELECTOR_HTML = '''<div class="flex flex-col gap-2 w-full mt-3 pt-3 border-t border-outline-variant/20">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <span class="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider font-bold">Seleccionar medios a contrastar (5 a 10 medios en columnas simultáneas):</span>
                <span class="font-label-sm text-label-sm text-on-surface-variant font-mono" id="selected-outlets-count">10 medios seleccionados</span>
              </div>
              <div class="flex flex-wrap gap-1.5" id="contrast-outlet-chips">
                <!-- Se llena dinámicamente con los 10 medios -->
              </div>
            </div>
          <!-- Framing Filter Pills -->'''

def update_html(filename):
    if not os.path.exists(filename):
        return
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Dropdown de temas
    pattern_dropdown = r'<div id="theme-dropdown-menu"[^>]*>.*?</div>'
    content = re.sub(pattern_dropdown, NEW_DROPDOWN_HTML, content, flags=re.DOTALL)

    # 2. Selector de medios en Contraste
    if 'id="contrast-outlet-chips"' not in content:
        content = content.replace('<!-- Framing Filter Pills -->', OUTLETS_SELECTOR_HTML, 1)

    # 3. Columnas de Contraste para 5 a 10 medios
    old_grid = 'class="grid grid-cols-1 lg:grid-cols-3 gap-space-lg mb-space-xl" id="contrast-columns"'
    new_grid = 'class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-space-lg mb-space-xl overflow-x-auto pb-4" id="contrast-columns"'
    content = content.replace(old_grid, new_grid)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated: {filename}")

if __name__ == '__main__':
    for fname in FILES:
        update_html(fname)
