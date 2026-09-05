/* ระบบสองภาษา (EN/TH) ใช้ร่วมกันทุกหน้า — จำภาษาที่เลือกไว้ใน localStorage ข้ามหน้า
   วิธีใช้ในมาร์กอัป:
     data-i18n="key"             แปลแล้วใส่เป็น textContent
     data-i18n-html="key"        แปลแล้วใส่เป็น innerHTML (ใช้เมื่อข้อความมีแท็ก เช่น <br>)
     data-i18n-placeholder="key" แปลแล้วใส่เป็น placeholder
     data-i18n-title="key"       แปลแล้วใส่เป็น title
     data-lang-btn="en"|"th"     ปุ่มสลับภาษา — คลิกแล้วเปลี่ยนภาษาทั้งเว็บทันที
   คำแปลอยู่ใน assets/js/i18n-dict.js (โหลดก่อนไฟล์นี้) ผ่าน window.BEQI_I18N_DICT
   ฟังก์ชัน I18N.t(key) ใช้เรียกคำแปลจาก JS อื่น ๆ (เช่น สคริปต์ที่ render การ์ด/แดชบอร์ดแบบไดนามิก)
   event "beqi:langchange" จะยิงทุกครั้งที่เปลี่ยนภาษา ให้สคริปต์หน้าไหนที่ render ข้อความเองมา
   ฟังแล้วสั่ง re-render ส่วนของตัวเองอีกที */
const BEQI_LANG_KEY = 'beqi_lang';

const I18N = (function(){
  const dict = window.BEQI_I18N_DICT || {};

  function getLang(){
    const saved = localStorage.getItem(BEQI_LANG_KEY);
    return (saved === 'en' || saved === 'th') ? saved : 'en';
  }

  function setLang(lang){
    if(lang !== 'en' && lang !== 'th') return;
    localStorage.setItem(BEQI_LANG_KEY, lang);
    apply();
  }

  function t(key){
    const entry = dict[key];
    if(!entry) return key;
    const lang = getLang();
    return entry[lang] ?? entry.en ?? entry.th ?? key;
  }

  function applyStatic(){
    const lang = getLang();
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function(el){
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el){
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function(el){
      el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
    });
    document.querySelectorAll('[data-lang-btn]').forEach(function(btn){
      const active = btn.getAttribute('data-lang-btn') === lang;
      btn.classList.toggle('font-bold', active);
      btn.setAttribute('aria-current', active ? 'true' : 'false');
    });
  }

  function apply(){
    applyStatic();
    document.dispatchEvent(new CustomEvent('beqi:langchange', {detail: {lang: getLang()}}));
  }

  function init(){
    document.querySelectorAll('[data-lang-btn]').forEach(function(btn){
      btn.addEventListener('click', function(){ setLang(btn.getAttribute('data-lang-btn')); });
    });
    apply();
  }

  return {getLang, setLang, t, apply, init};
})();

document.addEventListener('DOMContentLoaded', I18N.init);
