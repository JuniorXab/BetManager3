// ================================================
// BetManager Pro – Lógica principal
// Datos, Auth, Bankroll, Apuestas, Retos, Trivia
// ================================================

const LEAGUES={
  'Premier League':['Arsenal','Aston Villa','Bournemouth','Brentford','Brighton','Chelsea','Crystal Palace','Everton','Fulham','Ipswich Town','Leicester City','Liverpool','Man City','Man Utd','Newcastle','Nottm Forest','Southampton','Tottenham','West Ham','Wolves'],
  'La Liga':['Alavés','Athletic Club','Atlético Madrid','Barcelona','Celta','Espanyol','Getafe','Girona','Las Palmas','Leganés','Mallorca','Osasuna','Rayo','Betis','Real Madrid','Real Sociedad','Sevilla','Valencia','Valladolid','Villarreal'],
  'Serie A':['Atalanta','Bologna','Cagliari','Como','Empoli','Fiorentina','Genoa','Inter','Juventus','Lazio','Lecce','AC Milan','Monza','Napoli','Parma','Roma','Torino','Udinese','Venezia','Verona'],
  'Bundesliga':['Augsburg','Bayern Munich','Bochum','Dortmund','Frankfurt','Freiburg','Holstein Kiel','Hoffenheim','Leverkusen','Mainz','Monchengladbach','RB Leipzig','St. Pauli','Stuttgart','Union Berlin','Werder Bremen'],
  'Ligue 1':['Angers','Auxerre','Brest','Lens','Lille','Lyon','Marseille','Monaco','Montpellier','Nantes','Nice','PSG','Reims','Rennes','Saint-Etienne','Strasbourg','Toulouse'],
  'Liga BetPlay':['America','Nacional','Millonarios','Junior','Santa Fe','Medellin','Tolima','Cali','Once Caldas','Bucaramanga','Pasto','La Equidad','Alianza Petrolera','Envigado'],
  'Champions League':['Arsenal','Aston Villa','Atletico Madrid','Barcelona','Bayern Munich','Benfica','Bologna','Brest','Celtic','Club Brugge','Dortmund','Feyenoord','Inter','Juventus','Leverkusen','Lille','Man City','Monaco','PSG','PSV','Porto','RB Leipzig','Real Madrid','Shakhtar','Sporting CP','Young Boys'],
  'Europa League':['Ajax','Anderlecht','Athletic Club','AZ Alkmaar','Fenerbahce','Frankfurt','Galatasaray','Hoffenheim','Lazio','Lyon','Man Utd','Olympiacos','Porto','Rangers','Roma','Spurs','Villarreal'],
  'Liga MX':['America','Atlas','Atletico San Luis','Cruz Azul','Guadalajara','Leon','Mazatlan','Monterrey','Necaxa','Pachuca','Puebla','Santos Laguna','Tigres','Tijuana','Toluca','UNAM'],
  'Eredivisie':['Ajax','AZ','FC Utrecht','Feyenoord','Fortuna Sittard','Go Ahead Eagles','Heerenveen','Heracles','NEC','PSV','RKC Waalwijk','Sparta Rotterdam','Twente','Willem II'],
  'Liga Argentina':['Argentinos Jrs','Banfield','Belgrano','Boca Juniors','Defensa y Justicia','Estudiantes','Gimnasia','Godoy Cruz','Huracan','Independiente','Lanus','Newells','Racing','River Plate','Rosario Central','San Lorenzo','Talleres','Tigre','Velez'],
  'Copa Libertadores':['Atletico Mineiro','Boca Juniors','Botafogo','Colo-Colo','Flamengo','Fluminense','Internacional','Junior','LDU Quito','Libertad','Nacional','Olimpia','Palmeiras','Penharol','Racing','River Plate','Sao Paulo','Talleres'],
  'MLS':['Atlanta United','Austin FC','Charlotte FC','Chicago Fire','Cincinnati','Colorado Rapids','Columbus Crew','Dallas','DC United','Houston Dynamo','Inter Miami','LAFC','LA Galaxy','Minnesota United','Nashville SC','New England','NYCFC','NY Red Bulls','Orlando City','Philadelphia Union','Portland Timbers','Real Salt Lake','San Jose','Seattle Sounders','Sporting KC','Toronto FC','Vancouver Whitecaps']
};
const NBA=['Atlanta Hawks','Boston Celtics','Brooklyn Nets','Charlotte Hornets','Chicago Bulls','Cleveland Cavaliers','Dallas Mavericks','Denver Nuggets','Detroit Pistons','Golden State Warriors','Houston Rockets','Indiana Pacers','Los Angeles Clippers','Los Angeles Lakers','Memphis Grizzlies','Miami Heat','Milwaukee Bucks','Minnesota Timberwolves','New Orleans Pelicans','New York Knicks','Oklahoma City Thunder','Orlando Magic','Philadelphia 76ers','Phoenix Suns','Portland Trail Blazers','Sacramento Kings','San Antonio Spurs','Toronto Raptors','Utah Jazz','Washington Wizards'];
const DICT=[
  {t:'Bankroll',d:'Capital total destinado exclusivamente a apostar. No debe mezclarse con dinero de uso cotidiano.'},
  {t:'Flat Staking',d:'Sistema donde siempre apuestas el mismo porcentaje del bankroll inicial. En BetManager: 1 stake = 2% del bank inicial.'},
  {t:'P&G (Perdidas y Ganancias)',d:'Resultado neto total. Suma de ganancias menos perdidas. Tu termometro financiero principal.'},
  {t:'Stake',d:'Nivel de confianza del 1 al 10. Stake 1 = 2%, stake 5 = 10%, stake 10 = 20% del bankroll inicial.'},
  {t:'Yield',d:'Rentabilidad pura. Beneficio neto / total invertido x 100. Un yield sostenido del 5-10% es excelente.'},
  {t:'ROI',d:'Return on Investment. Similar al yield en apuestas. Mide el retorno porcentual sobre el capital invertido.'},
  {t:'Value Bet',d:'Apuesta de valor. Tu probabilidad estimada es mayor a la implicita en la cuota. Base del apostador profesional.'},
  {t:'Over / Under (O/U)',d:'Apuestas si el evento producira mas o menos de X unidades (goles, puntos, corners, tarjetas).'},
  {t:'CLV (Closing Line Value)',d:'Batir la linea de cierre. Si apostas a @2.00 y el partido empieza a @1.75, tienes CLV positivo.'},
  {t:'Props',d:'Apuestas sobre estadisticas individuales de jugadores: goles, rebotes, puntos, disparos, etc.'},
  {t:'Handicap Europeo',d:'Ventaja/desventaja ficticia en goles. Ej: Real Madrid -1 necesita ganar por 2+ para que gane la apuesta.'},
  {t:'Handicap Asiatico',d:'Variante del handicap que elimina el empate. Puede ser en 0.25 o 0.75 para dividir la apuesta.'},
  {t:'Doble Oportunidad',d:'Cubre dos de los tres resultados: 1X, X2 o 12. Cuota mas baja, mayor probabilidad.'},
  {t:'Cuota Implicita',d:'Probabilidad que refleja la cuota: 1 / cuota x 100. Cuota @2.00 = 50%, @1.50 = 66.7%.'},
  {t:'Void / Nula',d:'Apuesta anulada. El dinero se devuelve integro. Ocurre por suspension u otras causas.'},
  {t:'Kelly Criterion',d:'Formula para la apuesta optima: (p*b - q) / b, donde p es tu probabilidad estimada y b = cuota-1.'},
  {t:'Combinada (Parlay)',d:'Une varias selecciones. La cuota total es el producto de todas. Un fallo = se pierde todo.'},
  {t:'Moneyline (ML)',d:'Apuesta directa al ganador sin handicap. Muy usada en NBA y beisbol.'},
  {t:'Spread',d:'Handicap de puntos en NBA/NFL. Lakers -5.5 = deben ganar por 6+ puntos.'},
  {t:'Sharp / Sharps',d:'Apostadores profesionales. Cuando mueven masivamente un mercado, las casas ajustan las lineas.'},
  {t:'Tilt',d:'Estado emocional que lleva a decisiones irracionales tras perdidas. El mayor enemigo del apostador.'},
  {t:'Juice / Margen',d:'Comision de la casa. En @1.90/1.90 el margen es ~5.26%. Aposta en casas con menor margen.'},
  {t:'Cuota Americana',d:'Positivas (+150): ganas $150 por $100 apostados. Negativas (-200): apuestas $200 para ganar $100.'},
  {t:'Linea de Cierre',d:'Cuota definitiva al inicio del evento. Es la referencia mas eficiente del mercado.'},
  {t:'Cashout',d:'Retiro anticipado antes de que termine el evento. Util para asegurar, pero erosiona el valor esperado.'},
  {t:'Doble-Doble NBA',d:'Jugador con dos digitos en dos categorias estadisticas en un partido (ej: 10+ puntos y 10+ rebotes).'},
  {t:'Triple-Doble NBA',d:'Jugador con dos digitos en tres categorias (puntos, rebotes y asistencias). Muy raro.'},
  {t:'Back-to-Back NBA',d:'Equipo que juega en dias consecutivos. Aumenta el cansancio y puede afectar el rendimiento.'},
  {t:'Escalera (Reto)',d:'Sistema donde partes de un monto inicial y el objetivo es multiplicarlo (x3, x5 o x10) con apuestas controladas.'}
];
const TRIVIA=[
  {q:'Que significa Yield en apuestas deportivas?',o:['Numero de apuestas ganadas','Beneficio neto / total invertido x 100','El monto total apostado','La cuota promedio'],c:1},
  {q:'En BetManager Pro, cuanto representa Stake 1 (Flat Staking)?',o:['1% del bankroll actual','5% del bankroll inicial','2% del bankroll inicial','10% del bankroll inicial'],c:2},
  {q:'Que es el Tilt en apuestas?',o:['Una cuota muy alta','Un tipo de handicap','El retiro anticipado','Estado emocional que lleva a decisiones irracionales tras perdidas'],c:3},
  {q:'Que es una Value Bet?',o:['Una apuesta muy costosa','Apostar en varios partidos','Cuando tu probabilidad estimada supera la implicita en la cuota','Una apuesta al marcador exacto'],c:2},
  {q:'Cuantos equipos hay en la NBA?',o:['28','29','30','32'],c:2},
  {q:'Que es el Spread en apuestas NBA?',o:['El margen de la casa','Handicap de puntos para equilibrar el partido','La diferencia entre cuota alta y baja','El total de puntos del partido'],c:1},
  {q:'Que significa Over/Under (O/U)?',o:['Apostar si un equipo gana o pierde','Apostar al primer goleador','Apostar si habra mas o menos de X unidades en el partido','Una combinada de dos partidos'],c:2},
  {q:'Que es el CLV (Closing Line Value)?',o:['La ganancia total acumulada','Batir la cuota que existe al inicio del partido','El margen de la casa','El limite maximo de apuesta'],c:1},
  {q:'Que es un Doble-Doble en NBA?',o:['Ganar dos partidos seguidos','Apostar el doble del stake','Un jugador con dos digitos en dos categorias estadisticas','Una combinada con dos selecciones'],c:2},
  {q:'Que pais organiza la Liga BetPlay?',o:['Mexico','Argentina','Brasil','Colombia'],c:3},
  {q:'Cuanto es la cuota implicita de @2.00?',o:['25%','40%','75%','50%'],c:3},
  {q:'Que es un Back-to-Back en NBA?',o:['Un jugador que anota en ambas mitades','Una apuesta al ganador de dos cuartos','Dos partidos consecutivos para el mismo equipo','Un tipo de spread doble'],c:2},
  {q:'Que es el Kelly Criterion?',o:['El margen minimo de ganancia','El limite de stake permitido','Un tipo de handicap asiatico','Formula para calcular la apuesta optima segun probabilidad vs cuota'],c:3},
  {q:'Que significa Moneyline (ML)?',o:['El monto maximo apostable','El dinero en efectivo de la casa','Una apuesta a la linea de goles','Apuesta directa al ganador sin handicap'],c:3},
  {q:'Que equipo ha ganado mas Champions League?',o:['Barcelona','Bayern Munich','AC Milan','Real Madrid'],c:3},
  {q:'Que es el Handicap Asiatico?',o:['Un handicap solo para partidos asiaticos','El margen de victoria minima','Variante que elimina el empate dividiendo en 0.25 o 0.75','Un mercado de cuotas americanas'],c:2},
  {q:'Que es el Cashout?',o:['Cobrar una apuesta antes de que termine el evento','El pago de impuestos sobre ganancias','Retirar dinero del banco','Cancelar sin recuperar nada'],c:0},
  {q:'Que es el Flat Staking?',o:['Solo apostar en mercados planos','Apostar mas cuando pierdes','Apostar porcentaje variable segun confianza','Apostar siempre el mismo porcentaje del bankroll inicial'],c:3},
  {q:'Cuantos equipos tiene la Premier League?',o:['18','22','24','20'],c:3},
  {q:'Que significa P&G en BetManager Pro?',o:['Puntos y Goles','Probabilidad y Ganancia','Partidos y Goles','Perdidas y Ganancias'],c:3},
  {q:'Que es la Doble Oportunidad en futbol?',o:['Apostar al marcador exacto de dos partidos','Una combinada de dos apuestas','Apostar el doble del monto normal','Cubrir dos de los tres resultados posibles (1X, X2 o 12)'],c:3},
  {q:'Que es un Triple-Doble en NBA?',o:['Ganar el partido por 30+ puntos','Tres canastas de tres puntos','Tres dobles-dobles consecutivos','Lograr dos digitos en tres categorias estadisticas'],c:3},
  {q:'Que es el Juice o margen de la casa?',o:['Un bono especial de bienvenida','El beneficio neto del apostador','El tipo de cambio entre divisas','La comision que cobra la casa de apuestas'],c:3},
  {q:'Que significa apostar Over 2.5 goles?',o:['Exactamente 2.5 goles','2 o menos goles','El local marcara mas de 2','3 o mas goles en el partido'],c:3},
  {q:'Que es el Sharp en el mundo de las apuestas?',o:['Una cuota muy baja','Un tipo de combinada especial','Una apuesta al marcador exacto','Un apostador profesional con analisis profundo y capital alto'],c:3},
  {q:'Cuantos puntos vale una canasta de 3 puntos en NBA?',o:['2','4','1','3'],c:3},
  {q:'Que es un Void o Nula?',o:['Una apuesta perdida','Una apuesta cancelada donde el dinero se devuelve','Una apuesta con cuota 1.00','Una apuesta pendiente de resolver'],c:1},
  {q:'Que significa apostar en el Spread -5.5 de Lakers?',o:['Lakers deben anotar 5.5 puntos','Lakers deben ganar por 6 o mas puntos','Lakers pueden perder por hasta 5 puntos','El partido terminara con menos de 5.5 puntos'],c:1},
  {q:'Que es el ROI en apuestas?',o:['El numero de rondas de una escalera','El porcentaje de apuestas ganadoras','La cuota promedio de tus apuestas','El retorno porcentual sobre el capital invertido'],c:3},
  {q:'En una Combinada (Parlay), que pasa si una seleccion falla?',o:['Solo pierdes esa seleccion','La apuesta continua con las restantes','Se pierde toda la apuesta','Se devuelve el monto de esa seleccion'],c:2}
];
const RETO_TMPL={
  X3:{label:'x3',type:'ladder',mult:3,color:'#00b894',desc:'Multiplica tu bankroll por 3. El mas accesible para empezar.',cuotaRec:'1.40-1.60',stakeRec:'6-8%',pasos:'~10-15 apuestas',tips:['Apuesta solo al ganador (1X2) en favoritos claros.','Cuotas entre 1.40 y 1.60. Consistencia sobre todo.','Maximo 1 apuesta por dia. La paciencia es tu aliada.','Evita combinadas: un fallo lo pierde todo.','Si pierdes 2 seguidas, para y analiza.']},
  X5:{label:'x5',type:'ladder',mult:5,color:'#4a69bd',desc:'El clasico de los apostadores disciplinados.',cuotaRec:'1.50-1.80',stakeRec:'4-6%',pasos:'~18-25 apuestas',tips:['Cuotas entre 1.50 y 1.80 en mercados de alta probabilidad.','1X2 en favoritos, Over/Under de goles en linea 1.5 o 2.5.','Un error + impulsividad arruina el reto.','Registra mentalmente por que haces cada apuesta.','Si el bank cae un 30%, haz pausa de 48 horas.']},
  X10:{label:'x10',type:'ladder',mult:10,color:'#d63031',desc:'El reto maximo. Solo para muy disciplinados.',cuotaRec:'1.60-2.00',stakeRec:'4%',pasos:'~30-40 apuestas',tips:['El reto mas largo. La disciplina mental lo es todo.','Cuotas entre 1.60 y 2.00. Nunca subas por emocion.','Solo 1 apuesta por dia como maximo.','Analiza cada partido al menos 30 minutos antes.','No cambies de deporte ni de mercado.']},
  RACHA:{label:'Racha x5',type:'streak',target:5,color:'#e17055',desc:'Gana 5 apuestas CONSECUTIVAS sin fallar. Si fallas, la racha vuelve a 0.',cuotaRec:'1.30-1.60',stakeRec:'Monto fijo',pasos:'Depende de disciplina',tips:['Cuotas bajas y seguras. El objetivo es no fallar.','Un solo error reinicia la racha desde cero.','Favoritos claros en casa: tu mejor aliado.','No cambies de estrategia a mitad del reto.','Paciencia: puede tomar muchas apuestas llegar a 5 seguidas.']},
  CUOTA_ALTA:{label:'Cuota Alta x3',type:'highOdds',mult:3,minOdds:2.0,color:'#fd79a8',desc:'Solo apuestas con cuota >= 2.00. Llega a x3 tu bankroll.',cuotaRec:'>= 2.00',stakeRec:'4-6%',pasos:'Mas volatil',tips:['La app valida que la cuota sea 2.00 o mayor.','Mayor cuota = mayor riesgo. Se muy selectivo.','Analiza bien antes: el margen de error es mas alto.','Yield positivo con cuotas altas exige mucha seleccion.','Si aciertas 3 seguidas, evalua si merece seguir o retirar.']},
  TRIVIA:{label:'Trivia',type:'trivia',color:'#fdcb6e',desc:'30 preguntas de apuestas deportivas, futbol y NBA. Maximo 3 errores.',cuotaRec:'Conocimiento',stakeRec:'Sin apuestas',pasos:'10 preguntas por sesion',tips:['Las preguntas cubren glosario, futbol y NBA.','Maximo 3 errores antes de perder.','Responde con calma, no es contrarreloj.','El conocimiento es la base de las apuestas exitosas.']}
};

