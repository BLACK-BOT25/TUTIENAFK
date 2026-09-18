export const REALMS = [
  { name: 'Luyện Khí tầng 1', short: 'LK 1', need: 100, chance: 0.98, stat: 1.00, quote: 'Linh khí nhập thể, tiên lộ mới khai.' },
  { name: 'Luyện Khí tầng 2', short: 'LK 2', need: 170, chance: 0.95, stat: 1.08, quote: 'Khí hành chu thiên, kinh mạch dần thông.' },
  { name: 'Luyện Khí tầng 3', short: 'LK 3', need: 270, chance: 0.92, stat: 1.16, quote: 'Một hơi dẫn linh, vạn niệm quy tâm.' },
  { name: 'Luyện Khí tầng 4', short: 'LK 4', need: 420, chance: 0.88, stat: 1.25, quote: 'Đạo tâm bất động, linh lực tự sinh.' },
  { name: 'Luyện Khí tầng 5', short: 'LK 5', need: 620, chance: 0.84, stat: 1.35, quote: 'Tụ khí thành tuyền, căn cơ thêm vững.' },
  { name: 'Luyện Khí tầng 6', short: 'LK 6', need: 900, chance: 0.80, stat: 1.47, quote: 'Kiếm ý sơ minh, khí thế như phong.' },
  { name: 'Luyện Khí tầng 7', short: 'LK 7', need: 1280, chance: 0.76, stat: 1.60, quote: 'Linh đài sáng tỏ, thần thức lan xa.' },
  { name: 'Luyện Khí tầng 8', short: 'LK 8', need: 1780, chance: 0.72, stat: 1.75, quote: 'Một bước gần tiên, một niệm gần ma.' },
  { name: 'Luyện Khí tầng 9', short: 'LK 9', need: 2450, chance: 0.68, stat: 1.92, quote: 'Luyện khí viên mãn, trúc cơ khả kỳ.' },
  { name: 'Trúc Cơ sơ kỳ', short: 'TC S', need: 3500, chance: 0.60, stat: 2.20, quote: 'Đạo cơ vừa lập, thọ nguyên tăng trưởng.' },
  { name: 'Trúc Cơ trung kỳ', short: 'TC T', need: 5200, chance: 0.56, stat: 2.55, quote: 'Căn cơ như núi, pháp lực như triều.' },
  { name: 'Trúc Cơ hậu kỳ', short: 'TC H', need: 7600, chance: 0.52, stat: 2.95, quote: 'Đạo đài ổn định, Kim Đan hiện cơ.' },
  { name: 'Kim Đan sơ kỳ', short: 'KĐ S', need: 11000, chance: 0.45, stat: 3.50, quote: 'Nhất viên kim đan, ngã mệnh do ngã.' },
  { name: 'Kim Đan trung kỳ', short: 'KĐ T', need: 16000, chance: 0.42, stat: 4.20, quote: 'Đan quang chiếu phủ, thần hồn cô đọng.' },
  { name: 'Kim Đan hậu kỳ', short: 'KĐ H', need: 23000, chance: 0.38, stat: 5.10, quote: 'Kim đan đại thành, Nguyên Anh hữu vọng.' },
  { name: 'Nguyên Anh sơ kỳ', short: 'NA S', need: 34000, chance: 0.32, stat: 6.40, quote: 'Nguyên thần hóa anh, thiên địa đồng cảm.' },
];

export const ENEMIES = [
  { name: 'Thanh Phong Lang', minRealm: 0, hp: 38, attack: 7, defense: 2, stones: [3, 8], herbs: [0, 2], cultivation: 20, image: './public/img/spirit-wolf.svg' },
  { name: 'Xích Nhãn Hầu', minRealm: 2, hp: 68, attack: 11, defense: 4, stones: [5, 12], herbs: [1, 3], cultivation: 34, image: './public/img/demon-ape.svg' },
  { name: 'Huyền Giáp Ngưu', minRealm: 4, hp: 115, attack: 15, defense: 8, stones: [8, 18], herbs: [1, 4], cultivation: 55, image: './public/img/armored-ox.svg' },
  { name: 'U Minh Xà', minRealm: 7, hp: 185, attack: 24, defense: 10, stones: [14, 28], herbs: [2, 6], cultivation: 90, image: './public/img/nether-snake.svg' },
  { name: 'Thiết Vũ Ưng', minRealm: 9, hp: 280, attack: 33, defense: 15, stones: [20, 40], herbs: [3, 8], cultivation: 140, image: './public/img/iron-eagle.svg' },
  { name: 'Đan Hỏa Yêu Hồ', minRealm: 12, hp: 430, attack: 49, defense: 22, stones: [32, 60], herbs: [5, 10], cultivation: 230, image: './public/img/fire-fox.svg' },
];

export const EVENTS = [
  'Ngươi gặp một dòng linh tuyền ẩn trong khe đá.',
  'Một trận gió mang theo mùi linh thảo từ sườn núi.',
  'Dưới gốc cổ tùng có vài viên linh thạch bị bỏ quên.',
  'Ngươi ngộ được một tia kiếm ý khi nhìn lá rơi.',
  'Mây tím tụ nơi chân trời. Linh khí quanh thân dao động.',
];
