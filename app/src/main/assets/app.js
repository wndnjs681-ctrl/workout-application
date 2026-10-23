'use strict';
const $=s=>document.querySelector(s);
const icons={
 dumbbell:'M3 8v8m3-11v14m3-8h6m0-6v14m3-11v8M3 10H1v4h2m15-4h3v4h-3',
 heart:'M12 21 3 12C-2 5 7-1 12 6c5-7 14-1 9 6z',
 home:'M3 10l9-7 9 7v10H3zM9 20v-7h6v7',calendar:'M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2M7 2v4m10-4v4M3 10h18M7 14h2m6 0h2m-10 4h2',
 chart:'M4 3v17h17M8 15l4-5 4 2 5-7',settings:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1z',
 plus:'M12 5v14M5 12h14',check:'M5 12l4 4L19 6',arrow:'M5 12h14m-5-5 5 5-5 5',back:'M16 5l-7 7 7 7',next:'M8 5l7 7-7 7',clock:'M12 8v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18',
 flame:'M12 2c0 7-8 7-8 13a8 8 0 0 0 16 0c0-3-2-6-4-7 0 3-1 4-2 5 0-5-2-7-2-11',close:'M6 6l12 12M18 6 6 18',search:'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14m5 12 6 6',pause:'M8 5v14m8-14v14',play:'M7 4l14 8-14 8z',stop:'M6 6h12v12H6z',more:'M5 12h.01M12 12h.01M19 12h.01',download:'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',upload:'M12 16V4m-5 5 5-5 5 5M4 16v5h16v-5',widget:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',info:'M12 10v6m0-9h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20',trash:'M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7',target:'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10m0 5h.01',bolt:'M13 2 4 14h7l-1 8 10-13h-7z'
};
function icon(name,extra=''){return `<svg class="icon ${extra}" viewBox="0 0 24 24" aria-hidden="true"><path d="${icons[name]||icons.dumbbell}"/></svg>`;}
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(action,label,cls='secondary',attrs='')=>`<button class="${cls}" data-action="${action}" ${attrs}>${label}</button>`;
const library=[
 ['bench','바벨 벤치프레스','가슴','바벨','strength',40],['incline','인클라인 덤벨 프레스','가슴','덤벨','strength',12],['chestpress','체스트 프레스','가슴','머신','strength',30],['fly','덤벨 플라이','가슴','덤벨','strength',8],['cablefly','케이블 크로스오버','가슴','케이블','strength',10],['pushup','푸시업','가슴','맨몸','bodyweight',0],['dip','딥스','가슴','맨몸','bodyweight',0],
 ['deadlift','데드리프트','등','바벨','strength',60],['latpull','랫 풀다운','등','케이블','strength',35],['row','바벨 로우','등','바벨','strength',30],['seatedrow','시티드 케이블 로우','등','케이블','strength',30],['pullup','풀업','등','맨몸','bodyweight',0],['dumbbellrow','원암 덤벨 로우','등','덤벨','strength',14],['tbar','티바 로우','등','머신','strength',25],
 ['squat','바벨 스쿼트','하체','바벨','strength',40],['legpress','레그 프레스','하체','머신','strength',80],['lunge','덤벨 런지','하체','덤벨','strength',10],['legcurl','레그 컬','하체','머신','strength',25],['legextension','레그 익스텐션','하체','머신','strength',25],['rdl','루마니안 데드리프트','하체','바벨','strength',40],['hipthrust','힙 쓰러스트','하체','바벨','strength',40],['calf','스탠딩 카프 레이즈','하체','머신','strength',20],['goblet','고블릿 스쿼트','하체','덤벨','strength',12],['bodysquat','맨몸 스쿼트','하체','맨몸','bodyweight',0],
 ['ohp','오버헤드 프레스','어깨','바벨','strength',20],['shoulderpress','덤벨 숄더 프레스','어깨','덤벨','strength',10],['lateral','사이드 레터럴 레이즈','어깨','덤벨','strength',4],['rear','리어 델트 플라이','어깨','머신','strength',15],['facepull','페이스 풀','어깨','케이블','strength',15],
 ['curl','덤벨 컬','팔','덤벨','strength',8],['barbellcurl','바벨 컬','팔','바벨','strength',15],['hammercurl','해머 컬','팔','덤벨','strength',8],['pushdown','트라이셉스 푸시다운','팔','케이블','strength',15],['extension','오버헤드 트라이셉스 익스텐션','팔','덤벨','strength',8],
 ['plank','플랭크','코어','맨몸','duration',0],['crunch','크런치','코어','맨몸','bodyweight',0],['legraise','행잉 레그 레이즈','코어','맨몸','bodyweight',0],['russiantwist','러시안 트위스트','코어','덤벨','strength',5],['abwheel','앱 휠 롤아웃','코어','맨몸','bodyweight',0],
 ['run','러닝머신','유산소','머신','duration',0],['bike','실내 자전거','유산소','머신','duration',0],['rowing','로잉 머신','유산소','머신','duration',0],['walk','걷기','유산소','맨몸','duration',0],['rope','줄넘기','유산소','기타','duration',0]
,
 ["ex_001", "인클라인 바벨 벤치프레스", "가슴", "바벨", "strength", 0],
 ["ex_002", "디클라인 바벨 벤치프레스", "가슴", "바벨", "strength", 0],
 ["ex_003", "클로즈 그립 벤치프레스", "가슴", "바벨", "strength", 0],
 ["ex_004", "플로어 프레스", "가슴", "바벨", "strength", 0],
 ["ex_005", "랜드마인 체스트 프레스", "가슴", "바벨", "strength", 0],
 ["ex_006", "덤벨 벤치프레스", "가슴", "덤벨", "strength", 0],
 ["ex_007", "디클라인 덤벨 프레스", "가슴", "덤벨", "strength", 0],
 ["ex_008", "인클라인 덤벨 플라이", "가슴", "덤벨", "strength", 0],
 ["ex_009", "덤벨 풀오버", "가슴", "덤벨", "strength", 0],
 ["ex_010", "덤벨 스퀴즈 프레스", "가슴", "덤벨", "strength", 0],
 ["ex_011", "덤벨 플로어 프레스", "가슴", "덤벨", "strength", 0],
 ["ex_012", "펙 덱 플라이", "가슴", "머신", "strength", 0],
 ["ex_013", "인클라인 체스트 프레스 머신", "가슴", "머신", "strength", 0],
 ["ex_014", "디클라인 체스트 프레스 머신", "가슴", "머신", "strength", 0],
 ["ex_015", "해머 스트렝스 체스트 프레스", "가슴", "머신", "strength", 0],
 ["ex_016", "어시스트 딥스", "가슴", "머신", "strength", 0],
 ["ex_017", "스미스 벤치프레스", "가슴", "머신", "strength", 0],
 ["ex_018", "스미스 인클라인 벤치프레스", "가슴", "머신", "strength", 0],
 ["ex_019", "로우 케이블 플라이", "가슴", "케이블", "strength", 0],
 ["ex_020", "하이 케이블 플라이", "가슴", "케이블", "strength", 0],
 ["ex_021", "시티드 케이블 체스트 프레스", "가슴", "케이블", "strength", 0],
 ["ex_022", "원암 케이블 체스트 프레스", "가슴", "케이블", "strength", 0],
 ["ex_023", "인클라인 푸시업", "가슴", "맨몸", "bodyweight", 0],
 ["ex_024", "디클라인 푸시업", "가슴", "맨몸", "bodyweight", 0],
 ["ex_025", "다이아몬드 푸시업", "가슴", "맨몸", "bodyweight", 0],
 ["ex_026", "니 푸시업", "가슴", "맨몸", "bodyweight", 0],
 ["ex_027", "와이드 푸시업", "가슴", "맨몸", "bodyweight", 0],
 ["ex_028", "펜들레이 로우", "등", "바벨", "strength", 0],
 ["ex_029", "언더그립 바벨 로우", "등", "바벨", "strength", 0],
 ["ex_030", "스내치 그립 데드리프트", "등", "바벨", "strength", 0],
 ["ex_031", "랙 풀", "등", "바벨", "strength", 0],
 ["ex_032", "바벨 풀오버", "등", "바벨", "strength", 0],
 ["ex_033", "바벨 슈러그", "등", "바벨", "strength", 0],
 ["ex_034", "랜드마인 로우", "등", "바벨", "strength", 0],
 ["ex_035", "덤벨 데드리프트", "등", "덤벨", "strength", 0],
 ["ex_036", "벤트오버 덤벨 로우", "등", "덤벨", "strength", 0],
 ["ex_037", "인클라인 덤벨 로우", "등", "덤벨", "strength", 0],
 ["ex_038", "체스트 서포티드 덤벨 로우", "등", "덤벨", "strength", 0],
 ["ex_039", "덤벨 슈러그", "등", "덤벨", "strength", 0],
 ["ex_040", "레니게이드 로우", "등", "덤벨", "strength", 0],
 ["ex_041", "와이드 그립 랫 풀다운", "등", "케이블", "strength", 0],
 ["ex_042", "언더그립 랫 풀다운", "등", "케이블", "strength", 0],
 ["ex_043", "뉴트럴 그립 랫 풀다운", "등", "케이블", "strength", 0],
 ["ex_044", "원암 랫 풀다운", "등", "케이블", "strength", 0],
 ["ex_045", "스트레이트 암 풀다운", "등", "케이블", "strength", 0],
 ["ex_046", "원암 케이블 로우", "등", "케이블", "strength", 0],
 ["ex_047", "와이드 그립 시티드 로우", "등", "케이블", "strength", 0],
 ["ex_048", "케이블 풀오버", "등", "케이블", "strength", 0],
 ["ex_049", "어시스트 풀업", "등", "머신", "strength", 0],
 ["ex_050", "해머 스트렝스 로우", "등", "머신", "strength", 0],
 ["ex_051", "아이소 레터럴 로우", "등", "머신", "strength", 0],
 ["ex_052", "하이 로우 머신", "등", "머신", "strength", 0],
 ["ex_053", "로우 로우 머신", "등", "머신", "strength", 0],
 ["ex_054", "체스트 서포티드 로우 머신", "등", "머신", "strength", 0],
 ["ex_055", "스미스 바벨 로우", "등", "머신", "strength", 0],
 ["ex_056", "백 익스텐션 머신", "등", "머신", "strength", 0],
 ["ex_057", "친업", "등", "맨몸", "bodyweight", 0],
 ["ex_058", "뉴트럴 그립 풀업", "등", "맨몸", "bodyweight", 0],
 ["ex_059", "와이드 그립 풀업", "등", "맨몸", "bodyweight", 0],
 ["ex_060", "인버티드 로우", "등", "맨몸", "bodyweight", 0],
 ["ex_061", "백 익스텐션", "등", "맨몸", "bodyweight", 0],
 ["ex_062", "슈퍼맨", "등", "맨몸", "bodyweight", 0],
 ["ex_063", "프론트 스쿼트", "하체", "바벨", "strength", 0],
 ["ex_064", "박스 스쿼트", "하체", "바벨", "strength", 0],
 ["ex_065", "스모 데드리프트", "하체", "바벨", "strength", 0],
 ["ex_066", "스티프 레그 데드리프트", "하체", "바벨", "strength", 0],
 ["ex_067", "바벨 런지", "하체", "바벨", "strength", 0],
 ["ex_068", "바벨 불가리안 스플릿 스쿼트", "하체", "바벨", "strength", 0],
 ["ex_069", "바벨 굿모닝", "하체", "바벨", "strength", 0],
 ["ex_070", "바벨 글루트 브리지", "하체", "바벨", "strength", 0],
 ["ex_071", "바벨 스텝업", "하체", "바벨", "strength", 0],
 ["ex_072", "저처 스쿼트", "하체", "바벨", "strength", 0],
 ["ex_073", "덤벨 스쿼트", "하체", "덤벨", "strength", 0],
 ["ex_074", "덤벨 루마니안 데드리프트", "하체", "덤벨", "strength", 0],
 ["ex_075", "덤벨 스모 스쿼트", "하체", "덤벨", "strength", 0],
 ["ex_076", "덤벨 불가리안 스플릿 스쿼트", "하체", "덤벨", "strength", 0],
 ["ex_077", "덤벨 리버스 런지", "하체", "덤벨", "strength", 0],
 ["ex_078", "덤벨 워킹 런지", "하체", "덤벨", "strength", 0],
 ["ex_079", "덤벨 스텝업", "하체", "덤벨", "strength", 0],
 ["ex_080", "덤벨 사이드 런지", "하체", "덤벨", "strength", 0],
 ["ex_081", "싱글 레그 덤벨 데드리프트", "하체", "덤벨", "strength", 0],
 ["ex_082", "덤벨 힙 쓰러스트", "하체", "덤벨", "strength", 0],
 ["ex_083", "덤벨 카프 레이즈", "하체", "덤벨", "strength", 0],
 ["ex_084", "핵 스쿼트", "하체", "머신", "strength", 0],
 ["ex_085", "브이 스쿼트", "하체", "머신", "strength", 0],
 ["ex_086", "스미스 스쿼트", "하체", "머신", "strength", 0],
 ["ex_087", "스미스 런지", "하체", "머신", "strength", 0],
 ["ex_088", "스미스 힙 쓰러스트", "하체", "머신", "strength", 0],
 ["ex_089", "스미스 카프 레이즈", "하체", "머신", "strength", 0],
 ["ex_090", "수평 레그 프레스", "하체", "머신", "strength", 0],
 ["ex_091", "싱글 레그 프레스", "하체", "머신", "strength", 0],
 ["ex_092", "시티드 레그 컬", "하체", "머신", "strength", 0],
 ["ex_093", "라잉 레그 컬", "하체", "머신", "strength", 0],
 ["ex_094", "스탠딩 레그 컬", "하체", "머신", "strength", 0],
 ["ex_095", "싱글 레그 익스텐션", "하체", "머신", "strength", 0],
 ["ex_096", "힙 어브덕션", "하체", "머신", "strength", 0],
 ["ex_097", "힙 어덕션", "하체", "머신", "strength", 0],
 ["ex_098", "힙 쓰러스트 머신", "하체", "머신", "strength", 0],
 ["ex_099", "글루트 킥백 머신", "하체", "머신", "strength", 0],
 ["ex_100", "시티드 카프 레이즈", "하체", "머신", "strength", 0],
 ["ex_101", "레그 프레스 카프 레이즈", "하체", "머신", "strength", 0],
 ["ex_102", "벨트 스쿼트", "하체", "머신", "strength", 0],
 ["ex_103", "펜듈럼 스쿼트", "하체", "머신", "strength", 0],
 ["ex_104", "케이블 킥백", "하체", "케이블", "strength", 0],
 ["ex_105", "케이블 풀스루", "하체", "케이블", "strength", 0],
 ["ex_106", "케이블 힙 어브덕션", "하체", "케이블", "strength", 0],
 ["ex_107", "케이블 힙 어덕션", "하체", "케이블", "strength", 0],
 ["ex_108", "케이블 스쿼트", "하체", "케이블", "strength", 0],
 ["ex_109", "케틀벨 스윙", "하체", "케틀벨", "strength", 0],
 ["ex_110", "케틀벨 고블릿 스쿼트", "하체", "케틀벨", "strength", 0],
 ["ex_111", "케틀벨 데드리프트", "하체", "케틀벨", "strength", 0],
 ["ex_112", "케틀벨 런지", "하체", "케틀벨", "strength", 0],
 ["ex_113", "불가리안 스플릿 스쿼트", "하체", "맨몸", "bodyweight", 0],
 ["ex_114", "리버스 런지", "하체", "맨몸", "bodyweight", 0],
 ["ex_115", "워킹 런지", "하체", "맨몸", "bodyweight", 0],
 ["ex_116", "사이드 런지", "하체", "맨몸", "bodyweight", 0],
 ["ex_117", "싱글 레그 스쿼트", "하체", "맨몸", "bodyweight", 0],
 ["ex_118", "점프 스쿼트", "하체", "맨몸", "bodyweight", 0],
 ["ex_119", "글루트 브리지", "하체", "맨몸", "bodyweight", 0],
 ["ex_120", "싱글 레그 글루트 브리지", "하체", "맨몸", "bodyweight", 0],
 ["ex_121", "프로깅", "하체", "맨몸", "bodyweight", 0],
 ["ex_122", "덩키 킥", "하체", "맨몸", "bodyweight", 0],
 ["ex_123", "파이어 하이드런트", "하체", "맨몸", "bodyweight", 0],
 ["ex_124", "클램셸", "하체", "맨몸", "bodyweight", 0],
 ["ex_125", "맨몸 카프 레이즈", "하체", "맨몸", "bodyweight", 0],
 ["ex_126", "노르딕 컬", "하체", "맨몸", "bodyweight", 0],
 ["ex_127", "시시 스쿼트", "하체", "맨몸", "bodyweight", 0],
 ["ex_128", "시티드 바벨 숄더 프레스", "어깨", "바벨", "strength", 0],
 ["ex_129", "푸시 프레스", "어깨", "바벨", "strength", 0],
 ["ex_130", "바벨 업라이트 로우", "어깨", "바벨", "strength", 0],
 ["ex_131", "랜드마인 숄더 프레스", "어깨", "바벨", "strength", 0],
 ["ex_132", "비하인드 넥 프레스", "어깨", "바벨", "strength", 0],
 ["ex_133", "아놀드 프레스", "어깨", "덤벨", "strength", 0],
 ["ex_134", "덤벨 프론트 레이즈", "어깨", "덤벨", "strength", 0],
 ["ex_135", "벤트오버 레터럴 레이즈", "어깨", "덤벨", "strength", 0],
 ["ex_136", "시티드 덤벨 숄더 프레스", "어깨", "덤벨", "strength", 0],
 ["ex_137", "덤벨 업라이트 로우", "어깨", "덤벨", "strength", 0],
 ["ex_138", "인클라인 레터럴 레이즈", "어깨", "덤벨", "strength", 0],
 ["ex_139", "원암 덤벨 숄더 프레스", "어깨", "덤벨", "strength", 0],
 ["ex_140", "케이블 사이드 레터럴 레이즈", "어깨", "케이블", "strength", 0],
 ["ex_141", "케이블 프론트 레이즈", "어깨", "케이블", "strength", 0],
 ["ex_142", "케이블 리버스 플라이", "어깨", "케이블", "strength", 0],
 ["ex_143", "케이블 업라이트 로우", "어깨", "케이블", "strength", 0],
 ["ex_144", "케이블 외회전", "어깨", "케이블", "strength", 0],
 ["ex_145", "케이블 내회전", "어깨", "케이블", "strength", 0],
 ["ex_146", "숄더 프레스 머신", "어깨", "머신", "strength", 0],
 ["ex_147", "사이드 레터럴 레이즈 머신", "어깨", "머신", "strength", 0],
 ["ex_148", "리버스 펙 덱 플라이", "어깨", "머신", "strength", 0],
 ["ex_149", "스미스 숄더 프레스", "어깨", "머신", "strength", 0],
 ["ex_150", "파이크 푸시업", "어깨", "맨몸", "bodyweight", 0],
 ["ex_151", "핸드스탠드 푸시업", "어깨", "맨몸", "bodyweight", 0],
 ["ex_152", "숄더 탭", "어깨", "맨몸", "bodyweight", 0],
 ["ex_153", "이지바 컬", "팔", "바벨", "strength", 0],
 ["ex_154", "리버스 바벨 컬", "팔", "바벨", "strength", 0],
 ["ex_155", "바벨 프리처 컬", "팔", "바벨", "strength", 0],
 ["ex_156", "스파이더 컬", "팔", "바벨", "strength", 0],
 ["ex_157", "바벨 리스트 컬", "팔", "바벨", "strength", 0],
 ["ex_158", "바벨 리버스 리스트 컬", "팔", "바벨", "strength", 0],
 ["ex_159", "라잉 트라이셉스 익스텐션", "팔", "바벨", "strength", 0],
 ["ex_160", "클로즈 그립 플로어 프레스", "팔", "바벨", "strength", 0],
 ["ex_161", "인클라인 덤벨 컬", "팔", "덤벨", "strength", 0],
 ["ex_162", "컨센트레이션 컬", "팔", "덤벨", "strength", 0],
 ["ex_163", "덤벨 프리처 컬", "팔", "덤벨", "strength", 0],
 ["ex_164", "조트맨 컬", "팔", "덤벨", "strength", 0],
 ["ex_165", "크로스바디 해머 컬", "팔", "덤벨", "strength", 0],
 ["ex_166", "덤벨 킥백", "팔", "덤벨", "strength", 0],
 ["ex_167", "덤벨 스컬 크러셔", "팔", "덤벨", "strength", 0],
 ["ex_168", "원암 오버헤드 트라이셉스 익스텐션", "팔", "덤벨", "strength", 0],
 ["ex_169", "덤벨 리스트 컬", "팔", "덤벨", "strength", 0],
 ["ex_170", "덤벨 리버스 리스트 컬", "팔", "덤벨", "strength", 0],
 ["ex_171", "케이블 컬", "팔", "케이블", "strength", 0],
 ["ex_172", "로프 해머 컬", "팔", "케이블", "strength", 0],
 ["ex_173", "케이블 프리처 컬", "팔", "케이블", "strength", 0],
 ["ex_174", "하이 케이블 컬", "팔", "케이블", "strength", 0],
 ["ex_175", "원암 케이블 컬", "팔", "케이블", "strength", 0],
 ["ex_176", "로프 트라이셉스 푸시다운", "팔", "케이블", "strength", 0],
 ["ex_177", "리버스 그립 푸시다운", "팔", "케이블", "strength", 0],
 ["ex_178", "케이블 오버헤드 트라이셉스 익스텐션", "팔", "케이블", "strength", 0],
 ["ex_179", "원암 케이블 푸시다운", "팔", "케이블", "strength", 0],
 ["ex_180", "케이블 트라이셉스 킥백", "팔", "케이블", "strength", 0],
 ["ex_181", "바이셉스 컬 머신", "팔", "머신", "strength", 0],
 ["ex_182", "트라이셉스 익스텐션 머신", "팔", "머신", "strength", 0],
 ["ex_183", "딥스 머신", "팔", "머신", "strength", 0],
 ["ex_184", "벤치 딥스", "팔", "맨몸", "bodyweight", 0],
 ["ex_185", "트라이셉스 푸시업", "팔", "맨몸", "bodyweight", 0],
 ["ex_186", "바이시클 크런치", "코어", "맨몸", "bodyweight", 0],
 ["ex_187", "리버스 크런치", "코어", "맨몸", "bodyweight", 0],
 ["ex_188", "싯업", "코어", "맨몸", "bodyweight", 0],
 ["ex_189", "브이업", "코어", "맨몸", "bodyweight", 0],
 ["ex_190", "니업", "코어", "맨몸", "bodyweight", 0],
 ["ex_191", "행잉 니 레이즈", "코어", "맨몸", "bodyweight", 0],
 ["ex_192", "라잉 레그 레이즈", "코어", "맨몸", "bodyweight", 0],
 ["ex_193", "힐 터치", "코어", "맨몸", "bodyweight", 0],
 ["ex_194", "데드 버그", "코어", "맨몸", "bodyweight", 0],
 ["ex_195", "버드 독", "코어", "맨몸", "bodyweight", 0],
 ["ex_196", "마운틴 클라이머", "코어", "맨몸", "bodyweight", 0],
 ["ex_197", "플러터 킥", "코어", "맨몸", "bodyweight", 0],
 ["ex_198", "토 터치 크런치", "코어", "맨몸", "bodyweight", 0],
 ["ex_199", "시티드 니 턱", "코어", "맨몸", "bodyweight", 0],
 ["ex_200", "케이블 크런치", "코어", "케이블", "strength", 0],
 ["ex_201", "케이블 우드촙", "코어", "케이블", "strength", 0],
 ["ex_202", "팔로프 프레스", "코어", "케이블", "strength", 0],
 ["ex_203", "케이블 리버스 크런치", "코어", "케이블", "strength", 0],
 ["ex_204", "덤벨 사이드 벤드", "코어", "덤벨", "strength", 0],
 ["ex_205", "웨이티드 크런치", "코어", "덤벨", "strength", 0],
 ["ex_206", "웨이티드 싯업", "코어", "덤벨", "strength", 0],
 ["ex_207", "앱 크런치 머신", "코어", "머신", "strength", 0],
 ["ex_208", "로터리 토르소", "코어", "머신", "strength", 0],
 ["ex_209", "캡틴 체어 레그 레이즈", "코어", "머신", "strength", 0],
 ["ex_210", "일립티컬", "유산소", "머신", "duration", 0],
 ["ex_211", "스텝밀", "유산소", "머신", "duration", 0],
 ["ex_212", "스테퍼", "유산소", "머신", "duration", 0],
 ["ex_213", "스핀 바이크", "유산소", "머신", "duration", 0],
 ["ex_214", "리컴번트 바이크", "유산소", "머신", "duration", 0],
 ["ex_215", "스키 에르그", "유산소", "머신", "duration", 0],
 ["ex_216", "에어 바이크", "유산소", "머신", "duration", 0],
 ["ex_217", "경사 걷기", "유산소", "머신", "duration", 0],
 ["ex_218", "야외 달리기", "유산소", "맨몸", "duration", 0],
 ["ex_219", "조깅", "유산소", "맨몸", "duration", 0],
 ["ex_220", "빠르게 걷기", "유산소", "맨몸", "duration", 0],
 ["ex_221", "계단 오르기", "유산소", "맨몸", "duration", 0],
 ["ex_222", "제자리 달리기", "유산소", "맨몸", "duration", 0],
 ["ex_223", "점핑 잭", "유산소", "맨몸", "duration", 0],
 ["ex_224", "버피", "유산소", "맨몸", "duration", 0],
 ["ex_225", "하이 니", "유산소", "맨몸", "duration", 0],
 ["ex_226", "수영", "유산소", "맨몸", "duration", 0],
 ["ex_227", "등산", "유산소", "맨몸", "duration", 0],
 ["ex_228", "댄스", "유산소", "맨몸", "duration", 0],
 ["ex_229", "복싱", "유산소", "맨몸", "duration", 0],
 ["ex_230", "킥복싱", "유산소", "맨몸", "duration", 0],
 ["ex_231", "야외 자전거", "유산소", "기타", "duration", 0],
 ["ex_232", "배틀 로프", "유산소", "기타", "duration", 0],
 ["ex_233", "썰매 밀기", "유산소", "기타", "duration", 0],
 ["ex_234", "썰매 끌기", "유산소", "기타", "duration", 0],
 ["ex_235", "목 스트레칭", "기타", "맨몸", "duration", 0],
 ["ex_236", "어깨 스트레칭", "기타", "맨몸", "duration", 0],
 ["ex_237", "가슴 스트레칭", "기타", "맨몸", "duration", 0],
 ["ex_238", "광배근 스트레칭", "기타", "맨몸", "duration", 0],
 ["ex_239", "고관절 스트레칭", "기타", "맨몸", "duration", 0],
 ["ex_240", "햄스트링 스트레칭", "기타", "맨몸", "duration", 0],
 ["ex_241", "대퇴사두근 스트레칭", "기타", "맨몸", "duration", 0],
 ["ex_242", "종아리 스트레칭", "기타", "맨몸", "duration", 0],
 ["ex_243", "요가", "기타", "맨몸", "duration", 0],
 ["ex_244", "필라테스", "기타", "맨몸", "duration", 0],
 ["ex_245", "폼롤러 마사지", "기타", "기타", "duration", 0],
 ["ex_246", "사이드 플랭크", "코어", "맨몸", "duration", 0],
 ["ex_247", "리버스 플랭크", "코어", "맨몸", "duration", 0],
 ["ex_248", "할로우 홀드", "코어", "맨몸", "duration", 0],
 ["ex_249", "월 싯", "코어", "맨몸", "duration", 0],
 ["ex_250", "베어 플랭크", "코어", "맨몸", "duration", 0]
].map(([id,name,muscle,equipment,kind,weight])=>({id,name,muscle,equipment,kind,weight}));
const routines=[{name:'전신 밸런스',desc:'처음부터 탄탄하게, 전신 기본 루틴',ids:['squat','bench','latpull','plank'],color:'',tag:'FULL BODY'}, {name:'상체 집중',desc:'가슴 · 등 · 어깨, 균형 있게',ids:['bench','seatedrow','shoulderpress','curl'],color:'blue',tag:'UPPER BODY'}, {name:'하체 & 코어',desc:'흔들리지 않는 힘의 기초',ids:['squat','rdl','legcurl','plank'],color:'peach',tag:'LOWER BODY'}];
const WORKOUT_MAX_MS=2*3600000;
function fresh(){return {version:1,settings:{unit:'kg',rest:90,autoRest:true,goal:3},sessions:[],draft:null,customExercises:[],customRoutines:[],timer:null};}
let data=fresh(),loadError=false;
try{const raw=window.Android?Android.load():localStorage.getItem('liftlog-v1');if(raw){data=validate(JSON.parse(raw));}}catch(e){loadError=true;}
let page=data.draft?'workout':'home',month=new Date(),selectedDate=dateKey(),modal=null,pickerFilter='전체',pickerQuery='',picked=new Set(),insightId='bench',historyQuery='',historySelection=null,restExerciseId=null,finishResume=false,sessionTimeId=null,sessionDateId=null,replacementContext=null,pendingReplacementId=null,exerciseEditContext=null,pendingExerciseInfo=null;
function dateKey(date=new Date()){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
function parseDate(v){return new Date(v+'T12:00:00');}
function validDate(v){return typeof v==='string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !isNaN(parseDate(v)) && dateKey(parseDate(v))===v;}
function validate(x){
 if(!x||x.version!==1||!x.settings||!Array.isArray(x.sessions)||!Array.isArray(x.customExercises))throw Error('백업 형식 오류');
 const numeric=(n,min,max)=>typeof n==='number' && Number.isFinite(n)&&n>=min&&n<=max;
 if(!['kg','lb'].includes(x.settings.unit)||!numeric(x.settings.rest,15,3600)||!numeric(x.settings.goal,1,7)||!Number.isInteger(x.settings.goal)||typeof x.settings.autoRest!=='boolean')throw Error('설정 오류');
 if(x.customExercises.length>500||x.sessions.length>10000)throw Error('기록 개수 초과');
 const ids=new Set(library.map(e=>e.id));
 for(const e of x.customExercises){if(!e||typeof e.id!=='string'||!e.id.startsWith('custom_')||ids.has(e.id)||typeof e.name!=='string'||e.name.length<1||e.name.length>80||!['가슴','등','하체','어깨','팔','코어','유산소','기타'].includes(e.muscle)||!['strength','bodyweight','duration'].includes(e.kind))throw Error('운동 데이터 오류');ids.add(e.id);}
 function checkSession(s,draft){
  if(!s||typeof s.id!=='string'||!validDate(s.date)||typeof s.name!=='string'||s.name.length>80||!Array.isArray(s.exercises)||s.exercises.length>60||!numeric(s.startedAt,0,1e14)||typeof s.notes!=='string'||s.notes.length>2000)throw Error('운동 기록 오류');
  if(s.clock&&((s.clock.limitReached!==undefined&&typeof s.clock.limitReached!=='boolean')||(s.clock.autoStoppedAt!==undefined&&!numeric(s.clock.autoStoppedAt,0,1e14))))throw Error('자동 정지 시계 오류');
  if(s.clock&&(!numeric(s.clock.elapsedMs,0,86400000)||!numeric(s.clock.anchorMs,0,1e14)||!numeric(s.clock.lastSeenMs,0,1e14)||typeof s.clock.paused!=='boolean'))throw Error('운동 시계 오류');
  if(!draft&&(!numeric(s.finishedAt,0,1e14)||!numeric(s.duration,0,1e9)))throw Error('시간 오류');
  for(const e of s.exercises){if(e.notes!==undefined&&(typeof e.notes!=='string'||e.notes.length>2000))throw Error('운동별 메모 오류');if(!ids.has(e.id)||!Array.isArray(e.sets)||e.sets.length>100)throw Error('세트 오류');for(const set of e.sets){if(!numeric(set.weightKg,0,10000)||!numeric(set.reps,0,100000)||!Number.isInteger(set.reps)||typeof set.done!=='boolean')throw Error('세트 값 오류');}}
 }
 if(x.settings.exerciseOverrides!==undefined){
  const overrides=x.settings.exerciseOverrides;if(!overrides||typeof overrides!=='object'||Array.isArray(overrides)||Object.keys(overrides).length>library.length)throw Error('운동 수정 정보 오류');
  for(const [id,e] of Object.entries(overrides)){if(!library.some(base=>base.id===id)||!e||typeof e.name!=='string'||!e.name.trim()||e.name.length>80||!['가슴','등','하체','어깨','팔','코어','유산소','기타'].includes(e.muscle)||typeof e.equipment!=='string'||e.equipment.length>60||Object.keys(e).some(k=>!['name','muscle','equipment'].includes(k)))throw Error('운동 수정 정보 오류');}
 }
 if(x.settings.exerciseRest){for(const [id,n] of Object.entries(x.settings.exerciseRest))if(!ids.has(id)||!numeric(n,15,3600)||!Number.isInteger(n))throw Error('종목별 휴식 오류');}
 if(x.settings.favorites&&(!Array.isArray(x.settings.favorites)||x.settings.favorites.length>794||x.settings.favorites.some(id=>!ids.has(id))))throw Error('즐겨찾기 오류');
 if(x.customRoutines===undefined)x.customRoutines=[];
 if(!Array.isArray(x.customRoutines)||x.customRoutines.length>50)throw Error('루틴 오류');
 const routineIds=new Set();for(const r of x.customRoutines){if(!r||typeof r.id!=='string'||routineIds.has(r.id)||typeof r.name!=='string'||r.name.length<1||r.name.length>80||!r.exercises?.length)throw Error('루틴 오류');routineIds.add(r.id);checkSession({...r,date:'2026-01-01',startedAt:0,notes:''},true);}
 x.sessions.forEach(s=>checkSession(s,false));if(x.draft)checkSession(x.draft,true);
 if(x.timer && (!numeric(x.timer.total,1,3600)||!numeric(x.timer.remaining,0,3600)||typeof x.timer.paused!=='boolean'||!numeric(x.timer.end,0,1e14)))throw Error('타이머 오류');
 return x;
}
function save(){if(loadError){toast('저장된 데이터를 읽지 못했습니다. 설정에서 복원을 먼저 해주세요.');return false;}try{const raw=JSON.stringify(data);if(window.Android){if(!Android.save(raw))throw Error('저장 실패');}else localStorage.setItem('liftlog-v1',raw);return true;}catch(e){toast('기록을 저장하지 못했습니다. 저장 공간을 확인해 주세요.');return false;}}
function allExercises(){return [...library.map(e=>({...e,...data.settings.exerciseOverrides?.[e.id]})),...data.customExercises];}
function exercise(id){const base=library.find(e=>e.id===id);return base?{...base,...data.settings.exerciseOverrides?.[id]}:data.customExercises.find(e=>e.id===id);}
const fmt=n=>new Intl.NumberFormat('ko-KR',{maximumFractionDigits:1}).format(n);
const weight=n=>Number((n*(data.settings.unit==='lb'?2.2046226218:1)).toFixed(2));
const asKg=n=>n/(data.settings.unit==='lb'?2.2046226218:1);
const clock=n=>`${String(Math.floor(n/60)).padStart(2,'0')}:${String(Math.floor(n%60)).padStart(2,'0')}`;
function workoutClock(n){n=Math.max(0,Math.floor(n));return `${String(Math.floor(n/3600)).padStart(2,'0')}:${String(Math.floor(n/60)%60).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;}
function newClock(now=Date.now()){return {elapsedMs:0,anchorMs:now,lastSeenMs:now,paused:false,needsReview:false,limitReached:false};}
function normalizeClock(draft=data.draft,now=Date.now()){
 if(!draft)return null;
 if(!draft.clock){const age=now-draft.startedAt;draft.clock={...newClock(now),elapsedMs:Math.max(0,age),paused:age<0,needsReview:age<0};}
 const c=draft.clock;
 if(!c.paused&&now<c.lastSeenMs){
  c.elapsedMs=Math.min(WORKOUT_MAX_MS,c.elapsedMs+Math.max(0,c.lastSeenMs-c.anchorMs));c.anchorMs=now;c.lastSeenMs=now;c.paused=true;c.needsReview=true;
 }
 const elapsed=c.elapsedMs+(c.paused?0:Math.max(0,now-c.anchorMs));
 if(elapsed>=WORKOUT_MAX_MS){
  if(!c.limitReached)c.autoStoppedAt=Math.max(0,now-(elapsed-WORKOUT_MAX_MS));
  c.elapsedMs=WORKOUT_MAX_MS;c.paused=true;c.limitReached=true;c.awaitingStart=false;c.needsReview=false;c.anchorMs=now;c.lastSeenMs=now;
 }
 return c;
}
function workoutElapsedMs(draft=data.draft,now=Date.now()){const c=normalizeClock(draft,now);return c?Math.min(WORKOUT_MAX_MS,c.elapsedMs+(c.paused?0:Math.max(0,now-c.anchorMs))):0;}
function checkpointClock(now=Date.now()){
 const c=normalizeClock(data.draft,now);if(!c)return;
 if(!c.paused)c.elapsedMs=workoutElapsedMs(data.draft,now);c.anchorMs=now;c.lastSeenMs=now;
}
function beginWorkoutClock(){const c=normalizeClock();if(c?.awaitingStart){c.awaitingStart=false;c.paused=false;c.anchorMs=Date.now();c.lastSeenMs=Date.now();}}
function toggleWorkoutClock(){const c=normalizeClock();if(!c)return;if(c.limitReached){toast('전체 시간은 최대 2시간이에요. 필요하면 시간을 줄여 주세요.');return;}checkpointClock();c.paused=!c.paused;c.awaitingStart=false;c.anchorMs=Date.now();c.lastSeenMs=Date.now();save();render();}
function durationNeedsReview(s){return s.duration>12*3600&&!s.durationConfirmed;}
function reliableDuration(s){return durationNeedsReview(s)?0:s.duration;}
function durationLabel(s){if(durationNeedsReview(s))return '시간 확인 필요';const n=Math.max(0,Math.round(s.duration/60));return n>=60?`${Math.floor(n/60)}시간 ${n%60}분`:`${n}분`;}
function clockEditSheet(){const c=normalizeClock();if(!c)return;const seconds=Math.floor(workoutElapsedMs()/1000);sheet('전체 운동 시간',`<p class="small muted">전체 시간은 최대 2시간에서 자동 정지해요. 실제로 운동한 시간으로 줄일 수 있고, 세트와 메모는 유지됩니다.</p><div class="duration-fields"><label>분<input id="clock-minutes" type="number" inputmode="numeric" min="0" max="120" value="${Math.floor(seconds/60)}"></label><label>초<input id="clock-seconds" type="number" inputmode="numeric" min="0" max="59" value="${seconds%60}"></label></div>${button('saveClock','시간 적용','primary')}`,'clockEdit');}
function readDuration(minId,secId,maxSeconds=86400){const m=$(minId),s=$(secId);if(!m||!s)return null;const minutes=Number(m.value),seconds=Number(s.value);if(m.value.trim()===''||s.value.trim()===''||!Number.isInteger(minutes)||!Number.isInteger(seconds)||minutes<0||seconds<0||seconds>59||minutes*60+seconds>maxSeconds)return NaN;return minutes*60+seconds;}
function saveClockEdit(){const n=readDuration('#clock-minutes','#clock-seconds',WORKOUT_MAX_MS/1000);if(!Number.isFinite(n)){toast('전체 운동 시간은 0~120분으로 입력해 주세요.');return;}const c=normalizeClock();c.elapsedMs=n*1000;c.anchorMs=Date.now();c.lastSeenMs=Date.now();c.needsReview=false;c.limitReached=false;delete c.autoStoppedAt;normalizeClock();save();closeSheet();render();}
function sessionTimeSheet(id){const entry=data.sessions.find(s=>s.id===id);if(!entry)return;sessionTimeId=id;sheet('기록의 운동 시간 수정',`<p class="small muted">${esc(entry.name)} · ${entry.date}<br>운동·세트·무게는 바뀌지 않습니다.</p><div class="duration-fields"><label>분<input id="session-minutes" type="number" inputmode="numeric" min="0" max="1440" value="${durationNeedsReview(entry)?'':Math.floor(entry.duration/60)}" placeholder="실제 운동한 분"></label><label>초<input id="session-seconds" type="number" inputmode="numeric" min="0" max="59" value="0"></label></div>${button('saveSessionTime','수정 저장','primary')}`,'sessionTime');}
function saveSessionTime(){const n=readDuration('#session-minutes','#session-seconds'),entry=data.sessions.find(s=>s.id===sessionTimeId);if(!entry||!Number.isFinite(n)){toast('실제 운동 시간을 입력해 주세요.');return;}if(entry.originalDuration===undefined)entry.originalDuration=entry.duration;entry.duration=n;entry.durationConfirmed=true;save();closeSheet();render();toast('운동 시간을 수정했어요.');}
function exerciseRest(id){return data.settings.exerciseRest?.[id]||data.settings.rest;}
const completed=s=>s.exercises.flatMap(e=>e.sets.filter(a=>a.done)).length;
function volume(s){return s.exercises.reduce((sum,e)=>sum+(exercise(e.id)?.kind==='strength'?e.sets.filter(a=>a.done).reduce((t,a)=>t+a.weightKg*a.reps,0):0),0);}
function monday(){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));return d;}
function sessionDateSheet(id){
 const entry=data.sessions.find(s=>s.id===id);if(!entry)return;sessionDateId=id;
 sheet('운동 날짜 수정',`<p class="small muted">${esc(entry.name)}<br>운동한 날짜를 선택해 주세요. 세트와 운동 시간은 그대로 유지됩니다.</p><label class="form-label" for="session-date">운동 날짜</label><input class="sheet-input" id="session-date" type="date" value="${entry.date}" max="${dateKey()}" required><div class="sheet-actions">${button('sessionDateCancel','취소','secondary')}${button('saveSessionDate','날짜 저장','primary')}</div>`,'sessionDate');
}
function saveSessionDate(){
 const entry=data.sessions.find(s=>s.id===sessionDateId),value=$('#session-date')?.value;
 if(!entry)return;
 if(!validDate(value)||value>dateKey()){toast('오늘까지의 올바른 운동 날짜를 선택해 주세요.');return;}
 const previous=entry.date;entry.date=value;if(!save()){entry.date=previous;return;}
 selectedDate=value;month=parseDate(value);page='calendar';closeSheet();render();sessionDetail(entry.id);toast('운동 날짜를 수정했어요.');
}
function weekSessions(){return data.sessions.filter(s=>s.date>=dateKey(monday()) && s.date<=dateKey());}
function latest(){return [...data.sessions].sort((a,b)=>b.finishedAt-a.finishedAt);}
function lastExercise(id){for(const s of latest()){const e=s.exercises.find(a=>a.id===id);if(e && e.sets.some(a=>a.done))return e;}return null;}
function toast(msg){$('#toast').textContent=msg;$('#toast').className='toast';clearTimeout(toast.timeout);toast.timeout=setTimeout(()=>{$('#toast').className='';$('#toast').textContent='';},3400);}
function nav(){return `<nav class="nav" aria-label="주 메뉴">${[['home','home','홈'],['routines','dumbbell','운동'],['calendar','calendar','캘린더'],['insights','chart','성장'],['settings','settings','설정']].map(([p,i,n])=>button('navigate',icon(i)+n,page===p?'active':'',`data-page="${p}" aria-label="${n}"`)).join('')}</nav>`;}
function head(){return `<header class="head"><div class="brand">${icon('heart')} LIFTLOG</div>${button('navigate',icon('settings'),'avatar','data-page="settings" aria-label="설정"')}</header>`;}
function empty(title,desc,ico='dumbbell',action=''){return `<div class="empty">${icon(ico)}<h3>${title}</h3><p>${desc}</p>${action}</div>`;}
function stat(label,value,unit=''){return `<div class="stat"><div class="stat-label">${label}</div><div class="stat-value">${value} <small>${unit}</small></div></div>`;}
function routineCard(r,index){return `<div class="routine"><div class="routine-art ${r.color}">${icon(index===2?'target':'dumbbell')}</div><div class="routine-info"><h3>${r.name}</h3><p>${r.ids.length}개 운동 · ${r.tag}</p></div>${button('routine',icon('play'),'icon-btn',`data-index="${index}" aria-label="${r.name} 시작"`)}</div>`;}
function home(){
 const ws=weekSessions(),goal=data.settings.goal,week=monday(),timeIssues=data.sessions.filter(durationNeedsReview).length;
 return `${head()}<div class="eyebrow">MY LITTLE WORKOUT CLUB</div><h1 style="margin-top:10px">오늘도, 나를 위한 한 세트 ♡</h1><p class="welcome-line">조금씩 꾸준히. 나만의 운동 일기를 채워봐요.</p>
 <section class="hero"><svg class="hero-art icon" viewBox="0 0 24 24"><path d="${icons.dumbbell}"/></svg><span class="eyebrow">${data.draft?'WELCOME BACK, YOU ♡':'LET’S MAKE A LITTLE PROGRESS'}</span><h2>${data.draft?'멈췄던 운동,<br>이어서 해볼까요?':'오늘의 운동을<br>시작해 볼까요?'}</h2><p>${data.draft?esc(data.draft.name):'무게, 횟수, 휴식까지.<br>운동에만 집중하세요.'}</p>${button('start',icon(data.draft?'play':'plus')+(data.draft?'운동 이어하기':'새 운동 시작'),'primary')}</section><div style="margin-top:12px">${button('history',icon('calendar')+' 과거 운동 불러오기','secondary full')}</div>
 <section class="section card"><div class="row"><h3>이번 주의 페이스</h3><span class="pill">목표 ${goal}회</span></div><div class="row" style="margin-top:14px"><div><span class="big-number">${ws.length}</span><span class="muted"> / ${goal}회</span></div><span class="small lime">${ws.length>=goal?'목표 달성! 멋진 한 주예요':`${Math.max(0,goal-ws.length)}회 더, 나와의 약속`}</span></div><div class="progress-track"><span style="width:${Math.min(100,ws.length/goal*100)}%"></span></div><div class="week">${['월','화','수','목','금','토','일'].map((name,i)=>{const d=new Date(week);d.setDate(week.getDate()+i);const k=dateKey(d);const done=ws.some(s=>s.date===k);return `<button class="day ${done?'done':''} ${k===dateKey()?'today':''}" data-action="day" data-date="${k}" aria-label="${k} 기록">${name}<span>${done?icon('check'):d.getDate()}</span></button>`;}).join('')}</div></section>
 <div class="stats">${stat('이번 주 운동 시간',fmt(ws.reduce((n,s)=>n+reliableDuration(s),0)/60),'분')}${stat('이번 주 총 볼륨',fmt(weight(ws.reduce((n,s)=>n+volume(s),0))),data.settings.unit)}</div>
 ${timeIssues?`<section class="section time-review"><b>운동 시간 확인이 필요한 기록 ${timeIssues}개</b><p>지나치게 긴 시간은 합계에서 제외했어요. 실제 시간으로 수정하면 다시 반영됩니다.</p>${button('reviewTimes','기록 시간 확인하기','text-btn')}</section>`:''}<section class="section"><div class="row section-title"><h2>바로 시작하는 루틴</h2>${button('navigate','전체 보기 '+icon('next'),'text-btn','data-page="routines"')}</div><div class="card compact">${routines.map(routineCard).join('')}</div></section>
 <section class="section"><div class="row section-title"><h2>최근 운동</h2>${button('navigate','기록 보기','text-btn','data-page="calendar"')}</div>${data.sessions.length?logCard(latest()[0]):`<div class="card">${empty('첫 번째 기록을 기다리고 있어요','오늘의 한 세트가 내일의 기준이 됩니다.','calendar')}</div>`}</section><div class="app-footer">A LITTLE STRONGER, A LITTLE HAPPIER.</div>`;
}
function logCard(s){return `<button class="card log-card full" data-action="viewSession" data-id="${esc(s.id)}" style="text-align:left"><div class="row"><h3>${esc(s.name)}</h3><span class="badge">완료</span></div><p>${esc(s.date)} · ${s.exercises.length}개 운동</p><div class="log-metrics"><span>${icon('clock')} ${durationLabel(s)}</span><span>${completed(s)}세트</span><span>${fmt(weight(volume(s)))} ${data.settings.unit}</span></div></button>`;}
function routinesPage(){return `${head()}<div class="eyebrow">TRAIN WITH INTENTION</div><h1 style="margin-top:9px">오늘, 어떤 운동?</h1><p class="welcome-line">루틴으로 시작하거나 나만의 운동을 골라보세요.</p><div class="section">${button('start',icon('plus')+(data.draft?'진행 중인 운동 이어하기':'직접 운동 구성하기'),'primary')}${button('history',icon('calendar')+' 과거 운동 불러오기','secondary full','style="margin-top:12px"')}</div><section class="section"><div class="row"><h2>나만의 루틴</h2>${data.draft?button('saveRoutine','진행 중 구성 저장','text-btn'):''}</div>${data.customRoutines?.length?data.customRoutines.map(r=>`<div class="card custom-routine"><div><h3>${esc(r.name)}</h3><p class="micro">${r.exercises.length}개 운동 · ${r.exercises.reduce((n,e)=>n+e.sets.length,0)}세트</p></div>${button('customRoutine',icon('play'),'icon-btn',`data-id="${esc(r.id)}" aria-label="${esc(r.name)} 시작"`)}${button('deleteRoutine',icon('trash'),'icon-btn danger',`data-id="${esc(r.id)}" aria-label="${esc(r.name)} 삭제"`)}</div>`).join(''):'<p class="small muted" style="margin-top:10px">운동을 구성한 뒤 루틴으로 저장해 다시 사용하세요.</p>'}</section>${routines.map((r,i)=>`<section class="section card"><div class="row"><span class="mini-tag">${r.tag}</span><span class="small muted">${r.ids.length}개 운동</span></div><h2 style="margin-top:14px">${r.name}</h2><p class="small muted" style="margin-top:6px">${r.desc}</p><div class="divider"></div>${r.ids.map(id=>`<p class="small" style="margin-bottom:9px">${icon('dumbbell')} &nbsp;${exercise(id).name} <span class="muted">· ${exercise(id).kind==='duration'?'시간 기록':'1세트로 시작'}</span></p>`).join('')}${button('routine',icon('play')+'루틴 시작','secondary full',`data-index="${i}" style="margin-top:12px"`)}</section>`).join('')}<div class="section tip">${icon('info')}<p>시작한 뒤 운동을 추가·삭제하고, 세트 수와 무게를 자유롭게 바꿀 수 있어요.</p></div>`;}
function calendar(){
 const y=month.getFullYear(),m=month.getMonth(),first=new Date(y,m,1),count=new Date(y,m+1,0).getDate(),off=(first.getDay()+6)%7;
 const records=data.sessions.filter(s=>s.date===selectedDate);
 return `${head()}<div class="eyebrow">EVERY DAY COUNTS</div><h1 style="margin-top:9px">기록이 쌓이는 달력</h1><p class="welcome-line">운동한 날마다, 한 걸음 더 가까이.</p><div class="section card"><div class="calendar-head">${button('month',icon('back'),'icon-btn','data-delta="-1" aria-label="이전 달"')}<h2>${y}년 ${m+1}월</h2>${button('month',icon('next'),'icon-btn','data-delta="1" aria-label="다음 달"')}</div><div class="calendar-grid">${['월','화','수','목','금','토','일'].map(d=>`<div class="label">${d}</div>`).join('')}${'<span></span>'.repeat(off)}${Array.from({length:count},(_,i)=>{const k=dateKey(new Date(y,m,i+1));return button('day',i+1,`calendar-date ${k===dateKey()?'today':''} ${k===selectedDate?'selected':''} ${data.sessions.some(s=>s.date===k)?'has-record':''} ${k>dateKey()?'future':''}`,`data-date="${k}" aria-label="${k} 기록"`);}).join('')}</div><div class="row" style="margin-top:22px"><span class="small muted">● 운동 기록이 있는 날</span>${button('today','오늘로','text-btn')}</div></div><section class="section"><div class="row section-title"><h2>${parseDate(selectedDate).getMonth()+1}월 ${parseDate(selectedDate).getDate()}일</h2><span class="small muted">${records.length}개의 기록</span></div>${records.length?records.map(logCard).join(''):`<div class="card">${empty('아직 기록이 없는 날이에요',selectedDate>dateKey()?'앞으로 채워 갈 나의 운동 기록.':'오늘의 노력, 여기에 남겨보세요.','calendar',selectedDate<=dateKey()?button('recordDate',icon('plus')+'이 날짜에 기록하기','secondary'): '')}</div>`}</section>`;
}
function workout(){
 const s=data.draft;if(!s){page='home';return home();}
 const wc=normalizeClock(s),done=completed(s),total=s.exercises.reduce((n,e)=>n+e.sets.length,0);
 return `<div class="workout-top"><div class="workout-header">${button('navigate',icon('back'),'icon-btn','data-page="home" aria-label="홈으로"')}<span class="eyebrow">오늘의 운동 기록</span>${button('finish','완료','finish-top')}</div><div class="workout-clock-panel"><div><span class="micro">전체 운동 시간 · 최대 2시간</span><strong id="elapsed">${workoutClock(workoutElapsedMs(s)/1000)}</strong></div><div class="row">${button('toggleWorkoutClock',icon(wc.paused?'play':'pause'),'icon-btn',`aria-label="운동 시간 ${wc.paused?'이어하기':'일시정지'}" ${wc.limitReached?'disabled':''}`)}${button('clockEdit','수정','text-btn')}</div></div></div><div id="time-limit" class="time-limit" ${wc.limitReached?'':'hidden'}><b>2시간이 되어 시간을 자동으로 멈췄어요</b><p>세트와 메모는 그대로 남아 있어요. 실제 운동 시간이 더 짧다면 시간을 줄여서 저장하세요.</p>${button('clockEdit','시간 수정','secondary')}</div>${wc.needsReview?`<div class="time-review"><b>오래된 진행 기록이에요</b><p>세트는 보존했습니다. 전체 시간을 수정하거나 0부터 다시 측정해 주세요.</p><div class="row">${button('clockEdit','시간 수정','secondary')}${button('resetClock','0부터 측정','secondary')}</div></div>`:''}<div class="row"><span class="small muted">${s.date}</span><span class="micro" id="workout-status">${wc.limitReached?'2시간 자동 정지':wc.awaitingStart?'운동 준비':wc.paused?'전체 시간 일시정지':'운동 중'}</span></div><input class="session-name" id="session-name" maxlength="80" aria-label="운동 이름" value="${esc(s.name)}"><div class="row"><span class="small muted">${s.exercises.length}개 운동 · ${done}/${total}세트 완료</span>${button('unit',data.settings.unit.toUpperCase()+' ⇄','pill')}</div><div class="workout-progress"><span style="width:${total?done/total*100:0}%"></span></div>
 <p class="micro swipe-hint">세트를 왼쪽으로 밀고 놓으면 바로 삭제돼요.</p>${s.exercises.map((e,i)=>{const ex=exercise(e.id),last=lastExercise(e.id),kind=ex.kind;return `<section class="card exercise-card"><div class="row"><h3>${esc(ex.name)}</h3>${button('exerciseMenu',icon('more'),'icon-btn',`data-index="${i}" aria-label="${esc(ex.name)} 편집"`)}</div><p class="last">${last?`지난 기록 · ${setDescription(last.sets.find(a=>a.done),kind)}`:'첫 기록 · 오늘의 기준을 만들어보세요'}</p>${last?.notes?`<details class="previous-exercise-note"><summary>지난 운동 메모 보기</summary>${exerciseNoteText(last)}</details>`:''}<div class="exercise-shortcuts">${button('exerciseRest',icon('clock')+' 휴식 '+clock(exerciseRest(e.id)),'pill',`data-id="${esc(e.id)}"`)}${last?button('exerciseHistory','지난 기록 보기','text-btn',`data-id="${esc(e.id)}"`):''}</div><div class="set-labels"><span>세트</span><span>${kind==='strength'?data.settings.unit:kind==='duration'?'기록':'중량'}</span><span>${kind==='duration'?'시간 (초)':'횟수'}</span><span>완료</span></div>${e.sets.map((set,j)=>`<div class="set-swipe" data-ex="${i}" data-set="${j}">${button('deleteSet',icon('trash')+' 삭제','swipe-delete',`data-ex="${i}" data-set="${j}" aria-label="${esc(ex.name)} ${j+1}세트 삭제"`)}<div class="set-row ${set.done?'done':''}"><span class="set-number">${j+1}</span>${kind==='strength'?`<input inputmode="decimal" type="number" min="0" max="${weight(10000)}" step="any" value="${set.weightKg===0?'':weight(set.weightKg)}" placeholder="0" data-field="weight" data-ex="${i}" data-set="${j}" aria-label="${esc(ex.name)} ${j+1}세트 무게">`:`<span class="small muted" style="text-align:center">${kind==='duration'?'타임':'맨몸'}</span>`}<input inputmode="numeric" type="number" min="1" max="100000" step="1" value="${set.reps||''}" placeholder="횟수" data-field="reps" data-ex="${i}" data-set="${j}" aria-label="${esc(ex.name)} ${j+1}세트 ${kind==='duration'?'초':'횟수'}">${button('checkSet',icon('check'),`check ${set.done?'done':''}`,`data-ex="${i}" data-set="${j}" aria-label="${esc(ex.name)} ${j+1}세트 완료" aria-pressed="${set.done}"`)}</div></div>`).join('')}${button('addSet',icon('plus')+' 세트 추가 · 이전 값 복사','add-set',`data-index="${i}"`)+button('addThreeSets','+3 세트','quick-sets',`data-index="${i}" aria-label="${esc(ex.name)} 3세트 추가"`)}${exerciseNoteField(e,i)}</section>`;}).join('')}
 ${s.exercises.length?'':`<div class="section card">${empty('오늘의 운동을 골라주세요','운동 검색에서 부위별로 선택할 수 있어요.','dumbbell')}</div>`}<div class="section">${button('pick',icon('plus')+'운동 추가','secondary full')}${button('history',icon('calendar')+' 과거 운동 불러오기','secondary full','style="margin-top:10px"')}</div><label class="note-label" for="workout-notes">오늘의 메모</label><textarea class="note" id="workout-notes" maxlength="2000" rows="2" placeholder="컨디션, 자세, 다음 운동의 목표…">${esc(s.notes)}</textarea>${button('saveRoutine',icon('heart')+' 이 구성으로 루틴 저장','secondary full','style="margin-top:18px"')}<div class="workout-bottom">${button('cancelWorkout','운동 취소','secondary danger')}${button('finish',icon('check')+'운동 완료','primary')}</div><p class="micro" style="text-align:center;margin-top:14px">완료한 세트만 기록에 저장됩니다.</p>`;
}
function setDescription(set,kind){if(!set)return '기록 없음';return kind==='duration'?`${set.reps}초`:kind==='bodyweight'?`맨몸 × ${set.reps}회`:`${fmt(weight(set.weightKg))} ${data.settings.unit} × ${set.reps}회`;}
function insights(){
 const sessions=latest();
 const available=allExercises().filter(e=>sessions.some(s=>s.exercises.some(a=>a.id===e.id&&a.sets.some(a=>a.done))));
 if(available.length&&!available.some(e=>e.id===insightId))insightId=available[0].id;
 const totalVol=sessions.reduce((n,s)=>n+volume(s),0),history=[...sessions].reverse().filter(s=>s.exercises.some(e=>e.id===insightId&&e.sets.some(a=>a.done))).slice(-10);
 const ex=exercise(insightId)||library[0];
 const values=history.map(s=>{const e=s.exercises.find(a=>a.id===ex.id);return Math.max(...e.sets.filter(a=>a.done).map(a=>ex.kind==='strength'?weight(a.weightKg):a.reps));});
 const recorded=allExercises().filter(e=>sessions.some(s=>s.exercises.some(a=>a.id===e.id&&a.sets.some(a=>a.done))));
 let chart='';
 if(history.length){const max=Math.max(1,...values)*1.15,points=values.map((v,i)=>`${history.length===1?145:22+i*266/(history.length-1)},${125-v/max*100}`).join(' ');chart=`<svg class="chart" viewBox="0 0 310 155" role="img" aria-label="${esc(ex.name)} 기록 그래프">${[25,75,125].map(y=>`<path d="M20 ${y}H295" stroke="#2e3b2e" stroke-dasharray="3 5"/>`).join('')}<polyline class="line" points="${points}"/>${values.map((v,i)=>{const x=history.length===1?145:22+i*266/(history.length-1),y=125-v/max*100;return `<circle cx="${x}" cy="${y}" r="4" fill="#c8fa71"/><text x="${x}" y="${y-10}" text-anchor="middle">${fmt(v)}</text>`;}).join('')}<text x="20" y="151">${history[0].date.slice(5)}</text><text x="290" y="151" text-anchor="end">${history[history.length-1].date.slice(5)}</text></svg>`;}
 const weeks=Array.from({length:4},(_,i)=>{const end=new Date(monday());end.setDate(end.getDate()-(3-i)*7+6);const start=new Date(end);start.setDate(end.getDate()-6);return{n:sessions.filter(s=>s.date>=dateKey(start)&&s.date<=dateKey(end)).length,label:i===3?'이번 주':`${3-i}주 전`};});
 return `${head()}<div class="eyebrow">STRONGER, ONE REP AT A TIME</div><h1 style="margin-top:9px">숫자로 보는 나의 성장</h1><p class="welcome-line">꾸준한 나를, 기록으로 확인하세요.</p><div class="stats">${stat('누적 운동',sessions.length,'회')}${stat('완료한 세트',sessions.reduce((n,s)=>n+completed(s),0),'세트')}</div><div class="section card"><div class="row"><h3>운동 빈도</h3><span class="small muted">최근 4주</span></div><div class="bar-chart">${weeks.map(w=>`<div class="bar"><span class="small lime">${w.n}회</span><div style="height:${Math.max(3,w.n/Math.max(1,...weeks.map(x=>x.n))*78)}px"></div>${w.label}</div>`).join('')}</div></div><section class="section card"><div class="row"><h3>운동별 최고 기록</h3><span class="pill">${ex.kind==='strength'?data.settings.unit:ex.kind==='duration'?'초':'회'}</span></div><select id="insight-exercise" class="chart-select" aria-label="성장 그래프 운동 선택">${(recorded.length?recorded:[ex]).map(e=>`<option value="${esc(e.id)}" ${e.id===insightId?'selected':''}>${esc(e.name)}</option>`).join('')}</select>${chart||empty('성장의 출발선이에요','운동을 완료하면 실제 기록으로 그래프가 채워집니다.','chart')}<p class="micro">${ex.kind==='strength'?'운동별 세트 최고 무게':'운동별 세트 최고 '+(ex.kind==='duration'?'시간':'횟수')} · 최근 10회 기록</p></section><div class="section card"><span class="muted small">지금까지 들어 올린 총 볼륨</span><div class="big-number" style="margin-top:12px">${fmt(weight(totalVol))} <span class="small muted">${data.settings.unit}</span></div><p class="micro" style="margin-top:10px">중량 운동의 무게 × 횟수 합계. 맨몸·시간 운동 제외.</p></div><div class="section tip">${icon('bolt')}<p>기록이 쌓일수록 변화가 보입니다. 지난 기록을 기준으로 나만의 다음 목표를 정해보세요.</p></div>`;
}
function settings(){return `${head()}<div class="eyebrow">MAKE IT YOURS</div><h1 style="margin-top:9px">나에게 맞게</h1><p class="welcome-line">익숙한 단위, 편안한 운동의 리듬.</p>${loadError?'<div class="section tip danger">저장된 데이터 형식을 읽지 못했습니다. 원본은 보존되어 있으며, 백업 파일로 복원하거나 초기화할 수 있습니다.</div>':''}<div class="section card"><div class="setting-row"><div><h3>무게 단위</h3><p>기존 기록도 자동으로 환산돼요</p></div><div class="segmented">${['kg','lb'].map(u=>button('setUnit',u,u===data.settings.unit?'active':'',`data-unit="${u}"`)).join('')}</div></div><div class="setting-row"><div><h3>자동 휴식 타이머</h3><p>세트를 완료하면 바로 시작</p></div>${button('toggleRest','<span></span>',`switch ${data.settings.autoRest?'on':''}`,`role="switch" aria-label="자동 휴식 타이머" aria-checked="${data.settings.autoRest}"`)}</div><div class="setting-row"><div><h3>기본 휴식 시간</h3><p>나의 운동 속도에 맞게</p></div><select id="rest-setting" aria-label="기본 휴식 시간">${[30,45,60,90,120,180,300,...([30,45,60,90,120,180,300].includes(data.settings.rest)?[]:[data.settings.rest])].sort((a,b)=>a-b).map(n=>`<option value="${n}" ${n===data.settings.rest?'selected':''}>${n}초</option>`).join('')}</select></div><div class="setting-row"><div><h3>주간 운동 목표</h3><p>꾸준히 지킬 수 있는 약속</p></div><select id="goal-setting" aria-label="주간 운동 목표">${Array.from({length:7},(_,i)=>`<option value="${i+1}" ${data.settings.goal===i+1?'selected':''}>주 ${i+1}회</option>`).join('')}</select></div></div><div class="section card"><div class="row"><div class="routine-art blue">${icon('widget')}</div><div style="flex:1"><h3>홈 화면에서도 한눈에</h3><p class="small muted" style="margin-top:5px">${window.Android?'이번 주 운동 · 최근 기록 · 바로 시작':'Safari에서 설치해서 바로 열기'}</p></div></div>${button(window.Android?'widget':'installWeb',icon('plus')+(window.Android?'홈 화면 위젯 추가':'홈 화면 아이콘 추가'),'primary','style="margin-top:20px"')}<p class="micro" style="margin-top:12px">${window.Android?'홈 화면을 길게 눌러 위젯 → 리프트로그를 선택해도 돼요.':'Safari 공유 → 홈 화면에 추가. 웹앱에는 아이폰 네이티브 위젯과 잠금 화면 타이머 알림이 없습니다.'}</p></div><div class="section card"><h3>내 기록, 안전하게</h3><div class="setting-row"><div><p style="margin-top:0">계정 없이 이 기기에 저장됩니다.<br>기기를 바꾸기 전에 파일로 백업하세요.</p></div></div><div class="row" style="margin-top:15px">${button('export',icon('download')+' 백업 저장','secondary')}${button('import',icon('upload')+' 복원','secondary')}</div></div><div class="section">${button('reset','모든 데이터 초기화','text-btn danger')}</div><div class="app-footer">리프트로그 1.4.2<br>LIFTLOG · A LITTLE STRONGER, A LITTLE HAPPIER.</div>`;}
function render(){
 const screens={home,routines:routinesPage,calendar,workout,insights,settings};
 $('#app').innerHTML=`<main class="screen ${page==='workout'?'workout-screen':''}">${(screens[page]||home)()}</main>${page==='workout'?'':nav()}`;
 timerUI();
}
function sheet(title,body,kind='generic'){modal=kind;$('#app').inert=true;$('#overlay').innerHTML=`<div class="overlay-backdrop"><section class="sheet" data-kind="${kind}" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="handle"></div><div class="sheet-head"><h2>${title}</h2>${button('close',icon('close'),'icon-btn','aria-label="닫기"')}</div><div class="sheet-content">${body}</div></section></div>`;}
function closeSheet(){$('#app').inert=false;if(modal==='finish'&&finishResume&&data.draft){const c=normalizeClock();c.paused=!!c.limitReached;c.anchorMs=Date.now();c.lastSeenMs=Date.now();finishResume=false;save();}modal=null;$('#overlay').innerHTML='';}
function confirmSheet(title,desc,action,label='확인'){sheet(title,`<p class="muted">${desc}</p><div class="sheet-actions">${button('close','돌아가기','secondary')}${button(action,label,'primary')}</div>`,'confirm');}
function startWorkout(date=dateKey(),routine=null){
 if(loadError){page='settings';render();toast('데이터 복원 또는 초기화를 먼저 해주세요.');return;}
 if(data.draft){normalizeClock();page='workout';closeSheet();render();return;}
 data.draft={id:cryptoId(),date,name:routine?.name||'오늘의 운동',startedAt:Date.now(),notes:'',exercises:[]};
 data.draft.clock=newClock();if(!routine){data.draft.clock.paused=true;data.draft.clock.awaitingStart=true;}if(routine)data.draft.exercises=routine.ids.map(newExercise);
 save();page='workout';render();if(!routine)openPicker();
}
function cryptoId(){return 's_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,9);}
function newExercise(id){const ex=exercise(id),last=lastExercise(id),previous=last?.sets.find(set=>set.done),defaultReps=ex.kind==='duration'?(ex.muscle==='유산소'?600:60):10;return {id,notes:'',sets:[previous?{...previous,done:false}:{weightKg:ex.weight||0,reps:defaultReps,done:false}]};}

function openPicker(index=null){replacementContext=Number.isInteger(index)&&data.draft?.exercises[index]?{draftId:data.draft.id,entry:data.draft.exercises[index]}:null;pickerFilter='전체';pickerQuery='';picked=new Set();sheet(replacementContext?'운동 종류 변경':'운동 선택',`<div class="picker-toolbar"><div class="search">${icon('search')}<input id="exercise-search" type="search" enterkeyhint="done" autocomplete="off" aria-label="운동 검색" placeholder="운동·장비 검색 (예: 스쿼트, 덤벨)"></div><div class="filters" id="picker-filters"></div><p class="micro" id="picker-count"></p></div><div class="picker-list"><div id="picker-results"></div>${replacementContext?'':button('customExercise',icon('plus')+'나만의 운동 만들기','text-btn')}</div><div class="picker-footer">${button('addPicked','운동 추가','primary','id="picker-add"')}</div>`,'picker');refreshPicker();}
function searchExercises(query=pickerQuery,filter=pickerFilter){
 const normalize=v=>v.toLowerCase().replace(/[^a-z0-9가-힣]/g,'');
 const aliases={latpull:'렛풀다운 lat pulldown',squat:'squat 백스쿼트',bench:'bench press 벤치프레스',deadlift:'deadlift 데드',hipthrust:'힙쓰러스트 힙스러스트 hip thrust',lateral:'사레레 레터럴 lateral raise',rdl:'루마니안 romanian deadlift',ohp:'밀리터리프레스 shoulder press',pushup:'push up 푸쉬업',pullup:'pull up 턱걸이',run:'런닝머신 트레드밀 treadmill'};
 const terms=query.trim().split(/\s+/).map(normalize).filter(Boolean);
 const recent=new Set(latest().slice(0,20).flatMap(s=>s.exercises.map(e=>e.id)));const favorites=new Set(data.settings.favorites||[]);
 return allExercises().filter(e=>(filter==='전체'||(filter==='최근'?recent.has(e.id):filter==='즐겨찾기'?favorites.has(e.id):e.muscle===filter))&&terms.every(t=>normalize(e.name+' '+e.equipment+' '+e.muscle+' '+e.id+' '+(aliases[e.id]||'')).includes(t)));
}
function refreshPicker(){
 $('#picker-filters').innerHTML=['전체','최근','즐겨찾기','가슴','등','하체','어깨','팔','코어','유산소','기타'].map(f=>button('filter',f,`pill ${f===pickerFilter?'active':''}`,`data-filter="${f}"`)).join('');
 const list=searchExercises();if($('#picker-count'))$('#picker-count').textContent=`${list.length}개 운동 · ${replacementContext?'바꿀 운동 하나를 선택하세요':'여러 개를 골라 한 번에 추가하세요'}`;
 $('#picker-results').innerHTML=list.map(e=>{const added=data.draft?.exercises.some(x=>x.id===e.id),favorite=data.settings.favorites?.includes(e.id);return `<div class="exercise-choice ${picked.has(e.id)?'selected':''}"><button class="exercise-choice-main" data-action="pickExercise" data-id="${esc(e.id)}" aria-pressed="${picked.has(e.id)}" ${added?'disabled':''}><span class="routine-art">${icon(e.kind==='duration'?'clock':'dumbbell')}</span><div><h3>${esc(e.name)}</h3><p>${esc(e.muscle)} · ${esc(e.equipment||'직접 추가')} · ${added?'이미 추가됨':e.kind==='duration'?'시간':e.kind==='bodyweight'?'맨몸':'중량'}</p></div><span class="box">${icon('check')}</span></button>${button('favorite',icon('heart'),`favorite-button ${favorite?'on':''}`,`data-id="${esc(e.id)}" aria-label="${esc(e.name)} 즐겨찾기" aria-pressed="${!!favorite}"`)}</div>`;}).join('')||empty('조건에 맞는 운동이 없어요','전체에서 검색하거나 하트를 눌러 즐겨찾기에 추가해보세요.','search');
 $('#picker-add').textContent=picked.size?(replacementContext?'선택한 운동으로 변경':`${picked.size}개 운동 추가`):'운동을 선택해 주세요';$('#picker-add').disabled=!picked.size;
}
function customExercise(){sheet('나만의 운동',`<label class="form-label" for="custom-name">운동 이름</label><input id="custom-name" placeholder="예: 케틀벨 스윙" maxlength="80"><label class="form-label" for="custom-muscle">운동 부위</label><select id="custom-muscle">${['가슴','등','하체','어깨','팔','코어','유산소','기타'].map(m=>`<option>${m}</option>`).join('')}</select><label class="form-label" for="custom-kind">기록 방식</label><select id="custom-kind"><option value="strength">중량 + 횟수</option><option value="bodyweight">맨몸 + 횟수</option><option value="duration">시간 (초)</option></select>${button('saveCustom','만들고 운동에 추가','primary')}`,'custom');}
function replacementEntry(){if(!replacementContext||data.draft?.id!==replacementContext.draftId)return null;return data.draft.exercises.includes(replacementContext.entry)?replacementContext.entry:null;}
function requestExerciseReplacement(id){
 const entry=replacementEntry(),target=exercise(id);if(!entry||!target)return;
 if(data.draft.exercises.some(e=>e!==entry&&e.id===id)){toast('이미 추가된 운동이에요.');return;}
 if(exercise(entry.id).kind!==target.kind){pendingReplacementId=id;confirmSheet('새 운동의 세트로 바꿀까요?',`${esc(exercise(entry.id).name)} → ${esc(target.name)}. 기록 단위가 달라 기존 세트를 새 운동의 기본 세트로 바꿉니다. 메모와 지난 운동 기록은 그대로 유지됩니다.`,'confirmExerciseReplacement','새 세트로 변경');return;}
 replaceWorkoutExercise(id);
}
function replaceWorkoutExercise(id,allowNewSets=false){
 const entry=replacementEntry(),target=exercise(id);if(!entry||!target)return false;
 if(data.draft.exercises.some(e=>e!==entry&&e.id===id)){toast('이미 추가된 운동이에요.');return false;}
 const changedKind=exercise(entry.id).kind!==target.kind;if(changedKind&&!allowNewSets)return false;
 const index=data.draft.exercises.indexOf(entry),next=changedKind?{...newExercise(id),notes:entry.notes||''}:{...entry,id,sets:entry.sets.map(set=>({...set}))};
 data.draft.exercises[index]=next;if(!save()){data.draft.exercises[index]=entry;return false;}
 if(data.timer?.exerciseId===entry.id)stopTimer();replacementContext=null;pendingReplacementId=null;closeSheet();render();toast(changedKind?'새 운동의 세트로 변경했어요.':'운동을 변경했어요. 세트와 메모는 유지됩니다.');return true;
}
function exerciseInfoSheet(index){
 const entry=data.draft?.exercises[index];if(!entry)return;const e=exercise(entry.id);exerciseEditContext={draftId:data.draft.id,entry};
 sheet('운동 정보 수정',`<p class="small muted">이름·부위·기구 변경은 이 운동을 사용하는 기록에 함께 반영됩니다. 세트 수치는 유지됩니다.</p><label class="form-label" for="edit-ex-name">운동 이름</label><input class="sheet-input" id="edit-ex-name" maxlength="80" value="${esc(e.name)}"><label class="form-label" for="edit-ex-muscle">운동 부위</label><select class="full" id="edit-ex-muscle">${['가슴','등','하체','어깨','팔','코어','유산소','기타'].map(m=>`<option ${m===e.muscle?'selected':''}>${m}</option>`).join('')}</select><label class="form-label" for="edit-ex-equipment">기구</label><input class="sheet-input" id="edit-ex-equipment" maxlength="60" value="${esc(e.equipment||'')}"><label class="form-label" for="edit-ex-kind">기록 방식</label><select class="full" id="edit-ex-kind">${[['strength','중량 + 횟수'],['bodyweight','맨몸 + 횟수'],['duration','시간 (초)']].map(([v,label])=>`<option value="${v}" ${v===e.kind?'selected':''}>${label}</option>`).join('')}</select><p class="micro" style="margin-top:10px">기록 방식을 바꾸면 새 운동으로 저장해 지난 기록의 단위를 유지해요.</p>${button('saveExerciseInfo','수정 저장','primary')}`,'exerciseInfo');
}
function saveExerciseInfo(){
 const values={name:$('#edit-ex-name').value.trim(),muscle:$('#edit-ex-muscle').value,equipment:$('#edit-ex-equipment').value.trim(),kind:$('#edit-ex-kind').value};
 if(!values.name||values.name.length>80||values.equipment.length>60||!['가슴','등','하체','어깨','팔','코어','유산소','기타'].includes(values.muscle)||!['strength','bodyweight','duration'].includes(values.kind)){toast('올바른 운동 정보를 입력해 주세요.');return;}
 const ctx=exerciseEditContext;if(!ctx||data.draft?.id!==ctx.draftId||!data.draft.exercises.includes(ctx.entry))return;
 const pending={...ctx,values};
 if(exercise(ctx.entry.id).kind!==values.kind){pendingExerciseInfo=pending;confirmSheet('기록 방식을 변경할까요?','단위가 달라 새 운동과 기본 세트를 만듭니다. 현재 메모는 유지하고, 기존 운동과 지난 기록은 그대로 남깁니다.','confirmExerciseInfo','새 운동으로 변경');return;}
 applyExerciseInfo(pending);
}
function applyExerciseInfo(pending){
 if(!pending||data.draft?.id!==pending.draftId||!data.draft.exercises.includes(pending.entry))return false;
 const {entry,values}=pending,current=exercise(entry.id);if(!current)return false;
 const oldSettings=data.settings,oldCustom=data.customExercises,index=data.draft.exercises.indexOf(entry),changedKind=current.kind!==values.kind;
 if(changedKind){
  if(data.customExercises.length>=500){toast('직접 추가한 운동은 최대 500개까지 저장할 수 있어요.');return false;}
  const created={id:'custom_'+cryptoId(),...values,weight:0};data.customExercises=[...data.customExercises,created];data.draft.exercises[index]={...newExercise(created.id),notes:entry.notes||''};
 }else if(entry.id.startsWith('custom_'))data.customExercises=data.customExercises.map(e=>e.id===entry.id?{...e,...values}:e);
 else {const {name,muscle,equipment}=values;data.settings={...data.settings,exerciseOverrides:{...data.settings.exerciseOverrides,[entry.id]:{name,muscle,equipment}}};}
 if(!save()){data.settings=oldSettings;data.customExercises=oldCustom;data.draft.exercises[index]=entry;return false;}
 if(changedKind&&data.timer?.exerciseId===entry.id)stopTimer();pendingExerciseInfo=null;exerciseEditContext=null;closeSheet();render();toast('운동 정보를 수정했어요.');return true;
}
function finishWorkout(){const s=data.draft;if(!s || !completed(s)){toast('한 세트 이상 완료한 뒤 저장해 주세요.');return;}
 const c=normalizeClock();finishResume=!c.paused;checkpointClock();c.paused=true;const seconds=Math.floor(workoutElapsedMs()/1000);stopTimer();
 sheet('오늘도 해냈어요 ♡',`<div class="success-mark">${icon('check')}</div><h2 style="text-align:center">${completed(s)}세트의 노력이 쌓였어요.</h2><p class="muted small" style="text-align:center;margin-top:8px">완료한 세트만 저장해요. 운동 시간도 확인해 주세요.</p><div class="stats">${stat('총 볼륨',fmt(weight(volume(s))),data.settings.unit)}${stat('운동',s.exercises.filter(e=>e.sets.some(a=>a.done)).length,'종목')}</div><div class="duration-fields"><label>운동 시간 (분)<input id="finish-minutes" type="number" inputmode="numeric" min="0" max="120" value="${c.needsReview?'':Math.floor(seconds/60)}" placeholder="실제 운동한 분"></label><label>초<input id="finish-seconds" type="number" inputmode="numeric" min="0" max="59" value="${seconds%60}"></label></div>${c.needsReview?'<p class="small danger">오래된 기록의 실제 운동 시간을 입력해 주세요.</p>':''}${button('saveWorkout',icon('check')+'기록 저장','primary')}${button('saveRoutine','이 구성으로 나만의 루틴 저장','text-btn full')}`,'finish');}
function exerciseNoteField(e,index,sessionId=''){
 const label=exercise(e.id).name+' 메모',id=(sessionId?'saved-note-':'exercise-note-')+index;
 return `<div class="exercise-note"><label class="note-label" for="${id}">운동 메모 <span class="micro">자동 저장</span></label><textarea id="${id}" data-exercise-note="${index}" ${sessionId?'data-note-session="'+esc(sessionId)+'"':''} aria-label="${esc(label)}" maxlength="2000" rows="2" placeholder="자세, 기구 설정, 오늘의 느낌을 남겨보세요.">${esc(e.notes||'')}</textarea></div>`;
}
function exerciseNoteText(e){return e.notes?`<p class="exercise-note-text">${esc(e.notes)}</p>`:'';}
function sessionDetail(id){const s=data.sessions.find(s=>s.id===id);if(!s)return;sheet(esc(s.name),`<p class="small muted">${s.date} · ${durationLabel(s)} · ${completed(s)}세트</p>${s.exercises.map((e,i)=>`<div class="detail-exercise"><h3>${esc(exercise(e.id).name)}</h3><div class="history-sets">${e.sets.map(set=>`<span>${esc(setDescription(set,exercise(e.id).kind))}</span>`).join('')}</div>${exerciseNoteField(e,i,s.id)}</div>`).join('')}${button('sessionDate','날짜 수정','text-btn',`data-id="${esc(id)}"`)} · ${button('sessionTime','운동 시간 수정','text-btn',`data-id="${esc(id)}"`)}${s.notes?`<p class="small muted" style="margin-top:17px;white-space:pre-wrap">${esc(s.notes)}</p>`:''}<div class="sheet-actions">${button('repeat',icon('calendar')+'이 기록 불러오기','primary',`data-id="${esc(id)}"`)}${button('deleteSession',icon('trash'),'secondary danger',`data-id="${esc(id)}" aria-label="기록 삭제"`)}</div>`,'detail');}
function historyMatches(query=''){
 const terms=query.trim().toLowerCase().split(/\s+/).filter(Boolean);
 return [...data.sessions].sort((a,b)=>b.date.localeCompare(a.date)||b.finishedAt-a.finishedAt).filter(s=>{
  const text=[s.date,s.name,...s.exercises.map(e=>exercise(e.id)?.name||'')].join(' ').toLowerCase();
  return terms.every(term=>text.includes(term));
 });
}
function historySheet(){
 historyQuery='';historySelection=null;
 sheet('과거 운동 불러오기',`<p class="small muted">그날의 운동·세트·무게·횟수를 그대로 가져옵니다.</p><div class="search">${icon('search')}<input id="history-search" aria-label="과거 운동 검색" placeholder="운동 이름, 종목, 날짜로 검색"></div><div class="row" style="margin-bottom:12px"><span class="micro">예: 2026-10 · 벤치 · 상체</span><span id="history-count" class="micro"></span></div><div id="history-results"></div>`,'history');
 refreshHistory();
}
function refreshHistory(){
 const matches=historyMatches(historyQuery);
 $('#history-count').textContent=matches.length+'개 기록';
 $('#history-results').innerHTML=matches.map(s=>`<button class="card history-choice full" data-action="chooseHistory" data-id="${esc(s.id)}"><div class="row"><span class="small lime">${esc(s.date)}</span>${icon('next')}</div><h3 style="margin-top:9px">${esc(s.name)}</h3><p class="small muted" style="margin-top:7px">${s.exercises.length}개 운동 · ${completed(s)}세트 · ${durationLabel(s)}</p><p class="history-exercises">${s.exercises.map(e=>esc(exercise(e.id)?.name||'운동')).join(' · ')}</p></button>`).join('')||empty(data.sessions.length?'일치하는 기록이 없어요':'불러올 운동 기록이 아직 없어요',data.sessions.length?'운동 이름이나 날짜로 다시 검색해 주세요.':'운동을 완료하고 저장하면 여기에 표시됩니다.','calendar');
}
function selectedHistorySheet(id){
 const s=data.sessions.find(s=>s.id===id);if(!s){toast('이 기록을 찾을 수 없습니다.');return;}
 historySelection=id;
 const hasDraft=!!data.draft?.exercises.length;
 sheet('이 기록 불러오기',`<div class="row"><h3>${esc(s.name)}</h3><span class="pill">${esc(s.date)}</span></div><p class="small muted" style="margin-top:10px">${s.exercises.length}개 운동 · ${completed(s)}세트</p>${s.exercises.map(e=>`<div class="detail-exercise"><h3>${esc(exercise(e.id).name)}</h3><div class="history-sets">${e.sets.filter(a=>a.done).map(a=>`<span>${esc(setDescription(a,exercise(e.id).kind))}</span>`).join('')}</div>${exerciseNoteText(e)}</div>`).join('')}<div class="tip" style="margin-top:17px">${icon('info')}<p>선택한 날짜의 값으로 가져옵니다. 가져온 세트는 미완료 상태로 시작해요.</p></div>${hasDraft?`<p class="small muted" style="margin-top:15px">진행 중인 운동이 있어요. 추가하거나 운동 목록을 교체할 수 있습니다.</p>${button('appendHistory',icon('plus')+' 현재 운동에 추가','primary')}${button('replaceHistory','현재 운동 목록 교체','secondary full','style="margin-top:10px"')}`:button('loadHistory',icon('play')+'이 기록으로 운동 시작','primary')}${button('history','기록 목록으로 돌아가기','text-btn full','style="margin-top:12px"')}`,'historyPreview');
}
function importHistory(id,mode='replace'){
 if(loadError){toast('데이터 복원 또는 초기화를 먼저 해주세요.');return false;}
 const source=data.sessions.find(s=>s.id===id);if(!source){toast('이 기록을 찾을 수 없습니다.');return false;}
 const copied=source.exercises.map(e=>({id:e.id,notes:e.notes||'',sets:e.sets.filter(a=>a.done).map(a=>({weightKg:a.weightKg,reps:a.reps,done:false}))})).filter(e=>e.sets.length);
 if(!copied.length){toast('불러올 완료 세트가 없습니다.');return false;}
 const oldDraft=data.draft,oldTimer=data.timer;
 if(mode==='append'&&oldDraft){
  const merged=oldDraft.exercises.map(e=>({...e,sets:e.sets.map(a=>({...a}))}));
  for(const entry of copied){const existing=merged.find(e=>e.id===entry.id);if(existing){if(existing.sets.length+entry.sets.length>100){toast('운동당 최대 100세트까지 불러올 수 있어요.');return false;}existing.sets.push(...entry.sets);}else merged.push(entry);}
  if(merged.length>60){toast('한 번에 최대 60개 운동까지 기록할 수 있어요.');return false;}
  data.draft={...oldDraft,exercises:merged};
 }else{
  data.draft=oldDraft?{...oldDraft,name:source.name,exercises:copied}:{id:cryptoId(),date:dateKey(),name:source.name,startedAt:Date.now(),notes:'',exercises:copied};
  data.timer=null;
 }
 if(!save()){data.draft=oldDraft;data.timer=oldTimer;return false;}
 if(mode!=='append'&&window.Android)Android.stopTimer();
 closeSheet();page='workout';render();window.scrollTo(0,0);toast(source.date+' 운동 기록을 불러왔습니다.');return true;
}
function timerSeconds(){if(!data.timer)return 0;return data.timer.paused?data.timer.remaining:Math.max(0,Math.ceil((data.timer.end-Date.now())/1000));}
function nativeTimer(seconds){try{if(window.Android)Android.startTimer(seconds);}catch(e){toast('알림 타이머를 시작하지 못했습니다. 앱 내 타이머는 계속됩니다.');}}
function startTimer(seconds=data.settings.rest,exerciseId=null){seconds=Math.max(1,Math.min(3600,Math.round(seconds)));data.timer={exerciseId,total:seconds,remaining:seconds,paused:false,end:Date.now()+seconds*1000};nativeTimer(seconds);save();timerUI();updateRestSheet();}
function stopTimer(){data.timer=null;if(window.Android)Android.stopTimer();save();timerUI();updateRestSheet();}
function restSettingsSheet(id=null){restExerciseId=id;const current=id?exerciseRest(id):data.settings.rest;sheet(id?esc(exercise(id)?.name||'운동')+' · 휴식':'휴식 시간 설정',`<p class="small muted">${id?'이 운동의 세트를 완료하면 이 시간으로 시작해요.':'세트 완료 후 자동으로 시작할 기본 휴식이에요.'}</p><div class="rest-presets">${[30,60,90,120,180,300].map(n=>button('setRestPreset',clock(n),`pill ${current===n?'active':''}`,`data-seconds="${n}"`)).join('')}</div><label class="form-label">직접 설정 (초)<input id="rest-custom" type="number" inputmode="numeric" min="15" max="3600" value="${current}"></label>${button('saveRestSetting','휴식 시간 저장','primary')}${button('startConfiguredRest',icon('play')+' 지금 휴식 시작','secondary full','style="margin-top:10px"')}`,'restSettings');}
function setRestSetting(seconds,start=false){if(!Number.isInteger(seconds)||seconds<15||seconds>3600){toast('휴식은 15~3600초로 입력해 주세요.');return;}const id=restExerciseId;if(id){data.settings.exerciseRest||={};data.settings.exerciseRest[id]=seconds;}else data.settings.rest=seconds;save();closeSheet();render();if(start)startTimer(seconds,id);}
function timerSheet(){restExerciseId=null;sheet('휴식 타이머',`<div class="rest-large"><span class="small muted">${data.timer?.exerciseId?esc(exercise(data.timer.exerciseId)?.name||'휴식'):'다음 세트를 위한 휴식'}</span><strong id="sheet-timer">${clock(data.timer?timerSeconds():data.settings.rest)}</strong><span id="timer-status" class="small muted"></span></div><div class="timer-adjust">${button('timerSubtract','−15초','secondary')}${button('timerToggle',icon('play'),'primary','id="timer-toggle" aria-label="휴식 시작 또는 일시정지"')}${button('timerAdd','+15초','secondary')}</div><div class="rest-presets">${[30,60,90,120,180].map(n=>button('timerPreset',clock(n),'pill',`data-seconds="${n}"`)).join('')}</div><div class="sheet-actions">${button('timerStop','휴식 건너뛰기','secondary')}${button('restSettings','기본 시간 설정','secondary')}</div><p class="micro" style="margin-top:16px">${window.Android?'알림을 허용하면 잠금 화면에서도 남은 시간을 볼 수 있어요.':'웹앱에서는 잠금 화면 알림이 지원되지 않습니다.'}</p>`,'timer');timerUI();}
function nextSetInfo(){if(!data.draft)return null;for(let i=0;i<data.draft.exercises.length;i++){const e=data.draft.exercises[i],j=e.sets.findIndex(s=>!s.done);if(j>=0)return {exercise:e,index:i,set:j};}return null;}
function timerUI(){
 let dock=$('#timer-float');const t=data.timer,seconds=timerSeconds(),show=modal===null&&((!!data.draft&&page==='workout')||!!t);
 if(!show){dock?.remove();return;}
 const mode=t?(t.paused?'paused':'running'):'idle';
 if(!dock){dock=document.createElement('aside');dock.id='timer-float';dock.className='rest-dock';dock.dataset.mode='';document.body.append(dock);}
 dock.className='rest-dock'+(page==='workout'?'':' above-nav');
 if(dock.dataset.mode!==mode){dock.dataset.mode=mode;dock.innerHTML=`<div class="dock-progress"><i id="dock-progress-fill"></i></div><div class="dock-top"><button data-action="timer" class="dock-time"><span class="micro" id="dock-label"></span><b id="dock-seconds"></b></button><div class="dock-controls">${t?button('timerSubtract','−15','dock-adjust','aria-label="휴식 15초 줄이기"'):button('nextRestSettings','시간 설정','text-btn')}${t?button('timerToggle',icon(t.paused?'play':'pause'),'dock-play',`aria-label="휴식 ${t.paused?'재개':'일시정지'}"`):button('timerToggle',icon('play'),'dock-play','aria-label="휴식 시작"')}${t?button('timerAdd','+15','dock-adjust','aria-label="휴식 15초 늘리기"'):''}${t?button('timerStop','건너뛰기','dock-skip'):''}</div></div><button data-action="nextSet" class="dock-next" id="dock-next"></button>`;}
 const label=$('#dock-label'),time=$('#dock-seconds'),fill=$('#dock-progress-fill'),next=$('#dock-next'),info=nextSetInfo();
 if(label)label.textContent=t?(t.paused?'휴식 일시정지':'휴식 중'):'휴식 준비';if(time)time.textContent=clock(t?seconds:exerciseRest(info?.exercise.id));if(fill)fill.style.width=(t?Math.min(100,seconds/t.total*100):0)+'%';
 if(next){next.textContent=info?`${exercise(info.exercise.id).name} · 다음 ${info.set+1}세트로 이동 →`:'모든 세트 완료 · 운동 완료하기 →';}
}
function updateRestSheet(){if(modal!=='timer')return;const t=data.timer;const time=$('#sheet-timer'),label=$('#timer-status'),toggle=$('#timer-toggle');if(time)time.textContent=clock(t?timerSeconds():data.settings.rest);if(label)label.textContent=t?(t.paused?'일시정지':'휴식 중'):'시작을 눌러 휴식하세요';if(toggle)toggle.innerHTML=icon(t&&!t.paused?'pause':'play')+(t?(t.paused?'계속':'일시정지'):'시작');}
function adjustTimer(delta){if(!data.timer){startTimer(Math.max(15,data.settings.rest+delta));return;}const remaining=Math.min(3600,Math.max(1,timerSeconds()+delta));data.timer.remaining=remaining;data.timer.total=Math.max(data.timer.total,remaining);data.timer.end=Date.now()+remaining*1000;if(!data.timer.paused)nativeTimer(remaining);save();timerUI();updateRestSheet();}
function toggleTimer(){if(!data.timer){const id=nextSetInfo()?.exercise.id;startTimer(exerciseRest(id),id||null);return;}const t=data.timer;if(t.paused){t.end=Date.now()+t.remaining*1000;t.paused=false;nativeTimer(t.remaining);}else{t.remaining=timerSeconds();t.paused=true;if(window.Android)Android.stopTimer();}save();timerUI();updateRestSheet();}
function syncWorkoutLimitUI(){
 const c=data.draft?.clock;if(!c?.limitReached)return;
 const banner=$('#time-limit');if(banner)banner.hidden=false;
 const status=$('#workout-status');if(status)status.textContent='2시간 자동 정지';
 const toggle=$('[data-action="toggleWorkoutClock"]');if(toggle){toggle.disabled=true;toggle.innerHTML=icon('play');toggle.setAttribute('aria-label','전체 운동 시간 자동 정지');}
}
setInterval(()=>{
 if(data.draft){const wasPaused=data.draft.clock?.paused;normalizeClock();if(!wasPaused&&data.draft.clock.paused){save();syncWorkoutLimitUI();}if($('#elapsed'))$('#elapsed').textContent=workoutClock(workoutElapsedMs()/1000);if(!document.hidden&&Date.now()-data.draft.clock.lastSeenMs>=15000){checkpointClock();save();}}
 if(!document.hidden&&data.timer&&!data.timer.paused&&timerSeconds()<=0){data.timer=null;save();toast('휴식 끝! 다음 세트를 시작하세요.');if(!window.Android){try{const ctx=new (window.AudioContext||window.webkitAudioContext)(),o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);g.gain.value=.1;o.frequency.value=880;o.start();o.stop(ctx.currentTime+.35);o.onended=()=>ctx.close();}catch(e){}navigator.vibrate?.(300);}}
 timerUI();updateRestSheet();
},500);
const actions={
 toggleWorkoutClock,clockEdit:clockEditSheet,saveClock:saveClockEdit,
 resetClock:()=>{data.draft.clock=newClock();save();render();},
 reviewTimes:()=>{const s=latest().find(durationNeedsReview);if(s)sessionDetail(s.id);},
 sessionTime:b=>sessionTimeSheet(b.dataset.id),saveSessionTime,
 sessionDate:b=>sessionDateSheet(b.dataset.id),saveSessionDate,sessionDateCancel:()=>sessionDetail(sessionDateId),
 restSettings:()=>restSettingsSheet(),nextRestSettings:()=>restSettingsSheet(nextSetInfo()?.exercise.id||null),exerciseRest:b=>restSettingsSheet(b.dataset.id),
 setRestPreset:b=>setRestSetting(Number(b.dataset.seconds)),saveRestSetting:()=>setRestSetting(Number($('#rest-custom').value)),startConfiguredRest:()=>setRestSetting(Number($('#rest-custom').value),true),
 nextSet:()=>{const info=nextSetInfo();if(!info){finishWorkout();return;}page='workout';render();const row=document.querySelectorAll?.('.exercise-card')[info.index]?.querySelectorAll('.set-row')[info.set];row?.scrollIntoView?.({block:'center',behavior:'smooth'});row?.classList.add('next-set-highlight');},
 exerciseHistory:b=>{historySheet();historyQuery=exercise(b.dataset.id).name;$('#history-search').value=historyQuery;refreshHistory();},
 favorite:b=>{data.settings.favorites||=[];const index=data.settings.favorites.indexOf(b.dataset.id);if(index>=0)data.settings.favorites.splice(index,1);else data.settings.favorites.push(b.dataset.id);save();refreshPicker();},
 moveExercise:b=>{const index=Number(b.dataset.index),target=index+Number(b.dataset.direction);if(target<0||target>=data.draft.exercises.length)return;const [entry]=data.draft.exercises.splice(index,1);data.draft.exercises.splice(target,0,entry);save();closeSheet();render();},
 saveRoutine:()=>{if(!data.draft?.exercises.length)return;if(modal==='finish')closeSheet();sheet('나만의 루틴 저장',`<label class="form-label">루틴 이름<input id="routine-name" maxlength="80" value="${esc(data.draft.name)}"></label>${button('confirmSaveRoutine','루틴 저장','primary')}`,'saveRoutine');},
 confirmSaveRoutine:()=>{const name=$('#routine-name').value.trim();if(!name){toast('루틴 이름을 입력해 주세요.');return;}data.customRoutines||=[];if(data.customRoutines.length>=50){toast('루틴은 최대 50개까지 저장할 수 있어요.');return;}data.customRoutines.push({id:cryptoId(),name,exercises:data.draft.exercises.map(e=>({...e,sets:e.sets.map(s=>({...s,done:false}))}))});save();closeSheet();render();toast('나만의 루틴을 저장했어요.');},
 customRoutine:b=>{if(data.draft){toast('진행 중인 운동을 먼저 완료해 주세요.');return;}const r=data.customRoutines.find(r=>r.id===b.dataset.id);if(!r)return;startWorkout(dateKey(),{name:r.name,ids:[]});data.draft.exercises=JSON.parse(JSON.stringify(r.exercises));save();render();},
 deleteRoutine:b=>{window.pendingRoutineId=b.dataset.id;confirmSheet('루틴을 삭제할까요?','과거 운동 기록은 유지됩니다.','confirmDeleteRoutine','삭제');},
 confirmDeleteRoutine:()=>{data.customRoutines=data.customRoutines.filter(r=>r.id!==window.pendingRoutineId);save();closeSheet();render();},

 navigate:b=>{page=b.dataset.page;closeSheet();render();window.scrollTo(0,0);},
 installWeb:()=>window.showInstallHelp?.(),
 start:()=>startWorkout(),
 routine:b=>{if(data.draft){toast('진행 중인 운동을 먼저 완료하거나 취소해 주세요.');page='workout';render();return;}startWorkout(dateKey(),routines[Number(b.dataset.index)]);},
 day:b=>{selectedDate=b.dataset.date;month=parseDate(selectedDate);page='calendar';render();},
 month:b=>{month=new Date(month.getFullYear(),month.getMonth()+Number(b.dataset.delta),1);render();},
 today:()=>{month=new Date();selectedDate=dateKey();render();},
 recordDate:()=>{if(data.draft){toast('진행 중인 운동을 먼저 완료해 주세요.');page='workout';render();return;}startWorkout(selectedDate);},
 close:closeSheet,
 pick:openPicker,
 filter:b=>{pickerFilter=b.dataset.filter;refreshPicker();},
 pickExercise:b=>{const id=b.dataset.id;if(picked.has(id))picked.delete(id);else{if(replacementContext)picked.clear();picked.add(id);}refreshPicker();},
 addPicked:()=>{if(replacementContext){requestExerciseReplacement([...picked][0]);return;}if(data.draft.exercises.length+picked.size>60){toast('한 번에 최대 60개 운동까지 기록할 수 있어요.');return;}for(const id of picked){if(!data.draft.exercises.some(e=>e.id===id))data.draft.exercises.push(newExercise(id));}beginWorkoutClock();save();closeSheet();render();},
 customExercise,
 saveCustom:()=>{const name=$('#custom-name').value.trim();if(!name){toast('운동 이름을 입력해 주세요.');return;}if(data.customExercises.length>=500){toast('직접 추가한 운동은 최대 500개까지 저장할 수 있어요.');return;}if(data.draft.exercises.length>=60){toast('최대 60개 운동까지 기록할 수 있어요.');return;}const e={id:'custom_'+cryptoId(),name,muscle:$('#custom-muscle').value,kind:$('#custom-kind').value,equipment:'직접 추가',weight:0};data.customExercises.push(e);data.draft.exercises.push(newExercise(e.id));beginWorkoutClock();save();closeSheet();render();},
 addSet:b=>addSets(Number(b.dataset.index),1),
 addThreeSets:b=>addSets(Number(b.dataset.index),3),
 deleteSet:b=>deleteSet(Number(b.dataset.ex),Number(b.dataset.set)),
 undoSet:undoDeletedSet,
 checkSet:b=>{if(b.closest('.set-row')&&[...b.closest('.set-row').querySelectorAll('input')].some(i=>!i.checkValidity()||(i.value.trim()===''&&i.dataset.field!=='weight'))){toast('유효한 무게와 횟수 또는 시간을 입력해 주세요.');return;}const e=data.draft.exercises[Number(b.dataset.ex)],s=e.sets[Number(b.dataset.set)];if(!s.done&&(!Number.isInteger(s.reps)||s.reps<=0||s.reps>100000||!Number.isFinite(s.weightKg)||s.weightKg<0||s.weightKg>10000)){toast('유효한 무게와 횟수 또는 시간을 입력해 주세요.');return;}s.done=!s.done;if(s.done){try{window.Android?Android.haptic():navigator.vibrate?.(30);}catch(e){}if(data.settings.autoRest)startTimer(exerciseRest(e.id),e.id);}const y=window.scrollY;save();render();window.scrollTo(0,y);},
 exerciseMenu:b=>{const i=Number(b.dataset.index),e=data.draft.exercises[i];sheet(esc(exercise(e.id).name),`${button('changeExercise','운동 종류 변경','primary',`data-index="${i}"`)}${button('editExerciseInfo','운동 정보 수정','secondary full',`data-index="${i}" style="margin-top:12px"`)}<div class="sheet-actions">${button('moveExercise','위로 이동','secondary',`data-index="${i}" data-direction="-1" ${i===0?'disabled':''}`)}${button('moveExercise','아래로 이동','secondary',`data-index="${i}" data-direction="1" ${i===data.draft.exercises.length-1?'disabled':''}`)}</div>${button('exerciseRest','운동별 휴식 시간','secondary full',`data-id="${esc(e.id)}" style="margin:12px 0"`)}${button('removeLastSet','마지막 세트 삭제','secondary full',`data-index="${i}" ${e.sets.length===0?'disabled':''}`)}${button('removeExercise',icon('trash')+' 운동 삭제','secondary danger full',`data-index="${i}" style="margin-top:12px"`)}`,'exerciseMenu');},
 changeExercise:b=>openPicker(Number(b.dataset.index)),
 confirmExerciseReplacement:()=>replaceWorkoutExercise(pendingReplacementId,true),
 editExerciseInfo:b=>exerciseInfoSheet(Number(b.dataset.index)),saveExerciseInfo,confirmExerciseInfo:()=>applyExerciseInfo(pendingExerciseInfo),
 removeLastSet:b=>{const e=data.draft.exercises[Number(b.dataset.index)];if(e.sets.length)e.sets.pop();save();closeSheet();render();},
 removeExercise:b=>{data.draft.exercises.splice(Number(b.dataset.index),1);save();closeSheet();render();},
 unit:()=>{data.settings.unit=data.settings.unit==='kg'?'lb':'kg';save();render();toast('무게 단위: '+data.settings.unit);},
 setUnit:b=>{data.settings.unit=b.dataset.unit;save();render();},
 toggleRest:()=>{data.settings.autoRest=!data.settings.autoRest;save();render();},
 cancelWorkout:()=>confirmSheet('운동을 취소할까요?','진행 중인 운동의 입력 내용이 삭제됩니다. 저장한 과거 기록은 유지됩니다.','confirmCancel','취소하기'),
 confirmCancel:()=>{data.draft=null;stopTimer();save();closeSheet();page='home';render();},
 finish:finishWorkout,
 saveWorkout:()=>{const draft=data.draft;if(!draft)return;const now=Date.now();normalizeClock(draft,now);const s=JSON.parse(JSON.stringify(draft));s.exercises=s.exercises.map(e=>({...e,sets:e.sets.filter(a=>a.done)})).filter(e=>e.sets.length);s.finishedAt=draft.clock?.limitReached?(draft.clock.autoStoppedAt||now):now;const entered=readDuration('#finish-minutes','#finish-seconds',WORKOUT_MAX_MS/1000);if(Number.isNaN(entered)){toast('실제 운동 시간을 0~120분으로 입력해 주세요.');return;}s.duration=entered===null?Math.floor(workoutElapsedMs(draft)/1000):entered;s.durationConfirmed=true;delete s.clock;data.sessions.push(s);data.draft=null;if(!save()){data.sessions.pop();data.draft=draft;return;}stopTimer();closeSheet();selectedDate=s.date;month=parseDate(s.date);page='calendar';render();window.scrollTo(0,0);toast('오늘의 운동을 저장했습니다. 수고했어요!');},
 viewSession:b=>sessionDetail(b.dataset.id),
 history:historySheet,
 chooseHistory:b=>selectedHistorySheet(b.dataset.id),
 repeat:b=>selectedHistorySheet(b.dataset.id),
 loadHistory:()=>importHistory(historySelection),
 appendHistory:()=>importHistory(historySelection,'append'),
 replaceHistory:()=>confirmSheet('운동 목록을 교체할까요?','현재 입력한 운동과 세트를 선택한 과거 기록으로 교체합니다. 지금 운동의 날짜와 메모는 유지됩니다.','confirmReplaceHistory','교체하기'),
 confirmReplaceHistory:()=>importHistory(historySelection),
 deleteSession:b=>{const id=b.dataset.id;confirmSheet('이 기록을 삭제할까요?','삭제한 기록은 백업 파일이 없으면 되돌릴 수 없습니다.','confirmDelete','삭제하기');$('#overlay [data-action="confirmDelete"]').dataset.id=id;},
 confirmDelete:b=>{data.sessions=data.sessions.filter(s=>s.id!==b.dataset.id);save();closeSheet();render();toast('기록을 삭제했습니다.');},
 timer:timerSheet,
 timerPreset:b=>{startTimer(Number(b.dataset.seconds));updateRestSheet();},
 timerToggle:toggleTimer,
 timerStop:stopTimer,
 timerAdd:()=>adjustTimer(15),
 timerSubtract:()=>adjustTimer(-15),
 widget:()=>{if(window.Android)Android.pinWidget();else if(window.showWebWidgetHelp)window.showWebWidgetHelp();else toast('위젯은 안드로이드 APK에서 추가할 수 있어요.');},
 export:()=>{if(loadError){toast('읽기 오류가 있는 데이터를 백업할 수 없습니다.');return;}const raw=JSON.stringify(data,null,2);if(window.Android)Android.exportBackup(raw);else{const a=document.createElement('a'),url=URL.createObjectURL(new Blob([raw],{type:'application/json'}));a.href=url;a.download='liftlog-backup-'+dateKey()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}},
 import:()=>{if(window.Android)Android.importBackup();else $('#backup-file').click();},
 confirmImport:()=>{const before=data;stopTimer();data=window.pendingBackup;normalizeClock();data.timer=null;loadError=false;if(!save()){data=before;return;}window.pendingBackup=null;page=data.draft?'workout':'home';closeSheet();render();toast('백업에서 기록을 복원했습니다.');},
 reset:()=>confirmSheet('모든 데이터를 초기화할까요?','운동 기록, 진행 중인 운동, 추가한 운동과 설정이 모두 삭제됩니다. 필요하면 먼저 백업을 저장해 주세요.','confirmReset','초기화'),
 confirmReset:()=>{stopTimer();data=fresh();loadError=false;save();page='home';closeSheet();render();toast('데이터를 초기화했습니다.');}
};
document.addEventListener('click',event=>{const b=event.target.closest('[data-action]');if(b&&!b.disabled){try{actions[b.dataset.action]?.(b);}catch(e){console.error(e);toast('작업을 완료하지 못했습니다. 다시 시도해 주세요.');}}else if(event.target.classList.contains('overlay-backdrop'))closeSheet();});
document.addEventListener('input',event=>{
 const el=event.target;if(selectOnClickInput===el)selectOnClickInput=null;
 if(el.matches?.('textarea[data-exercise-note]')){
  const record=el.dataset.noteSession?data.sessions.find(s=>s.id===el.dataset.noteSession):data.draft;
  const entry=record?.exercises[Number(el.dataset.exerciseNote)];if(!entry)return;
  const previous=entry.notes;entry.notes=el.value.slice(0,2000);if(!save())entry.notes=previous;return;
 }
 if(el.id==='history-search'){historyQuery=el.value;refreshHistory();return;}
 if(el.id==='exercise-search'){pickerQuery=el.value;refreshPicker();return;}
 if(el.id==='session-name'&&data.draft){data.draft.name=el.value.slice(0,80);save();return;}
 if(el.id==='workout-notes'&&data.draft){data.draft.notes=el.value.slice(0,2000);save();return;}
 if(el.dataset.field&&data.draft){
  const s=data.draft.exercises[Number(el.dataset.ex)].sets[Number(el.dataset.set)],n=Number(el.value),valid=el.value.trim()!==''&&Number.isFinite(n)&&n>=0;
  if(s.done){s.done=false;el.closest('.set-row').classList.remove('done');el.closest('.set-row').querySelector('.check').classList.remove('done');el.closest('.set-row').querySelector('.check').setAttribute('aria-pressed','false');save();}
  if(el.value.trim()===''&&el.dataset.field==='weight'){s.weightKg=0;el.setCustomValidity('');save();return;}
  if(!valid){el.setCustomValidity('숫자를 입력해 주세요.');return;}
  if(el.dataset.field==='weight'){if(asKg(n)>10000){el.setCustomValidity('무게가 너무 큽니다.');return;}s.weightKg=asKg(n);}else{if(!Number.isInteger(n)||n>100000){el.setCustomValidity('정수로 입력해 주세요.');return;}s.reps=n;}
  el.setCustomValidity('');if(s.done){s.done=false;el.closest('.set-row').classList.remove('done');el.closest('.set-row').querySelector('.check').classList.remove('done');el.closest('.set-row').querySelector('.check').setAttribute('aria-pressed','false');}save();
 }
});
document.addEventListener('change',event=>{const el=event.target;
 if(el.id==='rest-setting'){data.settings.rest=Number(el.value);save();}
 if(el.id==='goal-setting'){data.settings.goal=Number(el.value);save();}
 if(el.id==='insight-exercise'){insightId=el.value;render();}
 if(el.id==='backup-file'&&el.files[0]){const file=el.files[0];if(file.size>5000000){toast('5MB 이하의 백업 파일을 선택해 주세요.');return;}file.text().then(importBackup).catch(()=>toast('파일을 읽지 못했습니다.'));el.value='';}
});
window.importBackup=raw=>{try{if(typeof raw!=='string'||raw.length>5000000)throw Error();const next=validate(JSON.parse(raw));window.pendingBackup=next;confirmSheet('백업을 복원할까요?',`${next.sessions.length}개의 운동 기록이 있습니다. 현재 기기의 데이터를 이 백업 내용으로 교체합니다.`,'confirmImport','복원하기');}catch(e){toast('유효한 리프트로그 백업 파일이 아닙니다.');}};
window.quickStart=()=>startWorkout();
window.handleBack=()=>{if(modal){closeSheet();return true;}if(page!=='home'){page='home';render();return true;}return false;};
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet();if(e.key==='Tab'&&modal){const f=[...$('#overlay').querySelectorAll('button:not(:disabled),input,select,textarea')];if(!f.length)return;if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();f.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===f.at(-1)){e.preventDefault();f[0].focus();}}});
if(data.draft){normalizeClock();save();}
if(data.timer&&!data.timer.paused&&timerSeconds()===0){data.timer=null;save();}
render();
if(loadError){page='settings';render();toast('저장 데이터를 읽지 못했습니다. 설정에서 확인해 주세요.');}


let deletedSet=null,swipeGesture=null,openSwipe=null,suppressSwipeClickUntil=0,suppressedSwipeRow=null,selectOnClickInput=null;
function addSets(index,count=1){
 const e=data.draft?.exercises[index];if(!e)return;
 if(e.sets.length+count>100){toast('운동당 최대 100세트까지 기록할 수 있어요.');return;}
 const template=e.sets.at(-1)||newExercise(e.id).sets[0];
 for(let i=0;i<count;i++)e.sets.push({...template,done:false});
 const y=window.scrollY;save();render();window.scrollTo(0,y);
 const card=document.querySelectorAll?.('.exercise-card')[index];
 card?.querySelector('.add-set')?.scrollIntoView?.({block:'nearest',behavior:'smooth'});
}
function deleteSet(index,setIndex){
 const e=data.draft?.exercises[index];if(!e||!e.sets[setIndex])return;
 deletedSet={draftId:data.draft.id,exercise:e,index:setIndex,set:{...e.sets[setIndex]}};
 const oldRows=[...(document.querySelectorAll?.(`.set-swipe[data-ex="${index}"]`)||[])];
 const oldTops=oldRows.map(row=>row.getBoundingClientRect().top);
 e.sets.splice(setIndex,1);if(!save()){e.sets.splice(setIndex,0,deletedSet.set);deletedSet=null;return;}
 closeOpenSwipe();const y=window.scrollY;render();window.scrollTo(0,y);
 if(!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){
  const rows=document.querySelectorAll?.(`.set-swipe[data-ex="${index}"]`)||[];
  rows.forEach((row,i)=>{const before=oldTops[i>=setIndex?i+1:i];if(before!==undefined){const delta=before-row.getBoundingClientRect().top;if(delta)row.animate?.([{transform:`translateY(${delta}px)`},{transform:'translateY(0)'}],{duration:180,easing:'ease-out'});}});
 }
 toast('세트를 삭제했어요.');$('#toast').innerHTML='세트를 삭제했어요. '+button('undoSet','되돌리기','undo-set');
}
function undoDeletedSet(){
 const d=deletedSet;if(!d||data.draft?.id!==d.draftId||!data.draft.exercises.includes(d.exercise))return;
 if(d.exercise.sets.length>=100){toast('세트가 가득 찼어요.');return;}
 d.exercise.sets.splice(d.index,0,d.set);deletedSet=null;save();render();toast('세트를 복원했어요.');
}
document.addEventListener('focusin',event=>{
 const el=event.target;
 if(el.matches?.('input[data-field],input[type=number]')){el.select();selectOnClickInput=el;}
 if(el.matches?.('input,textarea'))setTimeout(()=>el.scrollIntoView?.({block:'nearest',behavior:'smooth'}),250);
});
document.addEventListener('focusout',event=>{const el=event.target;if(selectOnClickInput===el)selectOnClickInput=null;if(el.dataset.field&&el.value.trim()===''){const set=data.draft?.exercises[Number(el.dataset.ex)]?.sets[Number(el.dataset.set)];if(set&&el.dataset.field==='reps'){el.value=set.reps||'';el.setCustomValidity('');}}});
document.addEventListener('dragstart',event=>{if(event.target.closest?.('.set-row'))event.preventDefault();});
function settleSwipe(row,opened){
 row.classList.remove('swiping');row.style.transform=opened?'translateX(-96px)':'';
 row.closest('.set-swipe')?.classList.toggle('swipe-open',opened);
 if(opened)openSwipe=row;else if(openSwipe===row)openSwipe=null;
}
function closeOpenSwipe(){if(openSwipe){settleSwipe(openSwipe,false);openSwipe=null;}}
document.addEventListener('pointerdown',event=>{
 if(event.isPrimary===false||event.button>0)return;
 suppressSwipeClickUntil=0;suppressedSwipeRow=null;
 const row=event.target.closest?.('.set-row'),deleting=event.target.closest?.('.swipe-delete');
 // The exposed delete action must stay still until its click has been delivered.
 if(deleting)return;
 if(openSwipe&&row!==openSwipe)closeOpenSwipe();
 if(!row)return;
 swipeGesture={row,x:event.clientX,y:event.clientY,pointerId:event.pointerId,offset:openSwipe===row?-96:0,position:openSwipe===row?-96:0,active:false};
});
document.addEventListener('pointermove',event=>{
 const g=swipeGesture;if(!g||event.pointerId!==g.pointerId)return;
 const dx=event.clientX-g.x,dy=event.clientY-g.y;
 if(!g.active){
  if(Math.abs(dy)>8&&Math.abs(dy)>=Math.abs(dx)){swipeGesture=null;return;}
  if(Math.abs(dx)<8||Math.abs(dx)<Math.abs(dy)*1.25)return;
  if(g.offset===0&&dx>0){swipeGesture=null;return;}
  g.active=true;g.row.classList.add('swiping');
  try{g.row.setPointerCapture?.(event.pointerId);}catch(e){}
 }
 event.preventDefault();g.position=Math.max(-96,Math.min(0,g.offset+dx));
 g.row.style.transform=`translateX(${g.position}px)`;
},{passive:false});
function endSwipe(event){
 const g=swipeGesture;if(!g||event.pointerId!==g.pointerId)return;swipeGesture=null;
 if(g.active){
  suppressSwipeClickUntil=Date.now()+350;suppressedSwipeRow=g.row;
  // A completed left swipe deletes immediately; a short or cancelled drag does not.
  const wrapper=g.row.closest('.set-swipe'),remove=g.position<=-56;
  settleSwipe(g.row,false);document.activeElement?.blur?.();
  if(remove&&wrapper)deleteSet(Number(wrapper.dataset.ex),Number(wrapper.dataset.set));
 }else if(g.offset<0){settleSwipe(g.row,false);suppressSwipeClickUntil=Date.now()+350;suppressedSwipeRow=g.row;}
}
document.addEventListener('pointerup',endSwipe);
document.addEventListener('pointercancel',()=>{const g=swipeGesture;swipeGesture=null;if(g)settleSwipe(g.row,g.offset<0);});
document.addEventListener('click',event=>{
 if(Date.now()<suppressSwipeClickUntil&&event.target.closest?.('.set-row')){event.preventDefault();event.stopImmediatePropagation();return;}
 if(event.target===selectOnClickInput){selectOnClickInput.select();selectOnClickInput=null;}
},true);
function syncViewport(){const v=window.visualViewport;if(!v)return;document.documentElement.style.setProperty('--vv-height',v.height+'px');document.documentElement.style.setProperty('--vv-top',v.offsetTop+'px');document.documentElement.classList.toggle('keyboard-open',window.innerHeight-v.height>100);}
window.visualViewport?.addEventListener('resize',syncViewport);window.visualViewport?.addEventListener('scroll',syncViewport);window.addEventListener?.('resize',syncViewport);syncViewport();

window.nativeRestStopped=()=>{data.timer=null;save();timerUI();updateRestSheet();};
document.addEventListener('visibilitychange',()=>{if(data.draft){checkpointClock();save();if(!document.hidden)render();}});
window.addEventListener?.('pagehide',()=>{if(data.draft){checkpointClock();save();}});
document.addEventListener('focusin',e=>{if(e.target.matches?.('input[data-field],textarea'))document.documentElement.classList.add('editing-set');});
document.addEventListener('focusout',()=>setTimeout(()=>{if(!document.activeElement?.matches?.('input[data-field],textarea'))document.documentElement.classList.remove('editing-set');},150));

