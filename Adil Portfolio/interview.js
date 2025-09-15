(function () {
    const $log   = document.getElementById('chatLog');
    const $form  = document.getElementById('chatForm');
    const $input = document.getElementById('chatInput');
    const $send  = document.getElementById('sendBtn');

    // ===== Orb micro-interactions =====
    const orb = document.querySelector('.orb');
    function setOrb(state){ /* orb state visuals disabled intentionally */ }
    // pointer interactivity: tilt/parallax + playful hue shift
    (function(){
      if(!orb) return;
      const wrap = document.querySelector('.orb-wrap');
      const canvas = orb.querySelector('.orb-canvas');
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let rafId = null;
      let targetHue = 335;
      let baseHue = 335;
      let startTs = performance.now();

      function lerp(a,b,t){ return a + (b-a)*t; }
      function animate(){
        const now = performance.now();
        const elapsed = (now - startTs) / 1000;
        const hueDrift = baseHue + Math.sin(elapsed * 0.25) * 6;
        targetHue = lerp(targetHue, hueDrift, 0.06);
        if(!reduce){
          const pulse = 1 + Math.sin(elapsed * 0.8) * 0.02;
          orb.style.transform = `scale(${pulse.toFixed(3)})`;
        }
        orb.style.setProperty('--hue', String(targetHue.toFixed(1)));
        draw(elapsed);
        rafId = requestAnimationFrame(animate);
      }

      // pointer interactions removed — autonomous animation instead

      // idle pulse slower when reduced motion
      if(reduce){
        orb.style.setProperty('--sweep','60s');
        orb.style.transition = 'opacity .2s ease';
      }

      // no pointer or click listeners

      // === Concentric ring canvas ===
      if(canvas && canvas.getContext){
        const ctx2d = canvas.getContext('2d', { alpha: true });
        let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
        function resize(){
          const rect = canvas.getBoundingClientRect();
          canvas.width = Math.floor(rect.width * dpr);
          canvas.height = Math.floor(rect.height * dpr);
          ctx2d.setTransform(dpr,0,0,dpr,0,0);
        }
        window.addEventListener('resize', resize);
        resize();

        const RINGS = 160; // many thin lines
        let t0 = performance.now();

        function draw(elapsed){
          const w = canvas.clientWidth, h = canvas.clientHeight;
          const cx = w/2, cy = h/2;
          const rMax = Math.min(w,h)/2 - 2;
          ctx2d.clearRect(0,0,w,h);

          // background very soft hue wash
          const bg = ctx2d.createRadialGradient(cx, cy*0.95, rMax*0.05, cx, cy*1.05, rMax*1.0);
          bg.addColorStop(0, `hsla(${targetHue.toFixed(0)},75%,72%,0.10)`);
          bg.addColorStop(1, `rgba(0,0,0,0)`);
          ctx2d.fillStyle = bg;
          ctx2d.fillRect(0,0,w,h);

          if(reduce){ return; }

          const t = elapsed || (performance.now() - t0) / 1000;
          const breathe = 1 + Math.sin(t*0.8)*0.012;
          const rotate = t * 0.15; // slow rotation

          ctx2d.save();
          ctx2d.translate(cx, cy);
          ctx2d.rotate(rotate);
          ctx2d.translate(-cx, -cy);

          ctx2d.globalCompositeOperation = 'lighter';
          for(let i=0;i<RINGS;i++){
            const p = i/(RINGS-1);
            const r = rMax * p * breathe;
            const alpha = 0.06 + (1 - Math.abs(p-0.75)) * 0.05; // brighter near upper band
            const hueEdge = targetHue + (p*30 - 15);

            ctx2d.strokeStyle = `hsla(${hueEdge.toFixed(1)}, 72%, ${ (60 + p*18).toFixed(1)}%, ${alpha.toFixed(3)} )`;
            ctx2d.lineWidth = 1;
            ctx2d.beginPath();
            ctx2d.arc(cx, cy, r, 0, Math.PI*2);
            ctx2d.stroke();
          }
          ctx2d.globalCompositeOperation = 'source-over';
          ctx2d.restore();
        }

        if(rafId===null) rafId = requestAnimationFrame(animate); else draw();
      } else {
        function draw() { /* noop */ }
      }
    })();
  
    // --- Minimal knowledge base: expand freely ---
    const KB = [
      {
        tag: "about",
        q: ["who are you","about you","background","bio","experience","cv","resume"],
        a: "Haha, gotchya, this is still in Beta I'm working on it! "
      },
      {
        tag: "strengths",
        q: ["strengths","superpower","what are you good at","skills"],
        a: "Strengths: systems thinking, shaping ambiguous problems into testable bets, and coaching designers through clear critique. I keep quality high with solid design systems and code-linked tokens."
      },
      {
        tag: "process",
        q: ["process","how do you work","design process","ux process","workflow","approach"],
        a: "Typical loop: clarify outcomes → shape bets (constraints, risks) → low-fi flows → quick prototypes → usability + metrics → iterate. Weekly rituals with eng/PM keep scope honest."
      },
      {
        tag: "impact",
        q: ["impact","metrics","measure","kpi","success"],
        a: "I tie design to a few signals: task success rate, time-to-value, adoption/retention, and friction scores. I align these with PM so the team sees impact, not output."
      },
      {
        tag: "tools",
        q: ["tools","stack","figma","handoff","components","design system","tokens"],
        a: "Figma (Variants + Tokens Studio), Storybook for live components, and lightweight decision docs. I prefer code-linked tokens so design & build stay in sync."
      },
      {
        tag: "skoda",
        q: ["skoda","workshop manual","vehicle health","engine ui","automotive","ota"],
        a: "Škoda Workshop Manual concept: modular layout surfacing diagnostics, parts inventory, and OTA updates. Goal: reduce search time and highlight actionable state."
      },
      {
        tag: "leadership",
        q: ["leadership","manager","coaching","team","hiring","culture"],
        a: "Leadership: give context, set clear bars, remove blockers, and coach via narrative + critique. I like pairing designers with engineers early so trade-offs are visible and decisions stick."
      }
    ];
  
    // --- Utilities ---
    const ctx = []; // last ~10 exchanges for light continuity
    const MAX_CTX = 10;
  
    function append(role, text) {
      const el = document.createElement('div');
      el.className = 'msg ' + (role === 'user' ? 'user' : 'bot');
      el.textContent = text;
      $log.appendChild(el);
      $log.scrollTop = $log.scrollHeight;
      return el;
    }
  
    function typing(on) {
      let t = document.getElementById('typing');
      if (on) {
        if (!t) {
          t = document.createElement('div');
          t.id = 'typing';
          t.className = 'msg bot';
          t.textContent = '…';
          $log.appendChild(t);
        }
      } else if (t) {
        t.remove();
      }
      $log.scrollTop = $log.scrollHeight;
    }
  
    // simple fuzzy score
    function score(query, item) {
      const q = query.toLowerCase();
      let s = 0;
      item.q.forEach(k => { if (q.includes(k)) s += 3; });
      if (item.a.toLowerCase().includes(q)) s += 1;
      return s;
    }
  
    function searchKB(query) {
      const ranked = KB.map(it => ({ it, s: score(query, it) }))
                       .sort((a,b)=> b.s - a.s);
      return ranked[0].s > 0 ? ranked[0].it.a : null;
    }
  
    function synthesizeFallback(q) {
      // Lightweight contextual fallback using recent turns
      const prev = ctx.slice(-4).map(x => (x.role + ': ' + x.text)).join(' | ');
      return (
        "Here’s my take: I’m a hands-on design leader who ships. " +
        "Ask about process, metrics, case studies (e.g., the Škoda concept), or how I collaborate with PM/Eng." +
        (prev ? " (We’ve been discussing: " + prev + ")" : "")
      );
    }
  
    async function respond(q) {
      const kb = searchKB(q);
      return kb || synthesizeFallback(q);
    }
  
    // typing activity => reflect on orb
    let __typingTimer;
    $input.addEventListener('input', () => {
      if (!$input) return;
      if ($input.value.trim().length) {
        setOrb('is-typing');
      } else {
        setOrb();
      }
      clearTimeout(__typingTimer);
      __typingTimer = setTimeout(() => setOrb(), 1200);
    });

    // --- Events ---
    $form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const q = ($input.value || '').trim();
      if (!q) return;
      setOrb('is-sending');

      // UI
      $send.disabled = true;
      append('user', q);
      ctx.push({ role: 'user', text: q });
      while (ctx.length > MAX_CTX) ctx.shift();
      $input.value = '';

      try {
        setOrb('is-awaiting');
        typing(true);
        const a = await respond(q);
        typing(false);
        setOrb('is-replying');
        append('bot', a);
        ctx.push({ role: 'bot', text: a });
        while (ctx.length > MAX_CTX) ctx.shift();
      } catch (err) {
        typing(false);
        append('bot', 'Oops—something went wrong. Mind trying again?');
        setOrb();
        console.error(err);
      } finally {
        $send.disabled = false;
        $input.focus();
        setOrb();
      }
    });
  
    // enter to submit (and shift+enter for newline if you later switch to <textarea>)
    $input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        $form.dispatchEvent(new Event('submit'));
      }
    });
  
    // Greeting
    append('bot', "Hey! I'm Adil’s interview bot. What would you like to know about my experience, process, or projects?");
    setOrb();
  })();