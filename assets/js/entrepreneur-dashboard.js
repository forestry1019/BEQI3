/* S2.1 — Coastal Stewardship (Entrepreneur Dashboard)
   ต้นแบบ: ยังไม่มีระบบ GEE ต่อทรัพย์สินรายแปลงจริง จึงใช้คะแนนของโซนที่ผู้ประกอบการเลือกตอนสมัคร (S2)
   เป็นชุดข้อมูลตั้งต้น — เมื่อผู้ประกอบการวาดขอบเขตแปลงจริงผ่าน "New Assessment" (แท็บวาดขอบเขตใน S1)
   ค่อยแทนที่ด้วยคะแนนจาก Earth Engine ของแปลงนั้นโดยตรง */
(function(){
  const session = BeqiCore.requireRole('entrepreneur', 'entrepreneur-portal.html');
  if(!session) return;

  document.getElementById('sidebarWho').textContent = session.propertyName + ' · ' + session.repName;
  document.getElementById('logoutBtn').addEventListener('click', function(){
    BeqiCore.clearSession();
    window.location.href = 'index.html';
  });
  document.querySelectorAll('.comingsoon').forEach(function(a){
    a.addEventListener('click', function(e){
      e.preventDefault();
      alert('ฟีเจอร์นี้ยังอยู่ระหว่างพัฒนา — จะเปิดใช้งานในเวอร์ชันถัดไป');
    });
  });

  const IND_LABEL = ['ความหนาแน่นพื้นที่สีเขียว','การเชื่อมโยงระบบนิเวศ','การเข้าถึงแหล่งน้ำธรรมชาติ','องค์ประกอบไบโอฟิลิก'];
  const RECO = [
    {icon:'park', title:'เพิ่มพื้นที่พืชพรรณพื้นถิ่น', desc:'ปลูกพืชชายฝั่งพื้นถิ่น (เช่น หูกวาง) ในพื้นที่เปลี่ยนผ่านเพื่อเพิ่มความหนาแน่นของเรือนยอดและปรับสภาพภูมิอากาศจุลภาค'},
    {icon:'hub', title:'เชื่อมผืนพืชพรรณให้ต่อเนื่อง', desc:'ลดการตัดขาดของแนวต้นไม้ระหว่างแปลง เพื่อให้สัตว์ป่าและเมล็ดพันธุ์เคลื่อนย้ายได้ง่ายขึ้น'},
    {icon:'water_drop', title:'ปรับปรุงการเข้าถึงแหล่งน้ำ', desc:'เพิ่มจุดเชื่อมสายตา/ทางเดินสู่แหล่งน้ำธรรมชาติ หรือทำระบบเก็บน้ำฝนเพื่อใช้ในภูมิทัศน์'},
    {icon:'auto_awesome', title:'เพิ่มองค์ประกอบไบโอฟิลิกในอาคาร', desc:'เพิ่มวัสดุธรรมชาติ แสงธรรมชาติ และมุมมองสู่ธรรมชาติในพื้นที่ใช้งานหลักตามแบบตรวจสอบ 14 รูปแบบ'}
  ];

  BeqiCore.loadData().then(function(D){
    const zone = D.zones.find(function(z){ return z.id === session.zoneId; }) || D.zones[0];
    document.getElementById('pageIntro').textContent =
      'ติดตามและยกระดับการผสานสถานประกอบการของคุณเข้ากับระบบนิเวศชายฝั่ง ' + zone.name_th + ' (' + zone.sub_th + ') ' +
      'ข้อมูลปัจจุบันอ้างอิงจากค่าเฉลี่ยของโซนที่เลือกไว้ตอนสมัคร รอการเชื่อมโยงกับแปลงจริงของคุณผ่าน Earth Engine';

    const score = zone.beqi;
    document.getElementById('gaugeScore').textContent = BeqiCore.fx(score, 0);
    const circumference = 2 * Math.PI * 120;
    const offset = circumference * (1 - Math.min(score, 100) / 100);
    requestAnimationFrame(function(){
      setTimeout(function(){ document.getElementById('gaugeProgress').style.strokeDashoffset = offset; }, 200);
    });

    document.getElementById('indicatorRows').innerHTML = zone.norm.map(function(v, i){
      return '<div class="flex justify-between items-end border-b border-limestone-gray pb-2">' +
        '<span class="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">' + IND_LABEL[i] + '</span>' +
        '<span class="font-data-viz text-data-viz font-bold ' + (v < 0.5 ? 'text-secondary' : 'text-primary') + '">' +
        Math.round(v * 100) + '/100</span></div>';
    }).join('');

    const cert = BeqiCore.certLevel(zone.beqi, zone.norm, D.meta.cert_rules);
    document.getElementById('badgeTier').textContent = cert.level + (cert.years ? ' Tier' : '');
    document.getElementById('badgeSub').textContent = zone.name_th + ' · Khao Lak Biophilic Index';
    document.getElementById('badgeYear').textContent = cert.years ? ('Valid ' + new Date().getFullYear() + ' – ' + (new Date().getFullYear() + cert.years)) : 'ยังไม่ผ่านการรับรอง';

    const order = zone.norm.map(function(v, i){ return i; }).sort(function(a, b){ return zone.norm[a] - zone.norm[b]; }).slice(0, 3);
    document.getElementById('recoCards').innerHTML = order.map(function(i){
      const r = RECO[i];
      const pts = Math.max(1, Math.round((1 - zone.norm[i]) * 25));
      const impact = zone.norm[i] < 0.5 ? 'High' : (zone.norm[i] < 0.75 ? 'Medium' : 'Low');
      return '<div class="bg-surface-container-lowest sketch-border p-6 organic-shadow-hover flex flex-col h-full">' +
        '<div class="mb-4 text-primary"><span class="material-symbols-outlined text-4xl">' + r.icon + '</span></div>' +
        '<h4 class="font-headline-md text-[20px] text-andaman-deep mb-3">' + r.title + '</h4>' +
        '<p class="font-body-md text-body-md text-on-surface-variant mb-6 flex-grow">' + r.desc + '</p>' +
        '<div class="flex items-center justify-between border-t border-limestone-gray pt-4 mt-auto">' +
        '<span class="font-label-caps text-[10px] text-outline uppercase tracking-widest">Est. Impact: ' + impact + '</span>' +
        '<span class="font-data-viz text-primary font-bold">+' + pts + ' Pts</span></div></div>';
    }).join('');
  });
})();
