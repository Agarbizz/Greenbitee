// Healthy Recipes page functionality (no HTML/CSS file changes required)
// - Renders recipe cards from a JS dataset
// - Filters by name and category using existing inputs in .search-filter
// - Opens a modal with full recipe details (ingredients UL, steps OL, nutrition table)

(function () {
  const onReady = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  };

  // --- Data: recipe collection ---
  const RECIPES = [
  {
    id: 'fresh-green-salad',
    name: 'Fresh Green Salad',
    category: 'Salads',
    image: 'GreenBitee/image/Salad.jpg', // fixed path relative to recipes.html
    description: 'A crunchy mix of greens, cucumbers, and a light vinaigrette.',
    ingredients: [
      '2 cups mixed greens',
      '1/2 cucumber, sliced',
      '1/4 cup cherry tomatoes',
      '1 tbsp olive oil',
      '1 tsp lemon juice',
      'Salt & pepper to taste'
    ],
      steps: [
        'Wash and dry the greens.',
        'Slice cucumber and halve the tomatoes.',
        'Whisk olive oil, lemon juice, salt, and pepper.',
        'Toss everything together and serve fresh.'
      ],
      nutrition: { calories: 180, protein: '3 g', carbs: '10 g', fats: '14 g' }
    },
    {
      id: 'berry-smoothie',
      name: 'Berry Smoothie',
      category: 'Smoothies',
      image: 'GreenBitee/image/Smoothie.jpg', // fixed path relative to recipes.html
      description: 'Refreshing blend of strawberries, blueberries, and yogurt.',
      ingredients: [
        '1/2 cup strawberries',
        '1/2 cup blueberries',
        '1/2 banana',
        '1/2 cup yogurt',
        '1/2 cup milk or water',
        'Honey to taste (optional)'
      ],
      steps: [
        'Add all ingredients to a blender.',
        'Blend until smooth and creamy.',
        'Pour into a glass and enjoy cold.'
      ],
      nutrition: { calories: 220, protein: '7 g', carbs: '42 g', fats: '3 g' }
    },
    {
      id: 'overnight-oats',
      name: 'Overnight Oats',
      category: 'Breakfast',
      image: 'GreenBitee/image/Oats.jpg', // fixed path relative to recipes.html
      description: 'Oats soaked in almond milk topped with fruits & nuts.',
      ingredients: [
        '1/2 cup rolled oats',
        '1/2 cup almond milk',
        '1 tbsp chia seeds',
        '1 tsp honey or maple syrup',
        'Sliced fruit & nuts for topping'
      ],
      steps: [
        'Mix oats, almond milk, chia, and sweetener in a jar.',
        'Refrigerate overnight (or at least 4 hours).',
        'Top with fruit and nuts before serving.'
      ],
      nutrition: { calories: 300, protein: '8 g', carbs: '45 g', fats: '9 g' }
    },
    {
      id: 'veggie-wrap',
      name: 'Veggie Wrap',
      category: 'Wraps',
      image: 'GreenBitee/image/VeggieWrap.jpg', // fixed path relative to recipes.html
      description: 'Whole wheat wrap stuffed with fresh vegetables & hummus.',
      ingredients: [
        '1 whole wheat tortilla',
        '2 tbsp hummus',
        '1/4 cup shredded carrots',
        '1/4 cup bell peppers, sliced',
        'Lettuce leaves',
        'Salt & pepper'
      ],
      steps: [
        'Spread hummus on tortilla.',
        'Layer veggies evenly.',
        'Season, roll tightly, and slice in half.'
      ],
      nutrition: { calories: 280, protein: '9 g', carbs: '45 g', fats: '8 g' }
    },
    // --- Added recipes ---
    {
      id: 'quinoa-kale-salad',
      name: 'Quinoa Kale Salad',
      category: 'Salads',
      image: 'GreenBitee/image/quinoa-kale-salad.jpg', // fixed path relative to recipes.html
      description: 'Protein-packed quinoa with kale, cherry tomatoes, and lemon dressing.',
      ingredients: [
        '1 cup cooked quinoa',
        '2 cups chopped kale',
        '1/2 cup cherry tomatoes',
        '2 tbsp olive oil',
        '1 tbsp lemon juice',
        'Salt & pepper to taste'
      ],
      steps: [
        'Massage kale with a bit of olive oil and salt.',
        'Combine quinoa, kale, and tomatoes in a bowl.',
        'Whisk olive oil and lemon; toss and season.'
      ],
      nutrition: { calories: 320, protein: '10 g', carbs: '42 g', fats: '12 g' }
    },
    {
      id: 'mango-spinach-smoothie',
      name: 'Mango Spinach Smoothie',
      category: 'Smoothies',
      image: 'GreenBitee/image/mango-spinach-smoothie.jpg', // fixed path relative to recipes.html
      description: 'Tropical mango blended with spinach and coconut water.',
      ingredients: [
        '1 cup mango chunks',
        '1 cup spinach',
        '1/2 banana',
        '3/4 cup coconut water',
        'Ice cubes'
      ],
      steps: [
        'Add all ingredients to blender.',
        'Blend until smooth.',
        'Serve immediately.'
      ],
      nutrition: { calories: 200, protein: '3 g', carbs: '48 g', fats: '1 g' }
    },
    {
      id: 'avocado-toast-egg',
      name: 'Avocado Toast with Egg',
      category: 'Breakfast',
      image: 'GreenBitee/image/avocado-toast-egg.jpg', // fixed path relative to recipes.html
      description: 'Crunchy toast topped with mashed avocado and a soft egg.',
      ingredients: [
        '1 slice whole grain bread',
        '1/2 ripe avocado',
        '1 egg (poached or fried)',
        'Chili flakes, salt & pepper'
      ],
      steps: [
        'Toast bread and mash avocado with seasoning.',
        'Spread avocado on toast and top with egg.',
        'Sprinkle chili flakes and serve.'
      ],
      nutrition: { calories: 350, protein: '12 g', carbs: '28 g', fats: '20 g' }
    },
    {
      id: 'chickpea-salad-wrap',
      name: 'Chickpea Salad Wrap',
      category: 'Wraps',
      image: 'GreenBitee/image/chickpea-salad-wrap.jpg', // fixed path relative to recipes.html
      description: 'Creamy chickpea salad wrapped with crunchy veggies.',
      ingredients: [
        '1 whole wheat tortilla',
        '1/2 cup cooked chickpeas (lightly mashed)',
        '1 tbsp Greek yogurt or hummus',
        '1/4 cup diced cucumber',
        'Lettuce leaves',
        'Salt, pepper, lemon juice'
      ],
      steps: [
        'Mix chickpeas with yogurt/hummus, lemon, salt and pepper.',
        'Layer lettuce and cucumber on tortilla.',
        'Add chickpea mix, roll, and slice.'
      ],
      nutrition: { calories: 310, protein: '11 g', carbs: '48 g', fats: '7 g' }
    }
  ];

  const debounce = (window.GB && GB.debounce) ? GB.debounce : ((fn, ms) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  });

  onReady(() => {
    // Page guard: only run on recipes page that has the expected containers
    const grid = document.querySelector('.recipes .recipe-grid');
    const searchInput = document.querySelector('.search-filter input[type="text"]');
    const categorySelect = document.querySelector('.search-filter select');
    if (!grid || !searchInput || !categorySelect) return;

    // Render helpers
    const createCard = (recipe) => {
      const card = document.createElement('div');
      card.className = 'recipe-card';
      card.setAttribute('data-id', recipe.id);
      card.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.name}">
        <h3>${recipe.name}</h3>
        <p>${recipe.description}</p>
      `;
      // Open modal on click
      card.addEventListener('click', () => openModal(recipe));
      return card;
    };

    const renderList = (items) => {
      const frag = document.createDocumentFragment();
      if (!items.length) {
        const empty = document.createElement('p');
        empty.textContent = 'No recipes found.';
        frag.appendChild(empty);
        grid.replaceChildren(frag);
        return;
      }
      items.forEach((r) => frag.appendChild(createCard(r)));
      // Atomically replace children to minimize layout thrash/flicker
      grid.replaceChildren(frag);
    };

    // Filtering
    const getFilters = () => ({
      q: (searchInput.value || '').trim().toLowerCase(),
      cat: (categorySelect.value || '').trim()
    });

    const applyFilters = () => {
      const { q, cat } = getFilters();
      const filtered = RECIPES.filter((r) => {
        const matchesName = !q || r.name.toLowerCase().includes(q);
        const matchesCat = !cat || cat === 'All Categories' || r.category === cat;
        return matchesName && matchesCat;
      });
      renderList(filtered);
    };

    // Initial render from data
    renderList(RECIPES);

    // Wire up inputs
    searchInput.addEventListener('input', debounce(applyFilters, 150));
    categorySelect.addEventListener('change', applyFilters);

    // Add a Clear Filters button without changing HTML
    const filterBar = document.querySelector('.search-filter');
    if (filterBar && !filterBar.querySelector('[data-clear-filters]')) {
      const clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.textContent = 'Clear Filters';
      clearBtn.setAttribute('data-clear-filters', '1');
      // Use CSS class defined in css/recipes.css instead of inline styles
      clearBtn.className = 'clear-filters-btn';
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        // Reset category to the 'All Categories' option if present, else empty
        const allOpt = Array.from(categorySelect.options).find(o => o.text.trim() === 'All Categories');
        categorySelect.value = allOpt ? allOpt.value : '';
        applyFilters();
      });
      filterBar.appendChild(clearBtn);
    }

    // --- Modal implementation (created dynamically, minimal inline styles) ---
    let modalEl = null;

    const ensureModal = () => {
      if (modalEl) return modalEl;
      modalEl = document.createElement('div');
      modalEl.style.position = 'fixed';
      modalEl.style.inset = '0';
      modalEl.style.background = 'rgba(0,0,0,0.5)';
      modalEl.style.display = 'none';
      modalEl.style.alignItems = 'center';
      modalEl.style.justifyContent = 'center';
      modalEl.style.zIndex = '9999';

      const dialog = document.createElement('div');
      dialog.style.background = '#fff';
      dialog.style.maxWidth = '800px';
      dialog.style.width = '90%';
      dialog.style.maxHeight = '85vh';
      dialog.style.overflow = 'auto';
      dialog.style.borderRadius = '12px';
      dialog.style.padding = '20px';
      dialog.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
      dialog.style.position = 'relative'; // ensure close button absolute positioning works

      const closeBtn = document.createElement('button');
      closeBtn.textContent = '×';
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.style.position = 'absolute';
      closeBtn.style.top = '10px';
      closeBtn.style.right = '16px';
      closeBtn.style.fontSize = '28px';
      closeBtn.style.background = 'transparent';
      closeBtn.style.border = 'none';
      closeBtn.style.cursor = 'pointer';
      closeBtn.style.lineHeight = '1';
      closeBtn.style.color = '#333';
      closeBtn.addEventListener('mouseenter', () => { closeBtn.style.opacity = '0.7'; });
      closeBtn.addEventListener('mouseleave', () => { closeBtn.style.opacity = '1'; });

      const content = document.createElement('div');
      content.className = 'recipe-modal-content';

      dialog.appendChild(closeBtn);
      dialog.appendChild(content);
      modalEl.appendChild(dialog);
      document.body.appendChild(modalEl);

      const close = () => hideModal();
      closeBtn.addEventListener('click', close);
      modalEl.addEventListener('click', (e) => { if (e.target === modalEl) close(); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

      return modalEl;
    };

    const buildNutritionTable = (nutrition) => {
      // Returns a table element as required by the spec
      const table = document.createElement('table');
      table.style.width = '100%';
      table.style.borderCollapse = 'collapse';
      const headers = ['Nutrient', 'Amount'];
      const rows = [
        ['Calories', nutrition.calories],
        ['Protein', nutrition.protein],
        ['Carbs', nutrition.carbs],
        ['Fats', nutrition.fats]
      ];

      const thead = document.createElement('thead');
      const trh = document.createElement('tr');
      headers.forEach((h) => {
        const th = document.createElement('th');
        th.textContent = h;
        th.style.borderBottom = '1px solid #ddd';
        th.style.textAlign = 'left';
        th.style.padding = '8px';
        trh.appendChild(th);
      });
      thead.appendChild(trh);

      const tbody = document.createElement('tbody');
      rows.forEach(([k, v]) => {
        const tr = document.createElement('tr');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        td1.textContent = k;
        td2.textContent = String(v);
        td1.style.padding = '8px';
        td2.style.padding = '8px';
        td1.style.borderBottom = '1px solid #f1f1f1';
        td2.style.borderBottom = '1px solid #f1f1f1';
        tr.appendChild(td1); tr.appendChild(td2);
        tbody.appendChild(tr);
      });

      table.appendChild(thead);
      table.appendChild(tbody);
      return table;
    };

    const openModal = (recipe) => {
      const m = ensureModal();
      const content = m.querySelector('.recipe-modal-content');
      content.innerHTML = '';

      const titleRow = document.createElement('div');
      titleRow.style.display = 'flex';
      titleRow.style.alignItems = 'center';
      titleRow.style.justifyContent = 'space-between';
      const title = document.createElement('h2');
      title.textContent = recipe.name;
      title.style.margin = '0';
      const saveBtn = document.createElement('button');
      saveBtn.textContent = 'Save Recipe';
      saveBtn.style.border = '1px solid #ddd';
      saveBtn.style.borderRadius = '8px';
      saveBtn.style.padding = '8px 12px';
      saveBtn.style.cursor = 'pointer';
      saveBtn.addEventListener('click', () => {
        const key = 'gb_saved_recipes';
        const list = (window.GB && GB.loadList) ? GB.loadList(key) : (JSON.parse(localStorage.getItem(key) || '[]'));
        if (!list.includes(recipe.id)) {
          list.push(recipe.id);
          if (window.GB && GB.saveList) GB.saveList(key, list); else localStorage.setItem(key, JSON.stringify(list));
        }
        if (window.GB && GB.showToast) GB.showToast(`Saved: ${recipe.name}`); else alert(`Saved: ${recipe.name}`);
      });
      titleRow.appendChild(title);
      titleRow.appendChild(saveBtn);

      const img = document.createElement('img');
      img.src = recipe.image;
      img.alt = recipe.name;
      img.style.width = '100%';
      img.style.borderRadius = '8px';
      img.style.margin = '12px 0';

      const desc = document.createElement('p');
      desc.textContent = recipe.description;

      const columns = document.createElement('div');
      columns.style.display = 'grid';
      columns.style.gridTemplateColumns = '1fr 1fr';
      columns.style.gap = '20px';

      // Ingredients (UL)
      const ingWrap = document.createElement('div');
      const ingHeader = document.createElement('h3');
      ingHeader.textContent = 'Ingredients';
      const ul = document.createElement('ul');
      recipe.ingredients.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
      });
      ingWrap.appendChild(ingHeader);
      ingWrap.appendChild(ul);

      // Steps (OL)
      const stepWrap = document.createElement('div');
      const stepHeader = document.createElement('h3');
      stepHeader.textContent = 'Steps';
      const ol = document.createElement('ol');
      recipe.steps.forEach((s) => {
        const li = document.createElement('li');
        li.textContent = s;
        ol.appendChild(li);
      });
      stepWrap.appendChild(stepHeader);
      stepWrap.appendChild(ol);

      // Nutrition table
      const nutriWrap = document.createElement('div');
      const nutriHeader = document.createElement('h3');
      nutriHeader.textContent = 'Nutrition Info';
      const table = buildNutritionTable(recipe.nutrition);

      // Append assembled content
      content.appendChild(titleRow);
      content.appendChild(img);
      content.appendChild(desc);
      content.appendChild(columns);
      columns.appendChild(ingWrap);
      columns.appendChild(stepWrap);
      content.appendChild(nutriHeader);
      content.appendChild(table);

      showModal();
    };

    const showModal = () => {
      ensureModal();
      modalEl.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    };

    const hideModal = () => {
      if (!modalEl) return;
      modalEl.style.display = 'none';
      document.body.style.overflow = '';
    };
  });
})();