let userEmail=null,currentBankAction='',pendingRetoType=null;
let appData={bank:0,initialBank:0,history:[],bankLog:[],goal:0,activeReto:null,retoHistory:[],proMode:{enabled:false,maxDailyBets:3,minBankPct:30}};
let triviaState={questions:[],current:0,correct:0,errors:0};
let combiSelections=[];

window.onload=()=>{
  if(localStorage.getItem('bmDark')){document.body.classList.add('dark');document.getElementById('dark-toggle').innerText='☀️';}
  const dl=document.getElementById('diccionario-list');
  DICT.forEach(d=>dl.innerHTML+=`<div class="edu-item"><h4>${d.t}</h4><p>${d.d}</p></div>`);
  const nL=document.getElementById('nba-local'),nA=document.getElementById('nba-away');
  NBA.sort().forEach(t=>{nL.innerHTML+=`<option>${t}</option>`;nA.innerHTML+=`<option>${t}</option>`;});
  renderRetoTemplates();
  const au=localStorage.getItem('activeUser');
  if(au){userEmail=au;loadUserData();document.getElementById('main-nav').style.display='flex';navTo('view-main');}
};

function navTo(id){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.querySelectorAll('nav button[id^="nav-"]').forEach(b=>b.classList.remove('active-nav'));
  document.getElementById(id).classList.add('active');
  const m={
    'view-main':'nav-main','view-football':'nav-football','view-nba':'nav-nba',
    'view-combi':'nav-combi','view-reto':'nav-reto','view-stats':'nav-stats',
    'view-analisis':'nav-analisis','view-edu':'nav-edu','view-pro':'nav-pro'
  };
  if(m[id])document.getElementById(m[id]).classList.add('active-nav');
  if(id==='view-stats')renderHistory('Todas',null);
  if(id==='view-main'){updateQuickStats();drawChart();updateBankLog();checkTiltBanner();}
  if(id==='view-combi'&&!document.getElementById('combi-selections').children.length)addCombiSelection();
  if(id==='view-analisis')renderAnalisis();
  if(id==='view-reto')renderRetoView();
  if(id==='view-pro')renderProStatus();
  if(id==='view-football')checkProWarn('fb');
  if(id==='view-nba')checkProWarn('nba');
}

function register(){
  const e=document.getElementById('auth-email').value.trim(),p=document.getElementById('auth-pass').value;
  if(!e||!p)return alert('Ingresa usuario y contrasena.');
  let u=JSON.parse(localStorage.getItem('bmUsers'))||{};
  if(u[e])return alert('Usuario ya existe.');
  u[e]={pass:p,bank:0,initialBank:0,history:[],bankLog:[],goal:0,activeReto:null,retoHistory:[],proMode:{enabled:false,maxDailyBets:3,minBankPct:30}};
  localStorage.setItem('bmUsers',JSON.stringify(u));alert('Cuenta creada. Inicia sesion.');
}
function login(){
  const e=document.getElementById('auth-email').value.trim(),p=document.getElementById('auth-pass').value;
  const u=JSON.parse(localStorage.getItem('bmUsers'))||{};
  if(u[e]&&u[e].pass===p){userEmail=e;localStorage.setItem('activeUser',e);loadUserData();document.getElementById('main-nav').style.display='flex';navTo('view-main');}
  else alert('Datos incorrectos.');
}
function logout(){localStorage.removeItem('activeUser');userEmail=null;document.getElementById('main-nav').style.display='none';document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));document.getElementById('view-auth').classList.add('active');}
function loadUserData(){
  const u=JSON.parse(localStorage.getItem('bmUsers'));
  const d=u[userEmail];
  appData={bank:0,initialBank:0,history:[],bankLog:[],goal:0,activeReto:null,retoHistory:[],proMode:{enabled:false,maxDailyBets:3,minBankPct:30},...d};
  updateBankUI();
}
function saveUserData(){const u=JSON.parse(localStorage.getItem('bmUsers'));u[userEmail]=appData;localStorage.setItem('bmUsers',JSON.stringify(u));updateBankUI();}

