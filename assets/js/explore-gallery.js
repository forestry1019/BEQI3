/* S1 — "สำรวจพื้นที่" (Explore) โหมดของ Explore the Coast
   อ่านข้อมูลจริงจาก data/beqi.json (ชุดเดียวกับที่ picker.js/app.js ใช้) มาแสดงเป็นการ์ดสำรวจสถานที่
   โหมด "วาดขอบเขต & เปรียบเทียบ" (ควบคุมโดย picker.js) เป็นคนละส่วนในหน้าเดียวกัน ดูสคริปต์แยกด้านล่าง */
(function(){
  const BAND_TEXT_COLOR = {A:'text-primary', B:'text-primary', C:'text-coral-warmth', D:'text-secondary', E:'text-secondary'};

  BeqiCore.loadData().then(function(D){
    let selectedZoneId = D.zones[0].id;

    document.getElementById('zoneFilterList').innerHTML = D.zones.map(function(z, i){
      const dotColor = ['bg-secondary', 'bg-coral-warmth', 'bg-primary-container'][i % 3];
      return '<button class="zonefilter flex items-center justify-between font-label-caps text-label-caps px-3 py-2 organic-border transition-colors" data-zone="' + z.id + '">' +
        '<span>' + z.name_th + ': ' + z.sub_th + '</span><span class="w-2 h-2 rounded-full ' + dotColor + '"></span></button>';
    }).join('');

    document.getElementById('zoneCardList').innerHTML = D.zones.map(function(z){
      return '<div class="zonecard bg-white organic-border p-5 sketch-shadow cursor-pointer" data-zone="' + z.id + '">' +
        '<div class="flex justify-between items-start mb-2"><h4 class="font-headline-md text-headline-md text-andaman-deep">' + z.name_th + '</h4>' +
        '<div class="flex flex-col items-end"><span class="font-data-viz text-data-viz font-bold ' + (BAND_TEXT_COLOR[z.band] || 'text-primary') + '">' + BeqiCore.fx(z.beqi, 0) + '</span>' +
        '<span class="font-label-caps text-[10px] text-outline">BEQI</span></div></div>' +
        '<p class="font-body-md text-[14px] text-on-surface-variant mb-4 line-clamp-2">' + z.sub_th + ' · พื้นที่บก ' + BeqiCore.fx(z.land_area_km2, 1) + ' ตร.กม.</p>' +
        '<div class="flex gap-2"><span class="flex items-center gap-1 font-label-caps text-[10px] bg-primary/10 text-primary px-2 py-1 rounded">' +
        '<span class="material-symbols-outlined text-[12px]">eco</span> ' + z.asset + '</span></div></div>';
    }).join('');

    function applySelection(){
      document.querySelectorAll('.zonefilter').forEach(function(b){
        b.classList.toggle('bg-primary', b.dataset.zone === selectedZoneId);
        b.classList.toggle('text-white', b.dataset.zone === selectedZoneId);
        b.classList.toggle('bg-surface-container-low', b.dataset.zone !== selectedZoneId);
        b.classList.toggle('text-primary', b.dataset.zone !== selectedZoneId);
      });
      document.querySelectorAll('.zonecard').forEach(function(c){
        c.classList.toggle('opacity-100', c.dataset.zone === selectedZoneId);
        c.classList.toggle('opacity-80', c.dataset.zone !== selectedZoneId);
      });
      renderDetail();
    }

    function renderDetail(){
      const z = D.zones.find(function(zz){ return zz.id === selectedZoneId; });
      document.getElementById('detailPlace').textContent = z.name_th;
      document.getElementById('detailScore').textContent = BeqiCore.fx(z.beqi, 0);
      document.getElementById('detailName').textContent = z.sub_th;
      document.getElementById('detailDesc').textContent =
        'พื้นที่บก ' + BeqiCore.fx(z.land_area_km2, 1) + ' ตร.กม. ระดับ ' + z.band + ' · ผ่านการรับรอง ' + z.cert +
        ' · ช่วงความเชื่อมั่น 95% [' + BeqiCore.fx(z.mc.lo, 0) + ', ' + BeqiCore.fx(z.mc.hi, 0) + ']';
      const grade = z.beqi >= 80 ? 'A+' : z.beqi >= 70 ? 'A' : z.beqi >= 60 ? 'B' : 'C';
      document.getElementById('detailGrade').textContent = grade;
      document.getElementById('detailAirNote').textContent =
        'ความหนาแน่นพื้นที่สีเขียว ' + BeqiCore.fx(z.raw.green_pct, 1) + '% · ดัชนีการเชื่อมโยงระบบนิเวศ ' + BeqiCore.fx(z.norm[1], 3);
      const visualPct = Math.round(((z.norm[0] + z.norm[3]) / 2) * 100);
      document.getElementById('detailVisualPct').textContent = visualPct + '%';
      document.getElementById('detailBarA').style.width = visualPct + '%';
      document.getElementById('detailBarB').style.width = Math.round(z.norm[3] * 100) + '%';
      document.getElementById('detailVisualNote').textContent =
        'ประมาณจากความหนาแน่นพื้นที่สีเขียวและองค์ประกอบไบโอฟิลิกของโซนนี้ (ตัวแทนมุมมองเชิงทัศนียภาพสู่ธรรมชาติ)';
    }

    document.querySelectorAll('.zonefilter').forEach(function(b){
      b.addEventListener('click', function(){ selectedZoneId = b.dataset.zone; applySelection(); });
    });
    document.querySelectorAll('.zonecard').forEach(function(c){
      c.addEventListener('click', function(){ selectedZoneId = c.dataset.zone; applySelection(); });
    });
    applySelection();
  });
})();
