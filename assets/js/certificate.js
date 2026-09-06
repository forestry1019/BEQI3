/* certificate.html — renders a printable BEQI certification certificate for one submission.
   Public page, same access model as check-status.html: the Submission ID + PIN in the URL
   query string act as the capability token (no login required) — reads the same checkStatus
   Cloud Function (server/index.js). Only renders once status === 'approved' with a certLevel set.

   Design preview: ?demo=Silver|Gold|Platinum renders a mock certificate without calling the API,
   for reviewing the three tier looks side by side (skips the id/pin requirement entirely). */
(function(){
  const API = (typeof BEQI_API_CONFIG !== 'undefined') ? BEQI_API_CONFIG : null;
  const ZONE_LABEL = {
    North: 'North Zone — Laem Pakarang & Khuek Khak Beach',
    Central: 'Central Zone — Bang Niang & Nang Thong Beach',
    South: 'South Zone — Khao Lak–Lam Ru National Park'
  };

  const params = new URLSearchParams(location.search);
  const id = (params.get('id') || '').trim().toUpperCase();
  const pin = (params.get('pin') || '').trim();
  const demoLevel = params.get('demo');

  const loadingEl = document.getElementById('certLoading');
  const errorEl = document.getElementById('certError');
  const errorMsgEl = document.getElementById('certErrorMsg');
  const cardEl = document.getElementById('certCard');
  const printBtn = document.getElementById('printBtn');

  function showError(msg){
    loadingEl.hidden = true;
    errorMsgEl.textContent = msg;
    errorEl.hidden = false;
  }

  printBtn.addEventListener('click', function(){ window.print(); });

  function monthsToYearsLater(isoDate, years){
    const d = new Date(isoDate);
    d.setFullYear(d.getFullYear() + years);
    return d;
  }
  function fmtDate(d){
    return d.toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric'});
  }

  function renderCert(sub, data){
    const rule = (data.meta.cert_rules || []).find(function(r){ return r.level === sub.certLevel; });
    const years = rule ? rule.years : 3;
    const validUntil = monthsToYearsLater(sub.createdAt, years);
    const levelSlug = sub.certLevel.toLowerCase();

    cardEl.classList.add('lvl-' + levelSlug);
    document.getElementById('certBusinessName').textContent = sub.businessName;
    document.getElementById('certLevel').textContent = sub.certLevel + ' Certification';
    document.getElementById('sealLevelText').textContent = sub.certLevel.toUpperCase();
    document.getElementById('certScoreLine').textContent = 'Overall BEQI Score: ' + BeqiCore.fx(sub.overall, 1) + ' / 100';
    document.getElementById('certId').textContent = sub.id || id;
    document.getElementById('certIdInline').textContent = sub.id || id;
    document.getElementById('certZone').textContent = ZONE_LABEL[sub.zoneId] || sub.zoneId || '—';
    document.getElementById('certValidUntil').textContent = fmtDate(validUntil);
    document.title = 'BEQI Certificate — ' + sub.businessName;

    loadingEl.hidden = true;
    cardEl.hidden = false;
    printBtn.hidden = false;
  }

  if(demoLevel){
    BeqiCore.loadData().then(function(data){
      renderCert({
        businessName: 'Andaman Breeze Eco Resort',
        certLevel: demoLevel,
        overall: {Platinum: 92.4, Gold: 76.8, Silver: 63.5}[demoLevel] || 80,
        id: 'BQ-DEMO' + demoLevel.slice(0, 2).toUpperCase(),
        zoneId: 'Central',
        createdAt: new Date().toISOString()
      }, data);
    });
    return;
  }

  if(!id || !pin){
    showError('This link is missing a Certificate No. and PIN. Open this page from your Entrepreneur Dashboard or the Check Status page.');
    return;
  }
  if(!API || !API.statusUrl){
    showError('Certificate service is unavailable right now. Please try again later.');
    return;
  }

  Promise.all([
    fetch(API.statusUrl + '?id=' + encodeURIComponent(id) + '&pin=' + encodeURIComponent(pin))
      .then(function(r){ if(r.status === 404) throw {notFound: true}; if(!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }),
    BeqiCore.loadData()
  ]).then(function(results){
    const sub = results[0];
    const data = results[1];

    if(sub.status !== 'approved' || !sub.certLevel){
      showError('This submission has not been certified yet (current status: ' +
        (sub.status === 'revision' ? 'Needs Revision' : 'Pending Review') +
        '). A certificate will appear here once an evaluator approves it.');
      return;
    }
    renderCert(sub, data);
  }).catch(function(e){
    showError(e && e.notFound
      ? 'No submission found for that Certificate No. and PIN.'
      : 'Could not reach the certificate service. Check your connection and reload the page.');
  });
})();