function setBank(){
  const v=parseFloat(document.getElementById('new-bank-input').value);
  if(v>0){appData.bank=v;appData.initialBank=v;if(!appData.bankLog)appData.bankLog=[];appData.bankLog.unshift({type:'inicio',amount:v,date:new Date().toLocaleDateString('es-CO'),note:'Bankroll inicial'});saveUserData();document.getElementById('new-bank-input').value='';calculateBetAmount('fb');calculateBetAmount('nba');}
}
function updateBankUI(){
  document.getElementById('bank-display').innerText='$'+appData.bank.toLocaleString('es-CO');
  const diff=appData.bank-(appData.initialBank||appData.bank);
  const de=document.getElementById('bank-diff');
  if(appData.initialBank&&diff!==0){de.innerText=(diff>=0?'▲ +':'▼ ')+'$'+Math.abs(diff).toLocaleString('es-CO')+' vs inicio';de.style.color=diff>=0?'#a8edda':'#ffb3b3';de.style.display='block';}
  else de.style.display='none';
  const has=appData.bank>0||appData.initialBank>0;
  document.getElementById('bank-setup-div').style.display=has?'none':'block';
  document.getElementById('bank-actions-div').style.display=has?'flex':'none';
  document.getElementById('meta-card').style.display=(has&&appData.goal>0)?'block':'none';
  document.getElementById('meta-setup-card').style.display=(has&&!appData.goal)?'block':'none';
  if(appData.goal>0)updateMetaUI();
  calculateBetAmount('fb');calculateBetAmount('nba');
}
function showBankModal(t){
  currentBankAction=t;const r=t==='retirar';
  document.getElementById('bank-modal-emoji').innerText=r?'💸':'➕';
  document.getElementById('bank-modal-title').innerText=r?'Retirar':'Recargar Bankroll';
  document.getElementById('bank-modal-desc').innerText=r?'El bankroll inicial no cambia.':'Cuanto monto añades?';
  document.getElementById('bank-modal-btn').innerText=r?'💸 Retirar':'➕ Recargar';
  document.getElementById('bank-modal-input').value='';
  document.getElementById('bank-modal').classList.add('show');
}
function closeBankModal(){document.getElementById('bank-modal').classList.remove('show');}
function confirmBankAction(){
  const v=parseFloat(document.getElementById('bank-modal-input').value);
  if(!v||v<=0)return alert('Monto invalido.');
  if(currentBankAction==='retirar'){if(v>appData.bank)return alert('Saldo insuficiente.');appData.bank-=v;appData.bankLog.unshift({type:'retiro',amount:v,date:new Date().toLocaleDateString('es-CO'),note:'Retiro parcial'});}
  else{appData.bank+=v;appData.bankLog.unshift({type:'recarga',amount:v,date:new Date().toLocaleDateString('es-CO'),note:'Recarga de bankroll'});}
  saveUserData();closeBankModal();updateBankLog();
}
function updateBankLog(){
  const lc=document.getElementById('bank-log-card'),ll=document.getElementById('bank-log-list');
  if(!appData.bankLog||!appData.bankLog.length){lc.style.display='none';return;}
  lc.style.display='block';
  const ic={inicio:'🏦',retiro:'💸',recarga:'➕'},co={inicio:'var(--primary)',retiro:'var(--danger)',recarga:'var(--success)'};
  ll.innerHTML=appData.bankLog.slice(0,8).map(l=>`<div class="bank-log-item" style="border-left-color:${co[l.type]}"><div><b style="font-size:.83rem">${ic[l.type]} ${l.note}</b><div style="font-size:.72rem;color:var(--text-muted)">${l.date}</div></div><div style="font-weight:800;color:${co[l.type]}">${l.type==='retiro'?'-':'+'} $${l.amount.toLocaleString('es-CO')}</div></div>`).join('');
}
function setMeta(){const v=parseFloat(document.getElementById('meta-input').value);if(v>0&&v>appData.bank){appData.goal=v;saveUserData();updateMetaUI();}else alert('La meta debe ser mayor a tu bankroll actual.');}
function editMeta(){appData.goal=0;saveUserData();document.getElementById('meta-card').style.display='none';document.getElementById('meta-setup-card').style.display='block';}
function updateMetaUI(){
  if(!appData.goal)return;
  const p=Math.min((appData.bank/appData.goal)*100,100);
  document.getElementById('meta-bar').style.width=p+'%';
  document.getElementById('meta-pct').innerText=p.toFixed(1)+'%';
  document.getElementById('meta-current').innerText='$'+appData.bank.toLocaleString('es-CO');
  document.getElementById('meta-goal-display').innerText='Meta: $'+appData.goal.toLocaleString('es-CO');
  if(p>=100)document.getElementById('meta-modal').classList.add('show');
}

// PRO MODE
function getProMaxStake(){
  if(!appData.proMode?.enabled)return 10;
  const p=appData.initialBank>0?(appData.bank/appData.initialBank)*100:100;
  if(p<=40)return 2; if(p<=60)return 3; if(p<=80)return 5; return 10;
}
function getTodayCount(){const t=new Date().toLocaleDateString('es-CO');return appData.history.filter(h=>h.date===t).length;}
function checkProWarn(sport){
  const w=document.getElementById('pro-warn-'+sport);if(!w)return;
  if(!appData.proMode?.enabled){w.style.display='none';return;}
  const ms=getProMaxStake(),tc=getTodayCount(),md=appData.proMode.maxDailyBets||3;
  const msgs=[];
  if(ms<10)msgs.push(`⚠️ Bank en zona de riesgo. Stake maximo: <b>${ms}</b> (${ms*2}%)`);
  if(tc>=md&&md!==99)msgs.push(`🔒 Limite diario alcanzado: <b>${md} apuestas</b> para hoy.`);
  if(msgs.length){w.style.display='block';w.innerHTML=msgs.join('<br>');}
  else w.style.display='none';
}
function checkProBlock(){
  if(!appData.proMode?.enabled)return true;
  const md=appData.proMode.maxDailyBets||3;
  if(md!==99&&getTodayCount()>=md){
    document.getElementById('pro-block-msg').innerText=`Modo Pro: limite de ${md} apuestas por hoy alcanzado.`;
    document.getElementById('pro-block-modal').classList.add('show');return false;
  }
  const mp=appData.proMode.minBankPct||0;
  if(mp>0&&appData.initialBank>0&&(appData.bank/appData.initialBank*100)<mp){
    document.getElementById('pro-block-msg').innerText=`Modo Pro: tu bank esta por debajo del ${mp}% del inicial.`;
    document.getElementById('pro-block-modal').classList.add('show');return false;
  }
  return true;
}
function togglePro(){
  if(!appData.proMode)appData.proMode={enabled:false,maxDailyBets:3,minBankPct:30};
  appData.proMode.enabled=document.getElementById('pro-toggle').checked;
  saveUserData();renderProStatus();
}
function updateProSettings(){
  if(!appData.proMode)appData.proMode={enabled:false,maxDailyBets:3,minBankPct:30};
  appData.proMode.maxDailyBets=parseInt(document.getElementById('pro-daily-sel').value);
  appData.proMode.minBankPct=parseInt(document.getElementById('pro-minbank-sel').value);
  const lbl=appData.proMode.maxDailyBets===99?'Sin limite':appData.proMode.maxDailyBets;
  document.getElementById('pro-daily-lbl').innerText=lbl;
  saveUserData();renderProStatus();
}
function renderProStatus(){
  const pm=appData.proMode||{enabled:false,maxDailyBets:3,minBankPct:30};
  document.getElementById('pro-toggle').checked=pm.enabled;
  document.getElementById('pro-daily-sel').value=pm.maxDailyBets||3;
  document.getElementById('pro-minbank-sel').value=pm.minBankPct||30;
  const lbl=pm.maxDailyBets===99?'Sin limite':(pm.maxDailyBets||3);
  document.getElementById('pro-daily-lbl').innerText=lbl;
  document.getElementById('pro-badge').innerText=pm.enabled?'ON':'OFF';
  document.getElementById('pro-badge').style.background=pm.enabled?'var(--success)':'var(--text-muted)';
  const ms=getProMaxStake(),pct=appData.initialBank>0?(appData.bank/appData.initialBank*100).toFixed(0):100;
  document.getElementById('pro-status-txt').innerHTML=pm.enabled
    ?`<span style="color:var(--success)">Modo Pro ACTIVO</span><br>Bank: ${pct}% del inicial → Stake max: <b>${ms}</b> (${ms*2}%)<br>Apuestas hoy: <b>${getTodayCount()}/${pm.maxDailyBets===99?'∞':pm.maxDailyBets}</b><br>Bank minimo: <b>${pm.minBankPct}%</b> del inicial`
    :`<span style="color:var(--text-muted)">Modo Pro desactivado.</span><br>La alerta de 3 perdidas seguidas siempre esta activa.`;
}

// TILT
function checkTiltBanner(){
  const res=appData.history.filter(h=>['Ganada','Perdida'].includes(h.result));
  const b=document.getElementById('tilt-banner');
  if(res.length>=3&&res.slice(-3).every(h=>h.result==='Perdida'))b.classList.add('show');
  else b.classList.remove('show');
}
function checkTiltModal(){
  const res=appData.history.filter(h=>['Ganada','Perdida'].includes(h.result));
  if(res.length>=3&&res.slice(-3).every(h=>h.result==='Perdida'))document.getElementById('tilt-modal').classList.add('show');
}

// STAKE
function calculateBetAmount(s){
  const el=document.getElementById(s+'-stake');let v=parseInt(el.value);
  const mx=getProMaxStake();if(v>mx){v=mx;el.value=mx;}
  document.getElementById(s+'-stake-val').innerText=v;
  document.getElementById(s+'-stake-pct').innerText=(v*2)+'%';
  const base=appData.initialBank||appData.bank;
  document.getElementById(s+'-money').value=Math.round(base*(v*2/100))||'';
}

// LIGAS
function loadTeams(){
  const lg=document.getElementById('fb-league').value;
  const sL=document.getElementById('fb-local'),sA=document.getElementById('fb-away');
  sL.innerHTML='<option value="">Elige local</option>';sA.innerHTML='<option value="">Elige visitante</option>';
  (LEAGUES[lg]||[]).forEach(t=>{sL.innerHTML+=`<option>${t}</option>`;sA.innerHTML+=`<option>${t}</option>`;});
  document.getElementById('fb-dynamic-container').innerHTML='';
}

