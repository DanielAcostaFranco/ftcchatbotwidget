(function () {
  "use strict";

  const CONFIG = {
    chatUrl: "https://script.google.com/a/macros/byui.edu/s/AKfycby72_k2_9Yug_FC55ECoE5sg_zwl_4MkLpyHPdBTlefhr5OGZMHr0GFzBk02OgxGADQAQ/exec",
    size: 70,
    offset: 20,
    zIndex: 999999,
    minWidth: 350,
    minHeight: 500
  };

  window.BYUISupport = {
    isMaximized: false,
    
    toggleChat: function () {
      const frame = document.getElementById("byui-chat-container");
      
      if (frame.classList.contains("byui-show")) {
        // CERRAR (Desvanecimiento hacia afuera)
        frame.classList.remove("byui-show");
        // Esperamos a que termine la animación (300ms) antes de ocultar el display
        setTimeout(() => {
          if (!frame.classList.contains("byui-show")) {
            frame.style.display = "none";
          }
        }, 300);
      } else {
        // ABRIR (Desvanecimiento hacia adentro)
        frame.style.display = "flex";
        // Pequeño delay para que el navegador detecte el cambio de display y anime la opacidad
        setTimeout(() => {
          frame.classList.add("byui-show");
        }, 10);
      }
    },

    maximize: function () {
      const frame = document.getElementById("byui-chat-container");
      const maxBtn = document.getElementById("byui-max-btn");
      
      if (!this.isMaximized) {
        frame.style.width = "90vw";
        frame.style.height = "90vh";
        frame.style.bottom = "5vh";
        frame.style.right = "5vw";
        maxBtn.innerHTML = "❐";
        this.isMaximized = true;
      } else {
        frame.style.width = CONFIG.minWidth + "px";
        frame.style.height = CONFIG.minHeight + "px";
        frame.style.bottom = (CONFIG.offset + CONFIG.size + 25) + "px";
        frame.style.right = CONFIG.offset + "px";
        maxBtn.innerHTML = "▢";
        this.isMaximized = false;
      }
    }
  };

  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
      #byui-chat-container {
        display: none; /* Estado inicial oculto */
        flex-direction: column;
        position: fixed;
        bottom: ${CONFIG.offset + CONFIG.size + 25}px;
        right: ${CONFIG.offset}px;
        width: ${CONFIG.minWidth}px;
        height: ${CONFIG.minHeight}px;
        min-width: 250px;
        min-height: 300px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: ${CONFIG.zIndex};
        background: white;
        overflow: visible;

        /* --- ESTILOS DE DESVANECIMIENTO --- */
        opacity: 0;
        transform: translateY(20px) scale(0.95);
        transition: opacity 0.3s ease, transform 0.3s ease, width 0.3s ease, height 0.3s ease, bottom 0.3s ease, right 0.3s ease;
        pointer-events: none;
      }

      /* Clase que activa la visibilidad */
      #byui-chat-container.byui-show {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: all;
      }

      #byui-resizer {
        position: absolute;
        top: -5px;
        left: -5px;
        width: 25px;
        height: 25px;
        cursor: nwse-resize;
        z-index: 1000000;
        background-color: #006eb6;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 10px rgba(0,110,182,0.5);
        color: white;
        font-size: 14px;
        user-select: none;
      }

      .byui-header {
        background: #006eb6;
        color: white;
        padding: 10px 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-family: sans-serif;
        border-radius: 12px 12px 0 0;
        flex-shrink: 0;
      }

      .byui-controls button {
        background: none; border: none; color: white;
        font-size: 18px; cursor: pointer; margin-left: 10px;
      }

      /* --- ANIMACION NEON ORIGINAL --- */
      #byui-support-bubble {
        position: fixed;
        bottom: ${CONFIG.offset}px;
        right: ${CONFIG.offset}px;
        width: ${CONFIG.size}px;
        height: ${CONFIG.size}px;
        border-radius: 50%;
        background: #006eb6;
        border: none;
        cursor: pointer;
        z-index: ${CONFIG.zIndex};
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px;
        transition: transform 0.3s ease;
        box-shadow: 0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 30px #00d4ff;
        animation: neon-pulse 2s infinite;
      }

      #byui-support-bubble:hover { transform: scale(1.1) rotate(5deg); }

      @keyframes neon-pulse {
        0% { box-shadow: 0 0 5px #00d4ff, 0 0 10px #00d4ff; }
        50% { box-shadow: 0 0 20px #00d4ff, 0 0 35px #00d4ff, 0 0 50px #00d4ff; }
        100% { box-shadow: 0 0 5px #00d4ff, 0 0 10px #00d4ff; }
      }
    `;
    document.head.appendChild(style);
  }

  function makeResizable(container) {
    const resizer = document.createElement("div");
    resizer.id = "byui-resizer";
    resizer.innerHTML = "⤡"; 
    container.appendChild(resizer);

    resizer.addEventListener("mousedown", (e) => {
      e.preventDefault();
      if (window.BYUISupport.isMaximized) return;
      
      const startWidth = container.offsetWidth;
      const startHeight = container.offsetHeight;
      const startX = e.clientX;
      const startY = e.clientY;

      function doResize(ev) {
        const newWidth = startWidth + (startX - ev.clientX);
        const newHeight = startHeight + (startY - ev.clientY);
        if (newWidth > 250) container.style.width = newWidth + "px";
        if (newHeight > 300) container.style.height = newHeight + "px";
      }

      function stopResize() {
        window.removeEventListener("mousemove", doResize);
        window.removeEventListener("mouseup", stopResize);
      }

      window.addEventListener("mousemove", doResize);
      window.addEventListener("mouseup", stopResize);
    });
  }

  function createChatElements() {
    const container = document.createElement("div");
    container.id = "byui-chat-container";
    container.innerHTML = `
      <div class="byui-header">
        <span style="font-size: 14px; font-weight: bold;">FTC Chatbot</span>
        <div class="byui-controls">
          <button id="byui-max-btn" onclick="window.BYUISupport.maximize()">▢</button>
          <button onclick="window.BYUISupport.toggleChat()">×</button>
        </div>
      </div>
      <iframe src="${CONFIG.chatUrl}" style="flex-grow: 1; border: none; width: 100%;"></iframe>
    `;
    document.body.appendChild(container);
    makeResizable(container);

    const btn = document.createElement("button");
    btn.id = "byui-support-bubble";
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:100%; height:100%; filter: drop-shadow(0 0 5px #fff);">
        <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
      </svg>
    `;
    btn.onclick = window.BYUISupport.toggleChat;
    document.body.appendChild(btn);
  }

  injectStyles();
  createChatElements();
})();
