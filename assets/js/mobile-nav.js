/* เมนูมือถือ (hamburger) ใช้ร่วมกันทุกหน้า — ปุ่ม <button class="md:hidden"> ในเฮดเดอร์เดิมมีอยู่แล้วทุกหน้า
   แต่ไม่เคยถูกเชื่อมกับอะไรเลย (ไม่มี id, ไม่มี event, ไม่มีแผงเมนู) ทำให้บนมือถือกดแล้วไม่มีอะไรเกิดขึ้น
   และเมนู/ปุ่มเปลี่ยนภาษาที่อยู่ใน <nav class="hidden md:flex"> เข้าถึงไม่ได้เลยบนจอเล็ก
   สคริปต์นี้จึงต้อง generic พอที่จะทำงานกับทุกหน้าโดยไม่ต้องแก้ HTML ของแต่ละหน้าเพิ่ม: หา <nav> ที่มี
   class hidden+md:flex ในเฮดเดอร์ แล้วดึง sibling ทั้งหมดในกล่องเดียวกัน (nav, ปุ่มเปลี่ยนภาษา, ปุ่ม CTA
   ถ้ามี) ยกเว้นปุ่ม hamburger เอง มา clone ใส่แผงเมนูที่กางลงมาเมื่อกด */
(function(){
  function init(){
    document.querySelectorAll('header').forEach(function(header){
      const nav = header.querySelector('nav.hidden.md\\:flex, nav[class*="hidden"][class*="md:flex"]');
      const toggle = header.querySelector('button.md\\:hidden');
      if(!nav || !toggle) return;

      const group = nav.parentElement; // กล่องที่รวม nav + ปุ่มเปลี่ยนภาษา + CTA + hamburger ไว้ด้วยกัน
      if(!group) return;

      const panel = document.createElement('div');
      panel.className = 'mobile-nav-panel hidden md:hidden border-t border-limestone-gray bg-background';
      panel.setAttribute('data-mobile-nav-panel', '');

      const inner = document.createElement('div');
      inner.className = 'flex flex-col gap-1 px-margin-mobile py-4 max-w-container-max mx-auto';
      panel.appendChild(inner);

      Array.from(group.children).forEach(function(child){
        if(child === toggle) return;
        // ดึงมาใส่แผงมือถือเฉพาะ element ที่ต้นฉบับซ่อนไว้บนมือถืออยู่แล้ว (มี class "hidden") เช่น nav,
        // ปุ่มเปลี่ยนภาษา, ปุ่ม CTA — ส่วน element ที่ไม่ได้ซ่อน (เช่นปุ่ม Log Out ที่ตั้งใจให้กดได้บนมือถือ
        // อยู่แล้วโดยไม่ต้องพึ่งเมนูนี้) ปล่อยไว้ที่เดิม ไม่ clone ซ้ำ กันปุ่มซ้ำ/id ซ้ำ/ปุ่มที่ไม่มี event
        if(!child.classList.contains('hidden')) return;
        const clone = child.cloneNode(true);
        // เอา hidden/md:flex ออกจากตัว clone เพื่อให้โชว์ในแผงมือถือได้ตามปกติ (ตัวต้นฉบับใน header ยังซ่อนอยู่เหมือนเดิม)
        clone.classList.remove('hidden');
        clone.classList.remove('md:flex');
        clone.removeAttribute('id'); // กัน id ซ้ำกับต้นฉบับ (คลิกใน panel นี้ทำงานผ่าน handler ที่ผูกใหม่ด้านล่างเท่านั้น)
        if(clone.tagName === 'NAV'){
          clone.className = 'flex flex-col gap-1';
        } else {
          clone.classList.add('flex');
          clone.classList.add('py-2');
        }
        inner.appendChild(clone);
      });

      header.insertAdjacentElement('afterend', panel);

      // I18N.init() ผูก click listener กับปุ่ม [data-lang-btn] ไปแล้วตอน DOMContentLoaded — แต่ตอนนั้นปุ่ม
      // ในแผงมือถือนี้ยังไม่ถูกสร้าง (clone ทีหลัง) ต้องผูกใหม่เองที่นี่ ส่วนสถานะ active/bold ของปุ่มยัง
      // อัปเดตถูกต้องอัตโนมัติเพราะ I18N.apply() ทำ querySelectorAll ใหม่ทุกครั้งที่เปลี่ยนภาษาอยู่แล้ว
      // หมายเหตุ: I18N คือ top-level const ใน i18n.js — เข้าถึงได้ตรง ๆ ด้วยชื่อ (สคริปต์ปกติทุกตัวใน
      // หน้าเดียวกันแชร์ scope ระดับบนสุดร่วมกัน) แต่ "window.I18N" จะเป็น undefined เสมอเพราะ const/let
      // ระดับบนสุดไม่ผูกเป็น property ของ window — เช็ค typeof แทนการเช็ค window.I18N
      panel.querySelectorAll('[data-lang-btn]').forEach(function(btn){
        btn.addEventListener('click', function(){
          if(typeof I18N !== 'undefined') I18N.setLang(btn.getAttribute('data-lang-btn'));
        });
      });

      function closeMenu(){
        panel.classList.add('hidden');
        toggle.querySelector('.material-symbols-outlined').textContent = 'menu';
        toggle.setAttribute('aria-expanded', 'false');
      }
      function openMenu(){
        panel.classList.remove('hidden');
        toggle.querySelector('.material-symbols-outlined').textContent = 'close';
        toggle.setAttribute('aria-expanded', 'true');
      }
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Menu');
      toggle.addEventListener('click', function(){
        panel.classList.contains('hidden') ? openMenu() : closeMenu();
      });
      // ปิดเมนูอัตโนมัติเมื่อกดลิงก์ในแผง หรือเมื่อจอกว้างขึ้นเกิน breakpoint md (เช่นหมุนจอ/ขยายหน้าต่าง)
      panel.addEventListener('click', function(e){
        if(e.target.closest('a')) closeMenu();
      });
      window.matchMedia('(min-width: 768px)').addEventListener('change', function(e){
        if(e.matches) closeMenu();
      });
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