// MERCADOS
function genL(a,b,s=1){const r=[];for(let v=a;v<=b;v=Math.round((v+s)*100)/100)r.push(v.toFixed(1));return r;}
function lopts(ls){return ls.map(l=>`<option>${l}</option>`).join('');}
function updateDynamicMarkets(sp){
  const lc=document.getElementById(sp+'-local').value||'Local';
  const aw=document.getElementById(sp+'-away').value||'Visitante';
  const mk=document.getElementById(sp+'-market').value;
  const bx=document.getElementById(sp+'-dynamic-container');
  bx.innerHTML='';if(!mk)return;bx.className='dyn-box';
  if(sp==='fb'){
    const gL=lopts(genL(.5,6.5)),cL=lopts(genL(.5,15.5)),tL=lopts(genL(.5,15.5));
    const mkmap={
      '1X2':`<label>Seleccion:</label><select id="d1"><option>Gana ${lc}</option><option>Empate</option><option>Gana ${aw}</option></select>`,
      'Doble Oportunidad':`<label>Seleccion:</label><select id="d1"><option>${lc} o Empate (1X)</option><option>${aw} o Empate (X2)</option><option>${lc} o ${aw} (12)</option></select>`,
      'Ambos Marcan':`<label>Ambos equipos marcan?</label><select id="d1"><option>Si</option><option>No</option></select>`,
      'Goles':`<label>Equipo/Partido:</label><select id="d1"><option>Total del Partido</option><option>${lc}</option><option>${aw}</option></select><div class="row"><div class="col"><label>Dir.:</label><select id="d2"><option>Mas de (+)</option><option>Menos de (-)</option></select></div><div class="col"><label>Linea:</label><select id="d3">${gL}</select></div></div>`,
      'Goles 1H':`<label>Equipo/Partido:</label><select id="d1"><option>Total del Partido</option><option>${lc}</option><option>${aw}</option></select><div class="row"><div class="col"><label>Dir.:</label><select id="d2"><option>Mas de (+)</option><option>Menos de (-)</option></select></div><div class="col"><label>Linea:</label><select id="d3">${gL}</select></div></div>`,
      'Corners':`<label>Equipo/Partido:</label><select id="d1" onchange="updCornersL()"><option value="total">Total</option><option>${lc}</option><option>${aw}</option></select><div class="row"><div class="col"><label>Dir.:</label><select id="d2"><option>Mas de (+)</option><option>Menos de (-)</option></select></div><div class="col"><label>Linea:</label><select id="d3">${cL}</select></div></div>`,
      'Tarjetas':`<label>Equipo/Partido:</label><select id="d1"><option>Total</option><option>${lc}</option><option>${aw}</option></select><label>Tipo:</label><select id="d2"><option>Tarjetas Totales</option><option>Solo Amarillas</option><option>Solo Rojas</option></select><div class="row"><div class="col"><label>Dir.:</label><select id="d3"><option>Mas de</option><option>Menos de</option></select></div><div class="col"><label>Linea:</label><select id="d4">${tL}</select></div></div>`,
      'Jugador':`<label>Jugador:</label><input id="d1" placeholder="Nombre del jugador"><label>Estadistica:</label><select id="d2"><option>Disparos a puerta</option><option>Disparos totales</option><option>Asistencias</option><option>Goleador (Anota)</option><option>Gol o Asistencia</option></select><div class="row"><div class="col"><label>Dir.:</label><select id="d3"><option>Mas de (+)</option><option>Menos de (-)</option></select></div><div class="col"><label>Linea:</label><input type="number" step="0.5" id="d4" placeholder="1.5"></div></div>`,
      'Handicap':`<label>Equipo:</label><select id="d1"><option>${lc}</option><option>${aw}</option></select><label>Handicap:</label><input id="d2" placeholder="Ej: -1 o +0.5">`,
      'Handicap Asiatico':`<label>Equipo:</label><select id="d1"><option>${lc}</option><option>${aw}</option></select><label>Linea asiatica:</label><select id="d2">${['-2','-1.75','-1.5','-1.25','-1','-0.75','-0.5','-0.25','0','+0.25','+0.5','+0.75','+1','+1.25','+1.5','+1.75','+2'].map(v=>`<option>${v}</option>`).join('')}</select>`,
      'Resultado Exacto':`<label>Resultado exacto:</label><select id="d1">${['0-0','1-0','0-1','1-1','2-0','0-2','2-1','1-2','2-2','3-0','0-3','3-1','1-3','3-2','2-3','3-3'].map(r=>`<option>${r}</option>`).join('')}</select>`,
      'Personalizado':`<label>Describe tu apuesta:</label><input id="d1" placeholder="Escribe el mercado y seleccion...">`
    };
    bx.innerHTML=mkmap[mk]||`<label>Seleccion:</label><input id="d1" placeholder="Descripcion">`;
  }else{
    const ptL=lopts(genL(150.5,280.5,5)),hL=lopts(genL(90.5,160.5,5)),qL=lopts(genL(40.5,75.5,2.5));
    const mkmap={
      'Ganador':`<label>Ganador:</label><select id="d1"><option>${lc}</option><option>${aw}</option></select>`,
      'Handicap':`<label>Equipo:</label><select id="d1"><option>${lc}</option><option>${aw}</option></select><label>Spread:</label><input id="d2" placeholder="Ej: -5.5">`,
      'Puntos Totales':`<div class="row"><div class="col"><label>Dir.:</label><select id="d1"><option>Mas de (+)</option><option>Menos de (-)</option></select></div><div class="col"><label>Linea:</label><select id="d2">${ptL}</select></div></div>`,
      'Ganador 1H':`<label>Ganador 1a Mitad:</label><select id="d1"><option>${lc}</option><option>${aw}</option><option>Empate al MT</option></select>`,
      'Puntos 1H':`<div class="row"><div class="col"><label>Dir.:</label><select id="d1"><option>Mas de (+)</option><option>Menos de (-)</option></select></div><div class="col"><label>Linea:</label><select id="d2">${hL}</select></div></div>`,
      'Ganador Cuarto':`<label>Cuarto:</label><select id="d1"><option>1er Cuarto</option><option>2do Cuarto</option><option>3er Cuarto</option><option>4to Cuarto</option></select><label>Ganador:</label><select id="d2"><option>${lc}</option><option>${aw}</option></select>`,
      'Puntos Cuarto':`<label>Cuarto:</label><select id="d1"><option>1er Cuarto</option><option>2do Cuarto</option><option>3er Cuarto</option><option>4to Cuarto</option></select><div class="row" style="margin-top:8px"><div class="col"><label>Dir.:</label><select id="d2"><option>Mas de (+)</option><option>Menos de (-)</option></select></div><div class="col"><label>Linea:</label><select id="d3">${qL}</select></div></div>`,
      'Props Jugador':`<label>Jugador:</label><input id="d1" placeholder="Nombre"><label>Estadistica:</label><select id="d2"><option>Puntos</option><option>Rebotes</option><option>Asistencias</option><option>PRA</option><option>Robos</option><option>Bloqueos</option><option>Triples anotados</option></select><div class="row" style="margin-top:8px"><div class="col"><label>Dir.:</label><select id="d3"><option>Mas de (+)</option><option>Menos de (-)</option></select></div><div class="col"><label>Linea:</label><input type="number" step="0.5" id="d4" placeholder="25.5"></div></div>`,
      'Doble Doble':`<label>Jugador:</label><input id="d1" placeholder="Nombre"><label>Lograra Doble-Doble?</label><select id="d2"><option>Si</option><option>No</option></select>`,
      'Triple Doble':`<label>Jugador:</label><input id="d1" placeholder="Nombre"><label>Lograra Triple-Doble?</label><select id="d2"><option>Si</option><option>No</option></select>`,
      'Personalizado NBA':`<label>Descripcion:</label><input id="d1" placeholder="Escribe el mercado...">`
    };
    bx.innerHTML=mkmap[mk]||`<label>Seleccion:</label><input id="d1" placeholder="...">`;
  }
}
function updCornersL(){
  const v=document.getElementById('d1')?.value,el=document.getElementById('d3');
  if(el)el.innerHTML=lopts(genL(.5,v==='total'?15.5:10.5));
}

function g(id){return document.getElementById(id)?.value||'';}
function buildDetails(sp,mk){
  if(sp==='fb'){
    if(['1X2','Doble Oportunidad','Ambos Marcan','Personalizado'].includes(mk))return g('d1');
    if(['Goles','Goles 1H'].includes(mk))return`${mk} ${g('d1')} | ${g('d2')} ${g('d3')}`;
    if(mk==='Corners')return`Corners ${g('d1')} | ${g('d2')} ${g('d3')}`;
    if(mk==='Tarjetas')return`${g('d2')} ${g('d1')} | ${g('d3')} ${g('d4')}`;
    if(mk==='Jugador')return`${g('d1')} | ${g('d2')} ${g('d3')} ${g('d4')}`;
    if(mk==='Handicap')return`Handicap ${g('d1')} ${g('d2')}`;
    if(mk==='Handicap Asiatico')return`H.Asiatico ${g('d1')} ${g('d2')}`;
    if(mk==='Resultado Exacto')return`Resultado: ${g('d1')}`;
    return g('d1');
  }else{
    if(mk==='Ganador')return`ML: ${g('d1')}`;
    if(mk==='Handicap')return`Spread: ${g('d1')} ${g('d2')}`;
    if(mk==='Puntos Totales')return`Puntos ${g('d1')} ${g('d2')}`;
    if(mk==='Ganador 1H')return`1aMitad: ${g('d1')}`;
    if(mk==='Puntos 1H')return`Pts 1aMitad ${g('d1')} ${g('d2')}`;
    if(mk==='Ganador Cuarto')return`${g('d1')}: ${g('d2')}`;
    if(mk==='Puntos Cuarto')return`${g('d1')} Pts ${g('d2')} ${g('d3')}`;
    if(mk==='Props Jugador')return`${g('d1')} | ${g('d2')} ${g('d3')} ${g('d4')}`;
    if(['Doble Doble','Triple Doble'].includes(mk))return`${mk}: ${g('d1')} - ${g('d2')}`;
    return g('d1')||mk;
  }
}

function saveBet(sn){
  const sp=sn==='Futbol'?'fb':'nba';
  if(!checkProBlock())return;
  const lc=document.getElementById(sp+'-local').value,aw=document.getElementById(sp+'-away').value;
  const mk=document.getElementById(sp+'-market').value,st=document.getElementById(sp+'-stake').value;
  const od=parseFloat(document.getElementById(sp+'-odds').value),mn=parseFloat(document.getElementById(sp+'-money').value);
  const rs=document.getElementById(sp+'-result').value,nt=document.getElementById(sp+'-notes').value.trim();
  if(!lc||!aw||!mk||isNaN(od)||!mn)return alert('Completa todos los campos.');
  const dt=buildDetails(sp,mk);
  let pr=0;
  if(rs==='Ganada'){pr=Math.round(mn*od-mn);appData.bank+=pr;}
  else if(rs==='Perdida'){pr=-mn;appData.bank-=mn;}
  appData.history.push({id:Date.now(),sport:sn,match:`${lc} vs ${aw}`,details:dt,notes:nt,stake:st,odds:od,money:mn,result:rs,profit:pr,date:new Date().toLocaleDateString('es-CO')});
  saveUserData();clearForm(sp);updateQuickStats();drawChart();checkTiltModal();
  alert(`Apuesta registrada!\nBankroll: $${appData.bank.toLocaleString('es-CO')}`);
}
function clearForm(sp){
  ['odds','notes'].forEach(f=>{const e=document.getElementById(sp+'-'+f);if(e)e.value='';});
  const re=document.getElementById(sp+'-result');if(re)re.value='Pendiente';
  const dc=document.getElementById(sp+'-dynamic-container');if(dc)dc.innerHTML='';
  const mk=document.getElementById(sp+'-market');if(mk)mk.value='';
}

function renderHistory(filter,btn){
  if(btn){document.querySelectorAll('.filters button').forEach(b=>b.classList.remove('active-filter'));btn.classList.add('active-filter');}
  const list=document.getElementById('history-list');list.innerHTML='';
  let w=0,l=0,p=0,ts=0,tp=0;
  appData.history.forEach(h=>{
    if(h.result==='Ganada'){w++;ts+=h.money;tp+=h.profit;}
    else if(h.result==='Perdida'){l++;ts+=h.money;tp+=h.profit;}
    else if(h.result==='Pendiente')p++;
  });
  const filt=filter==='Todas'?[...appData.history]:appData.history.filter(h=>h.result===filter);
  if(!filt.length){list.innerHTML='<p style="text-align:center;color:var(--text-muted);padding:28px 0">No hay apuestas en esta categoria</p>';}
  filt.slice().reverse().forEach(h=>{
    const sc=h.result==='Ganada'?'win':(h.result==='Perdida'?'loss':(h.result==='Nula'?'void':''));
    const pc=h.profit>0?'var(--success)':(h.profit<0?'var(--danger)':'gray');
    const ip=h.result==='Pendiente',ic=h.type==='Combinada';
    const cb=ic&&h.selections?`<div class="combi-picks">${h.selections.map((s,i)=>`<div class="combi-pick-row"><span>${i+1}. ${s.match} - ${s.pick}</span><span class="combi-sel-odds">@${parseFloat(s.odds).toFixed(2)}</span></div>`).join('')}</div>`:'';
    list.innerHTML+=`<div class="history-item ${sc}">
      <div class="h-head"><span>${h.date} · ${h.sport}</span><b>Stake ${h.stake}</b></div>
      <div class="h-title">${h.match}</div>${cb}
      <span class="h-detail">▶ ${h.details}</span>
      ${h.notes?`<div class="nota-display">📝 ${h.notes}</div>`:''}
      <div class="h-foot"><span>Inversion: $${h.money.toLocaleString('es-CO')}</span><span>Cuota: @${parseFloat(h.odds).toFixed(2)}</span></div>
      ${!ip?`<div class="h-profit" style="color:${pc}">${h.result}: ${h.profit>=0?'+':''}$${h.profit.toLocaleString('es-CO')}</div>`:''}
      <div class="h-actions">
        ${ip?`<button class="btn-success" onclick="resolvebet(${h.id},'Ganada')">✅ Ganada</button><button class="btn-danger" onclick="resolvebet(${h.id},'Perdida')">❌ Perdida</button><button onclick="resolvebet(${h.id},'Nula')" style="background:var(--void)">🔄 Nula</button>`:''}
        <button onclick="deleteBet(${h.id})" class="btn-secondary" style="max-width:80px">🗑</button>
      </div>
    </div>`;
  });
  const res=w+l,yp=ts>0?((tp/ts)*100).toFixed(2):0,wr=res>0?((w/res)*100).toFixed(1):0;
  document.getElementById('st-won').innerText=w;document.getElementById('st-lost').innerText=l;
  document.getElementById('st-pending').innerText=p;document.getElementById('st-total').innerText=appData.history.length;
  document.getElementById('st-yield').innerText=yp+'%';document.getElementById('st-winrate').innerText=wr+'%';
  document.getElementById('st-profit').innerText='$'+tp.toLocaleString('es-CO');
  document.getElementById('st-yield').style.color=parseFloat(yp)>=0?'var(--success)':'var(--danger)';
  document.getElementById('st-profit').style.color=tp>=0?'var(--success)':'var(--danger)';
}
function resolvebet(id,nr){
  const i=appData.history.findIndex(h=>h.id===id);if(i<0)return;
  const h=appData.history[i];let np=0;
  if(nr==='Ganada'){np=Math.round(h.money*h.odds-h.money);appData.bank+=np;}
  else if(nr==='Perdida'){np=-h.money;appData.bank-=h.money;}
  appData.history[i].result=nr;appData.history[i].profit=np;
  saveUserData();renderHistory('Todas',null);updateQuickStats();drawChart();checkTiltModal();checkTiltBanner();
}
function deleteBet(id){if(!confirm('Eliminar esta apuesta?'))return;appData.history=appData.history.filter(h=>h.id!==id);saveUserData();renderHistory('Todas',null);updateQuickStats();drawChart();}
function resetHistory(){if(!confirm('Eliminar historial y reiniciar bankroll a 0?'))return;appData.history=[];appData.bank=0;appData.bankLog=[];saveUserData();renderHistory('Todas',null);updateQuickStats();drawChart();}

function updateQuickStats(){
  const qs=document.getElementById('quick-stats');
  if(!appData.history.length){qs.style.display='none';return;}qs.style.display='flex';
  let w=0,ts=0,tp=0;
  appData.history.forEach(h=>{if(h.result==='Ganada'){w++;ts+=h.money;tp+=h.profit;}else if(h.result==='Perdida'){ts+=h.money;tp+=h.profit;}});
  const res=appData.history.filter(h=>['Ganada','Perdida'].includes(h.result)).length;
  const yp=ts>0?((tp/ts)*100).toFixed(1):0,wr=res>0?((w/res)*100).toFixed(0):0;
  document.getElementById('qs-yield').innerText=yp+'%';document.getElementById('qs-wr').innerText=wr+'%';
  document.getElementById('qs-count').innerText=appData.history.length;document.getElementById('qs-profit').innerText='$'+tp.toLocaleString('es-CO');
  document.getElementById('qs-yield').style.color=parseFloat(yp)>=0?'var(--success)':'var(--danger)';
  document.getElementById('qs-profit').style.color=tp>=0?'var(--success)':'var(--danger)';
}

// COMBINADAS
function addCombiSelection(){
  const idx=combiSelections.length;combiSelections.push({match:'',pick:'',odds:'',sport:'Futbol'});
  const cont=document.getElementById('combi-selections');
  const div=document.createElement('div');div.className='combi-sel-card';div.id='cs-'+idx;
  const lopts=Object.keys(LEAGUES).map(l=>`<option>${l}</option>`).join('');
  const nopts=NBA.sort().map(t=>`<option>${t}</option>`).join('');
  div.innerHTML=`<div class="combi-num">SEL. ${idx+1}</div><button class="remove-btn" onclick="removeCombi(${idx})">✕</button>
    <label>Deporte</label><select onchange="onCSportChange(this,${idx})" id="cs-sp-${idx}" style="margin-bottom:8px"><option value="Futbol">⚽ Futbol</option><option value="NBA">🏀 NBA</option></select>
    <div id="cs-teams-${idx}">
      <label>Liga</label><select id="cs-lg-${idx}" onchange="loadCombiTeams(${idx})" style="margin-bottom:7px">${lopts}</select>
      <div style="display:flex;gap:8px"><div style="flex:1"><label>Local</label><select id="cs-lc-${idx}" onchange="updateCMatch(${idx})" style="margin-bottom:7px"></select></div>
      <div style="flex:1"><label>Visitante</label><select id="cs-aw-${idx}" onchange="updateCMatch(${idx})" style="margin-bottom:7px"></select></div></div>
    </div>
    <label>Tu Pick</label><input placeholder="Ej: Gana Real Madrid..." oninput="combiSelections[${idx}].pick=this.value" id="cs-pk-${idx}">
    <label>Cuota (@)</label><input type="number" step="0.01" placeholder="Ej: 1.80" id="cs-od-${idx}" oninput="combiSelections[${idx}].odds=parseFloat(this.value)||'';updateCombiOdds()">`;
  cont.appendChild(div);loadCombiTeams(idx);updateCombiOdds();
}
function onCSportChange(sel,i){
  combiSelections[i].sport=sel.value;
  const td=document.getElementById('cs-teams-'+i);
  const nopts=NBA.sort().map(t=>`<option>${t}</option>`).join('');
  const lopts=Object.keys(LEAGUES).map(l=>`<option>${l}</option>`).join('');
  if(sel.value==='NBA'){td.innerHTML=`<div style="display:flex;gap:8px"><div style="flex:1"><label>Local</label><select id="cs-lc-${i}" onchange="updateCMatch(${i})" style="margin-bottom:7px">${nopts}</select></div><div style="flex:1"><label>Visitante</label><select id="cs-aw-${i}" onchange="updateCMatch(${i})" style="margin-bottom:7px">${nopts}</select></div></div>`;}
  else{td.innerHTML=`<label>Liga</label><select id="cs-lg-${i}" onchange="loadCombiTeams(${i})" style="margin-bottom:7px">${lopts}</select><div style="display:flex;gap:8px"><div style="flex:1"><label>Local</label><select id="cs-lc-${i}" onchange="updateCMatch(${i})" style="margin-bottom:7px"></select></div><div style="flex:1"><label>Visitante</label><select id="cs-aw-${i}" onchange="updateCMatch(${i})" style="margin-bottom:7px"></select></div></div>`;loadCombiTeams(i);}
  updateCMatch(i);
}
function loadCombiTeams(i){const e=document.getElementById('cs-lg-'+i);if(!e)return;const ts=(LEAGUES[e.value]||[]).map(t=>`<option>${t}</option>`).join('');['cs-lc-','cs-aw-'].forEach(p=>{const el=document.getElementById(p+i);if(el)el.innerHTML=ts;});updateCMatch(i);}
function updateCMatch(i){const l=document.getElementById('cs-lc-'+i)?.value||'',a=document.getElementById('cs-aw-'+i)?.value||'';if(l&&a)combiSelections[i].match=`${l} vs ${a}`;}
function removeCombi(i){if(combiSelections.length<=1)return alert('Necesitas al menos una seleccion.');const tmp=[...combiSelections];combiSelections=[];document.getElementById('combi-selections').innerHTML='';tmp.forEach((s,j)=>{if(j===i)return;addCombiSelection();combiSelections[combiSelections.length-1]={...s};});updateCombiOdds();}
function updateCombiOdds(){
  const st=document.getElementById('combi-stake').value,pct=st*2;
  document.getElementById('combi-stake-val').innerText=st;document.getElementById('combi-stake-pct').innerText=pct+'%';
  const base=appData.initialBank||appData.bank,mn=Math.round(base*(pct/100));
  document.getElementById('combi-money').value=mn||'';
  const vo=combiSelections.filter(s=>s.odds>0),to=vo.reduce((a,s)=>a*s.odds,1),pot=mn?Math.round(mn*to):0;
  const sm=document.getElementById('combi-summary');
  if(combiSelections.length>0){sm.style.display='block';document.getElementById('combi-count').innerText=combiSelections.length+' selecc.';document.getElementById('combi-total-odds').innerText=to.toFixed(2);document.getElementById('combi-potential').innerText=pot>0?'$'+pot.toLocaleString('es-CO'):'$0';}
  else sm.style.display='none';
}
function saveCombi(){
  const mn=parseFloat(document.getElementById('combi-money').value),rs=document.getElementById('combi-result').value;
  const st=document.getElementById('combi-stake').value,nt=document.getElementById('combi-notes').value.trim();
  combiSelections.forEach((_,i)=>updateCMatch(i));
  const vs=combiSelections.filter(s=>s.match&&s.pick&&s.odds>0);
  if(vs.length<2)return alert('Necesitas al menos 2 selecciones completas.');
  if(!mn)return alert('Establece tu Bankroll primero.');
  const to=parseFloat(vs.reduce((a,s)=>a*s.odds,1).toFixed(2));
  let pr=0;if(rs==='Ganada'){pr=Math.round(mn*to-mn);appData.bank+=pr;}else if(rs==='Perdida'){pr=-mn;appData.bank-=mn;}
  appData.history.push({id:Date.now(),type:'Combinada',sport:'Combinada',match:`Combinada ${vs.length} sels.`,details:`Cuota total: @${to}`,notes:nt,selections:vs.map(s=>({match:s.match,pick:s.pick,odds:s.odds})),totalOdds:to,stake:st,odds:to,money:mn,result:rs,profit:pr,date:new Date().toLocaleDateString('es-CO')});
  saveUserData();clearCombi();updateQuickStats();drawChart();alert(`Combinada guardada! @${to}\nBankroll: $${appData.bank.toLocaleString('es-CO')}`);
}
function clearCombi(){combiSelections=[];document.getElementById('combi-selections').innerHTML='';document.getElementById('combi-result').value='Pendiente';document.getElementById('combi-stake').value=1;document.getElementById('combi-notes').value='';document.getElementById('combi-summary').style.display='none';addCombiSelection();}

// RETOS
function renderRetoTemplates(){
  document.getElementById('reto-template-list').innerHTML=Object.entries(RETO_TMPL).map(([k,t])=>
    `<div class="reto-template-card" onclick="selectRetoTemplate('${k}')">
      <div class="reto-tmpl-header"><div class="reto-tmpl-badge" style="color:${t.color}">${t.label}</div><div class="reto-tmpl-name">${t.type==='trivia'?'Trivia':t.type==='streak'?'Racha':t.type==='highOdds'?'Cuota Alta':'Escalera'}</div></div>
      <div class="reto-tmpl-desc">${t.desc}</div>
      <div><span class="reto-tmpl-tag">🎯 ${t.cuotaRec}</span><span class="reto-tmpl-tag">📊 ${t.pasos}</span></div>
    </div>`
  ).join('');
}
function selectRetoTemplate(k){
  if(appData.activeReto)return alert('Ya tienes un reto activo. Terminalo o abandonalo primero.');
  pendingRetoType=k;const t=RETO_TMPL[k];
  document.getElementById('reto-setup-title').innerText='Configurar: '+t.label;
  document.getElementById('reto-initial').value=appData.bank>0?appData.bank:'';
  document.getElementById('reto-bank-row').style.display=t.type==='trivia'?'none':'block';
  const goal=t.mult?(appData.bank*t.mult).toLocaleString('es-CO'):'N/A';
  document.getElementById('reto-setup-info').innerHTML=`<b style="color:var(--primary)">${t.desc}</b><br><br>
    ${t.type!=='trivia'?`Con el monto que ingreses, tu meta sera <b>x${t.mult||'N/A'}</b> ese valor.`:'Responde 10 preguntas. Maximo 3 errores. Sin apuestas de dinero.'}<br><br>
    ${t.tips[0]}<br>${t.tips[1]}`;
  document.getElementById('reto-home').style.display='none';
  document.getElementById('reto-setup-view').style.display='block';
}
function cancelRetoSetup(){pendingRetoType=null;document.getElementById('reto-setup-view').style.display='none';document.getElementById('reto-home').style.display='block';}
function startReto(){
  const nm=document.getElementById('reto-name').value.trim()||('Reto '+pendingRetoType);
  const sp=document.getElementById('reto-sport').value;
  const t=RETO_TMPL[pendingRetoType];
  if(t.type==='trivia'){
    appData.activeReto={id:Date.now(),name:nm,type:'trivia',sport:sp,startDate:new Date().toLocaleDateString('es-CO'),status:'active',correct:0,errors:0};
    saveUserData();document.getElementById('reto-setup-view').style.display='none';
    startTrivia(nm);return;
  }
  const init=parseFloat(document.getElementById('reto-initial').value);
  if(!init||init<=0)return alert('Ingresa un monto inicial valido.');
  const goal=t.mult?Math.round(init*t.mult):null;
  const target=t.target||null;
  appData.activeReto={id:Date.now(),name:nm,type:pendingRetoType,templateType:t.type,mult:t.mult,minOdds:t.minOdds||null,initialBank:init,goalBank:goal,currentBank:init,target,currentStreak:0,sport:sp,startDate:new Date().toLocaleDateString('es-CO'),bets:[],status:'active'};
  saveUserData();document.getElementById('reto-setup-view').style.display='none';renderRetoView();
}

function renderRetoView(){
  const r=appData.activeReto;
  const hm=document.getElementById('reto-home'),av=document.getElementById('reto-active-view');
  const sv=document.getElementById('reto-setup-view');sv.style.display='none';
  if(!r){
    hm.style.display='block';av.style.display='none';
    renderRetoPast();return;
  }
  hm.style.display='none';av.style.display='block';
  // Decide which sub-view
  const lv=document.getElementById('reto-ladder-view'),stv=document.getElementById('reto-streak-view'),tv=document.getElementById('reto-trivia-view');
  lv.style.display='none';stv.style.display='none';tv.style.display='none';
  if(r.type==='trivia'){tv.style.display='block';startTrivia(r.name);}
  else if(r.templateType==='streak'||r.type==='RACHA'){stv.style.display='block';renderStreakView();}
  else{lv.style.display='block';renderLadderView();}
}

function renderLadderView(){
  const r=appData.activeReto;if(!r)return;
  const pct=Math.min((r.currentBank/r.goalBank)*100,100);
  document.getElementById('reto-bank-val').innerText='$'+r.currentBank.toLocaleString('es-CO');
  document.getElementById('reto-goal-val').innerText='$'+r.goalBank.toLocaleString('es-CO');
  document.getElementById('reto-active-name').innerText=r.name+' (x'+r.mult+')';
  document.getElementById('reto-pct').innerText=pct.toFixed(1)+'%';
  document.getElementById('reto-prog-fill').style.width=pct+'%';
  document.getElementById('reto-start-lbl').innerText='$'+r.initialBank.toLocaleString('es-CO');
  document.getElementById('reto-end-lbl').innerText='$'+r.goalBank.toLocaleString('es-CO');
  const t=RETO_TMPL[r.type]||RETO_TMPL['X3'];
  document.getElementById('reto-tips-content').innerHTML=t.tips.map(tp=>`<div class="consejo-card" style="margin-bottom:7px"><p>${tp}</p></div>`).join('');
  const bl=document.getElementById('reto-ladder-bets');
  if(!r.bets.length){bl.innerHTML='<p style="color:var(--text-muted);font-size:.83rem;text-align:center;padding:14px 0">Sin apuestas todavia</p>';return;}
  bl.innerHTML=r.bets.slice().reverse().map(b=>{
    const sc=b.result==='Ganada'?'win':(b.result==='Perdida'?'loss':'pending');
    const pc=b.profit>0?'var(--success)':(b.profit<0?'var(--danger)':'var(--void)');
    return`<div class="reto-bet-item ${sc}">
      <div style="display:flex;justify-content:space-between"><b>${b.match}</b><span style="font-size:.77rem;color:var(--text-muted)">@${parseFloat(b.odds).toFixed(2)}</span></div>
      <div style="font-size:.78rem;color:var(--primary);margin:2px 0">▶ ${b.pick}</div>
      <div style="display:flex;justify-content:space-between;font-size:.75rem;color:var(--text-muted)">
        <span>$${b.amount.toLocaleString('es-CO')}</span>
        ${b.result==='Pendiente'?`<button onclick="resolveLadderBet(${b.id},'Ganada')" class="btn-success" style="width:auto;padding:3px 8px;font-size:.7rem">✅</button><button onclick="resolveLadderBet(${b.id},'Perdida')" class="btn-danger" style="width:auto;padding:3px 8px;font-size:.7rem">❌</button><button onclick="resolveLadderBet(${b.id},'Nula')" style="width:auto;padding:3px 8px;font-size:.7rem;background:var(--void)">🔄</button>`
        :`<span style="font-weight:700;color:${pc}">${b.result}: ${b.profit>=0?'+':''}$${b.profit.toLocaleString('es-CO')}</span>`}
      </div>
    </div>`;
  }).join('');
}

function addLadderBet(){
  const r=appData.activeReto;if(!r)return;
  const match=document.getElementById('reto-match').value.trim(),pick=document.getElementById('reto-pick').value.trim();
  const odds=parseFloat(document.getElementById('reto-odds').value),amount=parseFloat(document.getElementById('reto-amount').value);
  const result=document.getElementById('reto-result').value;
  if(!match||!pick||isNaN(odds)||!amount)return alert('Completa todos los campos.');
  if(amount>r.currentBank)return alert('El monto supera el bank del reto.');
  if(r.minOdds&&odds<r.minOdds)return alert(`Este reto requiere cuota >= ${r.minOdds}`);
  let profit=0;
  if(result==='Ganada'){profit=Math.round(amount*odds-amount);r.currentBank+=profit;}
  else if(result==='Perdida'){profit=-amount;r.currentBank-=amount;}
  else if(result==='Nula'){}
  r.bets.push({id:Date.now(),match,pick,odds,amount,result,profit,date:new Date().toLocaleDateString('es-CO')});
  ['reto-match','reto-pick','reto-odds','reto-amount'].forEach(id=>{document.getElementById(id).value='';});
  document.getElementById('reto-result').value='Pendiente';
  if(result!=='Pendiente')checkLadderEnd();
  else{saveUserData();renderLadderView();}
}

function resolveLadderBet(id,nr){
  const r=appData.activeReto;if(!r)return;
  const i=r.bets.findIndex(b=>b.id===id);if(i<0)return;
  const b=r.bets[i];let pr=0;
  if(nr==='Ganada'){pr=Math.round(b.amount*b.odds-b.amount);r.currentBank+=pr;}
  else if(nr==='Perdida'){pr=-b.amount;r.currentBank-=b.amount;}
  r.bets[i].result=nr;r.bets[i].profit=pr;
  checkLadderEnd();
}

function checkLadderEnd(){
  const r=appData.activeReto;
  if(r.currentBank<=0){
    r.currentBank=0;r.status='failed';
    appData.retoHistory.push({...r,endDate:new Date().toLocaleDateString('es-CO')});
    appData.activeReto=null;saveUserData();
    document.getElementById('reto-lose-desc').innerText=`Fallaste el reto "${r.name}" tras ${r.bets.length} apuesta${r.bets.length!==1?'s':''}. Analiza y vuelve mas fuerte!`;
    document.getElementById('reto-lose-modal').classList.add('show');renderRetoView();return;
  }
  if(r.goalBank&&r.currentBank>=r.goalBank){
    r.status='completed';
    appData.retoHistory.push({...r,endDate:new Date().toLocaleDateString('es-CO')});
    appData.activeReto=null;saveUserData();
    document.getElementById('reto-win-title').innerText='Reto '+r.name+' completado!';
    document.getElementById('reto-win-desc').innerText=`Empezaste con $${r.initialBank.toLocaleString('es-CO')} y llegaste a $${r.currentBank.toLocaleString('es-CO')} en ${r.bets.filter(b=>b.result!=='Pendiente').length} apuestas. Disciplina total!`;
    document.getElementById('reto-win-modal').classList.add('show');renderRetoView();return;
  }
  saveUserData();renderLadderView();
}

function renderStreakView(){
  const r=appData.activeReto;if(!r)return;
  const cur=r.currentStreak||0,tgt=r.target||5;
  document.getElementById('streak-name').innerText=r.name;
  document.getElementById('streak-current').innerText=cur;
  document.getElementById('streak-target').innerText=tgt;
  document.getElementById('streak-fill').style.width=Math.min((cur/tgt)*100,100)+'%';
  const dots=document.getElementById('streak-dots');
  const allBets=(r.bets||[]).filter(b=>b.result!=='Pendiente');
  dots.innerHTML=allBets.slice(-10).map(b=>{
    const ok=b.result==='Ganada';
    return`<div class="streak-dot" style="background:${ok?'var(--success)':'var(--danger)'}">${ok?'G':'P'}</div>`;
  }).join('');
  const bl=document.getElementById('reto-streak-bets');
  if(!r.bets||!r.bets.length){bl.innerHTML='<p style="color:var(--text-muted);font-size:.83rem;text-align:center;padding:14px 0">Sin apuestas todavia</p>';return;}
  bl.innerHTML=r.bets.slice().reverse().map(b=>{
    const sc=b.result==='Ganada'?'win':(b.result==='Perdida'?'loss':'pending');
    const pc=b.profit>0?'var(--success)':(b.profit<0?'var(--danger)':'gray');
    return`<div class="reto-bet-item ${sc}">
      <div style="display:flex;justify-content:space-between"><b>${b.match}</b><span style="font-size:.77rem;color:var(--text-muted)">@${parseFloat(b.odds).toFixed(2)}</span></div>
      <div style="font-size:.78rem;color:var(--primary);margin:2px 0">▶ ${b.pick}</div>
      <div style="font-size:.75rem;color:${pc};text-align:right">${b.result==='Pendiente'?'Pendiente':`${b.result}: ${b.profit>=0?'+':''}$${b.profit.toLocaleString('es-CO')}`}</div>
    </div>`;
  }).join('');
}

function addStreakBet(){
  const r=appData.activeReto;if(!r)return;
  const match=document.getElementById('streak-match').value.trim(),pick=document.getElementById('streak-pick').value.trim();
  const odds=parseFloat(document.getElementById('streak-odds').value),amount=parseFloat(document.getElementById('streak-amount').value);
  const result=document.getElementById('streak-result').value;
  if(!match||!pick||isNaN(odds)||!amount)return alert('Completa todos los campos.');
  let profit=0;
  if(result==='Ganada'){profit=Math.round(amount*odds-amount);}
  else if(result==='Perdida'){profit=-amount;}
  if(result!=='Pendiente'){
    if(result==='Ganada'||result==='Nula'){
      if(result==='Ganada')r.currentStreak=(r.currentStreak||0)+1;
    }else{
      r.currentStreak=0;
    }
  }
  r.bets.push({id:Date.now(),match,pick,odds,amount,result,profit,date:new Date().toLocaleDateString('es-CO')});
  ['streak-match','streak-pick','streak-odds','streak-amount'].forEach(id=>{document.getElementById(id).value='';});
  document.getElementById('streak-result').value='Pendiente';
  if(result==='Ganada'&&r.currentStreak>=(r.target||5)){
    r.status='completed';
    appData.retoHistory.push({...r,endDate:new Date().toLocaleDateString('es-CO')});
    appData.activeReto=null;saveUserData();
    document.getElementById('reto-win-title').innerText='Reto Racha completado!';
    document.getElementById('reto-win-desc').innerText=`Lograste ${r.target||5} victorias CONSECUTIVAS con "${r.name}". Disciplina total!`;
    document.getElementById('reto-win-modal').classList.add('show');renderRetoView();return;
  }
  saveUserData();renderStreakView();
}

function abandonReto(){
  if(!confirm('Abandonar el reto? Se guardara como fallado.'))return;
  const r=appData.activeReto;r.status='failed';
  appData.retoHistory.push({...r,endDate:new Date().toLocaleDateString('es-CO')});
  appData.activeReto=null;saveUserData();renderRetoView();
}
function restartReto(){
  const lr=appData.retoHistory[appData.retoHistory.length-1];
  ['reto-win-modal','reto-lose-modal'].forEach(id=>document.getElementById(id).classList.remove('show'));
  if(lr){pendingRetoType=lr.type;selectRetoTemplate(lr.type);if(document.getElementById('reto-name'))document.getElementById('reto-name').value=lr.name||'';}
  navTo('view-reto');
}
function endReto(){['reto-win-modal','reto-lose-modal'].forEach(id=>document.getElementById(id).classList.remove('show'));navTo('view-reto');}
function clearRetoHistory(){
  if(!confirm('Borrar todo el historial de retos?'))return;
  appData.retoHistory=[];saveUserData();renderRetoPast();
}
function renderRetoPast(){
  const pc=document.getElementById('reto-past-card'),pl=document.getElementById('reto-past-list');
  if(!appData.retoHistory||!appData.retoHistory.length){pc.style.display='none';return;}
  pc.style.display='block';
  pl.innerHTML=appData.retoHistory.slice().reverse().map(r=>{
    const ok=r.status==='completed';
    const bankInfo=r.currentBank!==undefined?`$${r.initialBank?.toLocaleString('es-CO')||'?'} → <b style="color:${ok?'var(--success)':'var(--danger)'}">$${r.currentBank.toLocaleString('es-CO')}</b>`:'';
    return`<div class="reto-past-item ${r.status}">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <b style="color:${ok?'var(--success)':'var(--danger)'}">${ok?'✅':'❌'} ${r.name}</b>
        <span style="font-size:.72rem;color:var(--text-muted)">${r.startDate}</span>
      </div>
      <div style="font-size:.78rem;color:var(--text-muted);margin-top:4px">
        Tipo: ${r.type} · ${(r.bets||[]).length} apuesta${(r.bets||[]).length!==1?'s':''} ${bankInfo?'· '+bankInfo:''}
      </div>
    </div>`;
  }).join('');
}

// TRIVIA
function startTrivia(name){
  document.getElementById('trivia-reto-name').innerText=name||'Trivia';
  const shuffled=[...TRIVIA].sort(()=>Math.random()-.5).slice(0,10);
  triviaState={questions:shuffled,current:0,correct:0,errors:0};
  renderTriviaQuestion();
}
function renderTriviaQuestion(){
  const ts=triviaState,q=ts.questions[ts.current];
  if(!q)return;
  document.getElementById('trivia-q-num').innerText=`Pregunta ${ts.current+1}/10`;
  document.getElementById('trivia-correct').innerText=ts.correct;
  document.getElementById('trivia-score-fill').style.width=(ts.correct/10*100)+'%';
  const lives=3-ts.errors;
  document.getElementById('trivia-lives').innerHTML='❤️'.repeat(lives)+'🖤'.repeat(3-lives);
  document.getElementById('trivia-question').innerText=q.q;
  const opts=document.getElementById('trivia-options');
  opts.innerHTML=q.o.map((op,i)=>`<button class="trivia-opt" onclick="answerTrivia(${i})">${op}</button>`).join('');
  document.getElementById('trivia-feedback').style.display='none';
  document.getElementById('trivia-next-btn').style.display='none';
}
function answerTrivia(idx){
  const ts=triviaState,q=ts.questions[ts.current];
  const opts=document.querySelectorAll('.trivia-opt');
  opts.forEach(b=>b.disabled=true);
  const correct=idx===q.c;
  opts[idx].classList.add(correct?'correct':'wrong');
  if(!correct){opts[q.c].classList.add('show-correct');ts.errors++;}
  else ts.correct++;
  const fb=document.getElementById('trivia-feedback');
  fb.style.display='block';
  fb.style.background=correct?'#e6faf5':'#fff0f0';
  fb.style.color=correct?'var(--success)':'var(--danger)';
  fb.innerText=correct?'✅ Correcto!':'❌ Incorrecto. La correcta era: '+q.o[q.c];
  if(ts.errors>=3){
    setTimeout(()=>{
      const r=appData.activeReto;if(r){r.status='failed';r.correct=ts.correct;r.errors=ts.errors;appData.retoHistory.push({...r,endDate:new Date().toLocaleDateString('es-CO')});appData.activeReto=null;saveUserData();}
      document.getElementById('reto-lose-desc').innerText=`Fallaste la trivia "${r?.name||''}" con ${ts.correct}/10 correctas y ${ts.errors} errores.`;
      document.getElementById('reto-lose-modal').classList.add('show');renderRetoView();
    },1500);return;
  }
  if(ts.current>=9){
    setTimeout(()=>{
      const r=appData.activeReto;if(r){r.status='completed';r.correct=ts.correct;r.errors=ts.errors;appData.retoHistory.push({...r,endDate:new Date().toLocaleDateString('es-CO')});appData.activeReto=null;saveUserData();}
      document.getElementById('reto-win-title').innerText='Trivia Completada!';
      document.getElementById('reto-win-desc').innerText=`Respondiste ${ts.correct}/10 correctas con ${ts.errors} errores. ${ts.correct>=8?'Excelente conocimiento!':ts.correct>=5?'Buen intento!':'Sigue estudiando el glosario!'}`;
      document.getElementById('reto-win-modal').classList.add('show');renderRetoView();
    },1500);return;
  }
  document.getElementById('trivia-next-btn').style.display='block';
}
function nextTriviaQuestion(){triviaState.current++;renderTriviaQuestion();}

// ANALISIS
const CONSEJOS_BASE=[
  {tipo:'default',titulo:'Flat Staking',texto:'Siempre calculas sobre el bankroll inicial. Evita distorsion por rachas.'},
  {tipo:'default',titulo:'El Yield es tu norte',texto:'Yield sostenido 5-8% = excelente. Por encima del 10% a largo plazo = sobresaliente.'},
  {tipo:'warning',titulo:'Cuidado con el Tilt',texto:'Si pierdes 3 seguidas, para. Las peores decisiones llegan intentando recuperar perdidas rapido.'},
  {tipo:'default',titulo:'Especializate',texto:'Domina 1 o 2 ligas. Conocimiento profundo vale mas que apostar en todo.'},
  {tipo:'success',titulo:'Registra tu razonamiento',texto:'Usa Notas antes de cada apuesta. Revisar tu logica despues del partido acelera tu aprendizaje.'},
  {tipo:'warning',titulo:'Cuidado con las combinadas',texto:'Multiplican la cuota pero tambien el riesgo. Un fallo = todo perdido. Usalas con moderacion.'},
];
function renderAnalisis(){
  const res=appData.history.filter(h=>['Ganada','Perdida'].includes(h.result));
  const bw=document.getElementById('analisis-bestworse');
  if(!res.length){bw.innerHTML='<p style="color:var(--text-muted);font-size:.83rem;text-align:center;padding:14px 0">Sin apuestas resueltas</p>';}
  else{
    const best=res.reduce((a,b)=>b.profit>a.profit?b:a),worst=res.reduce((a,b)=>b.profit<a.profit?b:a);
    const bwi=(h,t)=>{const ok=t==='best',c=ok?'var(--success)':'var(--danger)',lb=ok?'🏆 Mejor':'💀 Peor';return`<div class="bw-item" style="border-color:${c}40"><div class="bw-label" style="color:${c}">${lb}</div><div class="bw-match">${h.match}</div><div class="bw-meta">${h.date} · @${parseFloat(h.odds).toFixed(2)}</div><div class="bw-profit" style="color:${c}">${h.profit>=0?'+':''}$${h.profit.toLocaleString('es-CO')}</div></div>`;};
    bw.innerHTML=`<div class="best-worst-card">${bwi(best,'best')}${bwi(worst,'worst')}</div>`;
  }
  const rE=document.getElementById('racha-emoji'),rT=document.getElementById('racha-texto'),rS=document.getElementById('racha-sub'),rD=document.getElementById('racha-dots');
  if(!res.length){rE.innerText='—';rT.innerText='Sin apuestas resueltas';rS.innerText='';rD.innerHTML='';}
  else{
    let cnt=1,tipo=res[res.length-1].result;
    for(let i=res.length-2;i>=0;i--){if(res[i].result===tipo)cnt++;else break;}
    rD.innerHTML=res.slice(-10).map(h=>`<div class="racha-dot" style="background:${h.result==='Ganada'?'var(--success)':'var(--danger)'}">${h.result==='Ganada'?'G':'P'}</div>`).join('');
    if(tipo==='Ganada'){rE.innerText=cnt>=3?'🔥':'✅';rT.innerText=`Racha ganadora de ${cnt}`;rT.style.color='var(--success)';rS.innerText=cnt>=3?'Mantener la disciplina!':'Vas bien.';}
    else{rE.innerText=cnt>=3?'❄️':'❌';rT.innerText=`Racha perdedora de ${cnt}`;rT.style.color='var(--danger)';rS.innerText=cnt>=3?'Para y revisa tu metodologia.':'Normal en el proceso.';}
  }
  const de=document.getElementById('analisis-deportes');
  const sports=['Futbol','NBA','Combinada'];
  const sd=sports.map(s=>{const bets=res.filter(h=>h.sport===s||(s==='Combinada'&&h.type==='Combinada'));const won=bets.filter(h=>h.result==='Ganada').length;const ts=bets.reduce((a,h)=>a+h.money,0),tp=bets.reduce((a,h)=>a+h.profit,0);const y=ts>0?(tp/ts*100):null,wr=bets.length>0?(won/bets.length*100):0;return{sport:s,count:bets.length,won,y,tp,wr};}).filter(s=>s.count>0);
  de.innerHTML=!sd.length?'<p style="color:var(--text-muted);font-size:.83rem;text-align:center;padding:14px 0">Sin datos</p>':sd.map(s=>{const yc=s.y===null?'var(--text-muted)':(s.y>=0?'var(--success)':'var(--danger)');const ys=s.y===null?'N/A':`${s.y>=0?'+':''}${s.y.toFixed(1)}%`;const bc=s.wr>=55?'var(--success)':(s.wr>=45?'var(--void)':'var(--danger)');return`<div class="analisis-sport-row"><div class="analisis-sport-head"><span class="analisis-sport-name">${s.sport}</span><span class="analisis-sport-meta">${s.count} apuesta${s.count>1?'s':''}</span></div><div class="analisis-bar-track"><div class="analisis-bar-fill" style="width:${Math.min(s.wr,100)}%;background:${bc}"></div></div><div class="analisis-sport-stats"><span>Acierto: <b>${s.wr.toFixed(0)}%</b></span><span>Yield: <b style="color:${yc}">${ys}</b></span><span>P&G: <b style="color:${s.tp>=0?'var(--success)':'var(--danger)'}">${s.tp>=0?'+':''}$${s.tp.toLocaleString('es-CO')}</b></span></div></div>`;}).join('');
  const le=document.getElementById('analisis-ligas');
  const fbRes=res.filter(h=>h.sport==='Futbol');
  const mktMap={'1X2':d=>d.startsWith('Gana')||d==='Empate','Goles':d=>d.includes('Goles'),'Corners':d=>d.includes('Corner'),'Tarjetas':d=>d.includes('Tarjeta'),'Handicap':d=>d.includes('Handicap'),'Ambos Marcan':d=>d.includes('Ambos')};
  const md=Object.entries(mktMap).map(([m,fn])=>{const bets=fbRes.filter(h=>fn(h.details||''));if(!bets.length)return null;const won=bets.filter(h=>h.result==='Ganada').length,ts=bets.reduce((a,h)=>a+h.money,0),tp=bets.reduce((a,h)=>a+h.profit,0),y=ts>0?(tp/ts*100):null;return{name:m,count:bets.length,won,y,tp};}).filter(Boolean).sort((a,b)=>(b.y||0)-(a.y||0));
  le.innerHTML=!md.length?'<p style="color:var(--text-muted);font-size:.83rem;text-align:center;padding:14px 0">Sin datos de futbol</p>':md.map(m=>{const yc=m.y===null?'var(--text-muted)':(m.y>=0?'var(--success)':'var(--danger)');const ys=m.y===null?'N/A':`${m.y>=0?'+':''}${m.y.toFixed(1)}%`;return`<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px dashed var(--border)"><div><div style="font-weight:700;font-size:.86rem">${m.name}</div><div style="font-size:.7rem;color:var(--text-muted)">${m.count} apuestas · ${m.won} ganadas</div></div><div style="text-align:right"><div style="font-weight:800;color:${yc}">${ys}</div><div style="font-size:.7rem;color:${m.tp>=0?'var(--success)':'var(--danger)'}">${m.tp>=0?'+':''}$${m.tp.toLocaleString('es-CO')}</div></div></div>`;}).join('');
  const cl=document.getElementById('consejos-list');const cons=[...CONSEJOS_BASE];
  if(res.length>=5){const ts=res.reduce((a,h)=>a+h.money,0),tp=res.reduce((a,h)=>a+h.profit,0);const gy=ts>0?(tp/ts*100):0,w=res.filter(h=>h.result==='Ganada').length,wr=w/res.length*100;
    if(gy<-10)cons.unshift({tipo:'danger',titulo:'Yield muy negativo',texto:`Tu yield es ${gy.toFixed(1)}%. Para y revisa en que mercados fallas.`});
    else if(gy>10)cons.unshift({tipo:'success',titulo:'Yield excelente',texto:`Yield del ${gy.toFixed(1)}%. Mantener la disciplina!`});
    if(wr<40)cons.unshift({tipo:'warning',titulo:'Tasa de acierto baja',texto:`Aciertas el ${wr.toFixed(0)}% de tus apuestas. Revisa tu metodologia.`});
  }
  cl.innerHTML=cons.map(c=>`<div class="consejo-card ${c.tipo}"><h4>${c.titulo}</h4><p>${c.texto}</p></div>`).join('');
}

function drawChart(){
  const cv=document.getElementById('bankroll-chart'),em=document.getElementById('chart-empty');
  const ctx=cv.getContext('2d'),W=cv.offsetWidth||460,H=130;
  cv.width=W;cv.height=H;ctx.clearRect(0,0,W,H);
  const pts=[];let cum=0;
  appData.history.filter(h=>['Ganada','Perdida'].includes(h.result)).forEach(h=>{cum+=h.profit;pts.push(cum);});
  if(pts.length<2){em.style.display='block';cv.style.display='none';return;}
  em.style.display='none';cv.style.display='block';
  const all=[0,...pts],mn=Math.min(...all),mx=Math.max(...all),rng=mx-mn||1;
  const pd={t:12,b:12,l:8,r:8},cW=W-pd.l-pd.r,cH=H-pd.t-pd.b;
  const tX=i=>pd.l+(i/(pts.length-1))*cW,tY=v=>pd.t+cH-((v-mn)/rng)*cH;
  ctx.beginPath();ctx.setLineDash([4,4]);ctx.strokeStyle='rgba(127,127,127,.3)';ctx.lineWidth=1;ctx.moveTo(pd.l,tY(0));ctx.lineTo(W-pd.r,tY(0));ctx.stroke();ctx.setLineDash([]);
  const last=pts[pts.length-1],pos=last>=0;
  ctx.beginPath();ctx.moveTo(tX(0),tY(pts[0]));pts.forEach((v,i)=>{if(i>0)ctx.lineTo(tX(i),tY(v));});ctx.lineTo(tX(pts.length-1),H-pd.b);ctx.lineTo(tX(0),H-pd.b);ctx.closePath();
  const gr=ctx.createLinearGradient(0,0,0,H);gr.addColorStop(0,pos?'rgba(0,184,148,.2)':'rgba(214,48,49,.2)');gr.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=gr;ctx.fill();
  ctx.beginPath();ctx.moveTo(tX(0),tY(pts[0]));pts.forEach((v,i)=>{if(i>0)ctx.lineTo(tX(i),tY(v));});ctx.strokeStyle=pos?'#00b894':'#d63031';ctx.lineWidth=2.5;ctx.lineJoin='round';ctx.stroke();
  const lx=tX(pts.length-1),ly=tY(last);ctx.beginPath();ctx.arc(lx,ly,5,0,Math.PI*2);ctx.fillStyle=pos?'#00b894':'#d63031';ctx.fill();
  ctx.fillStyle=pos?'#00b894':'#d63031';ctx.font='bold 11px Segoe UI';ctx.textAlign=lx>W/2?'right':'left';ctx.fillText(`${last>=0?'+':''}$${last.toLocaleString('es-CO')}`,lx,ly-8);
}

function toggleDark(){const d=document.body.classList.toggle('dark');document.getElementById('dark-toggle').innerText=d?'☀️':'🌙';localStorage.setItem('bmDark',d?'1':'');}